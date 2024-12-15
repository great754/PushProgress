from django.db import models
#from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import date, datetime
from django.utils import timezone
from django.contrib.auth.models import User

# Register your models here.

class Stats(models.Model):
    GOAL_CHOICES = (
        ("lose", "Lose Weight"),
        ("gain", "Gain Weight"),
        ("stay", "Stay Fit"),
        ("add", "Gain Muscle"),
    )
    current_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="current_user")
    goal = models.CharField(choices=GOAL_CHOICES, default="lose", max_length=20)
    weight = models.IntegerField(default=0)         # in lbs
    weight_goal = models.IntegerField(default=0)    # in lbs
    height = models.IntegerField(default=0)         # in inches
    date_started = models.DateField(default=timezone.now)

    def __str__(self):
        return f"{self.current_user} wants to {self.goal}"
    
class Food(models.Model):
    current_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="food_user")
    old_calories = models.IntegerField(default=0)
    old_protein = models.IntegerField(default=0)
    protein_goal = models.IntegerField(default=0)
    calorie_goal = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.current_user} eats {self.old_calories} but goal is {self.calorie_goal}"
    
# class Goal(models.Model):
#     current_user = models.ForeignKey(User, on_delete=models.CASCADE)
#     workout_plan =
## Class called Calories, that tracks the food the user ate that day, and their goal, and sees if they met their goal

class Goal(models.Model):
    current_user = models.ForeignKey(User, on_delete = models.CASCADE, related_name="goal_creator")
    workout = models.JSONField(default=dict())
    days = models.JSONField(default=list())
    date_started = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.current_user} can work out {len(self.days)} days a week"
    

class Activity_Log(models.Model):
    current_user = models.ForeignKey(User, on_delete = models.CASCADE, related_name="activity_by")
    activity = models.CharField(default="", max_length=20)
    duration = models.IntegerField(default=0)
    calories_burned = models.IntegerField(default=0)    ## the user can edit this
    date_started = models.DateField(default=timezone.now)
    time_started = models.TimeField(default=timezone.now)

    def __str__(self):
        return f"{self.current_user} went {self.activity} for {self.duration}"
# class Log