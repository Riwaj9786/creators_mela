from django.urls import path
from federal import views

urlpatterns = [
    path('province/', views.ProvinceListAPIView.as_view(), name='province_list'),
    path('district/', views.DistrictListAPIView.as_view(), name='district_list'),
    path('municipality/', views.MunicipalityListAPIView.as_view(), name='municipality_list'),  
]