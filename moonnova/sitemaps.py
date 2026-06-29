# moonnova/sitemaps.py
from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from datetime import datetime
from blog.models import BlogPost, Category as BlogCategory
from portfolio.models import Project, Category as PortfolioCategory
from django.db import models


class StaticViewSitemap(Sitemap):
    """Static pages - rarely change"""
    
    def items(self):
        return [
            'core:home',
            'core:about',
            'contact:contact',
            'portfolio:portfolio_list',
            'blog:blog_list',
            'core:consulting',
            'core:privacy_policy',
            'core:terms_of_service',
            'core:cookies_policy',
            'services:web_development',
            'services:ecommerce_development',
            'services:custom_software_development',
            'services:mobile_app_development',
            'services:ai_ml_solutions',
            'services:data_analytics',
            'services:seo_digital_growth',
        ]
    
    def location(self, item):
        return reverse(item)
    
    def lastmod(self, item):
        return datetime.now()  # Current date when sitemap is generated


class BlogPostSitemap(Sitemap):
    """Blog posts - use actual last modified date"""
    
    def items(self):
        return BlogPost.objects.filter(is_published=True).order_by('-published_at')
    
    def lastmod(self, obj):
        return obj.updated_at or obj.published_at or obj.created_at
    
    def location(self, obj):
        return obj.get_absolute_url()


class BlogCategorySitemap(Sitemap):
    """Blog categories"""
    
    def items(self):
        return BlogCategory.objects.filter(is_active=True).annotate(
            post_count=models.Count('posts', filter=models.Q(posts__is_published=True))
        ).filter(post_count__gt=0)
    
    def location(self, obj):
        return obj.get_absolute_url()
    
    def lastmod(self, obj):
        return datetime.now()


class PortfolioProjectSitemap(Sitemap):
    """Portfolio projects"""
    
    def items(self):
        return Project.objects.filter(status='published').order_by('-published_at')
    
    def lastmod(self, obj):
        return obj.updated_at or obj.published_at or obj.created_at
    
    def location(self, obj):
        return obj.get_absolute_url()


class PortfolioCategorySitemap(Sitemap):
    """Portfolio categories"""
    
    def items(self):
        return PortfolioCategory.objects.filter(is_active=True).annotate(
            project_count=models.Count('projects', filter=models.Q(projects__status='published'))
        ).filter(project_count__gt=0)
    
    def location(self, obj):
        return obj.get_absolute_url()
    
    def lastmod(self, obj):
        return datetime.now()