/**
 * MoonNova Solutions - Compact Footer JavaScript
 * Optimized for Professional Design
 */

class CompactMoonNovaFooter {
    constructor() {
        this.footer = document.querySelector('.compact-footer');
        this.currentYearEl = document.getElementById('current-year');
        this.backToTopBtn = document.getElementById('back-to-top');
        this.floatingParticles = document.querySelectorAll('.floating-particles .particle');
        
        this.init();
    }
    
    init() {
        console.log('🌙 MoonNova Compact Footer - Professional Edition Initialized');
        
        this.setCurrentYear();
        this.initBackToTop();
        this.initLogoAnimation();
        this.initParticleEffects();
        this.initHoverEffects();
        this.initScrollEffects();
        
        this.dispatchEvent('compactFooter:initialized', {
            version: '2.0.0',
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
        
        // Show/hide based on scroll
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 300) {
                this.backToTopBtn.classList.add('visible');
            } else {
                this.backToTopBtn.classList.remove('visible');
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        
        // Smooth scroll to top
        this.backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Click animation
            this.backToTopBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.backToTopBtn.style.transform = '';
            }, 300);
        });
    }
    
    initLogoAnimation() {
        const orbInner = document.querySelector('.orb-inner');
        if (orbInner) {
            // Start animation after a delay
            setTimeout(() => {
                orbInner.style.animationPlayState = 'running';
            }, 500);
        }
    }

     initParticleEffects() {
        // Mouse interaction for particles
        this.footer.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
            
            this.floatingParticles.forEach(particle => {
                const rect = particle.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                
                const distance = Math.sqrt(
                    Math.pow(x - this.mousePosition.x, 2) + 
                    Math.pow(y - this.mousePosition.y, 2)
                );
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    const angle = Math.atan2(
                        y - this.mousePosition.y,
                        x - this.mousePosition.x
                    );
                    
                    const pushX = Math.cos(angle) * force * 20;
                    const pushY = Math.sin(angle) * force * 20;
                    
                    particle.style.transform = `translate(${pushX}px, ${pushY}px)`;
                }
            });
        });
        
        // Reset particles position
        setInterval(() => {
            this.floatingParticles.forEach(particle => {
                particle.style.transform = '';
            });
        }, 3000);
    }
    
    initHoverEffects() {
        // Enhanced hover effects for links
        const links = document.querySelectorAll('.compact-link');
        links.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                const rect = link.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                link.style.setProperty('--mouse-x', `${x / rect.width}`);
                link.style.setProperty('--mouse-y', `${y / rect.height}`);
            });
        });
        
        // Social icons hover effect
        const socialIcons = document.querySelectorAll('.social-icon');
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
        // Add scroll class for background effects
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > lastScroll) {
                this.footer.classList.add('scrolling-down');
                this.footer.classList.remove('scrolling-up');
            } else {
                this.footer.classList.add('scrolling-up');
                this.footer.classList.remove('scrolling-down');
            }
            
            lastScroll = currentScroll;
        });
    }
    
    dispatchEvent(name, detail) {
        const event = new CustomEvent(`moonnova:${name}`, { detail });
        window.dispatchEvent(event);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.compactMoonNovaFooter = new CompactMoonNovaFooter();
        
        // Add loaded class
        document.body.classList.add('compact-footer-loaded');
        
        console.log('✅ MoonNova Compact Footer - Professional Edition Loaded Successfully');
        
    } catch (error) {
        console.error('❌ Compact footer initialization failed:', error);
        setupCompactFallback();
    }
});

// Compact fallback
function setupCompactFallback() {
    console.warn('⚠️ Using compact fallback footer functionality');
    
    // Set current year
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
    
    // Simple back to top
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CompactMoonNovaFooter;
}

// Global helper
window.MoonNovaCompact = window.MoonNovaCompact || {};
window.MoonNovaCompact.Footer = {
    getInstance: () => window.compactMoonNovaFooter
};