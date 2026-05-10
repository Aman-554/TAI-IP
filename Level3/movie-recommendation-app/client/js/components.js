// client/js/components.js
class MovieComponents {
    static createMovieCard(movie) {
        const posterPath = movie.poster_path 
            ? (movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
            : 'https://via.placeholder.com/500x750?text=No+Poster';
        
        const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
        
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.setAttribute('data-movie-id', movie.id);
        card.innerHTML = `
            <div class="movie-poster">
                <img src="${posterPath}" alt="${movie.title}" loading="lazy">
                <div class="movie-rating">
                    <i class="fas fa-star"></i> ${rating}
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-year">${year}</p>
            </div>
        `;
        
        card.addEventListener('click', () => {
            window.location.href = `movie-details.html?id=${movie.id}`;
        });
        
        return card;
    }

    static createRatingStars(rating, onRate) {
        const container = document.createElement('div');
        container.className = 'rating-stars';
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.className = `fas fa-star star ${i <= rating ? 'active' : ''}`;
            star.setAttribute('data-rating', i);
            star.addEventListener('click', () => onRate(i));
            container.appendChild(star);
        }
        
        return container;
    }

    static showLoadingSpinner(container) {
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        container.innerHTML = '';
        container.appendChild(spinner);
    }

    static hideLoadingSpinner(container) {
        const spinner = container.querySelector('.spinner');
        if (spinner) spinner.remove();
    }

    static renderMovies(movies, container) {
        container.innerHTML = '';
        
        if (!movies || movies.length === 0) {
            container.innerHTML = '<p style="text-align: center;">No movies found</p>';
            return;
        }
        
        movies.forEach(movie => {
            const card = this.createMovieCard(movie);
            container.appendChild(card);
        });
    }

    static async loadMoreMovies(loadFunction, container, page = 1, observer) {
        try {
            const data = await loadFunction(page);
            const newMovies = data.results;
            
            if (newMovies && newMovies.length > 0) {
                newMovies.forEach(movie => {
                    const card = this.createMovieCard(movie);
                    container.appendChild(card);
                });
                return data.page < data.total_pages;
            }
            return false;
        } catch (error) {
            console.error('Error loading more movies:', error);
            return false;
        }
    }
}

// Debounce function for search
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}