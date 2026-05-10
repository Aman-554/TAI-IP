// server/routes/watchlistRoutes.js
const express = require('express');
const router = express.Router();
const {
  addToWatchlist,
  getWatchlist,
  checkWatchlist,
  removeFromWatchlist,
} = require('../controllers/watchlistController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All routes require authentication

router.post('/', addToWatchlist);
router.get('/', getWatchlist);
router.get('/check/:movieId', checkWatchlist);
router.delete('/:id', removeFromWatchlist);

module.exports = router;