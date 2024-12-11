from accounts.models import Profile
from accounts.serializers import ProfileSerializer, InviteSerializer

from users.serializers import AboutMeSerializers, UserEventsSerializer

from events.models import EventAttendees

from creators_mela.base_permissions import IsAdminOrOwner

from rest_framework import generics
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status 

from django_filters.rest_framework import DjangoFilterBackend

from django.conf import settings
from django.core.mail import send_mail
from django.urls import reverse

# Create your views here.
class GuestsListAPIView(generics.ListAPIView):
    queryset = Profile.objects.filter(user_type__name="Guest")
    serializer_class = ProfileSerializer
    filter_backends = (SearchFilter, DjangoFilterBackend)
    search_fields = ('user__name', 'user__email')
    filterset_fields = ('gender', 'province__name', 'district__name',)
    permission_classes = (IsAuthenticated,)


class SpeakerListAPIView(generics.ListAPIView):
    queryset = Profile.objects.filter(user_type__name="Speaker")
    serializer_class = ProfileSerializer
    filter_backends = (SearchFilter, DjangoFilterBackend)
    search_fields = ('user__name', 'user__email')
    filterset_fields = ('gender', 'province__name', 'district__name',)
    permission_classes = (IsAuthenticated,)

    
class TeamListAPIView(generics.ListAPIView):
    queryset = Profile.objects.filter(user_type__name="Team")
    serializer_class = ProfileSerializer
    filter_backends = (SearchFilter, DjangoFilterBackend)
    search_fields = ('user__name', 'user__email')
    filterset_fields = ('gender', 'province__name', 'district__name',)
    permission_classes = (IsAuthenticated,)


class SpeakerInviteAPIView(APIView):
    permission_classes = (IsAdminUser,)

    def post(self, request, *args, **kwargs):
        serializer = InviteSerializer(data=request.data)
        if serializer.is_valid():
            emails = serializer.validated_data['email']
            url = reverse('accounts:user_apply')
            invitation_link = f"{request.scheme}://{request.get_host()}/{url}"

            subject = "You are Invited!"
            message = f"You can apply for the Creators' Mela with the provided link: \n {invitation_link}"

            from_mail = settings.DEFAULT_FROM_EMAIL

            for email in emails:
                send_mail(subject, message, from_mail, [email], fail_silently=False)
                
            return Response(
                {
                    'message': 'Invitation sent successfully!',
                    'link': invitation_link
                },
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class AboutProfileAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, slug=None, *args, **kwargs):
        try:
            if slug:
                profile = Profile.objects.get(slug=slug)
            else:
                profile = Profile.objects.get(user=request.user)
            
            serializer = AboutMeSerializers(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        

class UserRegisteredEventsAPIView(APIView):
    permission_classes = (IsAdminOrOwner,)

    def get(self, request, slug=None, *args, **kwargs):
        try:
            if slug:
                profile = Profile.objects.get(slug=slug)
            else:
                profile = Profile.objects.get(user=request.user)

            attendee_entries = EventAttendees.objects.filter(attendee=profile)
            print(attendee_entries)
            
            serializer = UserEventsSerializer(attendee_entries, many=True)
            print(serializer.data)

            return Response(serializer.data, status=status.HTTP_200_OK)
        

        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
        except EventAttendees.DoesNotExist:
            return Response({"error": "No registered events found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)