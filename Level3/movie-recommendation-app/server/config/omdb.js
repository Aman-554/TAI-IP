// server/config/omdb.js
const axios = require('axios');

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_API_URL = process.env.OMDB_API_URL || 'http://www.omdbapi.com/';

const omdbApi = axios.create({
  baseURL: OMDB_API_URL,
  params: {
    apikey: OMDB_API_KEY,
  },
});

// Search movies by title
const searchMovies = async (query, page = 1) => {
  try {
    const response = await omdbApi.get('/', {
      params: { 
        s: query,
        page: page,
        type: 'movie'
      }
    });
    
    if (response.data.Response === 'False') {
      return { results: [], totalResults: 0, Response: 'False', Error: response.data.Error };
    }
    
    // Transform OMDb response to match TMDb format
    return {
      results: response.data.Search || [],
      totalResults: parseInt(response.data.totalResults) || 0,
      page: page,
      Response: 'True'
    };
  } catch (error) {
    console.error('OMDb search error:', error);
    throw error;
  }
};

// Get movie details by IMDb ID or Title
const getMovieDetails = async (imdbId, title = null) => {
  try {
    const params = imdbId ? { i: imdbId } : { t: title };
    const response = await omdbApi.get('/', { params });
    
    if (response.data.Response === 'False') {
      throw new Error(response.data.Error);
    }
    
    // Transform OMDb response to a consistent format
    return {
      id: response.data.imdbID,
      title: response.data.Title,
      year: response.data.Year,
      rated: response.data.Rated,
      released: response.data.Released,
      runtime: response.data.Runtime,
      genres: response.data.Genre ? response.data.Genre.split(', ') : [],
      director: response.data.Director,
      writers: response.data.Writer,
      actors: response.data.Actors,
      plot: response.data.Plot,
      language: response.data.Language,
      country: response.data.Country,
      awards: response.data.Awards,
      poster: response.data.Poster !== 'N/A' ? response.data.Poster : null,
      ratings: response.data.Ratings,
      metascore: response.data.Metascore,
      imdbRating: response.data.imdbRating,
      imdbVotes: response.data.imdbVotes,
      type: response.data.Type,
      totalSeasons: response.data.totalSeasons
    };
  } catch (error) {
    console.error('OMDb details error:', error);
    throw error;
  }
};

// Get trending/popular movies (OMDb doesn't have this natively)
// We'll implement a workaround using year-based search
const getPopularMovies = async (page = 1) => {
  // Search for movies from recent years as a proxy for "popular"
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];
  
  try {
    let allMovies = [];
    for (const year of years) {
      const response = await omdbApi.get('/', {
        params: {
          s: 'movie',
          y: year,
          page: page,
          type: 'movie'
        }
      });
      
      if (response.data.Response === 'True' && response.data.Search) {
        allMovies = [...allMovies, ...response.data.Search];
      }
    }
    
    // Remove duplicates
    const uniqueMovies = [];
    const seen = new Set();
    for (const movie of allMovies) {
      if (!seen.has(movie.imdbID)) {
        seen.add(movie.imdbID);
        uniqueMovies.push(movie);
      }
    }
    
    return {
      results: uniqueMovies.slice(0, 20),
      totalResults: uniqueMovies.length,
      page: page
    };
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return { results: [], totalResults: 0, page: page };
  }
};

// Get all genres (OMDb doesn't provide genre list, so we'll define common ones)
const getGenres = async () => {
  // Common movie genres from OMDb
  return [
    { id: 'action', name: 'Action' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'animation', name: 'Animation' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'crime', name: 'Crime' },
    { id: 'drama', name: 'Drama' },
    { id: 'family', name: 'Family' },
    { id: 'fantasy', name: 'Fantasy' },
    { id: 'horror', name: 'Horror' },
    { id: 'mystery', name: 'Mystery' },
    { id: 'romance', name: 'Romance' },
    { id: 'sci-fi', name: 'Sci-Fi' },
    { id: 'thriller', name: 'Thriller' },
    { id: 'war', name: 'War' },
    { id: 'western', name: 'Western' }
  ];
};

// Get movies by genre (OMDb limitation - we'll use search with genre term)
const getMoviesByGenre = async (genreName, page = 1) => {
  try {
    const response = await omdbApi.get('/', {
      params: {
        s: genreName,
        page: page,
        type: 'movie'
      }
    });
    
    if (response.data.Response === 'False') {
      return { results: [], totalResults: 0 };
    }
    
    return {
      results: response.data.Search || [],
      totalResults: parseInt(response.data.totalResults) || 0,
      page: page
    };
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    return { results: [], totalResults: 0, page: page };
  }
};

module.exports = {
  searchMovies,
  getMovieDetails,
  getPopularMovies,
  getGenres,
  getMoviesByGenre,
};