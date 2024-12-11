from rest_framework import serializers

from accounts.models import Profile
from accounts.serializers import UserApplySerializer

from users.models import Interest

from events.models import EventAttendees, Event

from federal.serializers import ProvinceSerializer, DistrictBriefSerializer


class EventBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('name', 'date')


class UserEventsSerializer(serializers.ModelSerializer):
    event = EventBriefSerializer(read_only=True)
    class Meta:
        model = EventAttendees
        fields = ('event',)


class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = ('interest_name',)


class AboutMeSerializers(serializers.ModelSerializer):
    user = UserApplySerializer(read_only=True)
    profile_interests = InterestSerializer(many=True, read_only=True)
    province = ProvinceSerializer(read_only=True)
    district = DistrictBriefSerializer(read_only=True)
    
    class Meta:
        model = Profile
        fields = ('user', 'user_type', 'bio', 'gender', 'age', 'district', 'province', 'heard_from', 'profile_interests', 'slug')
        read_only_fields = ('user', 'user_type', 'bio', 'gender', 'age', 'district', 'province', 'heard_from', 'slug')