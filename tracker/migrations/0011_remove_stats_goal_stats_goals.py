# Generated by Django 5.0.6 on 2024-12-27 19:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0010_alter_activity_log_activity_alter_food_log_food'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='stats',
            name='goal',
        ),
        migrations.AddField(
            model_name='stats',
            name='goals',
            field=models.JSONField(default=[]),
        ),
    ]
