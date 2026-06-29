/**
 * MoonNova Solutions - Enhanced Blog Detail JavaScript
 * Professional Table of Contents with Rich Text Support
 */

(function() {
    'use strict';
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBlogDetail);
    } else {
        initBlogDetail();
    }
    
    function initBlogDetail() {
        initTableOfContents();
        initTocHighlight();
        initCopyLink();
        initNewsletterForm();
        initReadingProgress();
    }
    
    /**
     * Enhanced Table of Contents Generator
     * Works perfectly with RichTextField content
     */
    function initTableOfContents() {
        const tocContainer = document.getElementById('tableOfContents');
        const articleContent = document.querySelector('.post-content');
        
        if (!tocContainer || !articleContent) return;
        
        // Get all headings (h2 and h3) from the article content
        const headings = articleContent.querySelectorAll('h2, h3');
        
        if (headings.length === 0) {
            // Hide TOC card if no headings
            const tocCard = tocContainer.closest('.toc-card');
            if (tocCard) tocCard.style.display = 'none';
            return;
        }
        
        // Create TOC HTML
        let tocHTML = '<ul class="toc-list">';
        let previousLevel = 'h2';
        
        headings.forEach((heading, index) => {
            // Generate a clean ID if heading doesn't have one
            if (!heading.id) {
                const headingText = heading.textContent
                    .trim()
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '') // Remove special characters
                    .replace(/\s+/g, '-') // Replace spaces with hyphens
                    .replace(/-+/g, '-') // Remove multiple hyphens
                    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
                
                heading.id = `heading-${index}-${headingText}`;
            }
            
            const level = heading.tagName.toLowerCase();
            const tocClass = level === 'h2' ? 'toc-h2' : 'toc-h3';
            
            // Handle nested structure
            if (level === 'h3' && previousLevel === 'h2') {
                // Start a new sublist for h3 after h2
                tocHTML = tocHTML.replace(/<\/li>?$/, ''); // Remove the last closing li if needed
                tocHTML += '<ul class="toc-sublist">';
            } else if (level === 'h2' && previousLevel === 'h3') {
                // Close sublist when moving from h3 to h2
                tocHTML += '</ul></li>';
            }
            
            tocHTML += `<li class="${tocClass}">
                <a href="#${heading.id}">${heading.textContent}</a>
            </li>`;
            
            previousLevel = level;
        });
        
        // Close any open sublist at the end
        if (previousLevel === 'h3') {
            tocHTML += '</ul></li>';
        }
        
        tocHTML += '</ul>';
        tocContainer.innerHTML = tocHTML;
        
        // Add click handlers for TOC links
        document.querySelectorAll('.toc-list a').forEach(link => {
            link.addEventListener('click', handleTocClick);
        });
    }
    
    /**
     * Handle TOC link clicks with smooth scroll
     */
    function handleTocClick(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const offset = 100; // Adjust for fixed header
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update URL without page reload
            history.pushState(null, '', targetId);
            
            // Update active state
            document.querySelectorAll('.toc-list a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    }
    
    /**
     * Highlight active TOC item on scroll
     */
    function initTocHighlight() {
        const headings = document.querySelectorAll('.post-content h2, .post-content h3');
        const tocLinks = document.querySelectorAll('.toc-list a');
        
        if (!headings.length || !tocLinks.length) return;
        
        // Throttle scroll event for performance
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateActiveTocItem(headings, tocLinks);
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Initial check
        updateActiveTocItem(headings, tocLinks);
    }
    
    /**
     * Update active TOC item based on scroll position
     */
    function updateActiveTocItem(headings, tocLinks) {
        let current = '';
        const scrollPosition = window.scrollY + 150; // Offset for better UX
        
        headings.forEach(heading => {
            const sectionTop = heading.offsetTop;
            if (scrollPosition >= sectionTop) {
                current = heading.getAttribute('id');
            }
        });
        
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
                
                // Ensure the active item is visible in TOC
                const tocContainer = document.querySelector('.toc-content');
                if (tocContainer) {
                    const linkPosition = link.offsetTop;
                    const containerHeight = tocContainer.clientHeight;
                    const scrollTop = tocContainer.scrollTop;
                    
                    if (linkPosition < scrollTop || linkPosition > scrollTop + containerHeight - 50) {
                        tocContainer.scrollTop = linkPosition - containerHeight / 2;
                    }
                }
            }
        });
    }
    
    /**
     * Copy link to clipboard
     */
    function initCopyLink() {
        const copyBtn = document.querySelector('.share-btn.copy-link');
        
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const url = window.location.href;
                
                navigator.clipboard.writeText(url).then(() => {
                    showNotification('Link copied to clipboard!', 'success');
                }).catch(() => {
                    showNotification('Failed to copy link', 'error');
                });
            });
        }
    }
    
    /**
     * Newsletter form submission (AJAX)
     */
    function initNewsletterForm() {
        const newsletterForm = document.getElementById('newsletterForm');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', handleNewsletterSubmit);
        }
    }
    
    function handleNewsletterSubmit(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('newsletterEmail');
        const submitBtn = document.getElementById('newsletterSubmit');
        const email = emailInput.value.trim();
        
        // Validate email
        if (!email || !isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        const originalHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i>';
        submitBtn.disabled = true;
        
        // Simulate API call (replace with actual AJAX to your backend)
        setTimeout(() => {
            // Success
            submitBtn.innerHTML = '<i class="bi bi-check"></i>';
            showNotification('Successfully subscribed to newsletter!', 'success');
            emailInput.value = '';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalHtml;
                submitBtn.disabled = false;
            }, 2000);
        }, 1000);
    }
    
    /**
     * Email validation
     */
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    /**
     * Reading progress bar
     */
    function initReadingProgress() {
        const progressBar = document.getElementById('readingProgress');
        
        if (progressBar) {
            window.addEventListener('scroll', () => {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                progressBar.style.width = scrolled + '%';
            });
        }
    }
    
    /**
     * Show notification toast
     */
    function showNotification(message, type = 'info') {
        const toast = document.getElementById('notificationToast');
        const icon = document.getElementById('notificationIcon');
        const messageEl = document.getElementById('notificationMessage');
        
        if (!toast) return;
        
        // Set icon and color based on type
        if (type === 'success') {
            icon.className = 'bi bi-check-circle-fill';
            toast.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        } else if (type === 'error') {
            icon.className = 'bi bi-exclamation-circle-fill';
            toast.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        } else {
            icon.className = 'bi bi-info-circle-fill';
            toast.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
        }
        
        messageEl.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
})();