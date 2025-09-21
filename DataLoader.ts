import 'dotenv/config';
import axios from 'axios';
import { addReviewToDB, generateEmbeddingBatch, client, MovieReview } from './MindUtils';

const API_KEY = process.env.TMDB_API_KEY; 
const BASE_URL = 'https://api.themoviedb.org/3';

interface TMDBMovie {
    id: number;
    title: string;
}

interface TMDBReview {
    author: string;
    content: string;
    author_details: {
        rating: number | null;
    };
}

interface TMDBReviewsResponse {
    results: TMDBReview[];
}

interface TMDBMoviesResponse {
    results: TMDBMovie[];
    total_pages: number;
}

interface ProcessedReview {
    author: string;
    stars: number;
    review: string;
}
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchTopMovies(limit: number = 400): Promise<TMDBMovie[]> {
  let movies: TMDBMovie[] = [];
  let page = 1;

  while (movies.length < limit) {
    const res = await axios.get<TMDBMoviesResponse>(`${BASE_URL}/movie/top_rated`, {
      params: { api_key: API_KEY, page }
    });

    movies.push(...res.data.results);
    page++;

    if (page > res.data.total_pages) break;
  }

  return movies.slice(0, limit);
}

async function fetchReviews(movieId: number, maxReviews: number = 2): Promise<ProcessedReview[]> {
  const res = await axios.get<TMDBReviewsResponse>(`${BASE_URL}/movie/${movieId}/reviews`, {
    params: { api_key: API_KEY }
  });

  const allReviews = res.data.results
    .filter(r => r.author_details.rating !== null) 
    .sort((a, b) => (b.author_details.rating || 0) - (a.author_details.rating || 0));

  const valid: ProcessedReview[] = [];

  for (let r of allReviews) {
    const len = r.content.length;

    
    if (len >= 100 && len <= 500) {
      valid.push({
        author: r.author,
        stars: (r.author_details.rating || 0) / 2,
        review: r.content
      });
    }

    if (valid.length >= maxReviews) break;
  }

  return valid;
}
const BATCH_SIZE = 15;
async function processBatch(
  batch: { movie: TMDBMovie; review: ProcessedReview }[]
): Promise<void> {
  const texts = batch.map(b => b.review.review);

  let tries = 0;
  while (true) {
    try {
      const embeddings = await generateEmbeddingBatch(texts);

      for (let i = 0; i < batch.length; i++) {
        const { movie, review } = batch[i];
        const embed = embeddings[i];

        const item: MovieReview = {
          title: movie.title,
          author: review.author,
          stars: review.stars,
          review: review.review,
          embedding: embed,
        };

        await addReviewToDB(item);
      }

      console.log(`Inserted ${batch.length} reviews`);
      return; // success
    } catch (err: any) {
      // print once to understand error shape
      console.error("Error embedding batch:", err?.response?.status, err?.status, err?.code);

      // detect 429 flexibly
      const status = err?.response?.status || err?.status || (err?.code === 429 ? 429 : null);

      if (status === 429) {
        const wait = Math.min(60000, 2000 * 2 ** tries); // exponential backoff up to 60s
        console.warn(` Rate limited. Retrying in ${wait / 1000}s (try #${tries + 1})...`);
        await sleep(wait);
        tries++;
      } else {
        throw err; // not a rate limit → crash
      }
    }
  }
}


async function run(): Promise<void> {
  await client.connect();

  try {
    const movies = await fetchTopMovies(3000);

    let buffer: { movie: TMDBMovie; review: ProcessedReview }[] = [];
    const START_INDEX = 1500;
    for (let i = START_INDEX; i < movies.length; i++) {
      const movie = movies[i];
      const reviews = await fetchReviews(movie.id);

      for (let r of reviews) {
        buffer.push({ movie, review: r });

        if (buffer.length >= BATCH_SIZE) {
          await processBatch(buffer);
          buffer = []; // reset buffer
          await sleep(5000);
        }
      }
    }

    // Handle leftovers
    if (buffer.length > 0) {
      await processBatch(buffer);
    }
  } finally {
    await client.close();
  }
}

run().catch(console.error);