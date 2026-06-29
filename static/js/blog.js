(function() {
    'use strict';
    
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categorySelect');
    const blogGrid = document.getElementById('blogGrid');
    const pagination = document.getElementById('pagination');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const noResults = document.getElementById('noResults');
    const clearSearch = document.getElementById('clearSearch');
    
    let searchTimeout = null;
    let currentPage = 1;
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
    }
    
    if (categorySelect) {
        categorySelect.addEventListener('change', handleFilterChange);
    }
    
    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            clearSearch.style.display = 'none';
            currentPage = 1;
            fetchPosts();
        });
    }
    
    // Pagination event delegation
    if (pagination) {
        pagination.addEventListener('click', (e) => {
            const target = e.target.closest('[data-page]');
            if (target) {
                e.preventDefault();
                const page = target.dataset.page;
                if (page) {
                    currentPage = parseInt(page);
                    fetchPosts();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    }
    
    function handleSearchInput() {
        const query = searchInput.value.trim();
        
        if (clearSearch) {
            clearSearch.style.display = query ? 'flex' : 'none';
        }
        
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        searchTimeout = setTimeout(() => {
            currentPage = 1;
            fetchPosts();
        }, 300);
    }
    
    function handleFilterChange() {
        currentPage = 1;
        fetchPosts();
    }
    
    function fetchPosts() {
        const params = new URLSearchParams({
            search: searchInput ? searchInput.value.trim() : '',
            category: categorySelect ? categorySelect.value : 'all',
            page: currentPage
        });
        
        const url = `${window.BLOG_CONFIG.postsUrl}?${params.toString()}`;
        
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }
        
        if (blogGrid) {
            blogGrid.style.opacity = '0.5';
        }
        
        fetch(url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
            
            if (blogGrid) {
                blogGrid.style.opacity = '1';
            }
            
            updateBlogGrid(data);
            updatePagination(data.pagination);
            updateBrowserUrl(params);
        })
        .catch(error => {
            console.error('Error:', error);
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
            if (blogGrid) {
                blogGrid.style.opacity = '1';
            }
        });
    }
    
    function updateBlogGrid(data) {
        if (!blogGrid) return;
        
        if (data.posts && data.posts.length > 0) {
            blogGrid.innerHTML = data.posts.map(post => `
                <article class="blog-card">
                    <div class="card-image">
                        <a href="${post.url}">
                            <img 
                                src="${post.featured_image || '/static/images/blog-placeholder.jpg'}" 
                                alt="${post.image_alt}"
                                onerror="this.src='/static/images/blog-placeholder.jpg'"
                            >
                        </a>
                        <a href="/blog/category/${post.category_slug}/" class="card-category">
                            ${post.category_name}
                        </a>
                    </div>
                    <div class="card-content">
                        <div class="card-meta">
                            <span class="post-date">
                                <i class="bi bi-calendar3"></i>
                                ${post.published_at}
                            </span>
                            <span class="reading-time">
                                <i class="bi bi-clock"></i> ${post.reading_time} min
                            </span>
                        </div>
                        <h3 class="card-title">
                            <a href="${post.url}">${post.title}</a>
                        </h3>
                        <a href="${post.url}" class="read-more">
                            Read More <i class="bi bi-arrow-right"></i>
                        </a>
                    </div>
                </article>
            `).join('');
            
            blogGrid.style.display = 'grid';
            if (noResults) noResults.style.display = 'none';
        } else {
            blogGrid.style.display = 'none';
            if (noResults) noResults.style.display = 'block';
        }
    }
    
    function updatePagination(paginationData) {
        if (!pagination) return;
        
        const { current_page, total_pages, has_next, has_previous } = paginationData;
        
        if (total_pages <= 1) {
            pagination.style.display = 'none';
            return;
        }
        
        pagination.style.display = 'block';
        
        let html = '<div class="pagination">';
        
        if (has_previous) {
            html += `<button class="page-nav prev" data-page="${current_page - 1}">
                <i class="bi bi-arrow-left"></i>
            </button>`;
        }
        
        html += '<div class="page-numbers">';
        
        for (let i = 1; i <= total_pages; i++) {
            if (i === current_page) {
                html += `<span class="page-number active">${i}</span>`;
            } else if (i > current_page - 3 && i < current_page + 3) {
                html += `<button class="page-number" data-page="${i}">${i}</button>`;
            }
        }
        
        html += '</div>';
        
        if (has_next) {
            html += `<button class="page-nav next" data-page="${current_page + 1}">
                <i class="bi bi-arrow-right"></i>
            </button>`;
        }
        
        html += '</div>';
        pagination.innerHTML = html;
    }
    
    function updateBrowserUrl(params) {
        const url = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, '', url);
    }
    
    window.resetFilters = function() {
        if (searchInput) searchInput.value = '';
        if (categorySelect) categorySelect.value = 'all';
        if (clearSearch) clearSearch.style.display = 'none';
        currentPage = 1;
        fetchPosts();
    };
})();