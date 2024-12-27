# Generated by Django 5.1.3 on 2024-12-12 08:11

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0005_remove_session_moderator_session_moderator'),
    ]

    operations = [
        migrations.AddField(
            model_name='session',
            name='total_seats',
            field=models.IntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0)]),
        ),
    ]