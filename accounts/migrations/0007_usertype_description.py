# Generated by Django 5.1.3 on 2024-12-19 11:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_alter_profile_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='usertype',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]
