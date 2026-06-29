from django.urls import path
from . import views

app_name = 'blog'

urlpatterns = [
    path('', views.blog_list, name='blog_list'),
    path('post/<slug:slug>/', views.blog_detail, name='detail'),
    path('category/<slug:slug>/', views.blog_category, name='category'),
    path('api/search-suggestions/', views.search_suggestions, name='search_suggestions'),
    path('newsletter/signup/', views.newsletter_signup, name='newsletter_signup'),
]