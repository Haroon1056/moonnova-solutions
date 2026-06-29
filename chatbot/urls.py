from django.urls import path
from . import views

app_name = 'chatbot'

urlpatterns = [
    path('send/', views.send_message, name='send_message'),
    path('capture-lead/', views.capture_lead, name='capture_lead'),
    path('admin/refresh-context/', views.refresh_context, name='refresh_context'),
    path('admin/dashboard/', views.dashboard, name='admin_dashboard'),
]