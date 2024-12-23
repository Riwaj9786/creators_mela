# Generated by Django 5.1.3 on 2024-12-20 09:20

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='appuser',
            options={'verbose_name': 'User', 'verbose_name_plural': 'Users'},
        ),
        migrations.AlterModelOptions(
            name='profile',
            options={'verbose_name': 'Profile', 'verbose_name_plural': 'Profiles'},
        ),
        migrations.RemoveField(
            model_name='profile',
            name='user_type',
        ),
        migrations.AddField(
            model_name='appuser',
            name='user_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='accounts.usertype'),
        ),
    ]
