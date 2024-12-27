# Generated by Django 5.1.3 on 2024-12-11 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
        ('events', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='session',
            name='attendees',
            field=models.ManyToManyField(blank=True, limit_choices_to={'status': 'Accepted', 'user_type__name': 'Guest'}, null=True, related_name='session_attendees', to='accounts.profile'),
        ),
        migrations.AlterField(
            model_name='session',
            name='speakers',
            field=models.ManyToManyField(blank=True, limit_choices_to={'status': 'Accepted', 'user_type__name': 'Speaker'}, null=True, related_name='session_speakers', to='accounts.profile'),
        ),
    ]