from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.db.models import Q, Count
from .models import Project, Category, Technology
from django.core.paginator import Paginator

def portfolio_list(request):
    """Portfolio listing page with AJAX filtering"""
    category_slug = request.GET.get('category', 'all')
    
    # Base queryset
    projects = Project.objects.filter(
        status='published'
    ).select_related('category').prefetch_related('technologies')
    
    # Apply category filter
    if category_slug and category_slug != 'all':
        projects = projects.filter(category__slug=category_slug)
    
    # Order by featured first, then date
    projects = projects.order_by('-is_featured', '-published_at')
    
    # Get all categories with project counts
    categories = Category.objects.filter(
        is_active=True,
        projects__status='published'
    ).annotate(
        project_count=Count('projects')
    ).order_by('name')
    
    # Get featured projects
    featured_projects = projects.filter(is_featured=True)[:3]
    
    # Check if this is an AJAX request
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        projects_data = []
        for project in projects:
            projects_data.append({
                'id': project.id,
                'title': project.title,
                'slug': project.slug,
                'featured_image': project.featured_image.url if project.featured_image else None,
                'image_alt': project.image_alt or project.title,
                'category_name': project.category.name if project.category else 'Uncategorized',
                'category_slug': project.category.slug if project.category else '',
                'short_description': project.short_description,
                'url': project.get_absolute_url(),
            })
        
        return JsonResponse({
            'projects': projects_data,
            'total_count': projects.count(),
        })
    
    context = {
        'projects': projects,
        'categories': categories,
        'featured_projects': featured_projects,
        'current_category': category_slug,
        'total_projects': projects.count(),
    }
    return render(request, 'portfolio/portfolio_list.html', context)

def portfolio_detail(request, slug):
    """Individual project page"""
    project = get_object_or_404(
        Project, 
        slug=slug, 
        status='published'
    )
    
    # Get related projects (same category)
    related_projects = Project.objects.filter(
        category=project.category,
        status='published'
    ).exclude(id=project.id)[:3]
    
    # Get technologies list
    technologies = project.technologies.all()
    
    # Get gallery images - MAKE SURE THIS IS INCLUDED
    gallery_images = project.gallery_images.all()
    
    # Prepare result stats
    result_stats = []
    if project.result_stat_1_label and project.result_stat_1_value:
        result_stats.append({
            'label': project.result_stat_1_label,
            'value': project.result_stat_1_value,
        })
    if project.result_stat_2_label and project.result_stat_2_value:
        result_stats.append({
            'label': project.result_stat_2_label,
            'value': project.result_stat_2_value,
        })
    if project.result_stat_3_label and project.result_stat_3_value:
        result_stats.append({
            'label': project.result_stat_3_label,
            'value': project.result_stat_3_value,
        })
    
    context = {
        'project': project,
        'related_projects': related_projects,
        'technologies': technologies,
        'gallery_images': gallery_images,  # This is critical
        'result_stats': result_stats,
    }
    return render(request, 'portfolio/portfolio_detail.html', context)

def portfolio_category(request, slug):
    """Category page"""
    category = get_object_or_404(Category, slug=slug, is_active=True)
    
    posts = Project.objects.filter(
        category=category,
        status='published'
    ).order_by('-is_featured', '-published_at')
    
    # Pagination
    paginator = Paginator(posts, 9)  # 9 projects per page
    page = request.GET.get('page', 1)
    current_page = paginator.get_page(page)
    
    # Get all categories with counts for filter bar
    categories = Category.objects.filter(
        is_active=True,
        projects__status='published'
    ).annotate(
        project_count=Count('projects')
    ).order_by('name')
    
    context = {
        'category': category,
        'posts': current_page,
        'categories': categories,  # Pass categories for filter bar
        'paginator': paginator,
        'page_obj': current_page,
        'is_paginated': paginator.num_pages > 1,
    }
    return render(request, 'portfolio/portfolio_category.html', context)