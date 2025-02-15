from django.shortcuts import render

# Create your views here.


cards = [
    {
        "topic": "ChatApp",
        "icon": "📡",
        "link": "chathome"
    },
    {
        "topic": "Buy Products",
        "icon": "📝",
        "link": "category-list"
    },
    {
        "topic": "Learn",
        "icon": "👨‍🎓",
        "link": "home"
    },
    
]

def home(request):
    context ={
        "cards":cards
    }
    return render(request, "base.html", context )

