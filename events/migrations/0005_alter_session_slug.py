# Generated by Django 5.1.3 on 2024-12-24 13:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0004_alter_session_attendees_alter_session_hall_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='session',
            name='slug',
            field=models.SlugField(unique=True),
        ),
    ]