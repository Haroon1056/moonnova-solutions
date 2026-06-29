/**
 * MoonNova Solutions - Professional Header JavaScript
 * UPDATED: Direct links for CTA buttons (no modals)
 */

class MoonNovaHeader {
    constructor() {
        // Core Elements
        this.header = document.querySelector('.moonnova-header');
        this.navbar = document.querySelector('.main-nav');
        this.navbarCollapse = document.getElementById('navbarContent');
        this.body = document.body;
        
        // CTA Buttons (now simple links)
        this.quoteBtn = document.querySelector('.nav-actions .btn-outline-light');
        this.consultationBtn = document.querySelector('.nav-actions .btn-primary');
        this.navActions = document.querySelector('.nav-actions');
        
        // State Variables
        this.lastScrollY = 0;
        this.scrollThreshold = 50;
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.ticking = false;
        
        // Device Detection
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.currentBreakpoint = this.getCurrentBreakpoint();
        
        // Mega Dropdown Management
        this.megaDropdown = document.querySelector('.mega-dropdown');
        this.megaMenu = document.querySelector('.mega-menu');
        this.isMegaMenuOpen = false;
        
        // Performance
        this.resizeTimeout = null;
        
        // Initialize
        this.init();
    }
    
    init() {
        console.log('🚀 MoonNova Header - Direct Links, No Modals');
        
        this.setupDeviceDetection();
        this.initScrollHandler();
        this.initMegaDropdown();
        this.initMobileNavigation();
        this.initCTAButtons();
        this.initLogoInteractions();
        this.initAccessibility();
        this.initResizeHandler();
        this.initPerformanceOptimizations();
        this.initResponsiveHeader();
        this.updateBodyPadding();
        
        this.dispatchEvent('headerInitialized', {
            version: '3.6.0',
            breakpoint: this.currentBreakpoint,
            touchDevice: this.isTouchDevice
        });
    }
    
