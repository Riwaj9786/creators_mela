from rest_framework import serializers
from faqs.models import FrequentlyAskedQuestion

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrequentlyAskedQuestion
        fields = ('id', 'question', 'answer')
        read_only_fields = ('id',)