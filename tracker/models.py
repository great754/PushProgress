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
    calorie_goal = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.current_user} eats {self.old_calories} but goal is {self.calorie_goal}"
    
## Class called Calories, that tracks the food the user ate that day, and their goal, and sees if they met their goal