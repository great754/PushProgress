from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .models import *
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
import requests
from django.conf import settings
from .workouts import get_workout

# Create your views here.
def login_page(request):
    if not request.user.is_authenticated:
        # Check if the HTTP request method is POST (form submission)
        if request.method == "POST":
            username = request.POST.get('username')
            password = request.POST.get('password')
            
            # Check if a user with the provided username exists
            if not User.objects.filter(username=username).exists():
                # Display an error message if the username does not exist
                messages.error(request, 'Invalid Username')
                return redirect('login')
            
            user = authenticate(username=username, password=password)
            
            if user is None:
                # Display an error message if authentication fails (invalid password)
                messages.error(request, "Invalid Password")
                return redirect('login')
            else:
                # Log in the user and redirect to the home page upon successful login
                login(request, user)
                return redirect('index')
    else:
        return redirect('index')
    
    # Render the login page template (GET request)
    return render(request, 'tracker/login.html')

# Define a view function for the registration page
def register_page(request):
    # Check if the HTTP request method is POST (form submission)
    if request.method == 'POST':
        first_name = request.POST.get('firstname')
        last_name = request.POST.get('lastname')
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        # Check if a user with the provided username already exists
        user = User.objects.filter(username=username)
        
        if user.exists():
            # Display an information message if the username is taken
            messages.info(request, "Username already taken!")
            return redirect('register')
        
        # Create a new User object with the provided information
        user = User.objects.create_user(
            first_name=first_name,
            last_name=last_name,
            username=username
        )
        
        # Set the user's password and save the user object
        user.set_password(password)
        user.save()
        
        # Display an information message indicating successful account creation
        messages.info(request, "Account created Successfully!")
        return redirect('index')
    
    # Render the registration page template (GET request)
    return render(request, 'tracker/register.html')


def logout_view(request):
    # Log out the current user
    logout(request)
    # Redirect to the login page (or another page, e.g., home page)
    messages.info(request, "You have been logged out successfully.")
    return redirect('login')  # Replace 'login' with your desired URL name


def index(request):
    ## MAYBE ADD ANOTHER html template that the visiting user not logged in will see
    if request.user.is_authenticated:
        goals = []
        details = Stats.objects.filter(current_user = request.user)
        if len(details)>0:
            for detail in details:
                goals.append(detail.goal)
            weight = details[1].weight
            try:
                calorie_goal = Food.objects.get(current_user = request.user)
                return render(request, 'tracker/index.html', {
                    "goals": goals,
                    "weight": weight,
                    "calorie_goal":calorie_goal.calorie_goal
                })
            except Food.DoesNotExist:
                return redirect('food')
        else:
            return redirect('set')
    else:
        return redirect('login')

def set_goal(request):
    if request.user.is_authenticated:
        stats = Stats.objects.filter(current_user = request.user)
        if len(stats) > 0:
            return redirect('index')
        else:
            if request.method == 'POST':
                weight = request.POST["weight"]
                heightft = request.POST["height_ft"]
                heightin = request.POST["height_in"]
                height = int(heightft) + int(heightin)
                goals = request.POST.getlist("goal")
                weight_goal = request.POST["weight_goal"]
                for goal in goals:
                    Stats(current_user = request.user, goal = goal, weight = weight, weight_goal = weight_goal, height = height).save()
                return redirect("index")
            else:
                stats_choices = Stats.GOAL_CHOICES
                choices = []
                for choice in stats_choices:
                    choices.append(choice[1])
                return render(request, "tracker/set.html", {
                    "choices": choices
                })
    else:
        return redirect('index')
        
def get_calories(food):
    query = food
    api_url = 'https://api.calorieninjas.com/v1/nutrition?query='
    response = requests.get(api_url + query, headers={'X-Api-Key': settings.NUTR_API_KEY})
    if response.status_code == requests.codes.ok:
        return eval(response.text)["items"]
    else:
        return f"Error: {response.status_code}, {response.text}"

def food(request):
    # https://www.gicare.com/diets/increasing-calories/
    if request.user.is_authenticated:
        if request.method == 'POST':
            breakfast = get_calories(request.POST["breakfast"])
            breakfast_servings = int(request.POST["breakfast_servings"])
            lunch  = get_calories(request.POST["lunch"])
            lunch_servings = int(request.POST["lunch_servings"])
            dinner = get_calories(request.POST["dinner"])
            dinner_servings = int(request.POST["dinner_servings"])
            snacks = get_calories(request.POST["snacks"])
            snack_servings = int(request.POST["snack_servings"])

            old_protein = 0
            total_calories = 0
            breakfast_calories = 0
            lunch_calories = 0
            dinner_calories = 0
            snack_calories = 0
            if len(breakfast) == 0:
                breakfast_calories = 0
            else:
                for item in breakfast:
                    breakfast_calories += (item['calories'] * breakfast_servings)
                    old_protein += (item['protein_g'] * breakfast_servings)

            if len(lunch) == 0:
                lunch_calories = 0
            else:
                for item in lunch:
                    lunch_calories += (item['calories'] * lunch_servings)
                    old_protein += (item['protein_g'] * lunch_servings)

            if len(dinner) == 0:
                dinner_calories = 0
            else:
                for item in dinner:
                    dinner_calories += (item['calories'] * dinner_servings)
                    old_protein += (item['protein_g'] * dinner_servings)
            
            if len(snacks) == 0:
                snack_calories = 0
            else:
                for item in dinner:
                    snack_calories += (item['calories'] * snack_servings)
            total_calories = breakfast_calories+lunch_calories+dinner_calories+snack_calories

            new_calories = total_calories+500
            curr_weight = (Stats.objects.filter(current_user = request.user))[0]
            Food(current_user=request.user, old_calories=total_calories, calorie_goal=new_calories, old_protein=old_protein, protein_goal=curr_weight.weight).save()
            return redirect('index')
        else:
            return render(request, "tracker/food.html")
    else:
        return redirect('index')
    
## sets the workout routine
def set_dates(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            days = request.POST.getlist("day")
            workout = get_workout(days)
        else:
            return render(request, "tracker/setdates.html")
    else:
        return redirect('login')