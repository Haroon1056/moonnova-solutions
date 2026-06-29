/**
 * MoonNova Solutions - Base JavaScript
 * Professional & Optimized with Layout Fixes - IMPROVED
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 MoonNova Solutions - Professional Base JS Initialized');
    
    // Initialize all components
    initPageLoader();
    initBackToTop();
    initSmoothScroll();
    initFormEnhancements();
    initLayoutFixes(); // IMPROVED: Better layout handling
    initAccessibility();
    initPerformanceOptimizations();
    initResponsiveFixes(); // NEW: Responsive fixes
    
    // Dispatch initialization event
    dispatchCustomEvent('moonnova:baseInitialized', {
        version: '2.1.0',
        timestamp: Date.now()
    });
});

/**
 * ========== PAGE LOADER ==========
 */
function initPageLoader() {
    const pageLoader = document.getElementById('page-loader');
    
    if (!pageLoader) return;
    
    // Hide loader when page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(function() {
            pageLoader.classList.add('hidden');
            
            // Remove from DOM after animation completes
            setTimeout(function() {
                pageLoader.style.display = 'none';
                document.body.classList.add('page-loaded');
            }, 500);
        }, 800);
    });
    
    // Fallback: hide loader after 3 seconds max
    setTimeout(function() {
        if (!pageLoader.classList.contains('hidden')) {
            pageLoader.classList.add('hidden');
        }
    }, 3000);
}

/**
 * ========== BACK TO TOP BUTTON ==========
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (!backToTopBtn) return;
    
    function toggleBackToTop() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        trackEvent('UI', 'BackToTopClicked');
    });
    
    const debouncedScroll = debounce(toggleBackToTop, 100);
    window.addEventListener('scroll', debouncedScroll, { passive: true });
    
    toggleBackToTop();
}

/**
 * ========== SMOOTH SCROLL ==========
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const header = document.querySelector('.moonnova-header');
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
                
                setTimeout(() => {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                    target.removeAttribute('tabindex');
                }, 1000);
                
                trackEvent('Navigation', 'SmoothScrollUsed', href);
            }
        });
    });
    
    if (typeof bootstrap !== 'undefined') {
        try {
            const scrollSpy = new bootstrap.ScrollSpy(document.body, {
                target: '#main-nav',
                offset: 100
            });
        } catch (error) {
            console.warn('Bootstrap ScrollSpy initialization failed:', error);
        }
    }
}

/**
 * ========== FORM ENHANCEMENTS ==========
 */
function initFormEnhancements() {
    const formControls = document.querySelectorAll('.form-control, .form-select, .form-check-input');
    
    formControls.forEach(control => {
        control.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        control.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
        
        control.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });
    
    const forms = document.querySelectorAll('form[data-needs-validation]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                
                this.classList.add('was-validated');
                
                const firstInvalid = this.querySelector(':invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    firstInvalid.focus();
                }
                
                trackEvent('Forms', 'ValidationFailed', form.id || 'unknown');
            }
        }, false);
    });
    
    const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
}

/**
 * ========== LAYOUT FIXES - IMPROVED ==========
 */
function initLayoutFixes() {
    fixHeaderContainerWidth();
    fixContentAlignment();
    fixHeaderOverflow();
    
    window.addEventListener('resize', debounce(() => {
        fixHeaderContainerWidth();
        fixContentAlignment();
        fixHeaderOverflow();
    }, 250));
    
    fixScrollbarWidth();
}

function fixHeaderContainerWidth() {
    const header = document.querySelector('.moonnova-header');
    const headerContainer = header ? header.querySelector('.container') : null;
    const mainContainer = document.querySelector('.main-content .container');
    
    if (headerContainer && mainContainer) {
        const mainComputedStyle = window.getComputedStyle(mainContainer);
        headerContainer.style.maxWidth = mainComputedStyle.maxWidth;
        headerContainer.style.width = '100%';
    }
}

function fixContentAlignment() {
    const containers = document.querySelectorAll('.container, .container-fluid');
    
    containers.forEach(container => {
        const computedStyle = window.getComputedStyle(container);
        const paddingLeft = parseFloat(computedStyle.paddingLeft);
        const paddingRight = parseFloat(computedStyle.paddingRight);
        
        // Ensure minimum padding on mobile
        if (window.innerWidth < 768) {
            if (paddingLeft < 16) {
                container.style.paddingLeft = '1rem';
            }
            if (paddingRight < 16) {
                container.style.paddingRight = '1rem';
            }
        }
    });
}

function fixHeaderOverflow() {
    const header = document.querySelector('.moonnova-header');
    if (!header) return;
    
    const viewportWidth = window.innerWidth;
    const headerWidth = header.offsetWidth;
    const scrollWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Check if header is overflowing
    if (headerWidth > viewportWidth) {
        // Reduce padding on small screens
        const headerContainer = header.querySelector('.container');
        if (headerContainer) {
            if (viewportWidth < 768) {
                headerContainer.style.paddingLeft = '0.75rem';
                headerContainer.style.paddingRight = '0.75rem';
            }
        }
        
        // Adjust CTA buttons
        const ctaButtons = document.querySelectorAll('.btn-cta');
        if (viewportWidth < 992) {
            ctaButtons.forEach(btn => {
                btn.style.padding = '0.625rem 1rem';
                btn.style.fontSize = '0.8125rem';
            });
        }
    }
}