    updateBodyPadding() {
        const headerHeight = this.header.offsetHeight;
        this.body.style.paddingTop = headerHeight + 'px';
        
        window.addEventListener('resize', () => {
            this.debounce(() => {
                const newHeaderHeight = this.header.offsetHeight;
                this.body.style.paddingTop = newHeaderHeight + 'px';
            }, 100)();
        });
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
                this.dispatchEvent('headerScrolled', { scrolled: true });
            }
        } else {
            if (this.header.classList.contains('scrolled')) {
                this.header.classList.remove('scrolled');
                this.body.classList.remove('header-scrolled');
                this.dispatchEvent('headerScrolled', { scrolled: false });
            }
        }
        
        this.lastScrollY = currentScrollY;
    }
    
    initResponsiveHeader() {
        this.adjustHeaderForScreenSize();
        
        window.addEventListener('resize', () => {
            this.debounce(() => {
                this.adjustHeaderForScreenSize();
                this.adjustCTAButtons();
            }, 100)();
        });
        
        this.adjustCTAButtons();
    }
    
    adjustHeaderForScreenSize() {
        const viewportWidth = window.innerWidth;
        const header = this.header;
        
        if (!header) return;
        
        if (viewportWidth < 768) {
            header.classList.add('header-mobile');
            header.classList.remove('header-tablet', 'header-desktop');
        } else if (viewportWidth < 992) {
            header.classList.add('header-tablet');
            header.classList.remove('header-mobile', 'header-desktop');
        } else {
            header.classList.add('header-desktop');
            header.classList.remove('header-mobile', 'header-tablet');
        }
        
        this.checkHeaderOverflow();
    }
    
    checkHeaderOverflow() {
        const header = this.header;
        const navContent = this.navbarCollapse;
        const viewportWidth = window.innerWidth;
        
        if (!header || !navContent) return;
        
        const headerRect = header.getBoundingClientRect();
        
        if (headerRect.right > viewportWidth) {
            header.style.overflowX = 'hidden';
            this.adjustCTAButtons(true);
            
            if (viewportWidth < 768) {
                const navItems = header.querySelectorAll('.nav-item');
                navItems.forEach(item => {
                    item.style.flexShrink = '1';
                    item.style.minWidth = 'auto';
                });
            }
        } else {
            header.style.overflowX = '';
        }
    }
    
    adjustCTAButtons(forceAdjust = false) {
        const viewportWidth = window.innerWidth;
        
        if (!this.navActions || !this.quoteBtn || !this.consultationBtn) return;
        
        const containerWidth = this.navActions.offsetWidth;
        const quoteBtnWidth = this.quoteBtn.offsetWidth;
        const consultationBtnWidth = this.consultationBtn.offsetWidth;
        const gap = 12;
        const totalWidth = quoteBtnWidth + consultationBtnWidth + gap;
        
        if (forceAdjust || totalWidth > containerWidth) {
            if (viewportWidth < 480) {
                this.quoteBtn.style.padding = '0.5rem 0.75rem';
                this.consultationBtn.style.padding = '0.5rem 0.75rem';
                this.quoteBtn.style.fontSize = '0.75rem';
                this.consultationBtn.style.fontSize = '0.75rem';
            } else if (viewportWidth < 768) {
                this.quoteBtn.style.padding = '0.625rem 1rem';
                this.consultationBtn.style.padding = '0.625rem 1rem';
                this.quoteBtn.style.fontSize = '0.8125rem';
                this.consultationBtn.style.fontSize = '0.8125rem';
            }
        } else {
            this.quoteBtn.style.padding = '';
            this.consultationBtn.style.padding = '';
            this.quoteBtn.style.fontSize = '';
            this.consultationBtn.style.fontSize = '';
        }
        
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
            this.addTouchOptimizations();
        } else {
            this.body.classList.add('mouse-device');
        }
    }
    
    addTouchOptimizations() {
        const touchElements = document.querySelectorAll('.nav-link, .btn-cta, .dropdown-item');
        touchElements.forEach(el => {
            el.style.minHeight = '44px';
            el.style.minWidth = '44px';
        });
    }
    
    initMegaDropdown() {
        if (!this.megaDropdown || !this.megaMenu) return;
        
        const dropdownToggle = this.megaDropdown.querySelector('.dropdown-toggle');
        const bsDropdown = new bootstrap.Dropdown(dropdownToggle);
        
        if (!this.isTouchDevice && (this.currentBreakpoint === 'lg' || this.currentBreakpoint === 'xl' || this.currentBreakpoint === 'xxl')) {
            this.megaDropdown.addEventListener('mouseenter', () => {
                this.showMegaMenu();
            });
            
            this.megaDropdown.addEventListener('mouseleave', (e) => {
                if (!this.megaDropdown.contains(e.relatedTarget) && !this.megaMenu.contains(e.relatedTarget)) {
                    this.hideMegaMenu();
                }
            });
            
            this.megaMenu.addEventListener('mouseleave', (e) => {
                if (!this.megaDropdown.contains(e.relatedTarget) && !this.megaMenu.contains(e.relatedTarget)) {
                    this.hideMegaMenu();
                }
            });
        }
        
        if (this.isTouchDevice || this.currentBreakpoint === 'md' || this.currentBreakpoint === 'sm' || this.currentBreakpoint === 'xs') {
            dropdownToggle.addEventListener('click', (e) => {
                if (this.megaMenu.classList.contains('show')) {
                    e.stopPropagation();
                }
            });
        }
        
        dropdownToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleMegaMenu();
            } else if (e.key === 'Escape' && this.isMegaMenuOpen) {
                this.hideMegaMenu();
                dropdownToggle.focus();
            }
        });
        
        document.addEventListener('click', (e) => {
            if (this.isMegaMenuOpen && 
                !this.megaDropdown.contains(e.target) && 
                !this.megaMenu.contains(e.target)) {
                this.hideMegaMenu();
            }
        });
    }
    
    showMegaMenu() {
        if (!this.isMegaMenuOpen) {
            const dropdownToggle = this.megaDropdown.querySelector('.dropdown-toggle');
            const bsDropdown = bootstrap.Dropdown.getInstance(dropdownToggle);
            
            if (bsDropdown) {
                bsDropdown.show();
                this.isMegaMenuOpen = true;
                this.megaDropdown.classList.add('mega-active');
                this.dispatchEvent('megaMenuOpened');
            }
        }
    }
    
    hideMegaMenu() {
        if (this.isMegaMenuOpen) {
            const dropdownToggle = this.megaDropdown.querySelector('.dropdown-toggle');
            const bsDropdown = bootstrap.Dropdown.getInstance(dropdownToggle);
            
            if (bsDropdown) {
                bsDropdown.hide();
                this.isMegaMenuOpen = false;
                this.megaDropdown.classList.remove('mega-active');
                this.dispatchEvent('megaMenuClosed');
            }
        }
    }
    
    toggleMegaMenu() {
        if (this.isMegaMenuOpen) {
            this.hideMegaMenu();
        } else {
            this.showMegaMenu();
        }
    }
    
    initMobileNavigation() {
        if (this.navbarCollapse) {
            this.navbarCollapse.addEventListener('show.bs.collapse', () => {
                this.onMobileMenuOpen();
            });
            
            this.navbarCollapse.addEventListener('hide.bs.collapse', () => {
                this.onMobileMenuClose();
            });
            
            this.navbarCollapse.addEventListener('shown.bs.collapse', () => {
                this.onMobileMenuOpened();
            });
            
            this.navbarCollapse.addEventListener('hidden.bs.collapse', () => {
                this.onMobileMenuClosed();
            });
        }
        
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.currentBreakpoint === 'xs' || 
                    this.currentBreakpoint === 'sm' || 
                    this.currentBreakpoint === 'md') {
                    this.closeMobileMenu();
                }
            });
        });
    }
    
    onMobileMenuOpen() {
        this.body.classList.add('mobile-menu-open');
        this.body.style.overflow = 'hidden';
        this.dispatchEvent('mobileMenuOpening');
    }
    
    onMobileMenuClose() {
        this.dispatchEvent('mobileMenuClosing');
    }
    
    onMobileMenuOpened() {
        setTimeout(() => {
            const firstFocusable = this.navbarCollapse.querySelector('a, button, input');
            if (firstFocusable) firstFocusable.focus();
        }, 100);
        
        this.setupFocusTrap();
        this.dispatchEvent('mobileMenuOpened');
    }
    
    onMobileMenuClosed() {
        this.body.classList.remove('mobile-menu-open');
        this.body.style.overflow = '';
        
        const toggleBtn = document.querySelector('.navbar-toggler');
        if (toggleBtn) toggleBtn.focus();
        
        this.dispatchEvent('mobileMenuClosed');
    }
    
    closeMobileMenu() {
        if (this.navbarCollapse && this.navbarCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(this.navbarCollapse);
            if (bsCollapse) {
                bsCollapse.hide();
            }
        }
    }
    
    initCTAButtons() {
        // Get Quote button - direct link to contact page
        if (this.quoteBtn) {
            this.quoteBtn.addEventListener('click', (e) => {
                this.trackEvent('Header', 'Get Quote Clicked', this.currentBreakpoint);
                this.closeMobileMenu();
            });
        }
        
        // Free Consultation button - direct link to consulting page
        if (this.consultationBtn) {
            this.consultationBtn.addEventListener('click', (e) => {
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
                this.dispatchEvent('logoHovered');
            });
            
            logo.addEventListener('mouseleave', () => {
                logoMoon.style.transform = 'scale(1)';
                logoNova.style.animationDuration = '3s';
            });
        }
        
        logo.addEventListener('click', () => {
            this.trackEvent('Header', 'Logo Clicked');
        });
    }
    
    initAccessibility() {
        this.addAriaLabels();
        this.initKeyboardNavigation();
        this.initFocusVisible();
    }
    
    addAriaLabels() {
        const iconOnlyElements = document.querySelectorAll('.social-link, .contact-link i, .nav-icon i');
        
        iconOnlyElements.forEach(element => {
            if (!element.getAttribute('aria-label')) {
                const iconClass = Array.from(element.classList)
                    .find(className => className.startsWith('bi-'));
                
                if (iconClass) {
                    const label = iconClass.replace('bi-', '')
                        .replace(/-/g, ' ')
                        .replace(/\b\w/g, l => l.toUpperCase());
                    
                    element.setAttribute('aria-label', label);
                }
            }
        });
    }
    
    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            this.body.classList.remove('keyboard-navigation');
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.isMegaMenuOpen) {
                    this.hideMegaMenu();
                }
                
                this.closeMobileMenu();
                
                const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
                openDropdowns.forEach(dropdown => {
                    const dropdownInstance = bootstrap.Dropdown.getInstance(
                        dropdown.previousElementSibling
                    );
                    if (dropdownInstance) {
                        dropdownInstance.hide();
                    }
                });
            }
        });
    }
    
    initFocusVisible() {
        if (!this.body.classList.contains('focus-visible')) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    this.body.classList.add('focus-visible');
                }
            });
            
            document.addEventListener('mousedown', () => {
                this.body.classList.remove('focus-visible');
            });
        }
    }
    
    setupFocusTrap() {
        if (!this.navbarCollapse) return;
        
        const focusableElements = this.navbarCollapse.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        this.navbarCollapse.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        });
    }
    
    initResizeHandler() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            
            this.resizeTimeout = setTimeout(() => {
                const newBreakpoint = this.getCurrentBreakpoint();
                
                if (newBreakpoint !== this.currentBreakpoint) {
                    const oldBreakpoint = this.currentBreakpoint;
                    this.currentBreakpoint = newBreakpoint;
                    
                    this.body.classList.remove(`device-${oldBreakpoint}`);
                    this.body.classList.add(`device-${newBreakpoint}`);
                    
                    this.handleBreakpointChange(oldBreakpoint, newBreakpoint);
                    
                    this.dispatchEvent('breakpointChanged', {
                        old: oldBreakpoint,
                        new: newBreakpoint
                    });
                }
            }, 150);
        });
    }
    
    handleBreakpointChange(oldBreakpoint, newBreakpoint) {
        if ((oldBreakpoint === 'lg' || oldBreakpoint === 'xl' || oldBreakpoint === 'xxl') &&
            (newBreakpoint === 'xs' || newBreakpoint === 'sm' || newBreakpoint === 'md')) {
            this.hideMegaMenu();
        }
        
        if ((oldBreakpoint === 'xs' || oldBreakpoint === 'sm' || oldBreakpoint === 'md') &&
            (newBreakpoint === 'lg' || newBreakpoint === 'xl' || newBreakpoint === 'xxl')) {
            this.closeMobileMenu();
        }
    }
    
    initPerformanceOptimizations() {
        window.addEventListener('scroll', () => {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.cleanupPerformance();
            }, 100);
        }, { passive: true });
        
        this.setupLazyLoading();
    }
    
    cleanupPerformance() {}
    
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px',
                threshold: 0.01
            });
            
            const dropdownImages = document.querySelectorAll('.dropdown-menu img[data-src]');
            dropdownImages.forEach(img => observer.observe(img));
        }
    }
    
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
    
    trackEvent(category, action, label = '') {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                transport_type: 'beacon'
            });
        }
        
        this.dispatchEvent('analytics', { 
            category, 
            action, 
            label,
            timestamp: Date.now()
        });
    }
    
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(`moonnova:${eventName}`, {
            detail: { 
                ...detail, 
                header: this,
                timestamp: Date.now() 
            }
        });
        
        window.dispatchEvent(event);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        try {
            window.moonNovaHeader = new MoonNovaHeader();
            document.body.classList.add('header-loaded');
            
            console.log('✅ MoonNova Header - Direct Links, No Modals');
            
            const readyEvent = new CustomEvent('moonnova:ready', {
                detail: { 
                    component: 'header',
                    version: '3.6.0',
                    timestamp: Date.now()
                }
            });
            window.dispatchEvent(readyEvent);
            
        } catch (error) {
            console.error('❌ Failed to initialize MoonNova Header:', error);
            setupFallbackHeader();
        }
    }, 100);
});

