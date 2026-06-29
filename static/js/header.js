/**
 * MoonNova Solutions - Professional Header JavaScript
 * 
 * KEY FIX: Services dropdown on mobile now uses a fully custom click toggle.
 * Fixed conflict with home.js mobile menu handler.
 */

class MoonNovaHeader {
    constructor() {
        // Core Elements
        this.header = document.querySelector('.moonnova-header');
        this.navbar = document.querySelector('.main-nav');
        this.navbarCollapse = document.getElementById('navbarContent');
        this.body = document.body;
        
        // CTA Buttons
        this.quoteBtn = document.querySelector('.nav-actions .btn-outline-light');
        this.consultationBtn = document.querySelector('.nav-actions .btn-primary');
        this.navActions = document.querySelector('.nav-actions');
        
        // Services Dropdown Elements (custom, not Bootstrap)
        this.servicesToggle = document.getElementById('servicesDropdownToggle');
        this.servicesMenu = document.getElementById('servicesDropdownMenu');
        this.megaDropdown = document.querySelector('.mega-dropdown');
        this.isMobileServicesOpen = false;
        
        // State
        this.lastScrollY = 0;
        this.scrollThreshold = 50;
        this.ticking = false;
        this.resizeTimeout = null;
        
        // Device Detection
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.currentBreakpoint = this.getCurrentBreakpoint();
        
        this.init();
    }
    
    init() {
        console.log('🚀 MoonNova Header v4.2 - Fixed Home Page Conflict');
        
        // Prevent Bootstrap from initializing our dropdown
        this.preventBootstrapDropdown();
        
        this.setupDeviceDetection();
        this.initScrollHandler();
        this.initServicesDropdown();
        this.initMobileNavigation();
        this.initCTAButtons();
        this.initLogoInteractions();
        this.initAccessibility();
        this.initResizeHandler();
        this.initResponsiveHeader();
        this.updateBodyPadding();
        
        this.dispatchCustomEvent('headerInitialized', {
            version: '4.2.0',
            breakpoint: this.currentBreakpoint,
            touchDevice: this.isTouchDevice
        });
    }
    
