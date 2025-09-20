import 'dotenv/config';
import axios from 'axios';
import { addReviewToDB, generateEmbedding, client, MovieReview } from './mindUtils';

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

async function fetchReviews(movieId: number): Promise<ProcessedReview[]> {
  const res = await axios.get<TMDBReviewsResponse>(`${BASE_URL}/movie/${movieId}/reviews`, {
    params: { api_key: API_KEY }
  });

  return res.data.results
    .filter(r => r.author_details.rating !== null)
    .sort((a, b) => (b.author_details.rating || 0) - (a.author_details.rating || 0))
    .slice(0, 4)
    .map(r => ({
      author: r.author,
      stars: (r.author_details.rating || 0) / 2, 
      review: r.content
    }));
}

async function run(): Promise<void> {
  await client.connect();

  try {
    const movies = (await fetchTopMovies(400)).slice(0);

    for (let movie of movies) {
      const reviews = await fetchReviews(movie.id);

      for (let r of reviews) {
        const embed = await generateEmbedding(r.review);
        const item: MovieReview = {
          title: movie.title,
          author: r.author,
          stars: r.stars,
          review: r.review,
          embedding: embed
        };
        await addReviewToDB(item);
        console.log(`Inserted review for: ${movie.title}`);
      }
    }
  } finally {
    await client.close(); 
  }
}

run().catch(console.error);
