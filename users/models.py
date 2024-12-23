from django.db import models

from accounts.models import UserType 


class InvitedEmail(models.Model):
   email = models.EmailField()
   user_type = models.ForeignKey(
      UserType,
      on_delete= models.CASCADE,
      related_name='invited_user'
   )

   def __str__(self):
      return self.email