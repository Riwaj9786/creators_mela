from feedback.models import FeedbackQuestion, QuestionChoice
from feedback.serializers import QuestionSerializer, QuestionChoicesSerializer

from events.models import Session

from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
class CreateQuestionAPIView(APIView):
   permission_classes = (permissions.IsAdminUser,)

   def post(self, request, *args, **kwargs):
      slug = self.kwargs.get('slug')

      try:
         session = Session.objects.get(slug=slug)
      except Session.DoesNotExist:
         return Response(
            {'message': "Session doesn't exist!"},
            status=status.HTTP_404_NOT_FOUND
         )
      
      serializer = QuestionSerializer