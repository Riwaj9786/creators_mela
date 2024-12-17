from django.urls import path
from analytics import views

urlpatterns = [
    path('accounts/', views.ProfileAndRegistrationCountView.as_view(), name='accounts_analytics'),
    path('gender/', views.GenderCountAPIView.as_view(), name='gender_analytics'),
    path('province/', views.ProvinceAnalyticsAPIView.as_view(), name='province_users'),
    path('age/', views.UserAgeAnalyticsAPIView.as_view(), name='age_analytics'),
]