function fixScrollbarWidth() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    if (scrollbarWidth > 0) {
        document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    }
}

/**
 * ========== NEW: RESPONSIVE FIXES ==========
 */
function initResponsiveFixes() {
    // Fix for mega dropdown layout
    fixMegaDropdownLayout();
    
    // Header responsive behavior
    initHeaderResponsiveBehavior();
    
    // Listen for window resize
    window.addEventListener('resize', debounce(() => {
        fixMegaDropdownLayout();
        adjustHeaderForViewport();
    }, 150));
}

function fixMegaDropdownLayout() {
    const megaMenu = document.querySelector('.mega-menu');
    if (!megaMenu) return;
    
    const viewportWidth = window.innerWidth;
    const row = megaMenu.querySelector('.row');
    
    if (row) {
        // Apply proper grid layout based on screen size
        if (viewportWidth < 768) {
            // Mobile: 1 column
            row.style.flexDirection = 'column';
        } else if (viewportWidth < 992) {
            // Tablet: 2x2 grid
            row.style.flexDirection = 'row';
            row.style.flexWrap = 'wrap';
        } else {
            // Desktop: 4 columns
            row.style.flexDirection = 'row';
        }
    }
}

function initHeaderResponsiveBehavior() {
    adjustHeaderForViewport();
    
    // Update on scroll as well
    window.addEventListener('scroll', debounce(() => {
        adjustHeaderForViewport();
    }, 100), { passive: true });
}

function adjustHeaderForViewport() {
    const viewportWidth = window.innerWidth;
    const header = document.querySelector('.moonnova-header');
    
    if (!header) return;
    
    // Check if header content is overflowing
    const headerContent = header.querySelector('.navbar-collapse');
    if (headerContent && headerContent.scrollWidth > viewportWidth) {
        // Apply responsive adjustments
        if (viewportWidth < 768) {
            // Mobile: Stack everything
            header.style.overflowX = 'hidden';
        } else if (viewportWidth < 992) {
            // Tablet: Adjust spacing
            const navItems = header.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                item.style.margin = '0 0.125rem';
            });
        }
    }
}

/**
 * ========== ACCESSIBILITY ==========
 */
function initAccessibility() {
    document.querySelectorAll('[aria-hidden="true"]').forEach(icon => {
        if (!icon.getAttribute('aria-label') && icon.classList.contains('bi')) {
            const label = icon.classList.value
                .replace('bi-', '')
                .replace(/-/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
            icon.setAttribute('aria-label', label);
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const modals = document.querySelectorAll('.modal.show');
            if (modals.length > 0) {
                const currentModal = modals[0];
                const focusableElements = currentModal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                if (focusableElements.length > 0) {
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        }
    });
}

/**
 * ========== PERFORMANCE OPTIMIZATIONS ==========
 */
function initPerformanceOptimizations() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                    }
                    
                    if (img.dataset.bg) {
                        img.style.backgroundImage = `url(${img.dataset.bg})`;
                        img.removeAttribute('data-bg');
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        document.querySelectorAll('img[data-src], [data-bg]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    const optimizedScroll = debounce(function() {
        // Performance cleanup during scroll
    }, 100);
    
    window.addEventListener('scroll', optimizedScroll, { passive: true });
}

/**
 * ========== UTILITY FUNCTIONS ==========
 */
function debounce(func, wait) {
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

function throttle(func, limit) {
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

function trackEvent(category, action, label = '') {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            transport_type: 'beacon'
        });
    }
    
    dispatchCustomEvent('analytics', { 
        category, 
        action, 
        label,
        timestamp: Date.now()
    });
}

function dispatchCustomEvent(eventName, detail = {}) {
    const event = new CustomEvent(`moonnova:${eventName}`, {
        detail: { 
            ...detail,
            timestamp: Date.now() 
        }
    });
    
    window.dispatchEvent(event);
}

function getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width < 576) return 'xs';
    if (width < 768) return 'sm';
    if (width < 992) return 'md';
    if (width < 1200) return 'lg';
    if (width < 1400) return 'xl';
    return 'xxl';
}

function isTouchDevice() {
    return 'ontouchstart' in window || 
           navigator.maxTouchPoints > 0 || 
           navigator.msMaxTouchPoints > 0;
}

/**
 * ========== WINDOW LOAD HANDLER ==========
 */
window.addEventListener('load', function() {
    console.log('✅ MoonNova Solutions - All resources loaded');
    
    setTimeout(() => {
        fixHeaderContainerWidth();
        fixContentAlignment();
        fixHeaderOverflow();
        fixMegaDropdownLayout();
    }, 100);
    
    document.body.classList.add('page-fully-loaded');
    
    dispatchCustomEvent('moonnova:ready', {
        component: 'base',
        version: '2.1.0',
        breakpoint: getCurrentBreakpoint(),
        touchDevice: isTouchDevice(),
        timestamp: Date.now()
    });
});

/**
 * ========== ERROR HANDLING ==========
 */
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            description: e.error?.message || 'Unknown error',
            fatal: false
        });
    }
}, true);

/**
 * ========== EXPORT UTILITIES ==========
 */
window.MoonNova = window.MoonNova || {};
window.MoonNova.utils = {
    debounce,
    throttle,
    trackEvent,
    getCurrentBreakpoint,
    isTouchDevice
};