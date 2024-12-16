from django.urls import path
from accounts import views
from knox.views import LogoutView, LogoutAllView


app_name = 'accounts'

urlpatterns = [
    path('login/', views.LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('logout_all/', LogoutAllView.as_view(), name='logout-all'),

    path('user/apply/', views.UserApplyCreateAPIView.as_view(), name='user_apply'),
    path('user/update/', views.UserUpdateAPIView.as_view(), name='update_user'),

    path('profile/', views.ProfileListAPIView.as_view(), name='get_profile'),
    path('profile/edit/', views.ProfileUpdateAPIView.as_view(), name='edit_profile'),
    path('profile/all/', views.ProfileAllAPIView.as_view(), name='profile_all'),
    path('profile/<slug:slug>/approve/', views.ProfileApproveAPIView.as_view(), name="approve_profile"),
    path('profile/<slug:slug>/reject/', views.ProfileRejectAPIView.as_view(), name="reject_profile"),

    path('media_links/', views.SocialMediaLinkAPIView.as_view(), name='media_links'),

    path('change_password/', views.ChangePasswordAPIView.as_view(), name='change-password'),
    path('forgot_password/', views.ResetPasswordRequestAPIView.as_view(), name='forget-password'),
    path('forgot_password/validate_otp/', views.ValidateOTPView.as_view(), name='validate_otp'),
    path('reset/<str:uid>/<str:token>/', views.ResetPasswordView.as_view(), name='reset-password'),
]