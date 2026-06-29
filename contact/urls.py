from django.urls import path
from . import views

app_name = 'contact'

urlpatterns = [
    path('', views.contact, name='contact'),
    path('contact/submit/', views.submit_inquiry, name='submit_inquiry'),
    path('success/', views.contact_success, name='contact_success'),
]