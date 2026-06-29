from django.db import models
from django.urls import reverse
from django.utils.text import slugify
from ckeditor.fields import RichTextField
from django.utils import timezone

class Category(models.Model):
    """Portfolio categories"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('portfolio:category', args=[self.slug])

class Technology(models.Model):
    """Technologies used in projects"""
    name = models.CharField(max_length=50, unique=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Bootstrap icon class (e.g., bi-code-slash)")

    class Meta:
        verbose_name_plural = "Technologies"
        ordering = ['name']

    def __str__(self):
        return self.name

class Project(models.Model):
    """Main portfolio project model"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]

    title = models.CharField(max_length=250)
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='projects'
    )
    
    # Basic Info
    featured_image = models.ImageField(
        upload_to='portfolio/featured/%Y/%m/',
        help_text="16:9 ratio recommended (1200x675px)"
    )
    image_alt = models.CharField(
        max_length=150, 
        blank=True,
        help_text="SEO: describe the image"
    )
    short_description = models.CharField(
        max_length=200,
        help_text="Brief 1-line description for cards"
    )
    tagline = models.CharField(
        max_length=200,
        blank=True,
        help_text="Short tagline for project page"
    )
    
    # Content
    full_description = RichTextField(
        config_name='default',
        help_text="Main project description"
    )
    
    # Client Details
    client_name = models.CharField(max_length=200, blank=True)
    industry = models.CharField(max_length=200, blank=True)
    services_provided = models.CharField(max_length=500, blank=True)
    project_duration = models.CharField(max_length=100, blank=True)
    technologies = models.ManyToManyField(Technology, blank=True)
    
    # Challenge & Solution
    challenge = RichTextField(
        config_name='default',
        blank=True,
        help_text="Describe the client's challenge"
    )
    approach = RichTextField(
        config_name='default',
        blank=True,
        help_text="Describe your approach/strategy"
    )
    solution = RichTextField(
        config_name='default',
        blank=True,
        help_text="Describe the final solution"
    )
    
    # Results
    results = RichTextField(
        config_name='default',
        blank=True,
        help_text="Describe measurable outcomes"
    )
    
    # Stats/Results (for highlighted metrics)
    result_stat_1_label = models.CharField(max_length=100, blank=True)
    result_stat_1_value = models.CharField(max_length=50, blank=True)
    result_stat_2_label = models.CharField(max_length=100, blank=True)
    result_stat_2_value = models.CharField(max_length=50, blank=True)
    result_stat_3_label = models.CharField(max_length=100, blank=True)
    result_stat_3_value = models.CharField(max_length=50, blank=True)
    
    # Metadata
    is_featured = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    published_at = models.DateTimeField(null=True, blank=True)
    
    # SEO
    meta_title = models.CharField(max_length=150, blank=True)
    meta_description = models.CharField(max_length=300, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', '-published_at', '-created_at']
        indexes = [
            models.Index(fields=['-published_at', 'status']),
            models.Index(fields=['slug']),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            # Ensure unique slug
            original_slug = self.slug
            counter = 1
            while Project.objects.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        
        # Auto-set published_at when publishing
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
        
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('portfolio:detail', args=[self.slug])

class ProjectImage(models.Model):
    """Additional gallery images for projects"""
    project = models.ForeignKey(
        Project, 
        on_delete=models.CASCADE,
        related_name='gallery_images'
    )
    image = models.ImageField(upload_to='portfolio/gallery/%Y/%m/')
    alt_text = models.CharField(max_length=150, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.project.title} - Image {self.order}"