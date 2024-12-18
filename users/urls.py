from django.urls import path
from users import views

urlpatterns = [
    path('guests/', views.GuestsListAPIView.as_view(), name='guest_list'),
    path('speakers/', views.SpeakerListAPIView.as_view(), name='speaker_list'),
    path('speakers/invite/', views.SpeakerInviteAPIView.as_view(), name='invite_speaker'),
    
    path('team/', views.TeamListAPIView.as_view(), name='team-list'),

    path('about/', views.AboutProfileAPIView.as_view(), name='user_profile'),
    path('about/<slug:slug>/', views.AboutProfileAPIView.as_view(), name='user_profile'),
    # path('about/<slug:slug>/events/', views.UserRegisteredEventsAPIView.as_view(), name='registered_events'),

    path('register/session/<slug:slug>/', views.RegisterSessionAPIView.as_view(), name='register_session'),
    path('<slug:slug>/registered_events/', views.UserRegisteredEventAPIView.as_view(), name='user_registered_sessions'),
    path('<slug:slug>/registered_events/<pk>/', views.RegisteredUserDestroyAPIVIew.as_view(), name='delete_registered_user_from_session'),
]