from django.urls import path
from users import views

app_name = 'users'

urlpatterns = [
   
    # Fetch the data of Speakers and Performers Profile Picture data for Unauthenticated Users
    path('speakers/', views.AnonymousUserSpeakerAPIView.as_view(), name='speaker_list'),
    path('performers/', views.AnonymousUserPerformerAPIView.as_view(), name='performer_list'),

    # Invite New Users to a Session for Creators' Mela
    path('session/<str:session_slug>/<str:user_type>/invite/', views.UserInviteAPIView.as_view(), name='invite_user'),
    
    # Generated Link to create Invited Users
    path('session/<str:session_slug>/<str:user_type>/invited/create/', views.UserApplyCreateAPIView.as_view(), name='user_apply'),
    
    # Admin Authenticated List of Guests and other User Types
    path('attendee/list/', views.AdminAttendeeListAPIView.as_view(), name='attendee-list'),
    path('<str:user_type>/list/', views.AdminListAPIView.as_view(), name='team-list'),

    # About View for an Authenticated User
    path('about/', views.AboutProfileAPIView.as_view(), name='user_profile'),
    path('about/<slug:slug>/', views.AboutProfileAPIView.as_view(), name='user_profile_slug'),

    # Views for registering for a Session and showing the registered sessions for a User
    path('register/session/<slug:slug>/', views.RegisterSessionAPIView.as_view(), name='register_session'),
    path('<slug:slug>/registered_events/', views.UserRegisteredEventAPIView.as_view(), name='user_registered_sessions'),
    path('<slug:slug>/registered_events/<pk>/', views.RegisteredUserDestroyAPIVIew.as_view(), name='delete_registered_user_from_session'),
]