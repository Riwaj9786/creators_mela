from django.utils import timezone

from events.models import Session, Event, RegisteredSession
from events.serializers import (
        SessionSerializer,
        SessionListSerializer,
        EventSerializer,
        EventDetailSerializer,
        OngoingSessionSerializer
    )

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.filters import SearchFilter

from django_filters.rest_framework import DjangoFilterBackend


class EventListAPIView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = (permissions.AllowAny,)
    filter_backends = (DjangoFilterBackend, SearchFilter)
    search_fields = ('name', 'venue', 'slug')
    fiterset_fields = ('date',)


class EventCreateAPIView(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = (permissions.IsAdminUser,)


class EventRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = (permissions.IsAdminUser,)


class SessionCreateAPIView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request, slug, *args, **kwargs):
        try:
            event = Event.objects.get(slug=slug)
        
        except Event.DoesNotExist:
            return Response(
                {'message': 'Event doesn\'t exist!'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = SessionSerializer(data=request.data, context={'event': event})
        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    'message': 'Session Created Successfully!',
                    'data': serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            {
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class SessionInEventAPIView(generics.ListAPIView):
    serializer_class = SessionListSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        slug = self.kwargs.get('slug')

        if slug:
            try:
                self.event = Event.objects.get(slug=slug)
            except Event.DoesNotExist:
                return Response(
                    {'message': "Event doesn't exist!"},
                    status=status.HTTP_404_NOT_FOUND
                )
            return Session.objects.filter(event=self.event)
        else:
            self.event = None
            return Session.objects.all()


    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context


    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response(
            {
                'event': self.event.name,
                'data': serializer.data,
            },
            status=status.HTTP_200_OK
        )
    

class SessionRetrieveUpdateDestroyAPIView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def get(self, requser, slug, *args, **kwargs):
        try:
            session = Session.objects.get(slug=slug)
        except Session.DoesNotExist:
            return Response(
                {
                    'message': "Session doesn't exist!"
                },
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = SessionListSerializer(session)

        return Response(
            {'data': serializer.data},
            status=status.HTTP_200_OK
        )


    def patch(self, request, slug, *args, **kwargs):
        try:
            session = Session.objects.get(slug=slug)

        except Session.DoesNotExist:
            return Response(
                {
                    'message': "Session doesn't exist!"
                },
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = SessionSerializer(session, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    'message': 'Session Updated Successfully!',
                    'data': serializer.data
                },
                status=status.HTTP_200_OK
            )
        
        return Response(
            {
                'message': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    

    def delete(self, requser, slug, *args, **kwargs):
        try:
            session = Session.objects.get(slug=slug)
        except Session.DoesNotExist:
            return Response(
                {
                    'message': "Session doesn't exist!"
                },
                status=status.HTTP_404_NOT_FOUND
            )
        session.delete()

        return Response(
            {'message': 'Session Deleted Successfully!'},
            status=status.HTTP_204_NO_CONTENT
        )


class OngoingSessionListAPIView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        ongoing_sessions = Session.objects.filter(
            event__date = timezone.localtime(timezone.now()).date(),
            start_time__lte = timezone.localtime(timezone.now()).time(),
            end_time__gte = timezone.localtime(timezone.now()).time() 
        )

        count = ongoing_sessions.count()

        serializer = OngoingSessionSerializer(ongoing_sessions, many=True)

        return Response(
            {
                'count': count,
                'data': serializer.data
            },
            status=status.HTTP_200_OK
        )
    

class EventDetailListAPIView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, slug, *args, **kwargs):
        try:
            event = Event.objects.get(slug=slug)
        except Event.DoesNotExist:
            return Response(
                {'message': "Provided Event doesn't exist!"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = EventDetailSerializer(event)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
