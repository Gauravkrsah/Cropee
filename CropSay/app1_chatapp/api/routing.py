from django.urls import path 
from .import consumers 

ASGI_urlpatterns = [
    path("websocket/", consumers.UserBotConsumer.as_asgi())
]