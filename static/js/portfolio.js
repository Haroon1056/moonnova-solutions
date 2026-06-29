/**
 * MoonNova Solutions - Portfolio JavaScript
 * AJAX Filtering and Interactions
 * Fixed: No scrollbar issues, smooth transitions
 */

(function() {
    'use strict';
    
    // DOM Elements
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioGrid = document.getElementById('portfolioGrid');
    const noResults = document.getElementById('noResults');
    
    // State
    let currentCategory = 'all';
    let isAnimating = false;
    
    // Initialize
    document.addEventListener('DOMContentLoaded', init);
    
    function init() {
        console.log('📁 Portfolio Page Initialized');
        
        if (filterBtns.length) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', handleFilterClick);
            });
        }
    }
    
    /**
     * Handle filter button click
     */
    function handleFilterClick(e) {
        if (isAnimating) return;
        
        const btn = e.currentTarget;
        const category = btn.dataset.category;
        
        if (currentCategory === category) return;
        
        currentCategory = category;
        
        // Update active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter projects
        filterProjects(category);
    }
    
    /**
     * Filter projects by category
     */
    function filterProjects(category) {
        if (!portfolioGrid) return;
        
        isAnimating = true;
        
        // Fade out
        portfolioGrid.style.opacity = '0.3';
        
        // Build URL with filter
        const url = `${window.location.pathname}?category=${category}`;
        
        fetch(url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Update grid
            updatePortfolioGrid(data);
            
            // Fade in
            portfolioGrid.style.opacity = '1';
            
            // Update URL without reload
            updateBrowserUrl(category);
            
            isAnimating = false;
        })
        .catch(error => {
            console.error('Filter error:', error);
            portfolioGrid.style.opacity = '1';
            isAnimating = false;
        });
    }
    
    /**
     * Update portfolio grid with new projects
     */
    function updatePortfolioGrid(data) {
        if (!portfolioGrid) return;
        
        if (data.projects && data.projects.length > 0) {
            portfolioGrid.innerHTML = renderProjects(data.projects);
            portfolioGrid.style.display = 'grid';
            if (noResults) noResults.style.display = 'none';
        } else {
            portfolioGrid.style.display = 'none';
            if (noResults) noResults.style.display = 'block';
        }
    }
    
    /**
     * Render projects HTML
     */
    function renderProjects(projects) {
        return projects.map(project => `
            <article class="portfolio-card">
                <div class="card-image">
                    <a href="${project.url}">
                        <img src="${project.featured_image}" alt="${project.image_alt || project.title}" loading="lazy">
                        <div class="image-overlay">
                            <span class="overlay-text">View Project</span>
                            <i class="bi bi-arrow-right overlay-icon"></i>
                        </div>
                    </a>
                    <span class="card-category">${project.category_name}</span>
                </div>
                
                <div class="card-content">
                    <h3 class="card-title">
                        <a href="${project.url}">${escapeHtml(project.title)}</a>
                    </h3>
                    <p class="card-description">${escapeHtml(project.short_description)}</p>
                    <a href="${project.url}" class="card-link">
                        Read Case Study <i class="bi bi-arrow-right"></i>
                    </a>
                </div>
            </article>
        `).join('');
    }
    
    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Update browser URL without reload
     */
    function updateBrowserUrl(category) {
        const url = category === 'all' 
            ? window.location.pathname 
            : `${window.location.pathname}?category=${category}`;
        
        window.history.pushState({ category: category }, '', url);
    }
    
    /**
     * Handle browser back/forward
     */
    window.addEventListener('popstate', function(event) {
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category') || 'all';
        
        if (category !== currentCategory) {
            currentCategory = category;
            
            // Update active button
            filterBtns.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.category === category) {
                    btn.classList.add('active');
                }
            });
            
            filterProjects(category);
        }
    });
    
    // Expose reset function globally
    window.resetFilter = function() {
        if (currentCategory !== 'all') {
            filterProjects('all');
        }
    };
})();