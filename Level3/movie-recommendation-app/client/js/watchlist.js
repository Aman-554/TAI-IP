// client/js/watchlist.js
let allGenres = [];
let selectedGenres = [];

document.addEventListener('DOMContentLoaded', async () => {
    if (!authManager.user) {
        window.location.href = 'login.html';
        return;
    }
    
    await loadUserProfile();
    await loadGenres();
    await loadUserRatings();
    await loadWatchlist();
    
    // Setup tab switching
    document.querySelectorAll('.profile-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            
            document.querySelectorAll('.profile-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            document.querySelectorAll('.profile-tab-content').forEach(content => content.classList.remove('active'));
            document.getElementById(`${tab}Tab`).classList.add('active');
        });
    });
    
    document.getElementById('saveGenresBtn').addEventListener('click', saveFavoriteGenres);
});

async function loadUserProfile() {
    try {
        const user = await api.getProfile();
        document.getElementById('profileName').textContent = user.name;
        document.getElementById('profileEmail').textContent = user.email;
        selectedGenres = user.favoriteGenres || [];
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function loadGenres() {
    try {
        allGenres = await api.getGenres();
        const container = document.getElementById('genresGrid');
        
        allGenres.forEach(genre => {
            const genreDiv = document.createElement('div');
            genreDiv.className = 'genre-option';
            genreDiv.setAttribute('data-genre-id', genre.id);
            genreDiv.textContent = genre.name;
            
            if (selectedGenres.includes(genre.id)) {
                genreDiv.classList.add('selected');
            }
            
            genreDiv.addEventListener('click', () => {
                genreDiv.classList.toggle('selected');
                if (genreDiv.classList.contains('selected')) {
                    if (!selectedGenres.includes(genre.id)) {
                        selectedGenres.push(genre.id);
                    }
                } else {
                    selectedGenres = selectedGenres.filter(id => id !== genre.id);
                }
            });
            
            container.appendChild(genreDiv);
        });
    } catch (error) {
        console.error('Error loading genres:', error);
    }
}

async function saveFavoriteGenres() {
    try {
        await api.updateFavoriteGenres(selectedGenres);
        authManager.showToast('Favorite genres updated!', 'success');
    } catch (error) {
        authManager.showToast('Failed to update genres', 'error');
    }
}

async function loadUserRatings() {
    const container = document.getElementById('ratedMovies');
    
    try {
        const ratings = await api.getUserRatings();
        
        if (ratings.length === 0) {
            container.innerHTML = '<p>No ratings yet. Rate some movies!</p>';
            return;
        }
        
        container.innerHTML = '';
        
        for (const rating of ratings) {
            const posterPath = rating.moviePoster 
                ? (rating.moviePoster.startsWith('http') ? rating.moviePoster : `https://image.tmdb.org/t/p/w200${rating.moviePoster}`)
                : 'https://via.placeholder.com/200x300?text=No+Poster';
            
            const ratingCard = document.createElement('div');
            ratingCard.className = 'rating-card';
            ratingCard.innerHTML = `
                <img src="${posterPath}" alt="${rating.movieTitle}">
                <div class="rating-info">
                    <h4>${rating.movieTitle}</h4>
                    <div class="rating-value">
                        ${Array(rating.rating).fill('<i class="fas fa-star"></i>').join('')}
                        ${Array(5 - rating.rating).fill('<i class="far fa-star"></i>').join('')}
                    </div>
                </div>
                <button class="remove-btn" data-rating-id="${rating._id}">
                    <i class="fas fa-trash"></i> Remove Rating
                </button>
            `;
            
            const removeBtn = ratingCard.querySelector('.remove-btn');
            removeBtn.addEventListener('click', async () => {
                try {
                    await api.deleteRating(rating._id);
                    ratingCard.remove();
                    authManager.showToast('Rating removed', 'info');
                } catch (error) {
                    authManager.showToast('Failed to remove rating', 'error');
                }
            });
            
            container.appendChild(ratingCard);
        }
    } catch (error) {
        console.error('Error loading ratings:', error);
    }
}

async function loadWatchlist() {
    const container = document.getElementById('watchlistMovies');
    
    try {
        const watchlist = await api.getWatchlist();
        
        if (watchlist.length === 0) {
            container.innerHTML = '<p>Your watchlist is empty. Add some movies!</p>';
            return;
        }
        
        container.innerHTML = '';
        
        for (const item of watchlist) {
            const posterPath = item.moviePoster 
                ? (item.moviePoster.startsWith('http') ? item.moviePoster : `https://image.tmdb.org/t/p/w200${item.moviePoster}`)
                : 'https://via.placeholder.com/200x300?text=No+Poster';
            
            const watchlistCard = document.createElement('div');
            watchlistCard.className = 'watchlist-card';
            watchlistCard.innerHTML = `
                <img src="${posterPath}" alt="${item.movieTitle}">
                <div class="watchlist-info">
                    <h4>${item.movieTitle}</h4>
                    ${item.movieRating ? `<p>TMDB Rating: ${item.movieRating.toFixed(1)}/10</p>` : ''}
                </div>
                <button class="remove-btn" data-watchlist-id="${item._id}" data-movie-id="${item.movieId}">
                    <i class="fas fa-times"></i> Remove
                </button>
            `;
            
            const removeBtn = watchlistCard.querySelector('.remove-btn');
            removeBtn.addEventListener('click', async () => {
                try {
                    await api.removeFromWatchlist(item._id);
                    watchlistCard.remove();
                    authManager.showToast('Removed from watchlist', 'info');
                } catch (error) {
                    authManager.showToast('Failed to remove from watchlist', 'error');
                }
            });
            
            container.appendChild(watchlistCard);
        }
    } catch (error) {
        console.error('Error loading watchlist:', error);
    }
}
