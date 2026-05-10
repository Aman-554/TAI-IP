// server/controllers/ratingController.js
const Rating = require('../models/Rating');

// @desc    Add rating to a movie
// @route   POST /api/ratings
// @access  Private
const addRating = async (req, res) => {
  try {
    const { movieId, movieTitle, moviePoster, rating } = req.body;

    // Check if rating already exists
    const existingRating = await Rating.findOne({
      user: req.user.id,
      movieId,
    });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.movieTitle = movieTitle;
      existingRating.moviePoster = moviePoster;
      await existingRating.save();
      return res.json(existingRating);
    }

    // Create new rating
    const newRating = await Rating.create({
      user: req.user.id,
      movieId,
      movieTitle,
      moviePoster,
      rating,
    });

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's ratings
// @route   GET /api/ratings
// @access  Private
const getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ user: req.user.id }).sort('-createdAt');
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get rating for a specific movie
// @route   GET /api/ratings/:movieId
// @access  Private
const getMovieRating = async (req, res) => {
  try {
    const rating = await Rating.findOne({
      user: req.user.id,
      movieId: req.params.movieId,
    });
    res.json(rating || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update rating
// @route   PUT /api/ratings/:id
// @access  Private
const updateRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const userRating = await Rating.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!userRating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    userRating.rating = rating;
    await userRating.save();

    res.json(userRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete rating
// @route   DELETE /api/ratings/:id
// @access  Private
const deleteRating = async (req, res) => {
  try {
    const rating = await Rating.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.json({ message: 'Rating removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addRating,
  getUserRatings,
  getMovieRating,
  updateRating,
  deleteRating,
};