from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
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
import json
from datetime import datetime, timedelta
from itertools import chain

def login_page(request):
    if not request.user.is_authenticated:
        if request.method == "POST":
            username = request.POST.get('username')
            password = request.POST.get('password')
            
            if not User.objects.filter(username=username).exists():
                messages.error(request, 'Invalid Username')
                return redirect('login')
            
            user = authenticate(username=username, password=password)
            
            if user is None:
                messages.error(request, "Invalid Password")
                return redirect('login')
            else:
                login(request, user)
                return redirect('index')
    else:
        return redirect('index')
    
    return render(request, 'tracker/login.html')

def register_page(request):
    if request.method == 'POST':
        first_name = request.POST.get('firstname')
        last_name = request.POST.get('lastname')
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = User.objects.filter(username=username)
        
        if user.exists():
            messages.info(request, "Username already taken!")
            return redirect('register')
        user = User.objects.create_user(
            first_name=first_name,
            last_name=last_name,
            username=username
        )
        user.set_password(password)
        user.save()
        messages.info(request, "Account created Successfully!")
        return redirect('index')
    
    return render(request, 'tracker/register.html')


def logout_view(request):
    logout(request)
    messages.info(request, "You have been logged out successfully.")
    return redirect('login')


def index(request):
    ## MAYBE ADD ANOTHER html template that the visiting user not logged in will see
    if request.user.is_authenticated:
        if len(Stats.objects.filter(current_user = request.user)) > 0:           # if the user has stats
            calories_burned = 0
            for activity in Activity_Log.objects.filter(current_user = request.user, date_started = datetime.now()):
                calories_burned += activity.calories_burned
            goals = []
            details = Stats.objects.filter(current_user = request.user)
            day = datetime.now().strftime('%A')
            today = datetime.now()
            past_7_days = []
            for i in range(0, 7):
                past_day = today - timedelta(days=i)
                workout_done = Activity_Log.objects.filter(current_user = request.user, date_started = past_day)
                food_eaten = Food_Log.objects.filter(current_user = request.user, date_eaten = past_day)
                cals_eaten = 0
                wrkt_cals = 0
                for food in food_eaten:
                    cals_eaten += food.calories
                if len(workout_done) == 0:
                    past_7_days.append((past_day.strftime('%A'), 0, cals_eaten))
                else:
                    for workout in workout_done:
                        wrkt_cals += workout.calories_burned
                    past_7_days.append((past_day.strftime('%A'), wrkt_cals, cals_eaten))
            past_7_days.reverse()
            if len(details)>0:          # if the user already has stats
                for detail in details:
                    goals.append(detail.goals)
                weight = details[0].weight
                weight_goal = details[0].weight_goal
                try:
                    food_eaten = Food_Log.objects.filter(current_user = request.user, date_eaten=datetime.now())
                    total_calories = 0
                    total_protein = 0
                    for food in food_eaten:
                        total_calories += food.calories
                        total_protein += food.protein
                    try:
                        calories = Food.objects.filter(current_user = request.user)[0]      # gets the first food set
                        if len(Goal.objects.filter(current_user = request.user))> 0:
                            workout = Goal.objects.get(current_user = request.user)
                            paired = pair_days(workout.days, workout.workout)
                            return_dict = {
                                "goals": goals,
                                "weight": weight,
                                "calorie_goal":calories.calorie_goal, 
                                "workout": paired,
                                "today": {day: get_day_workout(day, paired)},
                                "protein_goal": calories.protein_goal, 
                                "food_eaten": Food_Log.objects.filter(current_user = request.user, date_eaten=datetime.now()),
                                "total_calories": total_calories,
                                "total_protein": total_protein,
                                "date": datetime.now(),
                                "day": day,
                                "weight_goal": weight_goal, 
                                "calories_burned": calories_burned,
                                "past_days": past_7_days}
                            
                            done = Activity_Log.objects.filter(current_user = request.user, date_started = datetime.now(), activity="Workout")
                            if len(done) > 0:
                                return_dict["done"] = "Done"
                            return render(request, 'tracker/index.html', return_dict)
                        else:
                            return_dict = {
                                "goals": goals,
                                "weight": weight,
                                "calorie_goal":calories.calorie_goal,
                                "protein_goal": calories.protein_goal,
                                "food_eaten": Food_Log.objects.filter(current_user = request.user, date_eaten=datetime.now()), 
                                "total_calories": total_calories,
                                "total_protein": total_protein,
                                "date": datetime.now(),
                                "day": day,
                                "weight_goal": weight_goal,
                                "calories_burned": calories_burned,
                            }
                            done = Activity_Log.objects.filter(current_user = request.user, date_started = datetime.now(), activity="Workout")
                            if len(done) > 0:
                                return_dict["done"] = "Done"
                            return render(request, 'tracker/index.html', return_dict)
                    except IndexError:
                        return redirect('food')
                except Food.DoesNotExist:
                    return redirect('food')
            else:
                return redirect('set')
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
                height = (int(heightft)*12) + int(heightin)
                goals = request.POST.getlist("goal")
                weight_goal = request.POST["weight_goal"]
                weights = [(weight, str(datetime.now()))]
                Stats(current_user = request.user, goals = goals, weight = weight, weights = weights, weight_goal = weight_goal, height = height).save()
                return redirect("food")
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
    if request.method == 'POST':
        details = Stats.objects.get(current_user = request.user)
        weight = details.weight
        goals = details.goals
        new_calories = 0
        old_calories = int(request.POST["old-calories"])

        if 'Lose Weight' in goals:
            new_calories = old_calories - 500
        elif 'Gain Weight' in goals:
            new_calories = old_calories + 500
        else:
            new_calories = old_calories
        Food(current_user=request.user, old_calories=old_calories, calorie_goal=new_calories, old_protein=0, protein_goal=weight).save()
        return redirect('set_dates')
    else:
        return render(request, "tracker/food.html")


    
