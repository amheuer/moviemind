import 'dotenv/config';
import axios from 'axios';
import { addReviewToDB, generateEmbedding, client } from './mindUtils.js';

const API_KEY = process.env.TMDB_API_KEY; 
const BASE_URL = 'https://api.themoviedb.org/3';

async function fetchTopMovies(limit = 400) {
  let movies = [];
  let page = 1;

  while (movies.length < limit) {
    const res = await axios.get(`${BASE_URL}/movie/top_rated`, {
      params: { api_key: API_KEY, page }
    });

    movies.push(...res.data.results);
    page++;

    if (page > res.data.total_pages) break;
  }

  return movies.slice(0, limit);
}

async function fetchReviews(movieId) {
  const res = await axios.get(`${BASE_URL}/movie/${movieId}/reviews`, {
    params: { api_key: API_KEY }
  });

  return res.data.results
    .filter(r => r.author_details.rating !== null)
    .sort((a, b) => b.author_details.rating - a.author_details.rating)
    .slice(0, 4)
    .map(r => ({
      author: r.author,
      stars: r.author_details.rating / 2, 
      review: r.content
    }));
}

async function run() {
  await client.connect();

  try {
    const movies = (await fetchTopMovies(400)).slice(0);

    for (let movie of movies) {
      const reviews = await fetchReviews(movie.id);

      for (let r of reviews) {
        const embed = await generateEmbedding(r.review);
        const item = {
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
