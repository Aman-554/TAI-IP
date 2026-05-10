// client/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // Load trending and popular movies on home page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
        loadHomePage();
    }
});

async function loadHomePage() {
    await loadTrendingMovies();
    await loadPopularMovies();
}

async function loadTrendingMovies() {
    const container = document.getElementById('trendingMovies');
    if (!container) return;
    
    try {
        MovieComponents.showLoadingSpinner(container);
        const data = await api.getTrendingMovies(1);
        const movies = data.results.slice(0, 12);
        MovieComponents.renderMovies(movies, container);
    } catch (error) {
        container.innerHTML = '<p class="error">Failed to load trending movies</p>';
        console.error(error);
    }
}

async function loadPopularMovies() {
    const container = document.getElementById('popularMovies');
    if (!container) return;
    
    try {
        MovieComponents.showLoadingSpinner(container);
        const data = await api.getPopularMovies(1);
        const movies = data.results.slice(0, 12);
        MovieComponents.renderMovies(movies, container);
    } catch (error) {
        container.innerHTML = '<p class="error">Failed to load popular movies</p>';
        console.error(error);
    }
}