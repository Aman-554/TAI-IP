// server/controllers/watchlistController.js
const Watchlist = require('../models/Watchlist');

// @desc    Add movie to watchlist
// @route   POST /api/watchlist
// @access  Private
const addToWatchlist = async (req, res) => {
  try {
    const { movieId, movieTitle, moviePoster, movieRating } = req.body;

    // Check if already in watchlist
    const exists = await Watchlist.findOne({
      user: req.user.id,
      movieId,
    });

    if (exists) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }

    const watchlistItem = await Watchlist.create({
      user: req.user.id,
      movieId,
      movieTitle,
      moviePoster,
      movieRating,
    });

    res.status(201).json(watchlistItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's watchlist
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ user: req.user.id }).sort('-addedAt');
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if movie is in watchlist
// @route   GET /api/watchlist/check/:movieId
// @access  Private
const checkWatchlist = async (req, res) => {
  try {
    const item = await Watchlist.findOne({
      user: req.user.id,
      movieId: req.params.movieId,
    });
    res.json({ inWatchlist: !!item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove from watchlist
// @route   DELETE /api/watchlist/:id
// @access  Private
const removeFromWatchlist = async (req, res) => {
  try {
    const item = await Watchlist.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found in watchlist' });
    }

    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToWatchlist,
  getWatchlist,
  checkWatchlist,
  removeFromWatchlist,
};