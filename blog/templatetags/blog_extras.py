from django import template
from django.db.models import Count, Q
from blog.models import Category, BlogPost

register = template.Library()

@register.simple_tag
def get_categories_with_counts():
    """Get all categories with published post counts"""
    return Category.objects.filter(
        is_active=True
    ).annotate(
        post_count=Count('posts', filter=Q(posts__is_published=True))
    ).order_by('name')

@register.simple_tag
def get_latest_posts(limit=5):
    """Get latest published posts"""
    return BlogPost.objects.filter(
        is_published=True
    ).order_by('-published_at')[:limit]

@register.simple_tag
def get_popular_posts(limit=5):
    """Get most viewed posts"""
    return BlogPost.objects.filter(
        is_published=True
    ).order_by('-views_count')[:limit]

@register.simple_tag
def get_featured_posts(limit=3):
    """Get featured posts"""
    return BlogPost.objects.filter(
        is_published=True,
        is_featured=True
    ).order_by('-published_at')[:limit]

@register.simple_tag(takes_context=True)
def param_replace(context, **kwargs):
    """Return encoded URL parameters, updated with kwargs"""
    params = context['request'].GET.copy()
    for key, value in kwargs.items():
        params[key] = value
    return params.urlencode()