from django.contrib import admin
from django.urls import path
from . import views
urlpatterns = [
    path('', views.index, name="index"),
    path('login/', views.login_page, name="login"),
    path('logout/', views.logout_view, name="logout"),
    path('register/', views.register_page, name="register"),
    path('set/', views.set_goal, name="set"),
    path('food/', views.food, name="food"),
    path('setdates/', views.set_dates, name="set_dates"),
    path('activity/', views.log_activity, name="activity"),
    path('logfood/', views.log_food, name="logfood"),
    path('account', views.account, name="account"),
    path('update_stats/', views.update_stats, name="update_stats"),
    path('logs/', views.logs, name="logs"),
    path('editfood/<int:id>', views.edit_food, name="editfood"),
    path('editactivity/<int:id>', views.edit_activity, name="editactivity"),
    path('deleteactivity/<int:id>', views.delete_activity, name="deleteactivity"),
    path('deletefood/<int:id>', views.delete_food, name="deletefood")
]