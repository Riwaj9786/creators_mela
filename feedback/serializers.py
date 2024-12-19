from rest_framework import serializers

from feedback.models import FeedbackQuestion, QuestionChoice

class QuestionSerializer(serializers.ModelSerializer):
   class Meta:
      model = FeedbackQuestion
      fields = ('session', 'question',)


class QuestionChoicesSerializer(serializers.ModelSerializer):
   class Meta:
      model = QuestionChoice
      fields = ('question', 'choice_option')