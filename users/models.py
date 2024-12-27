from django.db import models

from accounts.models import UserType, BaseModel
from events.models import Session


class InvitedEmail(models.Model):
   email = models.EmailField()
   user_type = models.ForeignKey(
      UserType,
      on_delete= models.CASCADE,
      related_name='invited_user'
   )
   session = models.ForeignKey(
      Session,
      on_delete = models.CASCADE,
      related_name = 'invited_session',
      null=True
   )

   def __str__(self):
      return self.email
   


class RegisteredSession(BaseModel):
    user = models.ForeignKey(
        'accounts.Profile',
        on_delete=models.PROTECT,
        related_name='registered_users',
        limit_choices_to = {
            'user__user_type__name': 'attendee',
            'status': "Accepted"
        }
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