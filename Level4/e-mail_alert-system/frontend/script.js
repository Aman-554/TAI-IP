// Get DOM elements
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');

// API Endpoint - Update this when deployed
const API_URL = 'http://localhost:5000/api/send-alert';

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  
  // Auto hide after 3 seconds
  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

// Show loading state on button
function setLoading(isLoading) {
  if (isLoading) {
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    submitBtn.disabled = true;
  } else {
    btnText.style.display = 'inline-block';
    btnLoader.style.display = 'none';
    submitBtn.disabled = false;
  }
}

// Form submission handler
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent default form submission
  
  // Get form values
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();
  
  // Client-side validation
  if (!name || !email || !subject || !message) {
    showToast('Please fill in all fields', 'error');
    return;
  }
  
  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast('Please enter a valid email address', 'error');
    return;
  }
  
  // Prepare data to send
  const formData = { name, email, subject, message };
  
  try {
    // Show loading state
    setLoading(true);
    
    // Send POST request to backend API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    // Parse response
    const result = await response.json();
    
    if (response.ok && result.success) {
      // Success: Show success message
      showToast('✅ Message sent! Check WhatsApp for notification.', 'success');
      
      // Reset form
      form.reset();
    } else {
      // Error from server
      showToast(result.error || 'Something went wrong. Please try again.', 'error');
    }
  } catch (error) {
    // Network or other errors
    console.error('Error:', error);
    showToast('❌ Failed to connect to server. Please try again later.', 'error');
  } finally {
    // Hide loading state
    setLoading(false);
  }
});

// Add input validation on the fly
const inputs = document.querySelectorAll('input, textarea');
inputs.forEach(input => {
  input.addEventListener('input', () => {
    if (input.value.trim()) {
      input.style.borderColor = '#cbd5e0';
    }
  });
});