## sets the workout routine
def set_dates(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            days = request.POST.getlist("day")
            goals = Stats.objects.get(current_user = request.user)
            workout = get_workout(len(days), goals.goals)
            Goal(current_user = request.user, workout=workout, days = days, date_started=datetime.now()).save()
            return redirect('index')
        else:
            return render(request, "tracker/setdates.html")
    else:
        return redirect('login')

def pair_days(days, workout):
    result = []
    days = set(days)
    added = {}
    all_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    
    for day in all_days:
        indices = list(workout)
        if day not in days:
            result.append({day: {"Rest": "Rest Today"}})
        else:
            if len(indices) == 0:
                result.append({day: {"Rest": "Rest Today"}})
            else:
                result.append({day: {indices[0]: workout[indices[0]]}})
                del workout[indices[0]]

    return result

def get_day_workout(day, workout):
    for item in workout:
        for i in item:
            if i == day:
                return (item[i])
            
def log_activity(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            activity = request.POST['activity_name']
            duration = int(request.POST['duration'])
            calories = int(request.POST['calories'])
            Activity_Log(current_user = request.user, activity = activity, duration = duration, calories_burned = calories, date_started=datetime.now(), time_started = datetime.now()).save()
            return redirect('index')
        else:
            return render(request, "tracker/activity.html")
    else:
        return redirect('index')

def get_workout_cal(activity, duration):
    querystring = {"activity": activity, "weight": "180", "duration": str(duration)}
    url = "https://calories-burned-by-api-ninjas.p.rapidapi.com/v1/caloriesburned"
    headers = {
	"x-rapidapi-key": settings.WORKOUT_API_KEY,
	"x-rapidapi-host": "calories-burned-by-api-ninjas.p.rapidapi.com"
}
    
    response = requests.get(url, headers=headers, params=querystring)
    try:
        return response.json()[0]
    except IndexError:
        return dict()
    
def log_food(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            try:
                cals = request.POST["hidden-calories"]
                food = request.POST["hidden-food"]
                protein = request.POST["hidden-protein"]
                time = request.POST["hidden-time"]
                Food_Log(current_user = request.user, food = food, calories = cals, protein=protein, time_eaten = time, date_eaten = datetime.now()).save()
                return redirect('index')
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON'}, status=400)
        else:
            return render(request, 'tracker/logfood.html')
    else:
        return redirect('login')
    

def account(request):
    if request.user.is_authenticated:
        try:
            Goal.objects.get(current_user = request.user)
            return_dict = dict()
            workout = Goal.objects.get(current_user = request.user)
            days = workout.days
            details = Stats.objects.get(current_user = request.user)
            weight = details.weight
            weight_goal = details.weight_goal
            goals = details.goals
            weights = details.weights
            height = details.height
            full_goals = []               ## full list of all goals
            for goal in Stats.GOAL_CHOICES:
                full_goals.append(goal[1])
            date_started = workout.date_started
            return_dict["workout"] = workout
            return_dict["days"] = days
            return_dict["date_started"] = date_started
            return_dict["goals"] = goals
            return_dict["weight"] = weight
            return_dict["weights"] = weights
            return_dict["weight_goal"] = weight_goal
            return_dict["full_goals"] = full_goals
            return_dict["height"] = height
            return_dict["full_days"] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            return render(request, "tracker/account.html", return_dict)
        except ObjectDoesNotExist:
            return redirect('index')
    else:
        return redirect('login')
    


def update_stats(request):
    if request.method == 'POST':
        try:
            old = Stats.objects.get(current_user = request.user)
            old_goals = Goal.objects.get(current_user = request.user)
            weights = old.weights
            data = json.loads(request.body)
            new_weight = data.get('weight')
            weight_goal = data.get('weight_goal')
            height = data.get('new_height')
            goals = data.get('goals')
            days = data.get('days')
            if int(new_weight) != int(old.weight):
                weights.append((int(new_weight), str(datetime.now())))
            old.goals = goals
            old.weight = new_weight
            old.weights = weights
            old.height = int(height)
            old.weight_goal = weight_goal
            old_goals.workout = get_workout(len(days), goals)
            old_goals.days = days
            old_goals.save()
            old.save()
            return JsonResponse({'message': [new_weight, old.weight]})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def logs(request):
    if request.user.is_authenticated:
        return_dict = dict()
        week1start = (datetime.now() - timedelta(days=6)).strftime('%m/%d/%Y')
        week1end = (datetime.now()).strftime('%m/%d/%Y')
        week2start = (datetime.now() - timedelta(days=13)).strftime('%m/%d/%Y')
        week2end = (datetime.now() - timedelta(days = 7)).strftime('%m/%d/%Y')
        week3start = (datetime.now() - timedelta(days=20)).strftime('%m/%d/%Y')
        week3end = (datetime.now() - timedelta(days = 14)).strftime('%m/%d/%Y')
        today = datetime.now()
        logs1 = []
        logs2 = []
        logs3 = []
        week2 = []
        week3 = []
        for i in range(0, 7):
            past_day = (today - timedelta(days=i))
            act_logs = Activity_Log.objects.filter(current_user = request.user, date_started = past_day)
            food_logs = Food_Log.objects.filter(current_user = request.user, date_eaten = past_day)
            combined = sorted(chain(act_logs, food_logs), key=lambda x: x.time_started if hasattr(x, 'time_started') else x.time_eaten)
            logs1.append((past_day.strftime('%A, %m/%d/%Y'), combined))
        for i in range(7, 14):
            past_day = today - timedelta(days=i)
            act_logs = Activity_Log.objects.filter(current_user = request.user, date_started = past_day)
            food_logs = Food_Log.objects.filter(current_user = request.user, date_eaten = past_day)
            combined = sorted(chain(act_logs, food_logs), key=lambda x: x.time_started if hasattr(x, 'time_started') else x.time_eaten)
            combined.reverse()
            logs2.append((past_day.strftime('%A, %m/%d/%Y'), combined))
        for i in range(14, 21):
            past_day = (today - timedelta(days=i))
            act_logs = Activity_Log.objects.filter(current_user = request.user, date_started = past_day)
            food_logs = Food_Log.objects.filter(current_user = request.user, date_eaten = past_day)
            combined = sorted(chain(act_logs, food_logs), key=lambda x: x.time_started if hasattr(x, 'time_started') else x.time_eaten)
            combined.reverse()
            logs3.append((past_day.strftime('%A, %m/%d/%Y'), combined))
        week1 = [(week1start, week1end), logs1]
        week2 = [(week2start, week2end), logs2]
        week3 = [(week3start, week3end), logs3]
        return_dict["week1"] = week1
        return_dict["week2"] = week2
        return_dict["week3"] = week3
        return render(request, "tracker/logs.html", return_dict)
    else: 
        return redirect('index')
    

def edit_food(request, id):
    if request.method == 'POST':
        try:
            try:
                data = json.loads(request.body)
                new_time = data.get('newTime')
                new_date = data.get('newDate')
                new_name = data.get('newName')
                new_calories = int(data.get('newCalories'))
                new_protein = int(data.get('newProtein'))
                food = Food_Log.objects.get(current_user = request.user, pk=id)
                food.food = new_name
                food.calories = new_calories
                food.protein = new_protein
                food.date_eaten = new_date
                food.time_eaten = new_time
                food.save()
            except Food_Log.DoesNotExist:
                return JsonResponse({'error': 'You cannot edit this content'})
            return JsonResponse({'message': "received"})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
def edit_activity(request, id):
    if request.method == 'POST':
        try:
            try:
                data = json.loads(request.body)
                new_date = data.get('newDate')
                new_time = data.get('newTime')
                new_name = data.get('newName')
                new_calories = int(data.get('newCalories'))
                activity = Activity_Log.objects.get(current_user = request.user, pk=id)
                activity.activity = new_name
                activity.calories_burned = new_calories
                activity.time_started = new_time
                activity.date_started = new_date
                activity.save()
            except Activity_Log.DoesNotExist:
                return JsonResponse({'error': 'You cannot edit this content'})
            return JsonResponse({'message': 'received'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    

def delete_activity(request, id):
    if request.method == 'POST':
        try:
            try:
                activity = Activity_Log.objects.get(current_user = request.user, pk=id)
                activity.delete()
            except Activity_Log.DoesNotExist:
                return JsonResponse({'error': 'You cannot edit this content'})
            return JsonResponse({'message': 'received'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


def delete_food(request, id):
    if request.method == 'POST':
        try:
            try:
                data = json.loads(request.body)
                food = Food_Log.objects.get(current_user = request.user, pk=id)
                food.delete()
            except Activity_Log.DoesNotExist:
                return JsonResponse({'error': 'You cannot edit this content'})
            return JsonResponse({'message': 'received'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)