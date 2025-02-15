from django.shortcuts import render, redirect
from app2_all_products.models import Category, SubCategory, SubProductCategory, Product


def ListCategory(request):
    list = Category.objects.all()
    context = {
        "category": list
    }
    return render(request, "app2_all_products/product_list.html", context)

