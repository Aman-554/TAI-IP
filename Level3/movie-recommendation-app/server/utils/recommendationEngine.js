// server/utils/recommendationEngine.js
const Rating = require('../models/Rating');
const omdb = require('../config/omdb');  // Changed from tmdb

class RecommendationEngine {
  constructor(userId, userGenres = []) {
    this.userId = userId;
    this.userGenres = userGenres; // Now stores genre names instead of IDs
  }

  calculateScore(movie, userRatings, genreWeight = 0.4, ratingWeight = 0.4, popularityWeight = 0.2) {
    let score = 0;
    
    // Genre match score (using genre names)
    let genreMatchScore = 0;
    if (this.userGenres.length > 0 && movie.Genre) {
      const movieGenres = movie.Genre ? movie.Genre.split(', ') : [];
      const matches = movieGenres.filter(g => 
        this.userGenres.some(userGenre => 
          userGenre.toLowerCase() === g.toLowerCase()
        )
      ).length;
      genreMatchScore = matches / this.userGenres.length;
    }
    
    // Rating similarity score - OMDb uses imdbRating
    let ratingSimilarityScore = 0;
    if (userRatings.length > 0) {
      const imdbRating = parseFloat(movie.imdbRating) || 0;
      ratingSimilarityScore = Math.min(imdbRating / 10, 1);
    }
    
    // Popularity score - OMDb doesn't have popularity, use imdbVotes as proxy
    let popularityScore = 0;
    const votes = parseInt(movie.imdbVotes?.replace(/,/g, '')) || 0;
    popularityScore = Math.min(votes / 100000, 1);
    
    // Calculate weighted score
    score = (genreMatchScore * genreWeight) +
            (ratingSimilarityScore * ratingWeight) +
            (popularityScore * popularityWeight);
    
    return score;
  }

  async getWatchedMovies() {
    const ratings = await Rating.find({ user: this.userId });
    return ratings.map(r => r.movieId);
  }

  async getRecommendations(limit = 20) {
    try {
      const watchedMovies = await this.getWatchedMovies();
      const userRatings = await Rating.find({ user: this.userId });
      
      // Get popular movies as base (since OMDb doesn't have trending)
      const popular = await omdb.getPopularMovies(1);
      let allMovies = [...popular.results];
      
      // Fetch more movies based on favorite genres
      if (this.userGenres.length > 0) {
        for (const genre of this.userGenres.slice(0, 3)) {
          try {
            const genreMovies = await omdb.getMoviesByGenre(genre, 1);
            allMovies = [...allMovies, ...genreMovies.results];
          } catch (error) {
            console.error(`Error fetching genre ${genre}:`, error);
          }
        }
      }
      
      // Remove duplicates and watched movies
      const uniqueMovies = [];
      const movieIds = new Set();
      
      for (const movie of allMovies) {
        if (!movieIds.has(movie.imdbID) && !watchedMovies.includes(movie.imdbID)) {
          movieIds.add(movie.imdbID);
          uniqueMovies.push(movie);
        }
      }
      
      // Get full details for each movie to calculate score
      const moviesWithDetails = [];
      for (const movie of uniqueMovies.slice(0, 50)) { // Limit to 50 for performance
        try {
          const details = await omdb.getMovieDetails(movie.imdbID);
          moviesWithDetails.push(details);
        } catch (error) {
          console.error('Error fetching movie details:', error);
        }
      }
      
      // Calculate scores for each movie
      const scoredMovies = moviesWithDetails.map(movie => ({
        ...movie,
        recommendationScore: this.calculateScore(movie, userRatings)
      }));
      
      // Sort by score and return top N
      const recommendations = scoredMovies
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, limit);
      
      // Transform to frontend format
      return recommendations.map(movie => ({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster,
        year: movie.year,
        imdbRating: movie.imdbRating,
        plot: movie.plot,
        genre: movie.genres,
        recommendationScore: movie.recommendationScore
      }));
      
    } catch (error) {
      console.error('Recommendation error:', error);
      const popular = await omdb.getPopularMovies(1);
      return popular.results.slice(0, limit);
    }
  }

  async getSimilarMovies(movieId, limit = 10) {
    try {
      // Validate IMDb ID format
      if (!movieId || typeof movieId !== 'string' || !movieId.startsWith('tt')) {
        console.warn(`Invalid IMDb ID skipped: ${movieId}`);
        return [];
      }
      
      // OMDb doesn't have a similar movies endpoint
      // Alternative: Search by genre of the movie
      const movieDetails = await omdb.getMovieDetails(movieId);
      if (movieDetails.genres && movieDetails.genres.length > 0) {
        const genreMovies = await omdb.getMoviesByGenre(movieDetails.genres[0], 1);
        // Filter out the original movie
        const similar = (genreMovies.results || [])
          .filter(m => m.imdbID !== movieId)
          .slice(0, limit);
        return similar;
      }
      return [];
    } catch (error) {
      console.error('Error getting similar movies:', error);
      return [];
    }
  }
}

module.exports = RecommendationEngine;