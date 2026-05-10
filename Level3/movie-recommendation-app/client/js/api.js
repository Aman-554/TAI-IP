// client/js/api.js
const API_BASE_URL = 'http://localhost:5000/api';

// API Service
class APIService {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: this.getHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth APIs
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async getProfile() {
        return this.request('/auth/profile');
    }

    async updateFavoriteGenres(genres) {
        return this.request('/auth/favorite-genres', {
            method: 'PUT',
            body: JSON.stringify({ favoriteGenres: genres }),
        });
    }

    // Movie APIs
    async getTrendingMovies(page = 1) {
        return this.request(`/movies/popular?page=${page}`);
    }

    async getPopularMovies(page = 1) {
        return this.request(`/movies/popular?page=${page}`);
    }

    async searchMovies(query, page = 1) {
        return this.request(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
    }

    async getMovieDetails(movieId) {
        return this.request(`/movies/${movieId}`);
    }

    async getGenres() {
        return this.request('/movies/genres');
    }

    async getMoviesByGenre(genreId, page = 1) {
        return this.request(`/movies/genre/${genreId}?page=${page}`);
    }

    // Rating APIs
    async addRating(ratingData) {
        return this.request('/ratings', {
            method: 'POST',
            body: JSON.stringify(ratingData),
        });
    }

    async getUserRatings() {
        return this.request('/ratings');
    }

    async getMovieRating(movieId) {
        return this.request(`/ratings/${movieId}`);
    }

    async updateRating(ratingId, rating) {
        return this.request(`/ratings/${ratingId}`, {
            method: 'PUT',
            body: JSON.stringify({ rating }),
        });
    }

    async deleteRating(ratingId) {
        return this.request(`/ratings/${ratingId}`, {
            method: 'DELETE',
        });
    }

    // Watchlist APIs
    async addToWatchlist(movieData) {
        return this.request('/watchlist', {
            method: 'POST',
            body: JSON.stringify(movieData),
        });
    }

    async getWatchlist() {
        return this.request('/watchlist');
    }

    async checkWatchlist(movieId) {
        return this.request(`/watchlist/check/${movieId}`);
    }

    async removeFromWatchlist(watchlistId) {
        return this.request(`/watchlist/${watchlistId}`, {
            method: 'DELETE',
        });
    }

    // Recommendation APIs
    async getPersonalizedRecommendations() {
        return this.request('/recommendations/personalized');
    }

    async getSimilarMovies(movieId) {
        return this.request(`/recommendations/similar/${movieId}`);
    }

    async getTrendingRecommendations() {
        return this.request('/recommendations/trending');
    }

    async getHybridRecommendations() {
        return this.request('/recommendations/hybrid');
    }
}

const api = new APIService();