# Generated by Django 5.1.3 on 2024-12-13 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='interest',
            field=models.TextField(blank=True, null=True),
        ),
    ]
