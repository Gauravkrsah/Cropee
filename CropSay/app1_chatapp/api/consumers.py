from channels.generic.websocket import WebsocketConsumer 

class UserBotConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        print("WebSocket connection established!")

    def receive(self, text_data):
        print(f"Received message: {text_data}")