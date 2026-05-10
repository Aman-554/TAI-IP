const express = require('express');
const router = express.Router();
const {
  addRating,
  getUserRatings,
  getMovieRating,
  updateRating,
  deleteRating,
} = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');
const { validateRating } = require('../middleware/validationMiddleware');

router.use(protect); // All routes require authentication

router.post('/', validateRating, addRating);
router.get('/', getUserRatings);
router.get('/:movieId', getMovieRating);
router.put('/:id', validateRating, updateRating);
router.delete('/:id', deleteRating);

module.exports = router;