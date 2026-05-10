// server/controllers/recommendationController.js
const RecommendationEngine = require('../utils/recommendationEngine');
const User = require('../models/User');
const Rating = require('../models/Rating');
const tmdb = require('../config/tmdb');

// @desc    Get personalized recommendations
// @route   GET /api/recommendations/personalized
// @access  Private
const getPersonalizedRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const engine = new RecommendationEngine(req.user.id, user.favoriteGenres || []);
    const recommendations = await engine.getRecommendations(20);
    
    res.json({
      success: true,
      recommendations,
      count: recommendations.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get similar movies to a specific movie
// @route   GET /api/recommendations/similar/:movieId
// @access  Private
const getSimilarMovies = async (req, res) => {
  try {
    const engine = new RecommendationEngine(req.user.id);
    const similar = await engine.getSimilarMovies(req.params.movieId, 10);
    res.json(similar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trending recommendations (fallback for non-logged in users)
// @route   GET /api/recommendations/trending
// @access  Public
const getTrendingRecommendations = async (req, res) => {
  try {
    const trending = await tmdb.getTrendingMovies(1);
    res.json(trending.results.slice(0, 20));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get hybrid recommendations (based on ratings and genres)
// @route   GET /api/recommendations/hybrid
// @access  Private
const getHybridRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userRatings = await Rating.find({ user: req.user.id });
    
    // Get top rated movies by the user
    const topRated = userRatings
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
    
    // Get similar movies to top rated ones
    const similarMovies = [];
    const engine = new RecommendationEngine(req.user.id, user.favoriteGenres || []);
    
    for (const rated of topRated) {
      const similar = await engine.getSimilarMovies(rated.movieId, 5);
      similarMovies.push(...similar);
    }
    
    // Remove duplicates
    const uniqueSimilar = [];
    const ids = new Set();
    for (const movie of similarMovies) {
      if (!ids.has(movie.id)) {
        ids.add(movie.id);
        uniqueSimilar.push(movie);
      }
    }
    
    // Get genre-based recommendations
    const engine2 = new RecommendationEngine(req.user.id, user.favoriteGenres || []);
    const genreRecs = await engine2.getRecommendations(10);
    
    // Combine and return unique recommendations
    const allRecs = [...uniqueSimilar, ...genreRecs];
    const finalRecs = [];
    const finalIds = new Set();
    
    for (const movie of allRecs) {
      if (!finalIds.has(movie.id)) {
        finalIds.add(movie.id);
        finalRecs.push(movie);
      }
    }
    
    res.json(finalRecs.slice(0, 20));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPersonalizedRecommendations,
  getSimilarMovies,
  getTrendingRecommendations,
  getHybridRecommendations,
};