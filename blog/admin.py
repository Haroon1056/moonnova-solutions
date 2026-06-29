from django.contrib import admin
from .models import Category, BlogPost
from django.utils.html import format_html
from django.utils import timezone

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'post_count', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ['name']}
    readonly_fields = ['created_at']  # Removed 'updated_at' since it doesn't exist
    list_editable = ['is_active']
    list_per_page = 25
    
    def post_count(self, obj):
        """Display number of posts in this category"""
        count = obj.posts.filter(is_published=True).count()
        return count
    post_count.short_description = 'Published Posts'
    post_count.admin_order_field = 'posts__count'

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = [
        'title', 
        'category', 
        'thumbnail_preview', 
        'is_published', 
        'is_featured', 
        'published_at', 
        'views_count',
        'reading_time_display'
    ]
    list_filter = ['is_published', 'is_featured', 'category', 'created_at']
    search_fields = ['title', 'excerpt', 'content']
    prepopulated_fields = {'slug': ['title']}
    readonly_fields = ['views_count', 'created_at', 'updated_at', 'thumbnail_preview', 'reading_time_display']
    list_editable = ['is_published', 'is_featured']
    list_per_page = 20
    date_hierarchy = 'published_at'
    
    actions = ['make_published', 'make_unpublished', 'make_featured', 'remove_featured']
    
    fieldsets = (
        ('Main Content', {
            'fields': ('title', 'slug', 'category', 'featured_image', 'thumbnail_preview', 'image_alt', 'excerpt', 'content'),
            'classes': ('wide',)
        }),
        ('Tags', {
            'fields': ('tags',),
        }),
        ('Publishing', {
            'fields': ('is_published', 'is_featured', 'published_at'),
            'classes': ('wide',),
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',),
        }),
        ('Metadata', {
            'fields': ('views_count', 'reading_time_display', 'created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    
    def thumbnail_preview(self, obj):
        """Show image thumbnail in admin list"""
        if obj.featured_image:
            return format_html(
                '<img src="{}" style="max-height: 50px; border-radius: 4px;" />',
                obj.featured_image.url
            )
        return format_html('<span style="color: #999;">No image</span>')
    thumbnail_preview.short_description = 'Preview'
    
    def reading_time_display(self, obj):
        """Display reading time"""
        return f"{obj.reading_time} min"
    reading_time_display.short_description = 'Reading Time'
    
    def make_published(self, request, queryset):
        """Publish selected posts"""
        queryset.update(is_published=True, published_at=timezone.now())
    make_published.short_description = "Publish selected posts"
    
    def make_unpublished(self, request, queryset):
        """Unpublish selected posts"""
        queryset.update(is_published=False)
    make_unpublished.short_description = "Unpublish selected posts"
    
    def make_featured(self, request, queryset):
        """Mark selected posts as featured"""
        queryset.update(is_featured=True)
    make_featured.short_description = "Mark as featured"
    
    def remove_featured(self, request, queryset):
        """Remove featured from selected posts"""
        queryset.update(is_featured=False)
    remove_featured.short_description = "Remove from featured"
    
    