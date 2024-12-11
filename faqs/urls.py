from django.urls import path
from faqs.views import FrequentlyAskedQuestionsListAPIView

urlpatterns = [
    path('', FrequentlyAskedQuestionsListAPIView.as_view(), name='faqs'),
]