function setupFallbackHeader() {
    console.warn('⚠️ Using fallback header functionality');
    
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarContent');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', () => {
            navbarCollapse.classList.toggle('show');
        });
    }
    
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        });
    });
}

window.addEventListener('load', () => {
    if (window.moonNovaHeader) {
        window.moonNovaHeader.dispatchEvent('pageLoaded');
        
        setTimeout(() => {
            document.body.classList.remove('header-loading');
        }, 500);
    }
});

window.addEventListener('error', (e) => {
    if (e.target.tagName === 'SCRIPT' && e.target.src.includes('header.js')) {
        console.error('Header script failed to load:', e.error);
        setupFallbackHeader();
    }
}, true);

window.MoonNova = window.MoonNova || {};
window.MoonNova.Header = {
    utils: {
        getCurrentBreakpoint: function() {
            const width = window.innerWidth;
            if (width < 576) return 'xs';
            if (width < 768) return 'sm';
            if (width < 992) return 'md';
            if (width < 1200) return 'lg';
            if (width < 1400) return 'xl';
            return 'xxl';
        },
        
        isTouchDevice: function() {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        },
        
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
        }
    }
};

// ============================================
// SIMPLE FIX FOR MOBILE SERVICES DROPDOWN
// ============================================
(function() {
    // Wait for everything to load
    window.addEventListener('load', function() {
        setTimeout(function() {
            // Get the services dropdown elements
            const servicesLink = document.querySelector('.mega-dropdown .dropdown-toggle');
            const servicesMenu = document.querySelector('.mega-dropdown .dropdown-menu');
            
            if (!servicesLink || !servicesMenu) {
                console.log('Services dropdown elements not found');
                return;
            }
            
            // Remove Bootstrap's dropdown behavior completely
            servicesLink.removeAttribute('data-bs-toggle');
            servicesLink.removeAttribute('data-bs-auto-close');
            
            // Also remove any Bootstrap dropdown instance
            if (typeof bootstrap !== 'undefined') {
                try {
                    const bsDropdown = bootstrap.Dropdown.getInstance(servicesLink);
                    if (bsDropdown) {
                        bsDropdown.dispose();
                    }
                } catch(e) {}
            }
            
            // For mobile only - add click handler
            function handleMobileClick(e) {
                // Only on mobile screens
                if (window.innerWidth < 992) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Toggle the 'show' class
                    if (servicesMenu.classList.contains('show')) {
                        servicesMenu.classList.remove('show');
                        servicesLink.setAttribute('aria-expanded', 'false');
                        console.log('Dropdown closed');
                    } else {
                        servicesMenu.classList.add('show');
                        servicesLink.setAttribute('aria-expanded', 'true');
                        console.log('Dropdown opened');
                    }
                }
            }
            
            // Remove old listeners and add new one
            servicesLink.removeEventListener('click', handleMobileClick);
            servicesLink.addEventListener('click', handleMobileClick);
            
            // Prevent clicks inside menu from closing it
            servicesMenu.removeEventListener('click', stopPropagation);
            servicesMenu.addEventListener('click', stopPropagation);
            
            function stopPropagation(e) {
                e.stopPropagation();
            }
            
            // Close dropdown when clicking outside (mobile only)
            document.removeEventListener('click', closeDropdownOutside);
            document.addEventListener('click', closeDropdownOutside);
            
            function closeDropdownOutside(e) {
                if (window.innerWidth < 992 && servicesMenu.classList.contains('show')) {
                    if (!servicesLink.contains(e.target) && !servicesMenu.contains(e.target)) {
                        servicesMenu.classList.remove('show');
                        servicesLink.setAttribute('aria-expanded', 'false');
                        console.log('Dropdown closed - outside click');
                    }
                }
            }
            
            console.log('Services dropdown fix applied!');
        }, 500);
    });
})();