from datetime import timedelta
import random

from creators_mela.base_permissions import IsOwner

from accounts.models import (
    AppUser,
    Profile,
    SocialMediaLinks,
)

from accounts.serializers import (
    ProfileListSerializer,
    UserApplySerializer,
    UserNameUpdateSerializer,
    ProfileSerializer,
    LoginSerializer,
    SocialMediaSerializer,
    ChangePasswordSerializer
)

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.filters import SearchFilter

from django_filters.rest_framework import DjangoFilterBackend

from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import login
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.utils import timezone
from django.urls import reverse

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from knox import views as knox_views

# Create your views here.
class UserUpdateAPIView(APIView):
    permission_classes = (IsOwner,)

    @swagger_auto_schema(
        operation_description="This endpoint updates the User Profile and can only be accessed if and only if the request user tries to access their own object.",
        responses={
            200: openapi.Response('Success!'),
            400: 'Bad Request',
            401: "Unauthorized: You must be authenticated to access the endpoint.",
            403: "Forbidden: You must be an OWNER User to access."
        }
    )

    def patch(self, request, *args, **kwargs):
        user = request.user
        serializer = UserNameUpdateSerializer(user, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    'message': 'User Updated Successfully!',
                    'data': serializer.data
                },
                status=status.HTTP_200_OK
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class UserApplyCreateAPIView(APIView):

    @swagger_auto_schema(
        operation_description="This endpoint creates post request for new users to apply. This endpoint is accessible to all the Users!",
        responses={
            200: openapi.Response('Success! Your default password is \'password123\''),
            400: 'Bad Request',
        }
    )

    def post(self, request, *args, **kwargs):
        
        serializer = UserApplySerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            name = serializer.validated_data.get('name')

            if AppUser.objects.filter(email=email).exists():
                return Response(
                    {'message': 'User with Email already exists!'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                user = AppUser.objects.create_user(
                    email = email,
                    name = name,
                    password = "password123",
                    is_active = True
                )

                return Response(
                    {
                        'message': f'User Created Successfully! The default password is password123',
                        'data': serializer.data
                    },
                    status=status.HTTP_201_CREATED
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        


class ProfileListAPIView(APIView):
    permission_classes = (IsOwner,)

    @swagger_auto_schema(
        operation_description="This endpoint provides the User Profile and can only be accessed if and only if the request user tries to access their own object.",
        responses={
            200: openapi.Response('Success!'),
            400: 'Bad Request',
            401: "Unauthorized: You must be authenticated to access the endpoint.",
            403: "Forbidden: You must be an OWNER User to access."
        }
    )


    def get(self, request, *args, **kwargs):
        user = request.user
        
        try:
            profile = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            return Response(
                {
                    'message': "Profile doesn't exist!"
                }, status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProfileUpdateAPIView(generics.UpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(
        operation_description="This endpoint updates the User Profile and can only be accessed if and only if the request user tries to access their own object.",
        responses={
            200: openapi.Response('Success!'),
            400: 'Bad Request',
            401: "Unauthorized: You must be authenticated to access the endpoint.",
            403: "Forbidden: You must be an OWNER User to access."
        }
    )


    def patch(self, request, *args, **kwargs):
        profile = get_object_or_404(Profile, user=request.user)

        serializer = self.get_serializer(profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()  

            return Response(
                {
                    'message': 'Profile Updated Successfully!',
                    'data': serializer.data
                },
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(knox_views.LoginView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            login(request, user)
            response = super().post(request, format=None)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(response.data, status=status.HTTP_200_OK)


class SocialMediaLinkAPIView(APIView):
    def get(self, request, *args, **kwargs):
        profile = get_object_or_404(Profile, user=request.user)
        social_media = SocialMediaLinks.objects.filter(profile=profile)

        serializer = SocialMediaSerializer(social_media, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        

    def post(self, request, *args, **kwargs):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = SocialMediaSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(profile=profile)
            return Response(
                {
                    'message': 'Social Media Link added successfully!',
                    'data': serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class ResetPasswordRequestAPIView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')

        try:
            user = AppUser.objects.get(email=email)

            otp = random.randint(100000, 999999)
            user.otp = otp       
            user.otp_expiry = timezone.now() + timedelta(minutes=5)
            user.save()

            reset_url = reverse('accounts:validate_otp')

            return Response(
                {
                    'message': f'Your OTP is {user.otp}. This One Time password is valid until {user.otp_expiry}!',
                    'reset_link': reset_url
                },
                status= status.HTTP_200_OK
            )
        
        except AppUser.DoesNotExist:
            return Response(
                {'message': 'User with the provided mail doesn\'t exist'},
                status=status.HTTP_400_BAD_REQUEST
            )


class ValidateOTPView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        try:
            user = AppUser.objects.get(email=email)

            if user.otp is None and user.otp_expiry is None:
                return Response(
                    {'message': 'No OTP is generated or OTP has expired!'},
                    status = status.HTTP_400_BAD_REQUEST
                )
            
            if timezone.now() > user.otp_expiry:
                user.otp = None
                user.otp_expiry = None
                user.save()
                return Response(
                    {'message': 'OTP has expired!'},
                    status= status.HTTP_400_BAD_REQUEST
                )
            
            if str(user.otp) == str(otp):
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                token = default_token_generator.make_token(user)
                reset_url = f"{request.scheme}://{request.get_host()}/api/v1/accounts/reset/{uid}/{token}/"
                
                return Response(
                    {
                        'message': 'OTP is valid. Please use the reset URL to change your password.',
                        'reset_url': reset_url
                    },
                    status=status.HTTP_200_OK
                )
            else:
                return Response({'message': 'OTP is not correct.'}, status=status.HTTP_400_BAD_REQUEST)
        
        except AppUser.DoesNotExist:
            return Response({'message': 'No OTP found!'}, status=status.HTTP_400_BAD_REQUEST) 


class ResetPasswordView(APIView):
    def post(self, request, uid, token):
        
        pk = urlsafe_base64_decode(uid).decode()
        try:
            user = AppUser.objects.get(pk=pk)

            if not default_token_generator.check_token(user, token):
                return Response(
                    {
                        'message': 'Token is invalid or Expired!'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                new_password = request.data.get('new_password')
                confirm_password = request.data.get('confirm_password')

                if new_password != confirm_password:
                    return Response(
                        {'message': 'Passwords don\'t match!'},
                        status= status.HTTP_400_BAD_REQUEST
                    )
                
                user.set_password(new_password)
                user.otp = None
                user.otp_expiry = None
                user.save()

                return Response(
                    {'message': 'Your Password has been reset successfully!'},
                    status= status.HTTP_200_OK
                )
        
        except ObjectDoesNotExist:
            return Response(
                {'message': 'User does not exist'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        except Exception as e:
            return Response(
                {'message': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class ChangePasswordAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def patch(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})

        if serializer.is_valid(raise_exception=True):
            user = request.user
            new_password = serializer.validated_data['new_password']

            user.set_password(new_password)
            user.save()

            return Response(
                {'message': "Password Changed Successfully!"},
                status = status.HTTP_200_OK
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileApproveAPIView(APIView):
    permission_classes = (IsAdminUser,)

    def patch(self, request, slug, *args, **kwargs):
        try:
            profile = Profile.objects.get(slug=slug)
        except Profile.DoesNotExist:
            return Response(
                {'message': "Profile Doesn't Exist!"},
                status=status.HTTP_404_NOT_FOUND
            )

        profile.status = "Accepted"
        profile.save()
        serializer = ProfileSerializer(profile)

        return Response(
            {
                'message': "Profile Status Changed to Accepted!",
                'data': serializer.data    
            },
            status=status.HTTP_200_OK
        )
    
    
class ProfileRejectAPIView(APIView):
    permission_classes = (IsAdminUser,)

    def patch(self, request, slug, *args, **kwargs):
        try:
            profile = Profile.objects.get(slug=slug)
        except Profile.DoesNotExist:
            return Response(
                {'message': "Profile Doesn't Exist!"},
                status=status.HTTP_404_NOT_FOUND
            )

        profile.status = "Rejected"
        profile.save()
        serializer = ProfileSerializer(profile)

        return Response(
            {
                'message': "Profile Status Changed to Rejected!",
                'data': serializer.data    
            },
            status=status.HTTP_200_OK
        )

class ProfileAllAPIView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileListSerializer
    permission_classes = (IsAdminUser,)
    filter_backends = (SearchFilter, DjangoFilterBackend,)
    search_list = ('profile__user__name',)
    filterset_fields = ('gender', 'status')


    @swagger_auto_schema(
        operation_description="This endpoint lists all the User Profile and can only be accessed by the ADMIN user.",
        responses={
            200: openapi.Response('Success!'),
            400: 'Bad Request',
            401: "Unauthorized: You must be authenticated to access the endpoint.",
            403: "Forbidden: You must be an ADMIN User to access."
        }
    )

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)