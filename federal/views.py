from rest_framework import generics
from federal.models import Province, District, Municipality
from federal.serializers import ProvinceSerializer, DistrictSerializer, MunicipalitySerializer
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

# Create your views here.
class ProvinceListAPIView(generics.ListAPIView):
    queryset = Province.objects.all()
    # queryset = Province.objects.prefetch_related('district_in_province__municipality_in_district')
    serializer_class = ProvinceSerializer
    permission_classes = (AllowAny,)
    filter_backends = (SearchFilter,)
    search_fields = ('name',)
    pagination_class = None


class DistrictListAPIView(generics.ListAPIView):
    # queryset = District.objects.all()
    queryset = District.objects.select_related('province').prefetch_related('municipality_in_district')
    serializer_class = DistrictSerializer
    permission_classes = (AllowAny,)
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filterset_fields = ('province__name',)
    search_fields = ('name',)
    pagination_class = None


class MunicipalityListAPIView(generics.ListAPIView):
    queryset = Municipality.objects.prefetch_related('district__province')
    # queryset = Municipality.objects.all()
    serializer_class = MunicipalitySerializer
    permission_classes = (AllowAny,)
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filterset_fields = ('district__name', 'district__province__name')
    search_fields = ('name',)
    pagination_class = None
