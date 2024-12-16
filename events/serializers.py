from django.core.exceptions import ValidationError
from rest_framework import serializers

from events.models import Event, Hall, Session

from accounts.models import Profile, AppUser


class SpeakerNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ('name',)

class AttendeeProfilePicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('profile_picture',)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('user_type', 'user__name')


class SessionSerializer(serializers.ModelSerializer):
    # Many-to-many relationships need to be represented by their IDs
    moderator = serializers.PrimaryKeyRelatedField(
        queryset=Profile.objects.all(), many=True, required=False
    )
    speakers = serializers.PrimaryKeyRelatedField(
        queryset=Profile.objects.filter(user_type__name='Speaker', status='Accepted'),
        many=True,
        required=False
    )
    attendees = serializers.PrimaryKeyRelatedField(
        queryset=Profile.objects.filter(user_type__name='Guest', status='Accepted'),
        many=True,
        required=False
    )

    class Meta:
        model = Session
        fields = [
            'id', 'session_name', 'banner', 'description',
            'total_seats', 'start_time', 'end_time', 'hall',
            'moderator', 'speakers', 'attendees', 'slug'
        ]

    def create(self, validated_data):
        event = self.context.get('event')

        # Handle many-to-many fields separately
        moderator_data = validated_data.pop('moderator', [])
        speakers_data = validated_data.pop('speakers', [])
        attendees_data = validated_data.pop('attendees', [])

        # Create the session instance in memory but not in the databse yet
        session = Session(event=event, **validated_data)

        try:
            session.save()
            session.full_clean()
        except ValidationError as e:
            session.delete()
            raise serializers.ValidationError(e.message_dict)
        
        session.save()

        # Add many-to-many relationships
        session.moderator.set(moderator_data)
        session.speakers.set(speakers_data)
        session.attendees.set(attendees_data)

        return session
    
    def update(self, instance, validated_data):
        event = self.context.get('event')

        moderator_data = validated_data.pop('moderator', None)
        speakers_data = validated_data.pop('speakers', None)
        attendees_data = validated_data.pop('attendees', None)   
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Perform model-level validation before saving
        try:
            instance.full_clean() 
        except ValidationError as e:
            raise serializers.ValidationError(e.message_dict)

        # Save the updated instance
        instance.save()

        # Update many-to-many relationships if they were provided
        if moderator_data is not None:
            instance.moderator.set(moderator_data)
        if speakers_data is not None:
            instance.speakers.set(speakers_data)
        if attendees_data is not None:
            instance.attendees.set(attendees_data)

        return instance
    

class SessionListSerializer(serializers.ModelSerializer):
    speakers = SpeakerNameSerializer(read_only = True, many=True)
    attendees = AttendeeProfilePicSerializer(read_only=True, many=True)

    class Meta:
        model = Session
        fields = (
            'id', 'session_name',
            'start_time', 'end_time', 'hall',
            'speakers', 'attendees', 'slug'
        )

class HallSessionSerializer(serializers.ModelSerializer):
    session_in_hall = SessionListSerializer(read_only=True, many=True)
    class Meta:
        model = Hall
        fields = ('hall_name', 'session_in_hall')


class EventDetailSerializer(serializers.ModelSerializer):
    event_hall = HallSessionSerializer(read_only=True, many=True)
    class Meta:
        model = Event
        fields = ('name', 'date', 'slug', 'event_hall')



class OngoingSessionSerializer(serializers.ModelSerializer):
    speakers = SpeakerNameSerializer(read_only = True, many=True)
    attendees = AttendeeProfilePicSerializer(read_only=True, many=True)

    class Meta:
        model = Session
        fields = (
            'id', 'session_name', 'banner', 'description',
            'total_seats', 'start_time', 'end_time', 'hall',
            'speakers', 'attendees', 'slug'
        )


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = (
            'id', 'name', 'venue', 'place', 'date', 'slug'
        )
        read_only_fields = ('id', 'slug')
