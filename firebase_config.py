import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, auth
import pyrebase
from google.cloud import storage
import sys
import json

# Load environment variables
load_dotenv()

# Check for service account key file
SERVICE_ACCOUNT_PATH = "serviceAccountKey.json"
if not os.path.exists(SERVICE_ACCOUNT_PATH):
    print("Error: serviceAccountKey.json is missing!")
    print("\nPlease follow these steps to get the file:")
    print("1. Go to Firebase Console (https://console.firebase.google.com/)")
    print("2. Select your project 'cropsay'")
    print("3. Click on ⚙️ (Settings icon) next to 'Project Overview'")
    print("4. Go to 'Service accounts' tab")
    print("5. Click 'Generate New Private Key'")
    print("6. Save the downloaded file as 'serviceAccountKey.json' in the project root directory")
    sys.exit(1)

try:
    # Initialize Firebase Admin SDK if not already initialized
    if not firebase_admin._apps:
        cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
        firebase_admin.initialize_app(cred)
        print("Firebase Admin SDK initialized successfully")
    else:
        print("Firebase Admin SDK already initialized")

    # Initialize Google Cloud Storage
    storage_client = storage.Client.from_service_account_json(SERVICE_ACCOUNT_PATH)

    # Pyrebase Configuration
    config = {
        "apiKey": os.getenv("FIREBASE_API_KEY"),
        "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
        "projectId": os.getenv("FIREBASE_PROJECT_ID"),
        "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
        "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
        "appId": os.getenv("FIREBASE_APP_ID"),
        "measurementId": os.getenv("FIREBASE_MEASUREMENT_ID"),
        "databaseURL": f"https://{os.getenv('FIREBASE_PROJECT_ID')}.firebaseio.com",
        "serviceAccount": SERVICE_ACCOUNT_PATH
    }

    # Initialize Pyrebase
    firebase = pyrebase.initialize_app(config)
    auth_instance = firebase.auth()

except Exception as e:
    print(f"\nError initializing Firebase: {str(e)}")
    print("Please check your serviceAccountKey.json and .env file configurations.")
    sys.exit(1) 