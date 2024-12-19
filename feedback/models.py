from django.db import models

# Create your models here.
from django.db import models

from accounts.models import BaseModel

# Create your models here.
class FeedbackQuestion(models.Model):
   session = models.ForeignKey(
      'events.Session',
      on_delete = models.CASCADE,
      related_name = 'feedback_question'
   )

   question = models.CharField(max_length=500)

   def __str__(self):
      return f"{self.session}_{self.question}?"
   
   class Meta:
      verbose_name = "Question"
      verbose_name_plural = "Questions"


class QuestionChoice(models.Model):
   question = models.ForeignKey(
      FeedbackQuestion,
      on_delete=models.CASCADE,
      related_name='choices'
   )
   choice_option = models.CharField(max_length=500)

   def __str__(self):
      return f"{self.choice_option}"
