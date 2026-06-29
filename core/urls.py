from django.urls import path
from . import views
from django.conf import settings
# from django.conf import settings
from django.conf.urls.static import static

app_name = 'core'

urlpatterns = [
    path('', views.HomeView.as_view(), name='home'),
    path('about/', views.about, name='about'),
    path('team/', views.team, name='team'),
    path('careers/', views.careers, name='careers'),
    path('privacy-policy/', views.privacy_policy, name='privacy_policy'),
    path('terms-of-service/', views.terms_of_service, name='terms_of_service'),
    path('cookies-policy/', views.cookies_policy, name='cookies_policy'),
    path('consulting/', views.consulting, name='consulting'),
    path('consulting/book/', views.book_consultation, name='book_consultation'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)