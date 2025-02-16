from django.contrib import admin
from .models import UserBotMessage, UserBotChannel

admin.site.register(UserBotMessage)
admin.site.register(UserBotChannel)
