from django.urls import path

from contact import views 

urlpatterns = [
    path('message/create/', views.ContactCreateAPIView.as_view(), name='contact_create'),
    path('message/list/', views.ContactListAPIView.as_view(), name='message'),
    path('message/delete/<pk>/', views.ContactDeleteAPIView.as_view(), name='message_delete'),
]