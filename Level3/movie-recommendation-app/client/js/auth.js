// client/js/auth.js
class AuthManager {
    constructor() {
        this.user = null;
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
    }

    checkAuth() {
        const token = localStorage.getItem('token');
        if (token) {
            api.setToken(token);
            this.loadUserProfile();
        } else {
            this.updateUIForLoggedOut();
        }
    }

    async loadUserProfile() {
        try {
            const userData = await api.getProfile();
            this.user = userData;
            this.updateUIForLoggedIn();
            return userData;
        } catch (error) {
            console.error('Failed to load profile:', error);
            this.logout();
        }
    }

    async register(name, email, password) {
        try {
            const data = await api.register({ name, email, password });
            api.setToken(data.token);
            this.user = data;
            this.updateUIForLoggedIn();
            this.showToast('Registration successful! Welcome!', 'success');
            window.location.href = 'index.html';
            return data;
        } catch (error) {
            this.showToast(error.message, 'error');
            throw error;
        }
    }

    async login(email, password) {
        try {
            const data = await api.login({ email, password });
            api.setToken(data.token);
            this.user = data;
            this.updateUIForLoggedIn();
            this.showToast('Login successful! Welcome back!', 'success');
            window.location.href = 'index.html';
            return data;
        } catch (error) {
            this.showToast(error.message, 'error');
            throw error;
        }
    }

    logout() {
        api.setToken(null);
        this.user = null;
        this.updateUIForLoggedOut();
        this.showToast('Logged out successfully', 'info');
        window.location.href = 'index.html';
    }

    updateUIForLoggedIn() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const userNameSpan = document.getElementById('userName');

        if (authButtons && userMenu) {
            authButtons.style.display = 'none';
            userMenu.style.display = 'block';
            if (userNameSpan && this.user) {
                userNameSpan.textContent = this.user.name.split(' ')[0];
            }
        }

        // Update protected links visibility
        const protectedLinks = document.querySelectorAll('.protected-link');
        protectedLinks.forEach(link => link.style.display = 'block');
    }

    updateUIForLoggedOut() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');

        if (authButtons && userMenu) {
            authButtons.style.display = 'flex';
            userMenu.style.display = 'none';
        }

        const protectedLinks = document.querySelectorAll('.protected-link');
        protectedLinks.forEach(link => link.style.display = 'none');
    }

    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // User menu dropdown
        const userMenuBtn = document.getElementById('userMenuBtn');
        const dropdownMenu = document.getElementById('dropdownMenu');
        
        if (userMenuBtn && dropdownMenu) {
            userMenuBtn.addEventListener('click', () => {
                dropdownMenu.classList.toggle('show');
            });
            
            document.addEventListener('click', (e) => {
                if (!userMenuBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('show');
                }
            });
        }

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');
        
        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('show');
            });
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        }[type] || 'ℹ';
        
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});