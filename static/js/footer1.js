/**
 * MoonNova Solutions - Compact Footer JavaScript
 * Namespaced to prevent conflicts with other page scripts
 */

class MnFtCompactFooter {
    constructor() {
        this.footer = document.querySelector('.mn-ft-footer');
        this.currentYearEl = document.getElementById('mn-ft-current-year');
        this.backToTopBtn = document.getElementById('mn-ft-back-to-top');
        this.mousePosition = { x: 0, y: 0 };

        if (!this.footer) return;
        this.init();
    }

    init() {
        console.log('🌙 MoonNova Footer - Namespaced Edition Initialized');

        this.setCurrentYear();
        this.initBackToTop();
        this.initLogoAnimation();
        this.initHoverEffects();
        this.initScrollEffects();

        this.dispatchFooterEvent('initialized', {
            version: '2.1.0',
            timestamp: Date.now()
        });
    }

    setCurrentYear() {
        if (this.currentYearEl) {
            this.currentYearEl.textContent = new Date().getFullYear();
        }
    }

    initBackToTop() {
        if (!this.backToTopBtn) return;

        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 300) {
                this.backToTopBtn.classList.add('mn-ft-visible');
            } else {
                this.backToTopBtn.classList.remove('mn-ft-visible');
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        this.backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });

            this.backToTopBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.backToTopBtn.style.transform = '';
            }, 300);
        });
    }

    initLogoAnimation() {
        const orbInner = this.footer.querySelector('.mn-ft-orb-inner');
        if (orbInner) {
            setTimeout(() => {
                orbInner.style.animationPlayState = 'running';
            }, 500);
        }
    }

    initHoverEffects() {
        // Enhanced hover effects for nav links
        const links = this.footer.querySelectorAll('.mn-ft-link');
        links.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                const rect = link.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                link.style.setProperty('--mn-ft-mouse-x', `${x / rect.width}`);
                link.style.setProperty('--mn-ft-mouse-y', `${y / rect.height}`);
            });
        });

        // Social icons hover
        const socialIcons = this.footer.querySelectorAll('.mn-ft-social-icon');
        socialIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                icon.style.transform = 'translateY(-3px) scale(1.1)';
            });
            icon.addEventListener('mouseleave', () => {
                icon.style.transform = '';
            });
        });
    }

    initScrollEffects() {
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > lastScroll) {
                this.footer.classList.add('mn-ft-scrolling-down');
                this.footer.classList.remove('mn-ft-scrolling-up');
            } else {
                this.footer.classList.add('mn-ft-scrolling-up');
                this.footer.classList.remove('mn-ft-scrolling-down');
            }

            lastScroll = currentScroll;
        });
    }

    dispatchFooterEvent(name, detail) {
        const event = new CustomEvent(`mnft:${name}`, { detail });
        window.dispatchEvent(event);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.mnFtFooter = new MnFtCompactFooter();
        document.body.classList.add('mn-ft-loaded');
        console.log('✅ MoonNova Footer - Namespaced Edition Loaded Successfully');
    } catch (error) {
        console.error('❌ MoonNova footer initialization failed:', error);
        mnFtFallback();
    }
});

// Fallback
function mnFtFallback() {
    console.warn('⚠️ Using MoonNova footer fallback');

    const yearEl = document.getElementById('mn-ft-current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const backToTop = document.getElementById('mn-ft-back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        window.addEventListener('scroll', () => {
            const visible = window.pageYOffset > 300;
            backToTop.style.opacity = visible ? '1' : '0';
            backToTop.style.visibility = visible ? 'visible' : 'hidden';
        });
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MnFtCompactFooter;
}

window.MnFt = window.MnFt || {};
window.MnFt.Footer = {
    getInstance: () => window.mnFtFooter
};
