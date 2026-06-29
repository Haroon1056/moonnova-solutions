from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.db.models import Q, Count
from django.utils import timezone
from django.views.decorators.http import require_GET
from django.contrib import messages
from .models import BlogPost, Category

from django.shortcuts import redirect
from django.contrib import messages
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_protect
from .models import NewsletterSubscriber

@require_POST
@csrf_protect
def newsletter_signup(request):
    """Handle newsletter signup"""
    email = request.POST.get('email', '').strip()
    
    if not email:
        messages.error(request, 'Please provide an email address.')
        return redirect(request.META.get('HTTP_REFERER', 'blog:blog_list'))
    
    # Basic email validation
    if '@' not in email or '.' not in email:
        messages.error(request, 'Please provide a valid email address.')
        return redirect(request.META.get('HTTP_REFERER', 'blog:blog_list'))
    
    # Check if already subscribed
    subscriber, created = NewsletterSubscriber.objects.get_or_create(
        email=email,
        defaults={'is_active': True}
    )
    
    if created:
        messages.success(request, 'Successfully subscribed to newsletter!')
    else:
        if not subscriber.is_active:
            subscriber.is_active = True
            subscriber.save()
            messages.success(request, 'Your subscription has been reactivated!')
        else:
            messages.info(request, 'You are already subscribed to our newsletter.')
    
    return redirect(request.META.get('HTTP_REFERER', 'blog:blog_list'))

def blog_list(request):
    """Main blog listing page with AJAX filtering"""
    # Get filter parameters
    search_query = request.GET.get('search', '')
    category_slug = request.GET.get('category', '')
    page = request.GET.get('page', 1)
    
    # Base queryset
    posts = BlogPost.objects.filter(
        is_published=True,
        published_at__lte=timezone.now()
    ).select_related('category')
    
    # Apply search filter
    if search_query:
        posts = posts.filter(
            Q(title__icontains=search_query) |
            Q(content__icontains=search_query) |
            Q(category__name__icontains=search_query)
        ).distinct()
    
    # Apply category filter
    if category_slug and category_slug != 'all':
        posts = posts.filter(category__slug=category_slug)
    
    # Order by published date
    posts = posts.order_by('-published_at')
    
    # Pagination - 12 posts per page
    paginator = Paginator(posts, 12)
    current_page = paginator.get_page(page)
    
    # Get all categories with post counts
    categories = Category.objects.filter(
        is_active=True,
        posts__is_published=True
    ).annotate(
        post_count=Count('posts')
    ).order_by('name')
    
    # Get total counts
    total_posts = BlogPost.objects.filter(is_published=True).count()
    
    # Check if this is an AJAX request
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        # Return JSON response for AJAX
        posts_data = []
        for post in current_page.object_list:
            posts_data.append({
                'id': post.id,
                'title': post.title,
                'slug': post.slug,
                'featured_image': post.featured_image.url if post.featured_image else None,
                'image_alt': post.image_alt or post.title,
                'category_name': post.category.name if post.category else 'Uncategorized',
                'category_slug': post.category.slug if post.category else '',
                'published_at': post.published_at.strftime('%b %d, %Y'),
                'reading_time': post.reading_time,
                'url': post.get_absolute_url(),
            })
        
        data = {
            'posts': posts_data,
            'pagination': {
                'current_page': current_page.number,
                'total_pages': paginator.num_pages,
                'has_next': current_page.has_next(),
                'has_previous': current_page.has_previous(),
                'total_count': paginator.count,
            }
        }
        return JsonResponse(data)
    
    # Regular template response
    context = {
        'posts': current_page,
        'categories': categories,
        'current_category': category_slug,
        'search_query': search_query,
        'total_posts': total_posts,
        'categories_count': categories.count(),
        'paginator': paginator,
        'page_obj': current_page,
        'is_paginated': paginator.num_pages > 1,
    }
    return render(request, 'blog/blog_list.html', context)

def blog_detail(request, slug):
    """Individual blog post page"""
    post = get_object_or_404(
        BlogPost, 
        slug=slug, 
        is_published=True,
        published_at__lte=timezone.now()
    )
    
    # Increment view count
    post.views_count += 1
    post.save(update_fields=['views_count'])
    
    # Get related posts (same category)
    related_posts = BlogPost.objects.filter(
        category=post.category,
        is_published=True
    ).exclude(id=post.id)[:3]
    
    # Get latest posts for sidebar
    latest_posts = BlogPost.objects.filter(
        is_published=True
    ).exclude(id=post.id)[:5]
    
    # Get categories with counts
    categories = Category.objects.filter(
        is_active=True,
        posts__is_published=True
    ).annotate(
        post_count=Count('posts')
    ).order_by('name')
    
    context = {
        'post': post,
        'related_posts': related_posts,
        'latest_posts': latest_posts,
        'categories': categories,
    }
    return render(request, 'blog/blog_detail.html', context)

def blog_category(request, slug):
    """Category page"""
    category = get_object_or_404(Category, slug=slug, is_active=True)
    
    posts = BlogPost.objects.filter(
        category=category,
        is_published=True,
        published_at__lte=timezone.now()
    ).order_by('-published_at')
    
    # Pagination
    paginator = Paginator(posts, 12)
    page = request.GET.get('page', 1)
    current_page = paginator.get_page(page)
    
    # Get all categories for sidebar
    categories = Category.objects.filter(
        is_active=True,
        posts__is_published=True
    ).annotate(
        post_count=Count('posts')
    ).order_by('name')
    
    context = {
        'category': category,
        'posts': current_page,
        'categories': categories,
        'paginator': paginator,
        'page_obj': current_page,
        'is_paginated': paginator.num_pages > 1,
    }
    return render(request, 'blog/blog_category.html', context)

@require_GET
def search_suggestions(request):
    """API endpoint for search suggestions"""
    query = request.GET.get('q', '')
    if len(query) < 2:
        return JsonResponse({'suggestions': []})
    
    posts = BlogPost.objects.filter(
        Q(title__icontains=query),
        is_published=True
    )[:5]
    
    suggestions = [{
        'title': post.title,
        'slug': post.slug,
        'url': post.get_absolute_url(),
    } for post in posts]
    
    return JsonResponse({'suggestions': suggestions})