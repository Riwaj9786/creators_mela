from django.core.exceptions import ValidationError
from rest_framework import serializers

from events.models import Hall, Session

from accounts.models import Profile, AppUser


class SessionDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ('date',)


class HallNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall
        fields = ('hall_name',)


# 1. Schedule Serializer for Not Authenticated Users
class SpeakerNameSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source = 'user.name')
    class Meta:
        model = Profile
        fields = ('name',)


class SessionUnAuthenticatedUserSerializer(serializers.ModelSerializer):
    speakers = SpeakerNameSerializer(read_only=True, many=True)
    
    class Meta:
        model = Session
        fields = ('session_name', 'start_time', 'end_time', 'speakers')



# 2. Schedule Serializer for Authenticated Users
class SpeakerNameProfilePicSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source = 'user.name')
    class Meta:
        model = Profile
        fields = ('name', 'profile_picture',)


class SessionAuthenticatedUserSerializer(serializers.ModelSerializer):
    speakers = SpeakerNameProfilePicSerializer(read_only=True, many=True)
    class Meta:
        model = Session
        fields = ('session_name', 'start_time', 'end_time', 'speakers', 'slug')



class SessionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Session
        fields = [
            'id', 'session_name', 'banner', 'description', 'date',
            'total_seats', 'start_time', 'end_time', 'hall',
            'moderator', 'speakers', 'performers', 'attendees'
        ]

    def create(self, validated_data):
        # Handle many-to-many fields separately
        moderator_data = validated_data.pop('moderator', [])
        speakers_data = validated_data.pop('speakers', [])
        performers_data = validated_data.pop('performers', [])
        attendees_data = validated_data.pop('attendees', [])

        # Create the session instance in memory but not in the databse yet
        session = Session(**validated_data) #type: ignore

        try:
            session.save()
            session.clean()
        except ValidationError as e:
            raise serializers.ValidationError(e.message)
        
        session.save()

        # Add many-to-many relationships
        session.moderator.set(moderator_data)
        session.speakers.set(speakers_data)
        session.performers.set(performers_data)
        session.attendees.set(attendees_data)

        return session


class SessionListSerializer(serializers.ModelSerializer):
    speakers = serializers.SerializerMethodField()
    performers = serializers.SerializerMethodField()
    moderator = serializers.SerializerMethodField()
    attendees = serializers.SerializerMethodField()

    hall = HallNameSerializer(read_only=True)

    class Meta:
        model = Session
        fields = (
            'id', 'session_name', 'banner', 'description',
            'date', 'start_time', 'end_time', 'hall',
            'total_seats',
            'moderator', 
            'speakers', 
            'performers',
            'attendees'
        )
    
    def get_speakers(self, obj):
        return SpeakerNameProfilePicSerializer(obj.speakers, many=True).data
    
    def get_performers(self, obj):
        return SpeakerNameProfilePicSerializer(obj.performers, many=True).data
    
    def get_moderator(self, obj):
        return SpeakerNameProfilePicSerializer(obj.moderator, many=True).data
    
    def get_attendees(self, obj):
        return SpeakerNameProfilePicSerializer(obj.attendees, many=True).data


class HallSessionSerializer(serializers.ModelSerializer):
    hall = SessionListSerializer(read_only=True, many=True)
    class Meta:
        model = Hall
        fields = ('hall_name', 'hall')




class OngoingSessionSerializer(serializers.ModelSerializer):
    speakers = SpeakerNameProfilePicSerializer(read_only = True, many=True)

    class Meta:
        model = Session
        fields = (
            'id', 'session_name',
            'total_seats', 'start_time', 'end_time', 'hall',
            'speakers', 'slug'
        )
        read_only_fields = ('slug',)
