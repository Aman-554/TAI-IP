// server/models/Watchlist.js
const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  movieTitle: {
    type: String,
    required: true,
  },
  moviePoster: {
    type: String,
  },
  movieRating: {
    type: Number,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Compound index to prevent duplicates
watchlistSchema.index({ user: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);