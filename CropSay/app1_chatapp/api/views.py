from django.shortcuts import render
from app2_all_products.models import Category, SubCategory, SubProductCategory, Product
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import google.generativeai as genai
from django.conf import settings
from django.utils.timezone import now 
from datetime import datetime, timedelta

def ChatHome(request):
    today = datetime.today().date()
    last_7_days = [(today - timedelta(days=i)).strftime("%A, %b %d") for i in range(1, 3)]  

    context = {
        "last_7_days": last_7_days
    }
    return render(request, "app1_chatapp/chathome.html", context)



def get_matching_word(description, valid_words):
    try:
        genai.configure(api_key=settings.GEMINI_KEY)
        model = genai.GenerativeModel("gemini-pro")

        prompt = f"""
        You must choose exactly one word from this list: {', '.join(valid_words)}.
        Do not return any other word or extra text.
        If none of the words match, return "None".
        Description: '{description}'
        """

        response = model.generate_content(prompt)
        suggested_word = response.text.strip()

        # Ensure the response is strictly from valid_words
        if suggested_word in valid_words:
            return suggested_word
        
        return "No matching word found."

    except Exception as e:
        return f"Error: {str(e)}"



def SuggestCrops(request):
    if request.method == "POST":
        description = request.POST.get("description", "").strip()  # Get form data

        if not description:
            return JsonResponse({"error": "Description is required"}, status=400)

        crops_product = ["Moringa", "Wheat", "Rice", "Corn", "Barley"]
        result = get_matching_word(description, crops_product)

        context = {
            "matching_product": result, 
            "message":"The best matching crop for your description is: ",
            "description" : description,
            "timestamp": now().strftime("%Y-%m-%d %H:%M:%S")  
        }

        return render(request, "app1_chatapp/chathome.html", context)
    return render(request,  "app1_chatapp/chathome.html", {"error": "Invalid request method"})

