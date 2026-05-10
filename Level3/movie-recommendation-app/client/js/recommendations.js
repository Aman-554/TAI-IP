// client/js/recommendations.js
let currentTab = 'personalized';

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (!authManager.user) {
        window.location.href = 'login.html';
        return;
    }
    
    loadRecommendations('personalized');
    
    // Setup tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            currentTab = tab;
            
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            loadRecommendations(tab);
        });
    });
});

async function loadRecommendations(type) {
    const container = document.getElementById('recommendationsGrid');
    MovieComponents.showLoadingSpinner(container);
    
    try {
        let recommendations = [];
        
        switch(type) {
            case 'personalized':
                const result = await api.getPersonalizedRecommendations();
                recommendations = result.recommendations;
                break;
            case 'hybrid':
                recommendations = await api.getHybridRecommendations();
                break;
            case 'trending':
                recommendations = await api.getTrendingRecommendations();
                break;
        }
        
        if (recommendations && recommendations.length > 0) {
            MovieComponents.renderMovies(recommendations, container);
        } else {
            container.innerHTML = '<p style="text-align: center;">No recommendations available. Rate some movies to get personalized recommendations!</p>';
        }
    } catch (error) {
        console.error('Error loading recommendations:', error);
        container.innerHTML = '<p class="error">Failed to load recommendations</p>';
        authManager.showToast('Failed to load recommendations', 'error');
    }
}
