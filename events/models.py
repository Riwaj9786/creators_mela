import os

from django.db import models
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator, MinValueValidator

from accounts.models import BaseModel

# Create your models here.
def session_banner_upload_to(instance, filename):
    session_id = instance.id
    return os.path.join('sessions/banner/', f"session_{session_id}", filename)

    
    
class Hall(models.Model):
    hall_name = models.CharField(max_length=255)

    def __str__(self):
        return self.hall_name



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
        related_name='hall'
    )
    slug = models.SlugField(unique=True, null=True, blank=True)


    moderator = models.ManyToManyField(
        'accounts.Profile',
        related_name = 'session_moderator',
        blank=True
    )

    speakers = models.ManyToManyField(
        'accounts.Profile',
        related_name = 'session_speakers',
        blank=True,
        limit_choices_to = {
            'user_type__name': 'Speaker',
            'status': 'Accepted'
        }
    )
    attendees = models.ManyToManyField(
        'accounts.Profile',
        related_name = 'session_attendees',
        blank=True,
        limit_choices_to={
            'user_type__name': 'Guest',
            'status': 'Accepted'
        }
    )        

    def validate_session(self):
        if self.start_time >= self.end_time:
            raise ValidationError("Start Time can't be after the End Time")
        
        overlapping_sessions = Session.objects.filter(
            hall=self.hall,
            event__date = self.event.date,
            start_time__lt = self.end_time,
            end_time__gt = self.start_time
        ).exclude(pk=self.pk)

        if overlapping_sessions:
            raise ValidationError(f"Session Time overlaps with other Sessions: {overlapping_sessions}!")
        
        for speaker in self.speakers.all():
            overlapping_for_speaker = Session.objects.filter(
                speakers = speaker,
                event__date = self.event.date,
                start_time__lte = self.start_time,
                end_time__gte = self.end_time
            ).exclude(pk=self.pk)

            if overlapping_for_speaker.exists():
                raise ValidationError(f"Speaker {speaker} is already assigned to another session during the time.")


    def save(self, *args, **kwargs):
        self.slug = slugify(self.session_name)

        original_slug = self.slug
        counter = 1

        while Session.objects.filter(slug=self.slug).exists():
            self.slug = f"{original_slug}-{counter}"
            counter += 1

        super(Session, self).save(*args, **kwargs)       
        
        self.full_clean() 


    def clean(self, *args, **kwargs):
        self.validate_session()
        super().clean(*args, **kwargs)


    def __str__(self):
        return self.session_name


class RegisteredSession(BaseModel):
    user = models.ForeignKey(
        'accounts.Profile',
        on_delete=models.PROTECT,
        related_name='registered_users'
    )
    session = models.ForeignKey(
        Session,
        on_delete=models.PROTECT,
        related_name='session_users'
    )
    
    class Meta:
        unique_together = ('user', 'session')

    def __str__(self):
        return f"{self.user}_{self.session}"
    

