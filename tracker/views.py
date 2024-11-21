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

# Create your views here.
def login_page(request):
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
        return redirect('register')
    
    # Render the registration page template (GET request)
    return render(request, 'tracker/register.html')


def index(request):
    try:
        Stats.objects.get(current_user = request.user)
        return render(request, 'tracker/index.html')
    except Stats.DoesNotExist:
        return redirect('set')

@login_required
def set_goal(request):
    try:
        Stats.objects.get(current_user = request.user)
        return redirect("index")
    except Stats.DoesNotExist:
        if request.method == 'POST':
            weight = request.POST["weight"]
            heightft = request.POST["height_ft"]
            heightin = request.POST["height_in"]
            height = int(heightft) + int(heightin)
            goal = request.POST["goal"]
            weight_goal = request.POST["weight_goal"]
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