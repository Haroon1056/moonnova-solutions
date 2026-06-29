from django.urls import path
from . import views

app_name = 'services'

urlpatterns = [
    path('', views.service_list, name='service_list'),
    path('custom-web-development/', views.custom_web_development, name='web_development'),
    path('ecommerce-web-development/', views.ecommerce_web_development, name='ecommerce_development'),
    path('custom-software-development/', views.custom_software_development, name='custom_software_development'),
    path('mobile-app-development/', views.mobile_app_development, name='mobile_app_development'),
    path('ai-ml-solutions/', views.ai_ml_solutions, name='ai_ml_solutions'),
    path('data-analytics/', views.data_analytics, name='data_analytics'),
    path('digital-marketing-seo/', views.seo_digital_growth, name='seo_digital_growth'),
]