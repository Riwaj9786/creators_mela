from accounts.models import Profile, AppUser, UserType
from accounts.serializers import ProfileSerializer, InviteSerializer, SpeakerTeamSerializer, UserApplySerializer

from events.models import Session, RegisteredSession

from users.serializers import AboutMeSerializers, RegisteredSessionSerializer

from creators_mela.base_permissions import IsAdminOrSessionOwner

from rest_framework import generics
from rest_framework.filters import SearchFilter
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
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
    serializer_class = SpeakerTeamSerializer
    filter_backends = (SearchFilter, DjangoFilterBackend)
    search_fields = ('user__name', 'user__email')
    filterset_fields = ('gender', 'province__name', 'district__name',)
    permission_classes = (IsAdminUser,)

    
class TeamListAPIView(generics.ListAPIView):
    queryset = Profile.objects.filter(user_type__name="Team")
    serializer_class = SpeakerTeamSerializer
    filter_backends = (SearchFilter, DjangoFilterBackend)
    search_fields = ('user__name', 'user__email')
    filterset_fields = ('gender', 'province__name', 'district__name',)
    permission_classes = (IsAdminUser,)


class UserInviteAPIView(APIView):
    permission_classes = (IsAdminUser,)

    def post(self, request, *args, **kwargs):
        serializer = InviteSerializer(data=request.data)

        if serializer.is_valid():
            user_type = kwargs.get('user_type')

            emails = serializer.validated_data['email'] # type: ignore
            url = reverse('users:user_apply', kwargs={'user_type': user_type})
            print(url)
            invitation_link = f"{request.scheme}://{request.get_host()}{url}"

            subject = "You are invited!"
            message = f"You can apply for the Creators' Mela with the provided link: \n {invitation_link}" 

            from_mail = settings.DEFAULT_FROM_EMAIL
            results = []

            for email in emails:
                if AppUser.objects.filter(email=email).exists():
                    results.append(
                        f"User with email {email} already exists! Change the status of the already existing user."
                    )
                else:
                    send_mail(subject, message, from_mail, [email], fail_silently=False)
                    results.append(f"Invitation sent successfully to {email}.")

            return Response(
                {
                    'message': results,
                    'link': invitation_link
                },
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserApplyCreateAPIView(APIView):

    def post(self, request, *args, **kwargs):
        serializer = UserApplySerializer(data=request.data)

        if serializer.is_valid():
            user_type_url = kwargs.get('user_type')

            email = serializer.validated_data.get('email')
            name = serializer.validated_data.get('name')

            if AppUser.objects.filter(email=email).exists():
                return Response(
                    {'message': "User with the email already exists!"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                user = AppUser.objects.create_user(
                    email = email,
                    name = name,
                    password = 'password123',
                    is_active = True
                )

                user_type, created = UserType.objects.get_or_create(name=user_type_url)

                profile, created = Profile.objects.get_or_create(
                    user = user,
                    defaults= {'user_type': user_type}
                )

                return Response(
                    {'message': f"{user_type} User created successfully!"},
                    status=status.HTTP_201_CREATED
                )
            
        else:
            return Response(
                {'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )


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
        

class RegisterSessionAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    
    def post(self, request, slug, *args, **kwargs):
        try:
            session = Session.objects.get(slug=slug)
        except Session.DoesNotExist:
            return Response(
                {
                    'message': "Session doesn't exist!"
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        user = request.user
        print(user)

        try:
            profile = user.profile
        except Profile.DoesNotExist:
            return Response(
                {'message': "Profile doesn't exist!"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        print(profile)
        if profile.status != 'Accepted':
            return Response(
                {'message': "You are not Accepted Profile to be registering in the session."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if RegisteredSession.objects.filter(session=session, user=profile):
            return Response(
                {'message': "You have already registered to the Session!"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        available_seats = RegisteredSession.objects.filter(session=session).count()

        if available_seats <= session.total_seats: # type: ignore
            registered_session = RegisteredSession.objects.create(session=session, user=profile)
            session.attendees.add(profile)
        else:
            return Response(
                {'message': "The Session is already occupied!"}
            )

        serializer = RegisteredSessionSerializer(registered_session)

        return Response(
            {
                'message': "You are successfully registered!",
                'data': serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    

class UserRegisteredEventAPIView(APIView):
    permission_classes = (IsAdminOrSessionOwner,)

    def get(self, request, slug, *args, **kwargs):
        try:
            profile = Profile.objects.get(slug=slug)
        except Profile.DoesNotExist:
            return Response(
                {'message': "Profile Doesn't exist!"},
                status=status.HTTP_404_NOT_FOUND
            )

        registered_sessions = RegisteredSession.objects.filter(user=profile)

        for session in registered_sessions:
            self.check_object_permissions(request, session)
        
        serializer = RegisteredSessionSerializer(registered_sessions, many=True)

        return Response(
            {'sessions': serializer.data},
            status=status.HTTP_200_OK
        )
    

class RegisteredUserDestroyAPIVIew(APIView):
    permission_classes = (IsAdminUser,)

    def delete(self, request, slug, pk, *args, **kwargs):
        try:
            profile = Profile.objects.get(slug=slug)
            try:
                registered_sessions = RegisteredSession.objects.get(user=profile, pk=pk)
                registered_sessions.delete()

            except RegisteredSession.DoesNotExist:
                return Response(
                    {'message': "The user has not registered for such session."},
                    status=status.HTTP_404_NOT_FOUND
                )

            return Response(
                {'message': "Entry Deleted Successfully!"},
                status=status.HTTP_204_NO_CONTENT
            )

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
