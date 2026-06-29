from django import template
from django.db.models import Count, Q
from portfolio.models import Category, Technology, Project

register = template.Library()

@register.simple_tag
def get_categories_with_counts():
    """Get all categories with published project counts"""
    return Category.objects.filter(
        is_active=True,
        projects__status='published'
    ).annotate(
        project_count=Count('projects', filter=Q(projects__status='published'))
    ).order_by('name')

@register.simple_tag
def get_featured_projects(limit=3):
    """Get featured projects"""
    return Project.objects.filter(
        status='published',
        is_featured=True
    ).order_by('-published_at')[:limit]

@register.simple_tag
def get_recent_projects(limit=6):
    """Get most recent projects"""
    return Project.objects.filter(
        status='published'
    ).order_by('-published_at')[:limit]

@register.simple_tag
def get_technologies():
    """Get all technologies"""
    return Technology.objects.all().order_by('name')

@register.simple_tag(takes_context=True)
def param_replace(context, **kwargs):
    """Return encoded URL parameters, updated with kwargs"""
    params = context['request'].GET.copy()
    for key, value in kwargs.items():
        params[key] = value
    return params.urlencode()

@register.filter
def project_duration_display(duration):
    """Format project duration for display"""
    if not duration:
        return ''
    return duration

@register.inclusion_tag('portfolio/includes/project_gallery.html', takes_context=True)
def render_project_gallery(context, project):
    """Render project gallery with all images"""
    return {
        'project': project,
        'gallery_images': project.gallery_images.all(),
        'request': context['request'],
    }

@register.simple_tag
def get_related_projects(project, limit=3):
    """Get related projects based on category"""
    return Project.objects.filter(
        category=project.category,
        status='published'
    ).exclude(id=project.id)[:limit]

@register.filter
def split_technologies(tech_string):
    """Split technologies string into list"""
    if not tech_string:
        return []
    return [tech.strip() for tech in tech_string.split(',')]


@register.filter
def multiply(value, arg):
    """Multiply the value by the argument"""
    try:
        return int(value) * int(arg)
    except (ValueError, TypeError):
        return 0