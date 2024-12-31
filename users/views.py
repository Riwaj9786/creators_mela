from accounts.models import Profile, AppUser, UserType
from accounts.serializers import ProfileSerializer, ProfileListSerializer, InviteSerializer, UserApplySerializer

from events.models import Session

from users.models import InvitedEmail, RegisteredSession
from users.serializers import (
    AboutMeSerializers,
    RegisteredSessionSerializer,
    ProfilePicSerializer,
    TeamListSerializer
)
from users.tasks import send_invitation_email

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


class AnonymousUserSpeakerAPIView(generics.ListAPIView):
    queryset = Profile.objects.select_related(
            'user'
        ).prefetch_related(
            'social_media'
        ).filter(
            user__user_type__name="speaker"
        )
    serializer_class = ProfilePicSerializer
    permission_classes = (AllowAny,)


class AnonymousUserPerformerAPIView(generics.ListAPIView):
    queryset = Profile.objects.select_related(
            'user'
        ).prefetch_related(
            'social_media'
        ).filter(
            user__user_type__name="performer"
        )
    serializer_class = ProfilePicSerializer
    permission_classes = (AllowAny,)


class AdminAttendeeListAPIView(generics.ListAPIView):
    queryset = Profile.objects.select_related(
            'user', 'province', 'district', 'municipality'
        ).prefetch_related(
            'social_media'
        ).filter(
            user__user_type__name="attendee"
        )
    serializer_class = ProfileListSerializer
    filter_backends = (SearchFilter, DjangoFilterBackend)
    search_fields = ('user__name', 'user__email')
    permission_classes = (IsAdminUser,)


class AdminListAPIView(generics.ListAPIView):
    serializer_class = TeamListSerializer
    filter_backends = (SearchFilter, DjangoFilterBackend)
    search_fields = ('user__name', 'user__email')
    permission_classes = (IsAdminUser,)

    def get_queryset(self):
        user_type_name = self.kwargs.get('user_type')

        queryset = Profile.objects.select_related(
            'user',
        ).filter(user__user_type__name = user_type_name)

        return queryset
    


class UserInviteAPIView(APIView):
    permission_classes = (IsAdminUser,)

    def post(self, request, *args, **kwargs):
        serializer = InviteSerializer(data=request.data)

        if serializer.is_valid():
            user_type_name = kwargs.get('user_type')
            user_type = UserType.objects.get(name=user_type_name)

            session_slug = kwargs.get('session_slug')
            session = Session.objects.get(slug=session_slug)

            emails = serializer.validated_data['email']  # type: ignore
            url = reverse('users:user_apply', kwargs={'user_type': user_type, 'session_slug': session_slug})
            invitation_link = f"{request.scheme}://{request.get_host()}{url}"

            subject = f"You are invited as {user_type_name} for the session {session.session_name}!"
            message = f"You can apply for the Creators' Mela with the provided link: \n {invitation_link}"

            from_mail = settings.DEFAULT_FROM_EMAIL
            results = []

            for email in emails:
                if AppUser.objects.filter(email=email).exists():
                    results.append(f"User with email {email} already exists!")
                else:
                    try:
                        invited_email = InvitedEmail.objects.get(email=email)
                        invited_email.user_type = user_type
                        invited_email.session = session
                        invited_email.save()

                        results.append(f"User with this email, {email} was already invited! The user_type has now been updated!")
                    except InvitedEmail.DoesNotExist:
                        InvitedEmail.objects.create(
                            email=email,
                            user_type=user_type
                        )

                    # Call the Celery task to send the email asynchronously
                    send_invitation_email.delay(subject, message, from_mail, email)
                    results.append(f"Invitation sent successfully to {email}")

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
            user_type_name = kwargs.get('user_type')
            session_slug = kwargs.get('session_slug')

            try:
                user_type = UserType.objects.get(name = user_type_name)
            except UserType.DoesNotExist:
                return Response(
                    {'message': "Invalid User Type!"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            

            try:
                session = Session.objects.get(slug = session_slug)
            except Session.DoesNotExist:
                return Response(
                    {'message': "Invalid Session!"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            
            email = serializer.validated_data.get('email')
            name = serializer.validated_data.get('name')

            if AppUser.objects.filter(email=email).exists():
                return Response(
                    {'message': "User with the email already exists!"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            try:
                invited_email = InvitedEmail.objects.get(email=email, user_type=user_type, session=session)
            except InvitedEmail.DoesNotExist:
                return Response(
                    {'message': "The provided mail, user type, and session combination was not invited!"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user = AppUser.objects.create_user(
                email = email,
                name = name,
                password = 'password123',
                user_type = user_type,
                is_active = True
            )

            profile, created = Profile.objects.get_or_create(
                user = user,
            )
            if not created:
                profile.status = "Accepted"
                profile.save()

            if user_type_name == 'speaker':
                session.speakers.add(profile)

            elif user_type_name == 'moderator':
                session.moderator.add(profile)

            elif user_type_name == 'performer':
                session.performers.add(profile)

            invited_email.delete()

            return Response(
                {'message': f"{user_type} User created successfully!"},
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            serializer.errors,
            status= status.HTTP_400_BAD_REQUEST
        )



class AboutProfileAPIView(APIView):
    permission_classes = (IsAdminOrSessionOwner,)

    def get(self, request, slug=None, *args, **kwargs):
        try:
            if slug:
                profile = Profile.objects.get(slug=slug)
            else:
                profile = Profile.objects.get(user=request.user)
            
            serializer = ProfileSerializer(profile)
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

        try:
            profile = user.profile
        except Profile.DoesNotExist:
            return Response(
                {'message': "Profile doesn't exist!"},
                status=status.HTTP_404_NOT_FOUND
            )
        
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
            if user.user_type.name == "attendee":
                registered_session = RegisteredSession.objects.create(session=session, user=profile)
                session.attendees.add(profile)
            else:
                return Response(
                    {'message': f"You are already Registered as {user.user_type}"},
                    status=status.HTTP_200_OK
                )
        else:
            return Response(
                {'message': "The Session is already occupied!"},
                status=status.HTTP_400_BAD_REQUEST
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
