from rest_framework import serializers
from federal.models import Province, District, Municipality

class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = ('id', 'name', 'code',)


class DistrictSerializer(serializers.ModelSerializer):
    province = ProvinceSerializer(read_only=True)
    class Meta:
        model = District
        fields = ('id', 'name', 'code', 'province', 'order')


class DistrictBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ('id', 'name',)


class MunicipalitySerializer(serializers.ModelSerializer):
    district = DistrictSerializer(read_only=True)
    class Meta:
        model = Municipality
        fields = ('id', 'name', 'code', 'district', 'type', 'order')


class MunicipalityBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Municipality
        fields = ('id', 'name', 'type')
        