    /* =====================================================
       PREVENT BOOTSTRAP FROM INITIALIZING OUR DROPDOWN
    ===================================================== */
    preventBootstrapDropdown() {
        if (this.servicesToggle) {
            // Remove all Bootstrap attributes
            this.servicesToggle.removeAttribute('data-bs-toggle');
            this.servicesToggle.removeAttribute('data-bs-auto-close');
            this.servicesToggle.removeAttribute('data-bs-offset');
            
            // Destroy any existing Bootstrap dropdown instance
            if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
                try {
                    const existingDropdown = bootstrap.Dropdown.getInstance(this.servicesToggle);
                    if (existingDropdown) {
                        existingDropdown.dispose();
                        console.log('Destroyed existing Bootstrap dropdown instance');
                    }
                } catch(e) {
                    // Ignore
                }
            }
        }
    }
    
    /* =====================================================
       SERVICES DROPDOWN - COMPLETELY CUSTOM
    ===================================================== */
    initServicesDropdown() {
        if (!this.servicesToggle || !this.servicesMenu || !this.megaDropdown) {
            console.warn('⚠️ Services dropdown elements not found');
            return;
        }
        
        // Remove any existing click handlers by cloning
        const newToggle = this.servicesToggle.cloneNode(true);
        this.servicesToggle.parentNode.replaceChild(newToggle, this.servicesToggle);
        this.servicesToggle = newToggle;
        
        // Also update the reference in megaDropdown
        this.servicesToggle = document.getElementById('servicesDropdownToggle');
        
        // Add click handler with multiple prevention layers
        this.servicesToggle.addEventListener('click', (e) => {
            // Only on mobile
            if (window.innerWidth < 992) {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
                
                console.log('Services dropdown clicked on mobile');
                this.toggleMobileServices();
                return false;
            }
        });
        
        // Also handle touchstart for better mobile response
        this.servicesToggle.addEventListener('touchstart', (e) => {
            if (window.innerWidth < 992) {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileServices();
            }
        }, { passive: false });
        
        // Prevent clicks inside menu from closing it
        this.servicesMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Close dropdown when clicking outside (but NOT when clicking the toggle)
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 992 && this.isMobileServicesOpen) {
                if (!this.megaDropdown.contains(e.target)) {
                    this.closeMobileServices();
                }
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileServicesOpen) {
                this.closeMobileServices();
            }
        });
        
        // Close when mobile menu closes
        if (this.navbarCollapse) {
            this.navbarCollapse.addEventListener('hide.bs.collapse', () => {
                this.closeMobileServices();
            });
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 992 && this.isMobileServicesOpen) {
                this.closeMobileServices();
            }
        });
        
        console.log('Services dropdown initialized successfully');
    }
    
    toggleMobileServices() {
        if (this.isMobileServicesOpen) {
            this.closeMobileServices();
        } else {
            this.openMobileServices();
        }
    }
    
    openMobileServices() {
        this.servicesMenu.classList.add('mobile-open');
        this.megaDropdown.classList.add('mobile-open');
        this.servicesToggle.setAttribute('aria-expanded', 'true');
        this.isMobileServicesOpen = true;
        console.log('Mobile services opened');
        this.dispatchCustomEvent('mobileServicesOpened');
    }
    
    closeMobileServices() {
        this.servicesMenu.classList.remove('mobile-open');
        this.megaDropdown.classList.remove('mobile-open');
        this.servicesToggle.setAttribute('aria-expanded', 'false');
        this.isMobileServicesOpen = false;
        console.log('Mobile services closed');
        this.dispatchCustomEvent('mobileServicesClosed');
    }
    
    /* ===================================================== */
    
    updateBodyPadding() {
        const setpadding = () => {
            const headerHeight = this.header.offsetHeight;
            this.body.style.paddingTop = headerHeight + 'px';
        };
        setpadding();
        window.addEventListener('resize', this.debounce(setpadding, 100));
    }
    
    initScrollHandler() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                this.ticking = true;
                requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
            }
        }, { passive: true });
        
        this.handleScroll();
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > this.scrollThreshold) {
            if (!this.header.classList.contains('scrolled')) {
                this.header.classList.add('scrolled');
                this.body.classList.add('header-scrolled');
            }
        } else {
            if (this.header.classList.contains('scrolled')) {
                this.header.classList.remove('scrolled');
                this.body.classList.remove('header-scrolled');
            }
        }
        
        this.lastScrollY = currentScrollY;
    }
    
    initResponsiveHeader() {
        this.adjustHeaderForScreenSize();
        window.addEventListener('resize', this.debounce(() => {
            this.adjustHeaderForScreenSize();
            this.adjustCTAButtons();
            
            if (window.innerWidth >= 992 && this.isMobileServicesOpen) {
                this.closeMobileServices();
            }
        }, 100));
        this.adjustCTAButtons();
    }
    
    adjustHeaderForScreenSize() {
        const viewportWidth = window.innerWidth;
        if (viewportWidth < 768) {
            this.header.classList.add('header-mobile');
            this.header.classList.remove('header-tablet', 'header-desktop');
        } else if (viewportWidth < 992) {
            this.header.classList.add('header-tablet');
            this.header.classList.remove('header-mobile', 'header-desktop');
        } else {
            this.header.classList.add('header-desktop');
            this.header.classList.remove('header-mobile', 'header-tablet');
        }
    }
    
    adjustCTAButtons(forceAdjust = false) {
        const viewportWidth = window.innerWidth;
        if (!this.navActions || !this.quoteBtn || !this.consultationBtn) return;
        
        if (viewportWidth < 992) {
            this.navActions.style.flexDirection = 'column';
            this.quoteBtn.style.width = '100%';
            this.consultationBtn.style.width = '100%';
            this.quoteBtn.style.maxWidth = 'none';
            this.consultationBtn.style.maxWidth = 'none';
        } else {
            this.navActions.style.flexDirection = 'row';
            this.quoteBtn.style.width = '';
            this.consultationBtn.style.width = '';
        }
    }
    
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        if (width < 576) return 'xs';
        if (width < 768) return 'sm';
        if (width < 992) return 'md';
        if (width < 1200) return 'lg';
        if (width < 1400) return 'xl';
        return 'xxl';
    }
    
    setupDeviceDetection() {
        this.body.classList.add(`device-${this.currentBreakpoint}`);
        if (this.isTouchDevice) {
            this.body.classList.add('touch-device');
        } else {
            this.body.classList.add('mouse-device');
        }
    }
    
    initMobileNavigation() {
        if (!this.navbarCollapse) return;
        
        this.navbarCollapse.addEventListener('show.bs.collapse', () => {
            this.body.classList.add('mobile-menu-open');
            this.body.style.overflow = 'hidden';
        });
        
        this.navbarCollapse.addEventListener('hide.bs.collapse', () => {
            this.body.classList.remove('mobile-menu-open');
            this.body.style.overflow = '';
            this.closeMobileServices();
        });
        
        this.navbarCollapse.addEventListener('shown.bs.collapse', () => {
            setTimeout(() => {
                const firstFocusable = this.navbarCollapse.querySelector('a, button, input');
                if (firstFocusable) firstFocusable.focus();
            }, 100);
        });
        
        // IMPORTANT: Close mobile nav when clicking nav links
        // BUT exclude the services toggle to prevent conflict
        const navLinks = this.navbarCollapse.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            // Skip the services toggle - we handle it separately
            if (link.id !== 'servicesDropdownToggle') {
                link.addEventListener('click', () => {
                    if (window.innerWidth < 992) {
                        this.closeMobileMenu();
                    }
                });
            }
        });
    }
    
    closeMobileMenu() {
        if (this.navbarCollapse && this.navbarCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(this.navbarCollapse);
            if (bsCollapse) bsCollapse.hide();
        }
    }
    
    initCTAButtons() {
        if (this.quoteBtn) {
            this.quoteBtn.addEventListener('click', () => {
                this.trackEvent('Header', 'Get Quote Clicked', this.currentBreakpoint);
                this.closeMobileMenu();
            });
        }
        
        if (this.consultationBtn) {
            this.consultationBtn.addEventListener('click', () => {
                this.trackEvent('Header', 'Free Consultation Clicked', this.currentBreakpoint);
                this.closeMobileMenu();
            });
        }
    }
    
    initLogoInteractions() {
        const logo = document.querySelector('.navbar-brand');
        const logoMoon = document.querySelector('.logo-moon');
        const logoNova = document.querySelector('.logo-nova');
        if (!logo || !logoMoon || !logoNova) return;
        
        if (!this.isTouchDevice) {
            logo.addEventListener('mouseenter', () => {
                logoMoon.style.transform = 'scale(1.1)';
                logoNova.style.animationDuration = '1.5s';
            });
            logo.addEventListener('mouseleave', () => {
                logoMoon.style.transform = 'scale(1)';
                logoNova.style.animationDuration = '3s';
            });
        }
        
        logo.addEventListener('click', () => this.trackEvent('Header', 'Logo Clicked'));
    }
    
    initAccessibility() {
        this.initKeyboardNavigation();
    }
    
    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') this.body.classList.add('keyboard-navigation');
            if (e.key === 'Escape') this.closeMobileMenu();
        });
        document.addEventListener('mousedown', () => {
            this.body.classList.remove('keyboard-navigation');
        });
    }
    
    initResizeHandler() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                const newBreakpoint = this.getCurrentBreakpoint();
                if (newBreakpoint !== this.currentBreakpoint) {
                    this.body.classList.remove(`device-${this.currentBreakpoint}`);
                    this.currentBreakpoint = newBreakpoint;
                    this.body.classList.add(`device-${newBreakpoint}`);
                }
            }, 150);
        });
    }
    
    debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    
    trackEvent(category, action, label = '') {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                transport_type: 'beacon'
            });
        }
    }
    
    dispatchCustomEvent(eventName, detail = {}) {
        window.dispatchEvent(new CustomEvent(`moonnova:${eventName}`, {
            detail: { ...detail, timestamp: Date.now() }
        }));
    }
}

