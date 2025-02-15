from django.shortcuts import render
from app2_all_products.models import Category, SubCategory, SubProductCategory, Product
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import google.generativeai as genai
from django.conf import settings

def ChatHome(request):
    return render(request, "app1_chatapp/chathome.html")


def get_matching_word(description, valid_words):
    try:
        genai.configure(api_key=settings.GEMINI_KEY)
        model = genai.GenerativeModel("gemini-pro")

        prompt = f"""
        From this list of products: {', '.join(valid_words)}
        Based on this description: '{description}'
        Return exactly one word from the list that best matches. 
        Only return the product name, nothing else.
        """

        response = model.generate_content(prompt)
        suggested_word = response.text.strip()

        # Check for exact or case-insensitive match
        for word in valid_words:
            if word.lower() == suggested_word.lower():
                return word

        # If no exact match, check if any product is mentioned in the response
        for word in valid_words:
            if word.lower() in response.text.lower():
                return word

        # If no match, ask Gemini to generate a fallback response
        fallback_prompt = f"""
        Based on the description: '{description}', provide a suggestion for a crop product.
        Don't worry about matching it to the existing list. Just give a reasonable suggestion based on the description.
        """

        fallback_response = model.generate_content(fallback_prompt)
        return fallback_response.text.strip() or "No matching word found."

    except Exception as e:
        return f"Error: {str(e)}"



def SuggestCrops(request):
    if request.method == "POST":
        description = request.POST.get("description", "").strip()  # Get form data

        if not description:
            return JsonResponse({"error": "Description is required"}, status=400)

        crops_product = ["Moringa", "Wheat", "Rice", "Corn", "Barley"]
        result = get_matching_word(description, crops_product)

        return render(request, "app1_chatapp/chathome.html", {"matching_product": result, "message":"The best matching crop for your description is: "})
    return render(request,  "app1_chatapp/chathome.html", {"error": "Invalid request method"})

