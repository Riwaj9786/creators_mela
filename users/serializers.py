from rest_framework import serializers

from accounts.models import Profile
from accounts.serializers import UserApplySerializer

from events.models import Event

from federal.serializers import ProvinceSerializer, DistrictBriefSerializer


class EventBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('name', 'date')



class AboutMeSerializers(serializers.ModelSerializer):
    user = UserApplySerializer(read_only=True)
    province = ProvinceSerializer(read_only=True)
    district = DistrictBriefSerializer(read_only=True)
    
    class Meta:
        model = Profile
        fields = ('user', 'user_type', 'bio', 'gender', 'age', 'district', 'province', 'heard_from', 'interest', 'slug')
        read_only_fields = ('user', 'user_type', 'bio', 'gender', 'age', 'district', 'province', 'heard_from', 'slug')