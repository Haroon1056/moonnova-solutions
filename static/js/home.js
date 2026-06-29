/**
 * MoonNova Solutions - Professional Homepage JavaScript
 * Premium Interactions & Animations
 */

class MoonNovaHomepage {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.scrollProgress = 0;
        this.lastScroll = 0;
        
        // Stats counters
        this.statNumbers = document.querySelectorAll('.stat-number[data-count]');
        this.counted = false;
        
        // Video player
        this.playButton = document.querySelector('.play-button');
        this.videoModal = null;
        
        this.init();
    }
    
    init() {
        console.log('🌙 MoonNova Homepage - Professional Edition Initialized');
        
        this.initScrollAnimations();
        this.initCounters();
        this.initVideoPlayer();
        this.initAccordionAnimations();
        this.initHoverEffects();
        this.initMobileOptimizations();
        
        // Load premium hero animation
        this.loadPremiumHeroAnimation();
        
        // Initial animations
        this.animateOnLoad();
    }
    
    /**
     * Load Premium Three.js Animation
     */
    loadPremiumHeroAnimation() {
        if (!document.getElementById('hero-3d-container')) return;
        
        // Check if already loaded
        if (window.premiumThreeHero) return;
        
        // Load the premium animation script
        const script = document.createElement('script');
        script.src = '{% static "js/threejs-hero-premium.js" %}';
        script.onload = () => {
            console.log('✅ Premium Hero Animation Loaded');
        };
        script.onerror = () => {
            console.log('⚠️ Falling back to CSS animation');
            this.setupCSSFallback();
        };
        
        document.head.appendChild(script);
    }
    
    setupCSSFallback() {
        const container = document.getElementById('hero-3d-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="css-fallback-animation">
                <div class="fallback-grid"></div>
                <div class="fallback-glow glow-1"></div>
                <div class="fallback-glow glow-2"></div>
                <div class="fallback-glow glow-3"></div>
            </div>
        `;
    }
    
    /**
     * Scroll Animations
     */
    initScrollAnimations() {
        // Update scroll progress
        const updateScrollProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            this.scrollProgress = scrollTop / docHeight;
            
            // Add scroll class to body
            if (scrollTop > 100) {
                document.body.classList.add('scrolled');
            } else {
                document.body.classList.remove('scrolled');
            }
            
            // Animate sections on scroll
            this.animateSectionsOnScroll();
        };
        
        window.addEventListener('scroll', updateScrollProgress);
        updateScrollProgress(); // Initial call
    }
    
    animateSectionsOnScroll() {
        const triggerBottom = window.innerHeight * 0.8;
        
        this.sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            
            if (sectionTop < triggerBottom) {
                section.classList.add('animated');
            }
        });
    }
    
    /**
     * Counter Animations
     */
    initCounters() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.counted) {
                    this.animateCounters();
                    this.counted = true;
                }
            });
        }, { threshold: 0.5 });
        
        const statsSection = document.querySelector('.hero-stats');
        if (statsSection) observer.observe(statsSection);
    }
    
    animateCounters() {
        this.statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };
            
            requestAnimationFrame(updateCounter);
        });
    }
    
    /**
     * Video Player
     */
    initVideoPlayer() {
        if (!this.playButton) return;
        
        this.playButton.addEventListener('click', () => {
            this.showVideoModal();
        });
    }
    
    showVideoModal() {
        // Create modal HTML
        const modalHTML = `
            <div class="modal fade" id="videoModal" tabindex="-1" aria-labelledby="videoModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content border-0 bg-transparent">
                        <div class="modal-header border-0">
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body p-0">
                            <div class="ratio ratio-16x9">
                                <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                                        title="MoonNova Solutions Brand Story" 
                                        frameborder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowfullscreen>
                                </iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        this.videoModal = new bootstrap.Modal(document.getElementById('videoModal'));
        this.videoModal.show();
        
        // Clean up on hide
        document.getElementById('videoModal').addEventListener('hidden.bs.modal', () => {
            document.getElementById('videoModal').remove();
        });
    }
    
    /**
     * Accordion Animations
     */
    initAccordionAnimations() {
        const accordionItems = document.querySelectorAll('.accordion-item');
        
        accordionItems.forEach(item => {
            const button = item.querySelector('.accordion-button');
            const collapse = item.querySelector('.accordion-collapse');
            
            if (button && collapse) {
                button.addEventListener('click', () => {
                    const isExpanded = button.classList.contains('collapsed');
                    
                    // Add animation class
                    if (isExpanded) {
                        collapse.classList.add('collapsing');
                        setTimeout(() => {
                            collapse.classList.remove('collapsing');
                        }, 300);
                    }
                });
            }
        });
    }
    
    /**
     * Enhanced Hover Effects
     */
    initHoverEffects() {
        // Service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x / rect.width}`);
                card.style.setProperty('--mouse-y', `${y / rect.height}`);
            });
        });
        
        // Project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = (x - centerX) / 25;
                const rotateX = (centerY - y) / 25;
                
                card.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-8px)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
    
    /**
     * Mobile Optimizations
     */
    initMobileOptimizations() {
        // Touch device detection
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.body.classList.add('touch-device');
            
            // Disable hover effects on mobile
            const hoverElements = document.querySelectorAll('.service-card, .project-card, .blog-card');
            hoverElements.forEach(el => {
                el.classList.add('no-hover');
            });
        }
        
        // Handle mobile menu
        this.initMobileMenu();
    }
    
    initMobileMenu() {
        // Get all nav links EXCEPT the services dropdown toggle
        const mobileMenuLinks = document.querySelectorAll('.navbar-nav .nav-link:not(#servicesDropdownToggle)');
        
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                const navbarCollapse = document.querySelector('.navbar-collapse.show');
                if (navbarCollapse) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }
            });
        });
    }
    
    /**
     * Load Animations
     */
    animateOnLoad() {
        // Animate hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 300);
        }
    }
    
    /**
     * Utility Methods
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    dispatchEvent(name, detail = {}) {
        const event = new CustomEvent(`moonnova:${name}`, { detail });
        window.dispatchEvent(event);
    }
    
    /**
     * Cleanup
     */
    destroy() {
        if (this.videoModal) {
            this.videoModal.dispose();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.moonNovaHomepage = new MoonNovaHomepage();
        
        // Add loaded class
        document.body.classList.add('homepage-loaded');
        
        console.log('✅ MoonNova Homepage - Professional Edition Loaded Successfully');
        
        // Dispatch ready event
        const readyEvent = new CustomEvent('moonnova:homepage:ready', {
            detail: { 
                component: 'homepage',
                version: '3.0.0',
                timestamp: Date.now()
            }
        });
        window.dispatchEvent(readyEvent);
        
    } catch (error) {
        console.error('❌ Homepage initialization failed:', error);
        setupFallbackHomepage();
    }
});

