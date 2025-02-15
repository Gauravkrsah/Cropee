from django.shortcuts import redirect
import requests
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.conf import settings


# Google OAuth2 Configuration
CLIENT_ID = settings.CLIENT_ID
CLIENT_SECRET = settings.CLIENT_SECRET
REDIRECT_URI = settings.REDIRECT_URI
TOKEN_URL = settings.TOKEN_URL
USER_INFO_URL = settings.USER_INFO_URL


def google_login(request):
    auth_url = (
        f"https://accounts.google.com/o/oauth2/auth?"
        f"client_id={CLIENT_ID}&"
        f"response_type=code&"
        f"redirect_uri={REDIRECT_URI}&"
        f"scope=openid email profile"
    )
    return redirect(auth_url)


def google_callback(request):
    # Step 1: Get the authorization code from the URL
    code = request.GET.get("code")
    if not code:
        return JsonResponse({"error": "No code provided by Google"})

    # Step 2: Exchange the authorization code for an access token
    token_data = {
        "code": code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    }

    # Send POST request to Google's token endpoint to get the access token
    token_response = requests.post(TOKEN_URL, data=token_data)
    token_json = token_response.json()

    if "access_token" not in token_json:
        return JsonResponse({"error": "Failed to get access token", "details": token_json})

    access_token = token_json["access_token"]

    # Step 3: Get the user's profile information using the access token
    user_info_response = requests.get(
        USER_INFO_URL,
        headers={"Authorization": f"Bearer {access_token}"}
    )
    user_info = user_info_response.json()

    # Step 4: Create or get the user based on email
    email = user_info.get('email')
    first_name = user_info.get("given_name", "")
    last_name = user_info.get("family_name", "")
    username = first_name.lower() + " " + last_name.lower()  # Set username as first name + last name (both lowercase)

    # Check if the user already exists in the system based on the username
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        # If the user doesn't exist, create a new user
        user = User.objects.create_user(
            username=username,  # Set the username as first name + last name
            email=email,  # Store the email in the email field
            password=None  # No password needed for Google login
        )
        user.first_name = first_name
        user.last_name = last_name
        user.save()

    # Step 5: Log the user in manually, specifying the backend
    login(request, user, backend='django.contrib.auth.backends.ModelBackend')

    # Redirect to a home page or dashboard
    return redirect("chathome")  # Redirect to any page you want the user to go after logging in
