# Generated by Django 5.0.6 on 2024-12-16 21:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0009_food_log'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activity_log',
            name='activity',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='food_log',
            name='food',
            field=models.CharField(default='', max_length=100),
        ),
    ]
