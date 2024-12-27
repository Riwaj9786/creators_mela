from rest_framework import serializers

from accounts.models import AppUser, Profile, SocialMediaLinks, UserType, Platform

from federal.serializers import ProvinceNameSerializer, DistrictNameSerializer, MunicipalityNameSerializer

from django.contrib.auth import authenticate
from django.core.validators import validate_email 
from django.utils import timezone



# SERIALIZERS FOR USER MODEL
############################################

class UserNameUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ('name',)


class UserTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserType
        fields = ('name',)


class UserApplySerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ('email', 'name')


class UserSerializer(serializers.ModelSerializer):
    user_type = UserTypeSerializer(read_only=True)
    class Meta:
        model = AppUser
        fields = ('name', 'user_type')


class PlatformNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Platform
        fields = ('platform_name',)


class SocialMediaSerializer(serializers.ModelSerializer):
    platform = PlatformNameSerializer(read_only=True)
    class Meta:
        model = SocialMediaLinks
        fields = ('platform', 'url')


class ProfileListSerializer(serializers.ModelSerializer):
    user = UserApplySerializer(read_only=True)
    province = ProvinceNameSerializer()
    district = DistrictNameSerializer()
    municipality = MunicipalityNameSerializer()
    profile_social_media_links = SocialMediaSerializer(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = (
            'created_at',
            'user',
            'profile_social_media_links',
            'phone',
            'age',
            'gender',
            'municipality',
            'district',
            'province',
            'status',
            'slug'
        )


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    # province = ProvinceNameSerializer()
    # district = DistrictNameSerializer()
    # municipality = MunicipalityNameSerializer()
    profile_social_media_links = SocialMediaSerializer(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = (
            'user',
            'profile_picture',
            'bio',
            'date_of_birth',
            # 'age',
            'phone',
            'gender',
            'province',
            'district',
            'municipality',
            'profile_social_media_links',
            'interest',
            'heard_from'
        )

    def get_age(self, obj):
        if obj.date_of_birth:
            today = timezone.now().today()
            age = today.year - obj.date_of_birth.year - ((today.month, today.day) < (obj.date_of_birth.month, obj.date_of_birth.day))
            return age


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False)

    def validate(self, attrs):
        email = attrs.get('email').lower()
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError("Please give both email and password!")
        
        if not AppUser.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email doesn't Exist, Register yourself first to login!")
        
        user = authenticate(request=self.context.get('request'), email=email, password=password)

        if not user:
            raise serializers.ValidationError("Wrong Credentials!")
        
        attrs['user'] = user
        return attrs
    

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False, write_only=True)
    new_password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False, write_only=True)
    confirm_password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False, write_only=True)

    def validate_current_password(self, value):
        user = self.context['request'].user

        if not user.check_password(value):
            raise serializers.ValidationError("Current Password is Incorrect!")
        return value

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data
    

class InviteSerializer(serializers.Serializer):
    email = serializers.ListField(
        child = serializers.EmailField(),
        allow_empty = False
    )