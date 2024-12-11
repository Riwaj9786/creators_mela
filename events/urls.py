from django.urls import path

from events import views

urlpatterns = [
    path('list/', views.EventListAPIView.as_view(), name='event_list'),
    path('attendees/', views.EventAttendeesAPIView.as_view(), name='event_attendees'),

    path('ongoing/', views.OngoingSessionAPIView.as_view(), name='ongoing_events'),

    path('create/', views.EventCreateAPIView.as_view(), name='create_event'),
    path('edit/<pk>/', views.EventUpdateAPIView.as_view(), name='update_event'),
]