"""
URL configuration for moonnova project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# moonnova/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.contrib.sitemaps.views import sitemap

from .sitemaps import (
    StaticViewSitemap,
    BlogPostSitemap,
    PortfolioProjectSitemap,
    PortfolioCategorySitemap,
    BlogCategorySitemap,
)

# Sitemaps configuration
sitemaps = {
    'static': StaticViewSitemap,
    'blog': BlogPostSitemap,
    'blog-categories': BlogCategorySitemap,
    'portfolio': PortfolioProjectSitemap,
    'portfolio-categories': PortfolioCategorySitemap,
}

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Sitemap
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('sitemap-<section>.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    
    # Apps
    path('', include('core.urls')),
    path('', include('services.urls')),
    path('portfolio/', include('portfolio.urls')),
    path('blog/', include('blog.urls')),
    path('contact/', include('contact.urls')),
    path('chatbot/', include('chatbot.urls')),
    path('.well-known/appspecific/com.chrome.devtools.json', 
         TemplateView.as_view(template_name='empty.json', content_type='application/json')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)