
from django.contrib import admin
from django.urls import path, include
from app3_authentication.api import google_authentication

urlpatterns = [
    path('', include("home.api.urls")),
    path('complete/google/', google_authentication.google_callback, name='google_callback'),
    path('admin/', admin.site.urls),
    path('app1_chatapp/', include("app1_chatapp.api.urls")),
    path('app2_all_products/', include("app2_all_products.api.urls")),
    path('google_auth/', include("app3_authentication.api.urls")),
    path('app4_chat_specialist/', include("app4_chat_specialist.api.urls"))
]

