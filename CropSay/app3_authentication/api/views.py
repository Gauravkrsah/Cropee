from django.shortcuts import render, redirect
from django.contrib.auth import logout


def custom_logout_view(request):
    logout(request)  
    return redirect('chathome') 


