// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// State Management
let currentUser = null;
let cart = [];
let products = [];
let categories = [];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
});

async function initializeApp() {
    await loadCategories();
    await loadProducts();
    renderCategories();
    renderFeaturedProducts();
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            showPage(page);
        });
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Modals
    document.getElementById('loginBtn').addEventListener('click', () => openModal('loginModal'));
    document.getElementById('registerBtn').addEventListener('click', () => openModal('registerModal'));
    document.getElementById('cartIcon').addEventListener('click', () => openModal('cartModal'));
    
    document.getElementById('closeLogin').addEventListener('click', () => closeModal('loginModal'));
    document.getElementById('closeRegister').addEventListener('click', () => closeModal('registerModal'));
    document.getElementById('closeCart').addEventListener('click', () => closeModal('cartModal'));
    document.getElementById('closeCheckout').addEventListener('click', () => closeModal('checkoutModal'));

    // Switch between login and register
    document.getElementById('switchToRegister').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('loginModal');
        openModal('registerModal');
    });
    document.getElementById('switchToLogin').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('registerModal');
        openModal('loginModal');
    });

    // Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Checkout
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (!currentUser) {
            showAlert('Please login to checkout', 'error');
            closeModal('cartModal');
            openModal('loginModal');
            return;
        }
        closeModal('cartModal');
        openModal('checkoutModal');
        populateCheckoutForm();
    });

    // Payment method toggle
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const cardDetails = document.getElementById('cardDetails');
            cardDetails.style.display = e.target.value === 'card' ? 'block' : 'none';
        });
    });

    // Filters
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
    document.getElementById('sortFilter').addEventListener('change', filterProducts);
}

// Page Navigation
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    
    document.getElementById(`${pageName}Page`).classList.add('active');
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

    if (pageName === 'products') {
        renderProducts();
    } else if (pageName === 'orders') {
        loadOrders();
    }
}

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Authentication
function checkAuthStatus() {
    const userData = localStorage.getItem('user');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateUIForLoggedInUser();
    }
    loadCartFromLocalStorage();
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const user = await response.json();
            currentUser = user;
            localStorage.setItem('user', JSON.stringify(user));
            updateUIForLoggedInUser();
            closeModal('loginModal');
            showAlert('Login successful!', 'success');
            document.getElementById('loginForm').reset();
        } else {
            showAlert('Invalid email or password', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Login failed. Please try again.', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        phone: document.getElementById('registerPhone').value,
        address: document.getElementById('registerAddress').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            showAlert('Registration successful! Please login.', 'success');
            closeModal('registerModal');
            openModal('loginModal');
            document.getElementById('registerForm').reset();
        } else {
            const error = await response.text();
            showAlert(error || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Registration failed. Please try again.', 'error');
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('user');
    updateUIForLoggedOutUser();
    showAlert('Logged out successfully', 'success');
    showPage('home');
}

function updateUIForLoggedInUser() {
    document.getElementById('loggedOutMenu').style.display = 'none';
    document.getElementById('loggedInMenu').style.display = 'block';
    document.getElementById('userInfo').textContent = currentUser.name;
    document.getElementById('ordersLink').style.display = 'block';
}

function updateUIForLoggedOutUser() {
    document.getElementById('loggedOutMenu').style.display = 'block';
    document.getElementById('loggedInMenu').style.display = 'none';
    document.getElementById('ordersLink').style.display = 'none';
}

// Categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        categories = await response.json();
        
        // Populate category filter
        const categoryFilter = document.getElementById('categoryFilter');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        // Use default categories if API fails
        categories = [
            { id: 1, name: 'Electronics', icon: 'fa-laptop' },
            { id: 2, name: 'Clothing', icon: 'fa-shirt' },
            { id: 3, name: 'Books', icon: 'fa-book' },
            { id: 4, name: 'Home & Garden', icon: 'fa-home' }
        ];
    }
}

function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = categories.map(category => `
        <div class="category-card" onclick="filterByCategory(${category.id})">
            <i class="fas ${category.icon || 'fa-tag'}"></i>
            <h3>${category.name}</h3>
        </div>
    `).join('');
}

function filterByCategory(categoryId) {
    showPage('products');
    document.getElementById('categoryFilter').value = categoryId;
    filterProducts();
}

// Products
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        products = await response.json();
    } catch (error) {
        console.error('Error loading products:', error);
        // Use sample products if API fails
        products = generateSampleProducts();
    }
}

