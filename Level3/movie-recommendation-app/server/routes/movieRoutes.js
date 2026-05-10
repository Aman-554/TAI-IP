// server/routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const {
  getPopularMovies,      // Replaces getTrendingMovies
  searchMovies,
  getMovieDetails,
  getMoviesByGenre,
  getGenres,
} = require('../controllers/movieController');

// Note: /trending endpoint removed - use /popular instead
router.get('/popular', getPopularMovies);
router.get('/search', searchMovies);
router.get('/genres', getGenres);
router.get('/genre/:genreName', getMoviesByGenre);  // Now uses genre name instead of ID
router.get('/:id', getMovieDetails);

module.exports = router;