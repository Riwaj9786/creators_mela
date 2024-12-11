from django.utils import timezone

from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.filters import SearchFilter

from django_filters.rest_framework import DjangoFilterBackend

from events.models import Event, EventSpeakers, EventAttendees
from events.serializers import SpeakerSerializer, EventDetailSerializer, AttendeeSerializer

# Create your views here.
class EventListAPIView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventDetailSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter)
    search_fields = ('name',)
    filterset_fields = ('hall', 'date')


class EventAttendeesAPIView(generics.ListAPIView):
    queryset = EventAttendees.objects.all()
    serializer_class = AttendeeSerializer
    permission_classes = (AllowAny,)


class OngoingSessionAPIView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, *args, **kwargs):
        ongoing_events = Event.objects.filter(
            start_time__gt = timezone.now().time(),
            end_time__lt = timezone.now().time()
        )

        serializer = EventDetailSerializer(ongoing_events, many=True)

        if serializer:
            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'message': 'There are no ongoing events currently!'},
                status=status.HTTP_404_NOT_FOUND
            )
        

class EventCreateAPIView(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventDetailSerializer
    permission_classes = (IsAdminUser,)


class EventUpdateAPIView(generics.UpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventDetailSerializer
    permission_classes = (IsAdminUser,)