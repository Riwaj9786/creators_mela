from django.utils import timezone
from django.db.models import Count

from events.models import Session, Hall
from users.models import RegisteredSession

from events.serializers import (
        SessionSerializer,
        SessionListSerializer,
        OngoingSessionSerializer,
        SessionUnAuthenticatedUserSerializer,
        SessionAuthenticatedUserSerializer,
        SessionDateSerializer
    )

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status


class SessionDateListAPIView(generics.ListAPIView):
    queryset = Session.objects.values('date').distinct()
    serializer_class = SessionDateSerializer
    permission_classes = (permissions.AllowAny,)


class SessionsScheduleAPIView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def get(self, request, *args, **kwargs):
        # Obtain Date passed from the query parameters
        date = request.query_params.get('date')

        # Fetch the current date
        now = timezone.localtime(timezone.now())
        today = now.date()

        # Obtain the Ongoing Sessions in the current time
        ongoing_sessions_count = Session.objects.filter(
                date = today,
                start_time__lte = now.time(),
                end_time__gte = now.time() 
            ).count()

        # Obtain the total numboer of Sessions that day
        sessions_count = Session.objects.filter(date = date).count()

        # Fetch the sessions that day with the related halls
        sessions = Session.objects.select_related(
                'hall'
            ).prefetch_related(
                'speakers',
                'attendees'
            ).filter(date=date)
        
        halls = Hall.objects.prefetch_related('sessions').filter(id__in=sessions.values_list('hall_id', flat=True)).distinct()

        data = []
        hall_sessions_map = {}
        
        for session in sessions:
            hall_id = session.hall_id
            if hall_id not in hall_sessions_map:
                hall_sessions_map[hall_id] = []
            

            session_serializer = (
                SessionAuthenticatedUserSerializer(session) if request.user.is_authenticated
                else SessionUnAuthenticatedUserSerializer(session)
            )
            hall_sessions_map[hall_id].append({
                'session': session_serializer.data,
        })
        
        for hall in halls:
            data.append({
                'hall_name': hall.hall_name,
                'venue': hall.venue,
                'location': hall.location,
                'sessions': hall_sessions_map.get(hall.id, [])
            })

        return Response(
            {
                'session_count': sessions_count,
                'ongoing_sessions': ongoing_sessions_count,
                'data': data,
            },
            status=status.HTTP_200_OK
        )


class SessionCreateAPIView(generics.CreateAPIView):
    queryset = Session.objects.all()
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = SessionSerializer


class SessionRetrieveUpdateDestroyAPIView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def get(self, requser, slug, *args, **kwargs):
        try:
            session = Session.objects.select_related('hall').prefetch_related('moderator', 'speakers', 'attendees', 'performers').get(slug=slug)
        except Session.DoesNotExist:
            return Response(
                {
                    'message': "Session doesn't exist!"
                },
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = SessionListSerializer(session)
        number_of_attendees = RegisteredSession.objects.filter(session=session).count()

        return Response(
            {
                'data': serializer.data,
                'attendees': number_of_attendees
            },
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
        serializer = SessionListSerializer(session, data=request.data, partial=True)
        
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
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        ongoing_sessions = Session.objects.filter(
            date = timezone.localtime(timezone.now()).date(),
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
    


class CalendarDetailAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not start_date or not end_date:
            return Response(
                {"error": "start_date and end_date are required parameters"},
                status=status.HTTP_400_BAD_REQUEST
            )

        sessions = Session.objects.filter(
            date__gte = start_date,
            date__lte = end_date
        ).values('date').annotate(count=Count('id'))

        
        data = [
            {
                'date': session['date'],
                'count': session['count']
            }
            for session in sessions
        ]

        return Response(
            {'date': data}, 
            status=status.HTTP_200_OK
        )    
    


## VIEWS RELATED TO SESSION REGISTRATIONS 