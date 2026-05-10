# MovieFlix - Movie Recommendation Web Application

A full-stack movie recommendation web application that provides personalized movie recommendations based on user preferences, ratings, and viewing history.

## Features

### Authentication
- User registration and login with JWT
- Password hashing with bcrypt
- Protected routes and authenticated API endpoints

### Movie Features
- Browse trending and popular movies using OMDb API
- Search movies with debounced input
- Filter by genre
- View detailed movie information
- Infinite scrolling pagination

### User Features
- Rate movies (1-5 stars)
- Add movies to watchlist
- Select favorite genres for better recommendations
- View and manage ratings and watchlist

### Recommendation System
- Weighted scoring algorithm based on:
  - Genre matching
  - Rating similarity
  - Movie popularity
- Personalized recommendations
- Hybrid recommendations combining user ratings and genres
- Similar movie suggestions

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Vanilla CSS with CSS Variables
- Responsive UI Design

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for Authentication
- OMDb API Integration for movie data fetching

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd movie-recommendation-app
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and add the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   OMDB_API_KEY=your_omdb_api_key
   OMDB_API_URL=http://www.omdbapi.com/
   CLIENT_URL=http://localhost:5500
   ```
   Start the backend server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

3. **Frontend Setup:**
   Open the `client` directory using a live server (e.g. VSCode Live Server extension) or run it on `localhost:5500`.

## Architecture Overview
- `client/` - Contains the frontend HTML, CSS, and JS logic.
- `server/` - Contains the Express backend, Mongoose models, and OMDb API integration.

## License
MIT