// Fallback functionality
function setupFallbackHomepage() {
    console.warn('⚠️ Using fallback homepage functionality');
    
    // Basic counter animation
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        let current = 0;
        const increment = target / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 20);
    });
    
    // Basic video modal
    const playButton = document.querySelector('.play-button');
    if (playButton) {
        playButton.addEventListener('click', () => {
            alert('Brand story video would play here. In production, this would open a modal with the video.');
        });
    }
}

// Global helper
window.MoonNovaHomepage = {
    getInstance: () => window.moonNovaHomepage,
    utils: {
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        animateOnScroll: function() {
            const elements = document.querySelectorAll('.animate-on-scroll');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            }, { threshold: 0.1 });
            
            elements.forEach(element => observer.observe(element));
        }
    }
};

// Initialize scroll animations
window.addEventListener('load', () => {
    if (window.MoonNovaHomepage.utils) {
        window.MoonNovaHomepage.utils.animateOnScroll();
    }
});



/**
 * MoonNova Solutions - Services Section
 * COMPLETE WORKING VERSION - Show More/Less Toggle WITH SCROLL FIX
 */

(function() {
    'use strict';
    
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        console.log('🚀 Services Section: Initializing...');
        
        // Get elements
        const toggleBtn = document.getElementById('toggle-services');
        const hiddenRows = document.getElementById('hidden-services');
        const servicesSection = document.getElementById('services');
        
        // Exit if elements don't exist
        if (!toggleBtn || !hiddenRows) {
            console.warn('⚠️ Services toggle elements not found');
            return;
        }
        
        console.log('✅ Services toggle elements found');
        
        // Store original section position for scroll restoration
        let servicesSectionTop = 0;
        
        // === INITIAL SETUP ===
        
        // 1. Hide hidden rows initially
        hiddenRows.style.display = 'none';
        hiddenRows.style.opacity = '0';
        hiddenRows.style.transform = 'translateY(-10px)';
        
        // 2. Set initial button state (Show More visible, Show Less hidden)
        const btnTextMore = toggleBtn.querySelector('.btn-text-more');
        const btnTextLess = toggleBtn.querySelector('.btn-text-less');
        const btnIconMore = toggleBtn.querySelector('.btn-icon-more');
        const btnIconLess = toggleBtn.querySelector('.btn-icon-less');
        
        if (btnTextMore) btnTextMore.style.display = 'inline';
        if (btnTextLess) btnTextLess.style.display = 'none';
        if (btnIconMore) btnIconMore.style.display = 'inline';
        if (btnIconLess) btnIconLess.style.display = 'none';
        
        // 3. Animate visible cards on page load
        animateVisibleCards();
        
        // 4. Remove any existing event listeners and add fresh one
        const newToggleBtn = toggleBtn.cloneNode(true);
        toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);
        
        // 5. Add click event listener
        newToggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isHidden = hiddenRows.style.display === 'none' || 
                            hiddenRows.style.display === '';
            
            // Store current services section position before any changes
            if (servicesSection) {
                servicesSectionTop = servicesSection.getBoundingClientRect().top + window.pageYOffset;
            }
            
            if (isHidden) {
                expandServices(this, hiddenRows);
            } else {
                collapseServices(this, hiddenRows, servicesSectionTop);
            }
        });
        
        console.log('✅ Services Section: Ready');
    }
    
    /**
     * Expand services - show hidden rows
     */
    function expandServices(btn, hiddenRows) {
        console.log('📂 Expanding services...');
        
        // Show the container
        hiddenRows.style.display = 'block';
        
        // Force reflow
        hiddenRows.offsetHeight;
        
        // Fade in
        hiddenRows.style.opacity = '1';
        hiddenRows.style.transform = 'translateY(0)';
        
        // Update button UI
        const btnTextMore = btn.querySelector('.btn-text-more');
        const btnTextLess = btn.querySelector('.btn-text-less');
        const btnIconMore = btn.querySelector('.btn-icon-more');
        const btnIconLess = btn.querySelector('.btn-icon-less');
        
        if (btnTextMore) btnTextMore.style.display = 'none';
        if (btnTextLess) btnTextLess.style.display = 'inline';
        if (btnIconMore) btnIconMore.style.display = 'none';
        if (btnIconLess) btnIconLess.style.display = 'inline';
        
        btn.classList.add('active');
        
        // Animate hidden cards sequentially
        const hiddenCards = hiddenRows.querySelectorAll('.premium-card');
        hiddenCards.forEach((card, index) => {
            // Set initial state
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'none';
            
            // Force reflow
            card.offsetHeight;
            
            // Animate in with delay
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50 + (index * 40));
        });
    }
    
    /**
     * Collapse services - hide hidden rows with scroll fix
     */
    function collapseServices(btn, hiddenRows, originalPosition) {
        console.log('📂 Collapsing services...');
        
        // Get current scroll position before hiding
        const currentScroll = window.pageYOffset;
        
        // Fade out
        hiddenRows.style.opacity = '0';
        hiddenRows.style.transform = 'translateY(-10px)';
        
        // Update button UI immediately for better UX
        const btnTextMore = btn.querySelector('.btn-text-more');
        const btnTextLess = btn.querySelector('.btn-text-less');
        const btnIconMore = btn.querySelector('.btn-icon-more');
        const btnIconLess = btn.querySelector('.btn-icon-less');
        
        if (btnTextMore) btnTextMore.style.display = 'inline';
        if (btnTextLess) btnTextLess.style.display = 'none';
        if (btnIconMore) btnIconMore.style.display = 'inline';
        if (btnIconLess) btnIconLess.style.display = 'none';
        
        btn.classList.remove('active');
        
        // Hide after animation completes
        setTimeout(() => {
            hiddenRows.style.display = 'none';
            
            // Restore scroll position to services section top
            if (originalPosition) {
                // Small delay to ensure DOM has updated
                setTimeout(() => {
                    window.scrollTo({
                        top: originalPosition,
                        behavior: 'smooth'
                    });
                }, 50);
            }
        }, 350);
    }
    
    /**
     * Animate visible cards on page load
     */
    function animateVisibleCards() {
        const visibleCards = document.querySelectorAll('.visible-row .premium-card');
        
        visibleCards.forEach((card, index) => {
            // Set initial state
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            // Animate in with delay
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.classList.add('animated');
            }, 100 + (index * 50));
        });
    }
    
    /**
     * Fallback for images that fail to load
     */
    function handleImageErrors() {
        const images = document.querySelectorAll('.card-bg-img');
        images.forEach(img => {
            img.addEventListener('error', function() {
                // Hide the broken image
                this.style.display = 'none';
                // Parent will show gradient background
            });
        });
    }
    
    // Handle image errors
    window.addEventListener('load', handleImageErrors);
    
})();