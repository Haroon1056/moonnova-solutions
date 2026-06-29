from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Technology, Project, ProjectImage

class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 3
    fields = ['image', 'alt_text', 'order']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'project_count', 'is_active']
    prepopulated_fields = {'slug': ['name']}
    list_filter = ['is_active']
    search_fields = ['name']
    
    def project_count(self, obj):
        return obj.projects.filter(status='published').count()
    project_count.short_description = 'Projects'

@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon_preview']
    search_fields = ['name']
    
    def icon_preview(self, obj):
        if obj.icon:
            return format_html('<i class="{}"></i>', obj.icon)
        return '-'
    icon_preview.short_description = 'Icon'

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = [
        'title', 
        'category', 
        'thumbnail_preview', 
        'is_featured', 
        'status', 
        'published_at'
    ]
    list_filter = ['status', 'is_featured', 'category', 'industry']
    search_fields = ['title', 'short_description', 'client_name']
    prepopulated_fields = {'slug': ['title']}
    readonly_fields = ['created_at', 'updated_at', 'thumbnail_preview']
    list_editable = ['is_featured', 'status']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'category', 'featured_image', 'thumbnail_preview', 'image_alt', 'short_description', 'tagline')
        }),
        ('Client Details', {
            'fields': ('client_name', 'industry', 'services_provided', 'project_duration', 'technologies'),
            'classes': ('wide',)
        }),
        ('Main Content', {
            'fields': ('full_description',),
        }),
        ('Challenge & Solution', {
            'fields': ('challenge', 'approach', 'solution'),
            'classes': ('wide',)
        }),
        ('Results', {
            'fields': ('results',),
        }),
        ('Result Statistics', {
            'fields': (
                ('result_stat_1_label', 'result_stat_1_value'),
                ('result_stat_2_label', 'result_stat_2_value'),
                ('result_stat_3_label', 'result_stat_3_value'),
            ),
            'classes': ('wide',)
        }),
        ('Publishing', {
            'fields': ('is_featured', 'status', 'published_at'),
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',),
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    
    inlines = [ProjectImageInline]
    
    actions = ['make_published', 'make_featured', 'make_draft']
    
    def thumbnail_preview(self, obj):
        if obj.featured_image:
            return format_html(
                '<img src="{}" style="max-height: 50px; border-radius: 4px;" />',
                obj.featured_image.url
            )
        return format_html('<span style="color: #999;">No image</span>')
    thumbnail_preview.short_description = 'Preview'
    
    def make_published(self, request, queryset):
        queryset.update(status='published')
    make_published.short_description = "Publish selected projects"
    
    def make_draft(self, request, queryset):
        queryset.update(status='draft')
    make_draft.short_description = "Mark as draft"
    
    def make_featured(self, request, queryset):
        queryset.update(is_featured=True)
    make_featured.short_description = "Mark as featured"