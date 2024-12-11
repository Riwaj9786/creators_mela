from django.db import models

# Create your models here.
class FrequentlyAskedQuestion(models.Model):
    question = models.TextField()
    answer = models.TextField()

    class Meta:
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"
    