/* ===== Initialize ===== */
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        try {
            window.moonNovaHeader = new MoonNovaHeader();
            document.body.classList.add('header-loaded');
            console.log('✅ MoonNova Header v4.2 initialized');
        } catch (error) {
            console.error('❌ Header init failed:', error);
            setupFallbackHeader();
        }
    }, 100);
});

function setupFallbackHeader() {
    console.warn('⚠️ Using fallback header');
    
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarContent');
    const servicesToggle = document.getElementById('servicesDropdownToggle');
    const servicesMenu = document.getElementById('servicesDropdownMenu');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', () => {
            navbarCollapse.classList.toggle('show');
        });
    }
    
    if (servicesToggle && servicesMenu) {
        servicesToggle.addEventListener('click', (e) => {
            if (window.innerWidth < 992) {
                e.preventDefault();
                e.stopPropagation();
                servicesMenu.classList.toggle('mobile-open');
            }
        });
    }
}

window.addEventListener('load', () => {
    if (window.moonNovaHeader) {
        setTimeout(() => document.body.classList.remove('header-loading'), 500);
    }
});

// Public API
window.MoonNova = window.MoonNova || {};
window.MoonNova.Header = {
    getBreakpoint: () => window.moonNovaHeader?.getCurrentBreakpoint?.() || null,
    closeMobileMenu: () => window.moonNovaHeader?.closeMobileMenu?.(),
    closeMobileServices: () => window.moonNovaHeader?.closeMobileServices?.()
};