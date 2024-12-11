from django.db import models

from accounts.models import Profile

# Create your models here.
class Interest(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='profile_interests')
    interest_name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.profile}_{self.interest_name}"
    
    class Meta:
        verbose_name = 'Interest'
        verbose_name_plural = 'Interests'


    