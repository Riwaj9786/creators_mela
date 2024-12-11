from rest_framework import serializers

from events.models import Event, EventSpeakers, EventAttendees

from accounts.models import Profile, AppUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ('name',)


class ProfileAbstractSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Profile
        fields = ('user', 'profile_picture')


class SpeakerSerializer(serializers.ModelSerializer):
    speaker = ProfileAbstractSerializer(read_only=True)
    class Meta:
        model = EventSpeakers
        fields = ('speaker',)


class AttendeeSerializer(serializers.ModelSerializer):
    # attendee_event = EventDetailSerializer(read_only=True)
    attendee = ProfileAbstractSerializer(read_only=True)
    class Meta:
        model = EventAttendees
        fields = ('attendee',)



class EventDetailSerializer(serializers.ModelSerializer):
    speakers = SpeakerSerializer(read_only=True, many=True)
    attendee_event = AttendeeSerializer(read_only=True, many=True)
    class Meta:
        model = Event
        fields = (
            'id',
            'name',
            'venue',
            'place',
            'date',
            'start_time',
            'end_time',
            'hall',
            'speakers',
            'attendee_event',
        )
        ordering = ('hall', 'start_time')