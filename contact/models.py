from django.db import models
from accounts.models import BaseModel

# Create your models here.
class Contact(BaseModel):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()

    def __str__(self):
        return f"Message from {self.name}, {self.email}"