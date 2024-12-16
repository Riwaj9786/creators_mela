# Generated by Django 5.1.3 on 2024-12-10 05:18

import accounts.models
import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('federal', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=155)),
            ],
        ),
        migrations.CreateModel(
            name='AppUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('name', models.CharField(max_length=255, null=True)),
                ('date_joined', models.DateTimeField(auto_now_add=True)),
                ('is_active', models.BooleanField(default=False)),
                ('is_staff', models.BooleanField(default=False)),
                ('otp', models.IntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(100000), django.core.validators.MaxValueValidator(999999)])),
                ('otp_expiry', models.DateTimeField(blank=True, null=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'User',
                'verbose_name_plural': '1. Users',
            },
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('profile_picture', models.ImageField(blank=True, null=True, upload_to=accounts.models.profile_pic_upload_to, validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['jpg', 'png', 'jpeg'])])),
                ('phone', models.CharField(blank=True, max_length=15, null=True)),
                ('age', models.IntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(125)])),
                ('gender', models.CharField(blank=True, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other'), ('Non-Binary', 'Non-Binary'), ('Not Specified', 'Not Specified')], max_length=55, null=True)),
                ('status', models.CharField(choices=[('Accepted', 'Accepted'), ('Rejected', 'Rejected'), ('Pending', 'Pending')], default='Pending', max_length=55)),
                ('is_international', models.BooleanField(default=False)),
                ('bio', models.TextField(blank=True, null=True)),
                ('heard_from', models.CharField(blank=True, choices=[('Social Media', 'Social Media'), ('Advertisement', 'Advertisement'), ('Friends/Family', 'Friends/Family'), ('Our Website', 'Our Website'), ('News/Information', 'News/Information')], max_length=25, null=True)),
                ('slug', models.SlugField(blank=True, null=True, unique=True)),
                ('district', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='user_district', to='federal.district')),
                ('municipality', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='user_municipality', to='federal.municipality')),
                ('province', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='user_province', to='federal.province')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
                ('user_type', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='accounts.usertype')),
            ],
            options={
                'verbose_name': 'Profile',
                'verbose_name_plural': '2. Profiles',
            },
        ),
        migrations.CreateModel(
            name='SocialMediaLinks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('platform', models.CharField(choices=[('FB', 'Facebook'), ('IG', 'Instagram'), ('YT', 'Youtube'), ('X', 'X')], max_length=55)),
                ('url', models.URLField()),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='profile_social_media_links', to='accounts.profile')),
            ],
            options={
                'unique_together': {('profile', 'platform')},
            },
        ),
    ]