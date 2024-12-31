from django.urls import path

from events import views

urlpatterns = [
    path('schedule/', views.SessionsScheduleAPIView.as_view(), name='date_wise'),
    path('calendar/', views.CalendarDetailAPIView.as_view(), name='calendar_view'),
    path('session/update/<slug:slug>/', views.SessionRetrieveUpdateDestroyAPIView.as_view(), name="session_retrieve_update_delete"),

    path('session/dates/', views.SessionDateListAPIView.as_view(), name='session_dates'),

    path('session/create/', views.SessionCreateAPIView.as_view(), name='session_create'),

    path('session/ongoing/', views.OngoingSessionListAPIView.as_view(), name='ongoing_sessions'),
]