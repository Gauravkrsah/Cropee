from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

BOT_USERNAME = "ChatBot"

class UserBotMessage(models.Model):
    from_who = models.ForeignKey(User, on_delete=models.CASCADE, related_name="from_user")
    to_whom = models.CharField(max_length=255, default=BOT_USERNAME)  # Store the bot name directly
    message = models.TextField()
    date = models.DateField(default=now)  # Use default value
    time = models.TimeField(default=now)
    has_been_seen = models.BooleanField(null=True, default=False)

    def __str__(self):
        return f"From : {self.from_who}---> To :{self.to_whom}"



class UserBotChannel(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT, default=None)
    channel_name = models.TextField()

    def __str__(self):
        return f"New Channel Opened for User : {self.user}"