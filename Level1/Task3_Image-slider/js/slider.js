// ========================================
// IMAGE SLIDER FUNCTIONALITY
// ========================================

class ImageSlider {
    constructor() {
        // DOM Elements
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.nav-btn.prev');
        this.nextBtn = document.querySelector('.nav-btn.next');
        this.sliderContainer = document.querySelector('.slider-container');
        
        // Slider State
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.isAutoPlaying = true;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 2000;
        
        // Initialize
        this.init();
    }
    
    init() {
        // Event Listeners
        this.addEventListeners();
        
        // Start Auto-play
        this.startAutoPlay();
        
        // Show first slide
        this.showSlide(0);
    }
    
    // ========================================
    // EVENT LISTENERS
    // ========================================
    addEventListeners() {
        // Navigation Buttons
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Dot Indicators
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
        
        // Pause on Hover
        this.sliderContainer.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
        });
        
        this.sliderContainer.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
        
        // Touch/Swipe Support for Mobile
        this.addTouchSupport();
    }
    
    // ========================================
    // SLIDE NAVIGATION
    // ========================================
    showSlide(index) {
        // Remove active class from all slides and dots
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');
        
        // Update current slide index
        this.currentSlide = index;
    }
    
    nextSlide() {
        let next = (this.currentSlide + 1) % this.totalSlides;
        this.showSlide(next);
        this.resetAutoPlay();
    }
    
    previousSlide() {
        let prev = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.showSlide(prev);
        this.resetAutoPlay();
    }
    
    goToSlide(index) {
        this.showSlide(index);
        this.resetAutoPlay();
    }
    
    // ========================================
    // AUTO-PLAY FUNCTIONALITY
    // ========================================
    startAutoPlay() {
        if (this.isAutoPlaying && !this.autoPlayInterval) {
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoPlayDelay);
        }
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
    
    // ========================================
    // TOUCH/SWIPE SUPPORT
    // ========================================
    addTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50;
        
        this.sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX, minSwipeDistance);
        }, { passive: true });
    }
    
    handleSwipe(startX, endX, minDistance) {
        const swipeDistance = startX - endX;
        
        if (Math.abs(swipeDistance) > minDistance) {
            if (swipeDistance > 0) {
                // Swipe Left - Next Slide
                this.nextSlide();
            } else {
                // Swipe Right - Previous Slide
                this.previousSlide();
            }
        }
    }
}

// ========================================
// INITIALIZE SLIDER WHEN DOM IS READY
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const slider = new ImageSlider();
    
    // Optional: Expose to window for debugging
    window.imageSlider = slider;
    
    console.log('Image Slider initialized successfully!');
});

