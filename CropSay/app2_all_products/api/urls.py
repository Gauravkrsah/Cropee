from django.urls import path 
from .import views

urlpatterns = [
    path("category_list/", views.ListCategory, name="category-list")
]
