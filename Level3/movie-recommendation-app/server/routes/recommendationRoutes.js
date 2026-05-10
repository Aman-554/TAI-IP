// server/routes/recommendationRoutes.js
const express = require('express');
const router = express.Router();
const {
  getPersonalizedRecommendations,
  getSimilarMovies,
  getTrendingRecommendations,
  getHybridRecommendations,
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/trending', getTrendingRecommendations);
router.get('/personalized', protect, getPersonalizedRecommendations);
router.get('/similar/:movieId', protect, getSimilarMovies);
router.get('/hybrid', protect, getHybridRecommendations);

module.exports = router;