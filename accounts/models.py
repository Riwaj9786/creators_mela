import os

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import MinValueValidator, MaxValueValidator, FileExtensionValidator
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.utils.text import slugify

from federal.models import Province, District, Municipality

# Create your models here.
class AppUserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set!')
        
        if not password:
            raise ValueError('The Password must be set!')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        if password:
            user.set_password(password)

        user.save(using=self.db)
        return user
    

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError("Superuser must have is_staff=True.")
        
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)
    

class AppUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    otp = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(100000), MaxValueValidator(999999)])
    otp_expiry = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = AppUserManager()
    
    class Meta:
        verbose_name = "User"
        verbose_name_plural = "1. Users"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
    
    def __str__(self):
        return f'{self.email}'
    
    def has_perm(self, perm, obj=None):
        """Check if the user has a specific permission."""
        return True

    def has_module_perms(self, app_label):
        """Check if the user has permissions to access the specified app."""
        return True
    

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


@receiver(post_save, sender=get_user_model())
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(
            user = instance,
        )


def profile_pic_upload_to(instance, filename):
    user_id = instance.user.pk
    return os.path.join('profile_pics/', f"user_{user_id}", filename)


class UserType(models.Model):
    name = models.CharField(max_length=155)

    def __str__(self):
        return self.name


class Profile(BaseModel):
    GENDER_CHOICES = (
        ('Male', "Male"),
        ('Female', "Female"),
        ('Other', "Other"),
        ('Non-Binary', 'Non-Binary'),
        ('Not Specified', "Not Specified")
    )

    STATUS_CHOICES = (
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
        ('Pending', 'Pending'),
    )

    INFO_ABOUT_US = (
        ('Social Media', 'Social Media'),
        ('Advertisement', 'Advertisement'),
        ('Friends/Family', 'Friends/Family'),
        ('Our Website', 'Our Website'),
        ('News/Information', 'News/Information')
    )
    
    user = models.OneToOneField(AppUser, on_delete=models.CASCADE, related_name='profile')
    profile_picture = models.ImageField(
            validators=[FileExtensionValidator(allowed_extensions=['jpg', 'png', 'jpeg'])],
            upload_to=profile_pic_upload_to,
            null=True,
            blank=True
        )
    
    phone = models.CharField(max_length=15, blank=True, null=True)
    age = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(125)], null=True, blank=True)
    gender = models.CharField(max_length=55, choices=GENDER_CHOICES, null=True, blank = True)
    province = models.ForeignKey(Province, null=True, blank = True, on_delete=models.PROTECT, related_name='user_province')
    district = models.ForeignKey(District, null=True, blank = True, on_delete=models.PROTECT, related_name='user_district')
    municipality = models.ForeignKey(Municipality, null=True, blank = True, on_delete=models.PROTECT, related_name='user_municipality')
    user_type = models.ForeignKey(
        UserType, 
        on_delete=models.PROTECT, 
        name='user_type',
        null=True,
        blank=True
    )
    status = models.CharField(max_length=55, choices=STATUS_CHOICES, default="Pending")
    is_international = models.BooleanField(default=False)

    bio = models.TextField(null=True, blank=True)
    heard_from = models.CharField(max_length=25, null=True, blank=True, choices=INFO_ABOUT_US)

    slug = models.SlugField(unique=True, null=True, blank=True)

    def __str__(self):
        return f"{self.user.name}"

    class Meta:
        verbose_name = "Profile"
        verbose_name_plural = "2. Profiles"


    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.user.name)
            slug = base_slug
            count = 1

            # Ensure the slug is unique
            while Profile.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{count}"
                count += 1

            self.slug = slug

        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.user.email}"        


class SocialMediaLinks(models.Model):
    PLATFORM_TYPE_CHOICES = (
        ('FB', "Facebook"),
        ('IG', "Instagram"),
        ('YT', "Youtube"),
        ('X', "X"),
    )

    profile = models.ForeignKey(Profile, on_delete=models.PROTECT, related_name='profile_social_media_links')
    platform = models.CharField(max_length=55, choices=PLATFORM_TYPE_CHOICES)
    url = models.URLField()

    class Meta:
        unique_together = ('profile', 'platform')

    def __str__(self):
        return f"{self.profile}_{self.platform}"