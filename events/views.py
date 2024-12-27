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
from rest_framework.filters import SearchFilter

from django_filters.rest_framework import DjangoFilterBackend


class SessionDateListAPIView(generics.ListAPIView):
    queryset = Session.objects.values('date').distinct()
    serializer_class = SessionDateSerializer
    permission_classes = (permissions.AllowAny,)


class SessionsScheduleAPIView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def get(self, request, *args, **kwargs):
        date = request.query_params.get('date')

        ongoing_sessions_count = Session.objects.filter(
            date = timezone.localtime(timezone.now()).date(),
            start_time__lte = timezone.localtime(timezone.now()).time(),
            end_time__gte = timezone.localtime(timezone.now()).time() 
        ).count()

        sessions_count = Session.objects.filter(
            date = date
        ).count()

        if date:
            halls = Session.objects.filter(date=date).values_list('hall', flat=True).distinct()
            data = []

            for hall in halls:
                hall_instance = Hall.objects.get(id=hall)
                sessions_for_hall = Session.objects.filter(hall=hall_instance, date=date)
                
                session_data = []
                
                for session in sessions_for_hall:
                    if request.user.is_authenticated:
                        session_result = SessionAuthenticatedUserSerializer(session).data
                    else:
                        session_result = SessionUnAuthenticatedUserSerializer(session).data

                    session_data.append({
                        'session': session_result,
                    })
                data.append({
                    'hall_name': hall_instance.hall_name,
                    'venue': hall_instance.venue,
                    'location': hall_instance.location,
                    'sessions': session_data
                })
        else:
            halls = Session.objects.none
            return Response({'message': "No Dates selected!"}, status=status.HTTP_204_NO_CONTENT)

        return Response(
            {
                'session_count': sessions_count,
                'ongoing_sessions': ongoing_sessions_count,
                'data': data
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
            session = Session.objects.get(slug=slug)
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