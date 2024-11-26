from django.contrib import admin
from django.urls import path
from . import views
urlpatterns = [
    path('', views.index, name="index"),
    path('login/', views.login_page, name="login"),
    path('logout/', views.logout_view, name="logout"),
    path('register/', views.register_page, name="register"),
    path('set/', views.set_goal, name="set"),
    path('food/', views.food, name="food")
]