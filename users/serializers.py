from rest_framework import serializers

from accounts.models import Profile
from accounts.serializers import UserApplySerializer

from events.models import RegisteredSession

from federal.serializers import ProvinceSerializer, DistrictBriefSerializer


class RegisteredSessionSerializer(serializers.ModelSerializer):
    session_date = serializers.DateTimeField(source='session.session_date', read_only=True)
    session_name = serializers.CharField(source='session.session_name', read_only=True)
    registered_date = serializers.DateTimeField(read_only=True)

    class Meta:
        model = RegisteredSession
        fields = ('session_name', 'session_date', 'registered_date')



class AboutMeSerializers(serializers.ModelSerializer):
    user = UserApplySerializer(read_only=True)
    province = ProvinceSerializer(read_only=True)
    district = DistrictBriefSerializer(read_only=True)
    
    class Meta:
        model = Profile
        fields = ('user', 'user_type', 'bio', 'gender', 'age', 'district', 'province', 'heard_from', 'interest', 'slug')
        read_only_fields = ('user', 'user_type', 'bio', 'gender', 'age', 'district', 'province', 'heard_from', 'slug')