function generateSampleProducts() {
    return [
        { id: 1, name: 'Laptop Pro', description: 'High-performance laptop for professionals', price: 1299.99, category: { id: 1, name: 'Electronics' }, stock: 15 },
        { id: 2, name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 29.99, category: { id: 1, name: 'Electronics' }, stock: 50 },
        { id: 3, name: 'Cotton T-Shirt', description: 'Comfortable cotton t-shirt', price: 19.99, category: { id: 2, name: 'Clothing' }, stock: 100 },
        { id: 4, name: 'Denim Jeans', description: 'Classic blue denim jeans', price: 49.99, category: { id: 2, name: 'Clothing' }, stock: 75 },
        { id: 5, name: 'JavaScript Guide', description: 'Complete guide to JavaScript', price: 39.99, category: { id: 3, name: 'Books' }, stock: 30 },
        { id: 6, name: 'Python Cookbook', description: 'Essential Python recipes', price: 44.99, category: { id: 3, name: 'Books' }, stock: 25 },
        { id: 7, name: 'Garden Tools Set', description: 'Complete gardening tool set', price: 79.99, category: { id: 4, name: 'Home & Garden' }, stock: 20 },
        { id: 8, name: 'LED Desk Lamp', description: 'Adjustable LED desk lamp', price: 34.99, category: { id: 4, name: 'Home & Garden' }, stock: 40 }
    ];
}

function renderFeaturedProducts() {
    const grid = document.getElementById('featuredProducts');
    const featured = products.slice(0, 4);
    grid.innerHTML = featured.map(product => createProductCard(product)).join('');
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    let filteredProducts = [...products];

    // Apply category filter
    const categoryId = document.getElementById('categoryFilter').value;
    if (categoryId) {
        filteredProducts = filteredProducts.filter(p => p.category.id == categoryId);
    }

    // Apply search filter
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.description.toLowerCase().includes(searchTerm)
        );
    }

    // Apply sorting
    const sortBy = document.getElementById('sortFilter').value;
    switch(sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        default:
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    grid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-image">
                <i class="fas fa-box"></i>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category.name}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

function filterProducts() {
    renderProducts();
}

function handleSearch(e) {
    renderProducts();
}

// Shopping Cart
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.product.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ product, quantity: 1 });
    }

    updateCartCount();
    saveCartToLocalStorage();
    showAlert(`${product.name} added to cart!`, 'success');
}

function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.product.id === productId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartCount();
        renderCart();
        saveCartToLocalStorage();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    updateCartCount();
    renderCart();
    saveCartToLocalStorage();
    showAlert('Item removed from cart', 'success');
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function renderCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        document.getElementById('cartTotal').textContent = '0.00';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    cartItemsDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <i class="fas fa-box"></i>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.product.name}</div>
                <div class="cart-item-price">$${item.product.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.product.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.product.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <i class="fas fa-trash remove-btn" onclick="removeFromCart(${item.product.id})"></i>
            </div>
        </div>
    `).join('');

    document.getElementById('cartTotal').textContent = total.toFixed(2);
}

// Update cart display when modal opens
document.getElementById('cartIcon').addEventListener('click', renderCart);

// Checkout
function populateCheckoutForm() {
    if (currentUser) {
        document.getElementById('shippingName').value = currentUser.name || '';
        document.getElementById('shippingAddress').value = currentUser.address || '';
        document.getElementById('shippingPhone').value = currentUser.phone || '';
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shipping = 5.00;
    const total = subtotal + shipping;

    document.getElementById('checkoutSubtotal').textContent = subtotal.toFixed(2);
    document.getElementById('checkoutShipping').textContent = shipping.toFixed(2);
    document.getElementById('checkoutTotal').textContent = total.toFixed(2);
}

async function handleCheckout(e) {
    e.preventDefault();

    if (!currentUser) {
        showAlert('Please login to place an order', 'error');
        return;
    }

    const orderData = {
        userId: currentUser.id,
        items: cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
        })),
        shippingAddress: document.getElementById('shippingAddress').value,
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
        totalAmount: parseFloat(document.getElementById('checkoutTotal').textContent)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            const order = await response.json();
            showAlert('Order placed successfully! Order ID: ' + order.id, 'success');
            cart = [];
            updateCartCount();
            saveCartToLocalStorage();
            closeModal('checkoutModal');
            document.getElementById('checkoutForm').reset();
            showPage('orders');
            loadOrders();
        } else {
            showAlert('Failed to place order. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        showAlert('Checkout failed. Please try again.', 'error');
    }
}

// Orders
async function loadOrders() {
    if (!currentUser) {
        document.getElementById('ordersList').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <p>Please login to view your orders</p>
            </div>
        `;
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/orders/user/${currentUser.id}`);
        const orders = await response.json();
        renderOrders(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('ordersList').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load orders</p>
            </div>
        `;
    }
}

function renderOrders(orders) {
    const ordersList = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <p>You haven't placed any orders yet</p>
                <button class="btn btn-primary" onclick="showPage('products')">Start Shopping</button>
            </div>
        `;
        return;
    }

    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">Order #${order.id}</div>
                    <div class="order-date">${new Date(order.orderDate).toLocaleDateString()}</div>
                </div>
                <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.product.name} x ${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-footer">
                <div>Payment: ${order.paymentMethod.toUpperCase()}</div>
                <div class="order-total">Total: $${order.totalAmount.toFixed(2)}</div>
            </div>
        </div>
    `).join('');
}

// Alerts
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 3000);
}
