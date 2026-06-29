from django.urls import path
from . import views

app_name = 'portfolio'

urlpatterns = [
    path('', views.portfolio_list, name='portfolio_list'),
    path('project/<slug:slug>/', views.portfolio_detail, name='detail'),
    path('category/<slug:slug>/', views.portfolio_category, name='category'),
]