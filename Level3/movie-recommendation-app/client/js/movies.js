// client/js/movies.js
let currentPage = 1;
let currentQuery = '';
let currentGenre = '';
let isLoading = false;
let hasMore = true;
let observer;

document.addEventListener('DOMContentLoaded', () => {
    loadGenres();
    loadMovies();
    setupInfiniteScroll();
    
    const searchInput = document.getElementById('searchInput');
    const genreFilter = document.getElementById('genreFilter');
    
    const debouncedSearch = debounce(() => {
        currentQuery = searchInput.value;
        currentGenre = genreFilter.value;
        currentPage = 1;
        hasMore = true;
        document.getElementById('moviesGrid').innerHTML = '';
        loadMovies();
    }, 500);
    
    searchInput.addEventListener('input', debouncedSearch);
    genreFilter.addEventListener('change', () => {
        currentGenre = genreFilter.value;
        currentQuery = '';
        searchInput.value = '';
        currentPage = 1;
        hasMore = true;
        document.getElementById('moviesGrid').innerHTML = '';
        loadMovies();
    });
});

async function loadGenres() {
    try {
        const genres = await api.getGenres();
        const select = document.getElementById('genreFilter');
        genres.forEach(genre => {
            const option = document.createElement('option');
            // Changed from genre.id to genre.name because backend expects genreName
            option.value = genre.name;
            option.textContent = genre.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading genres:', error);
    }
}

async function loadMovies() {
    if (isLoading) return;
    isLoading = true;
    
    const container = document.getElementById('moviesGrid');
    
    try {
        let data;
        if (currentQuery) {
            data = await api.searchMovies(currentQuery, currentPage);
        } else if (currentGenre) {
            data = await api.getMoviesByGenre(currentGenre, currentPage);
        } else {
            data = await api.getPopularMovies(currentPage);
        }
        
        const movies = data.results;
        
        if (currentPage === 1) {
            MovieComponents.renderMovies(movies, container);
        } else {
            movies.forEach(movie => {
                const card = MovieComponents.createMovieCard(movie);
                container.appendChild(card);
            });
        }
        
        hasMore = data.page < data.total_pages;
        currentPage++;
    } catch (error) {
        console.error('Error loading movies:', error);
        authManager.showToast('Failed to load movies', 'error');
    } finally {
        isLoading = false;
    }
}

function setupInfiniteScroll() {
    const loadMoreTrigger = document.getElementById('loadMoreTrigger');
    
    observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
            loadMovies();
        }
    }, { threshold: 0.1 });
    
    observer.observe(loadMoreTrigger);
}
