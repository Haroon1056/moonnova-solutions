/**
 * MoonNova Solutions - Contact Page JavaScript
 * Form validation, notifications, and interactions
 */

(function() {
    'use strict';
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactPage);
    } else {
        initContactPage();
    }
    
    function initContactPage() {
        initFormHandler();
        initFaqAccordion();
        initSmoothScroll();
    }
    
    // ========== FORM HANDLER ==========
    function initFormHandler() {
        const form = document.getElementById('contactForm');
        
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                const submitBtn = form.querySelector('.btn-submit');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual AJAX)
                setTimeout(() => {
                    showNotification('Message sent! We\'ll get back to you within 24 hours.', 'success');
                    form.reset();
                    
                    submitBtn.innerHTML = '<i class="bi bi-check"></i> Sent!';
                    submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }, 2000);
                }, 1500);
            }
        });
    }
    
    function validateForm() {
        const fullname = document.getElementById('fullname');
        const email = document.getElementById('email');
        const projectType = document.getElementById('project_type');
        const timeline = document.getElementById('timeline');
        const details = document.getElementById('details');
        const privacy = document.getElementById('privacy');
        
        let isValid = true;
        
        // Clear previous errors
        clearErrors();
        
        // Validate Full Name
        if (!fullname.value.trim()) {
            showError(fullname, 'Please enter your full name');
            isValid = false;
        }
        
        // Validate Email
        if (!email.value.trim()) {
            showError(email, 'Please enter your email address');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate Project Type
        if (!projectType.value) {
            showError(projectType, 'Please select a project type');
            isValid = false;
        }
        
        // Validate Timeline
        if (!timeline.value) {
            showError(timeline, 'Please select a timeline');
            isValid = false;
        }
        
        // Validate Details
        if (!details.value.trim()) {
            showError(details, 'Please tell us about your project');
            isValid = false;
        } else if (details.value.trim().length < 20) {
            showError(details, 'Please provide more details (at least 20 characters)');
            isValid = false;
        }
        
        // Validate Privacy Policy
        if (!privacy.checked) {
            showError(privacy, 'You must agree to the Privacy Policy');
            isValid = false;
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function showError(element, message) {
        element.style.borderColor = '#ef4444';
        
        const formGroup = element.closest('.form-group') || element.closest('.form-checkbox');
        const errorMsg = document.createElement('span');
        errorMsg.className = 'error-message';
        errorMsg.textContent = message;
        errorMsg.style.cssText = 'color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem; display: block;';
        
        formGroup.appendChild(errorMsg);
    }
    
    function clearErrors() {
        document.querySelectorAll('.form-control').forEach(el => {
            el.style.borderColor = '';
        });
        document.querySelectorAll('.error-message').forEach(el => el.remove());
    }
    
    function showNotification(message, type) {
        const toast = document.getElementById('notificationToast');
        const icon = document.getElementById('notificationIcon');
        const messageEl = document.getElementById('notificationMessage');
        
        if (!toast) return;
        
        if (type === 'success') {
            icon.className = 'bi bi-check-circle-fill';
            toast.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        } else {
            icon.className = 'bi bi-info-circle-fill';
            toast.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
        }
        
        messageEl.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
    
    // ========== FAQ ACCORDION ==========
    function initFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-premium-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-premium-question');
            const toggle = item.querySelector('.faq-premium-toggle');
            
            if (question) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Close all other FAQs
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                    });
                    
                    // Toggle current FAQ
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
            
            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isActive = item.classList.contains('active');
                    
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                    });
                    
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
    
    // ========== SMOOTH SCROLL ==========
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
})();