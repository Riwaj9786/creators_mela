# Generated by Django 5.1.3 on 2024-12-25 08:47

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_alter_profile_phone_alter_profile_slug'),
        ('events', '0010_alter_registeredsession_user_alter_session_moderator'),
    ]

    operations = [
        migrations.AlterField(
            model_name='registeredsession',
            name='user',
            field=models.ForeignKey(limit_choices_to={'status': 'Accepted', 'user__user_type__name': 'attendee'}, on_delete=django.db.models.deletion.PROTECT, related_name='registered_users', to='accounts.profile'),
        ),
    ]