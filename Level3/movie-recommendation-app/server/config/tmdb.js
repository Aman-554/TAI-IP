// server/config/tmdb.js
const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = process.env.TMDB_API_URL;

const tmdbApi = axios.create({
  baseURL: TMDB_API_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'en-US',
  },
});

// Fetch trending movies
const getTrendingMovies = async (page = 1) => {
  const response = await tmdbApi.get('/trending/movie/week', {
    params: { page }
  });
  return response.data;
};

// Fetch popular movies
const getPopularMovies = async (page = 1) => {
  const response = await tmdbApi.get('/movie/popular', {
    params: { page }
  });
  return response.data;
};

// Search movies
const searchMovies = async (query, page = 1) => {
  const response = await tmdbApi.get('/search/movie', {
    params: { query, page }
  });
  return response.data;
};

// Get movie details
const getMovieDetails = async (movieId) => {
  const response = await tmdbApi.get(`/movie/${movieId}`, {
    params: { append_to_response: 'credits,similar' }
  });
  return response.data;
};

// Get movies by genre
const getMoviesByGenre = async (genreId, page = 1) => {
  const response = await tmdbApi.get('/discover/movie', {
    params: { with_genres: genreId, page }
  });
  return response.data;
};

// Get all genres
const getGenres = async () => {
  const response = await tmdbApi.get('/genre/movie/list');
  return response.data.genres;
};

module.exports = {
  getTrendingMovies,
  getPopularMovies,
  searchMovies,
  getMovieDetails,
  getMoviesByGenre,
  getGenres,
};