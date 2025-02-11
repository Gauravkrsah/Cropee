from flask import Flask
from auth_routes import auth_bp
from main_routes import main_bp
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials

# Load environment variables
load_dotenv()

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred)
    print("Firebase Admin SDK initialized in app.py")

app = Flask(__name__)
app.secret_key = os.urandom(24)  # For session management

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(main_bp)

if __name__ == '__main__':
    app.run(debug=True) 