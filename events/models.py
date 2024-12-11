from django.db import models
from django.core.exceptions import ValidationError

# Create your models here.
class Event(models.Model):
    HALL_CHOICES = (
        ('Hall A', 'Hall A'),
        ('Hall B', 'Hall B'),
        ('Hall C', 'Hall C')
    )

    name = models.CharField(max_length=150)
    venue = models.CharField(max_length=150, null=True)
    place = models.CharField(max_length=55, default="Kathmandu")
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    hall = models.CharField(max_length=55, choices=HALL_CHOICES)


    def __str__(self):
        return f"{self.name}_{self.hall}"
    
    
    class Meta:
        ordering = ('hall', 'start_time')


    def clean(self):
        super().clean()

        if self.start_time >= self.end_time:
            raise ValidationError("Start Time can't be after the End Time")
        
        overlapping_events = Event.objects.filter(
            hall=self.hall,
            date = self.date,
            start_time__lt = self.end_time,
            end_time__gt = self.start_time
        )

        if self.pk:
            overlapping_events = overlapping_events.exclude(pk=self.pk)

        if overlapping_events:
            raise ValidationError("Event Time overlaps with other Events!")

    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class EventSpeakers(models.Model):
    event = models.ForeignKey(Event, on_delete=models.PROTECT, null=True, related_name='speakers')
    speaker = models.ForeignKey(
        'accounts.Profile',
        on_delete=models.PROTECT,
        null=True,
        related_name='event_speakers',
        limit_choices_to={
            'user_type__name': 'Speaker',
            'status': "Accepted"
        }
    )

    class Meta:
        verbose_name = "Speaker"
        verbose_name_plural = "Speakers"

    def __str__(self):
        return f"{self.speaker} for {self.event}"

    def clean(self):    
        super().clean()

        overlapping_events = EventSpeakers.objects.filter(
            speaker = self.speaker,
            event__date = self.event.date,
            event__start_time__lt = self.event.end_time,
            event__end_time__gt = self.event.start_time
        )

        if self.pk:
            overlapping_events = overlapping_events.exclude(pk=self.pk)

        if overlapping_events.exists():
            raise ValidationError("Speaker's Event overlaps in the same time!")

    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class EventAttendees(models.Model):
    event = models.ForeignKey(Event, on_delete=models.PROTECT, null=True, related_name='attendee_event')
    attendee = models.ForeignKey(
        'accounts.Profile',
        on_delete=models.PROTECT,
        related_name='attendee',
        limit_choices_to={
            'user_type__name': 'Guest',
            'status': "Accepted"
        }
    )

    class Meta:
        verbose_name = "Attendee"
        verbose_name_plural = "Event Attendees"