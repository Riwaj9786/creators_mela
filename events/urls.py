from django.urls import path

from events import views

urlpatterns = [
    path('<slug:slug>/', views.EventDetailListAPIView.as_view(), name='event_detail'),

    path('<slug:slug>/session/',views.SessionInEventAPIView.as_view(), name='session_in_event_list'),
    path('<slug:slug>/session/create/', views.SessionCreateAPIView.as_view(), name='session_create'),
    path('session/ongoing/', views.OngoingSessionListAPIView.as_view(), name='ongoing_session'),
    path('session/<slug:slug>/', views.SessionRetrieveUpdateDestroyAPIView.as_view(), name='session_update'),

    path('list/', views.EventListAPIView.as_view(), name='events_list'),
    path('create/', views.EventCreateAPIView.as_view(), name='event_create'),
    path('<pk>/', views.EventRetrieveUpdateDestroyAPIView.as_view(), name='event_retrieve_update_destroy'),
] 