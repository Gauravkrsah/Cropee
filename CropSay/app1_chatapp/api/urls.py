from django.urls import path 
from .import views 

urlpatterns = [
    path("", views.ChatHome, name="chathome"),
    path("suggest-crops/", views.SuggestCrops, name="suggest-crops"),
]
