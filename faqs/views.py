from faqs.models import FrequentlyAskedQuestion
from faqs.serializers import FAQSerializer
from faqs.permissions import IsAdminUserOrReadOnly
from rest_framework import generics

# Create your views here.
class FrequentlyAskedQuestionsListAPIView(generics.ListCreateAPIView):
    queryset = FrequentlyAskedQuestion.objects.all()
    serializer_class = FAQSerializer
    permission_classes = (IsAdminUserOrReadOnly,)