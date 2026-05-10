// server/models/Rating.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Compound index to prevent duplicate ratings
ratingSchema.index({ user: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);