# Generated by Django 5.1.3 on 2024-12-25 04:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_alter_profile_phone_alter_profile_slug'),
        ('events', '0008_remove_session_attendees_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='session',
            name='moderator',
            field=models.ManyToManyField(blank=True, related_name='session_moderator', to='accounts.profile'),
        ),
    ]
