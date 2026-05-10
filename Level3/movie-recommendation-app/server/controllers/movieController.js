// server/controllers/movieController.js
const omdb = require('../config/omdb');  // Changed from tmdb

// @desc    Search movies
// @route   GET /api/movies/search
// @access  Public
const searchMovies = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    const movies = await omdb.searchMovies(query, parseInt(page));
    
    // Transform OMDb response to frontend-friendly format
    const transformedResults = (movies.results || []).map(movie => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster_path: movie.Poster !== 'N/A' ? movie.Poster : null,
      type: movie.Type,
      vote_average: null, // OMDb search doesn't include ratings
    }));
    
    res.json({
      results: transformedResults,
      page: movies.page,
      total_pages: Math.ceil(movies.totalResults / 10),
      total_results: movies.totalResults
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get movie details
// @route   GET /api/movies/:id
// @access  Public
const getMovieDetails = async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await omdb.getMovieDetails(movieId);
    
    // Transform to frontend-friendly format
    const transformedMovie = {
      id: movie.id,
      title: movie.title,
      year: movie.year,
      poster_path: movie.poster,
      backdrop_path: movie.poster, // OMDb doesn't have backdrop, use poster
      overview: movie.plot,
      vote_average: parseFloat(movie.imdbRating) || 0,
      vote_count: parseInt(movie.imdbVotes?.replace(/,/g, '')) || 0,
      runtime: parseInt(movie.runtime) || 0,
      genres: movie.genres.map(g => ({ id: g.toLowerCase(), name: g })),
      release_date: movie.released,
      cast: movie.actors ? movie.actors.split(', ') : [],
      director: movie.director,
      writers: movie.writers ? movie.writers.split(', ') : [],
      language: movie.language,
      country: movie.country,
      awards: movie.awards,
      ratings: movie.ratings
    };
    
    res.json(transformedMovie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

let popularMoviesCache = { data: null, timestamp: 0 };

// @desc    Get popular movies
// @route   GET /api/movies/popular
// @access  Public
const getPopularMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    
    // Use cache if available and less than 1 hour old (only for page 1)
    if (page === 1 && popularMoviesCache.data && (Date.now() - popularMoviesCache.timestamp < 3600000)) {
      return res.json(popularMoviesCache.data);
    }
    
    const movies = await omdb.getPopularMovies(page);
    
    const transformedResults = (movies.results || []).map(movie => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster_path: movie.Poster !== 'N/A' ? movie.Poster : null,
      type: movie.Type,
    }));
    
    const responseData = {
      results: transformedResults,
      page: movies.page,
      total_pages: Math.ceil(movies.totalResults / 10),
      total_results: movies.totalResults
    };
    
    if (page === 1) {
      popularMoviesCache = { data: responseData, timestamp: Date.now() };
    }
    
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all genres
// @route   GET /api/movies/genres
// @access  Public
const getGenres = async (req, res) => {
  try {
    const genres = await omdb.getGenres();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get movies by genre
// @route   GET /api/movies/genre/:genreName
// @access  Public
const getMoviesByGenre = async (req, res) => {
  try {
    const genreName = req.params.genreName;
    const page = parseInt(req.query.page) || 1;
    const movies = await omdb.getMoviesByGenre(genreName, page);
    
    const transformedResults = (movies.results || []).map(movie => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster_path: movie.Poster !== 'N/A' ? movie.Poster : null,
    }));
    
    res.json({
      results: transformedResults,
      page: movies.page,
      total_pages: Math.ceil(movies.totalResults / 10),
      total_results: movies.totalResults
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Note: Trending movies endpoint removed as OMDb doesn't support it
// You can use popular movies as an alternative

module.exports = {
  getPopularMovies,
  searchMovies,
  getMovieDetails,
  getMoviesByGenre,
  getGenres,
};