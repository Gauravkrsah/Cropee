from django.urls import path 
from .import views
from django.contrib.auth import views as auth_views
from .import google_authentication

urlpatterns = [
    path('login/google/', google_authentication.google_login, name='google-login'),
    path('logout/', views.custom_logout_view, name='logout-app3' ),
]

 

 