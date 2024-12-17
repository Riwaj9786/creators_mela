from rest_framework import serializers

from accounts.models import AppUser, Profile, SocialMediaLinks

from django.contrib.auth import authenticate
from django.core.validators import validate_email 

from federal.models import Province, District, Municipality

class UserNameUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ('name',)


class UserApplySerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ('email', 'name')


class SocialMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialMediaLinks
        fields = ('platform', 'url')


class ProfileListSerializer(serializers.ModelSerializer):
    user = UserApplySerializer(read_only=True)
    class Meta:
        model = Profile
        fields = ('user', 'age', 'gender', 'status',)


class ProfileSerializer(serializers.ModelSerializer):
    user = UserApplySerializer(read_only=True)
    province = serializers.PrimaryKeyRelatedField(
        queryset = Province.objects.all(),
        required = False
    )
    district = serializers.PrimaryKeyRelatedField(
        queryset = District.objects.all(),
        required=False
    )
    municipality = serializers.PrimaryKeyRelatedField(
        queryset = Municipality.objects.all(),
        required = False
    )
    profile_social_media_links = SocialMediaSerializer(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = (
            'user',
            'profile_picture',
            'phone',
            'date_of_birth',
            'gender',
            'province',
            'district',
            'municipality',
            'status',
            'profile_social_media_links',
            'slug',
        )


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