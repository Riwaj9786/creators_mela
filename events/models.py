import os

from django.db import models
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator, MinValueValidator

# Create your models here.
def session_banner_upload_to(instance, filename):
    session_id = instance.id
    return os.path.join('sessions/banner/', f"session_{session_id}", filename)

    
    
class Hall(models.Model):
    hall_name = models.CharField(max_length=255)
    venue = models.CharField(max_length=255, null=True, blank=True)
    location = models.CharField(max_length=500, null=True, blank=True)

    def __str__(self):
        return self.hall_name

def create_session_slug(slug):
    base_slug = slugify(slug) # type: ignore
    slug = base_slug
    count = 1

    while Session.objects.filter(slug=slug).exists():
        slug = f"{base_slug}-{count}"
        count += 1

    return slug



class Session(models.Model):
    session_name = models.CharField(max_length=500)
    
    banner = models.ImageField(upload_to=session_banner_upload_to, validators=[FileExtensionValidator(allowed_extensions={'jpg', 'png', 'jpeg'})], null=True, blank=True)
    description = models.TextField(blank=True, null=True)

    total_seats = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
    
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    hall = models.ForeignKey(
        Hall,
        on_delete=models.PROTECT,
        related_name='sessions'
    )
    slug = models.SlugField(unique=True, null=True, blank=True)


    moderator = models.ManyToManyField(
        'accounts.Profile',
        related_name = 'session_moderator',
        blank=True,
        limit_choices_to = {
            'status': "Accepted"
        }
    )
    performers = models.ManyToManyField(
        'accounts.Profile',
        related_name='session_performers',
        blank=True,
        limit_choices_to = {
            'user__user_type__name': 'performer',
            'status': 'Accepted'
        }
    )
    speakers = models.ManyToManyField(
        'accounts.Profile',
        related_name = 'session_speakers',
        blank=True,
        limit_choices_to = {
            'user__user_type__name': 'speaker',
            'status': 'Accepted'
        }
    )

    attendees = models.ManyToManyField(
        'accounts.Profile',
        related_name = 'session_attendees',
        blank=True,
        limit_choices_to = {
            'user__user_type__name': 'attendee',
            'status': 'Accepted'
        }
    )

    def validate_session(self):
        if self.start_time >= self.end_time:
            raise ValidationError("Start Time can't be after the End Time")
        
        overlapping_sessions = Session.objects.filter(
            hall=self.hall,
            date=self.date,
            start_time__lt = self.end_time,
            end_time__gt = self.start_time
        ).exclude(pk=self.pk)

        if overlapping_sessions:
            raise ValidationError(f"Session Time overlaps with other Sessions: {overlapping_sessions}!")
        

    def clean(self, *args, **kwargs):
        self.validate_session()


    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = create_session_slug(self.session_name)

        self.clean()

        super().save(*args, **kwargs)               
                

    def __str__(self):
        return self.session_name
