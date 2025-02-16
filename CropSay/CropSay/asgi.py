import os
from django.core.asgi import get_asgi_application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'CropSay.settings')

#asgi_config
from channels.routing import ProtocolTypeRouter, URLRouter 
from app1_chatapp.api import routing 

'''adding user and session in asgi_application'''
from channels.auth import AuthMiddlewareStack
application = ProtocolTypeRouter({
    "http":get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(routing.ASGI_urlpatterns)
    )
})
