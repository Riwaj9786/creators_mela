from django.contrib import admin

from events.models import Event, Session, Hall, RegisteredSession

# Register your models here.
@admin.register(Event)
class EventAdmin(admin.ModelAdmin): 
    list_display = ('name', 'venue', 'date')
    list_display_links = ('name', 'venue', 'date')
    search_fields = ('name', 'venue')


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ('session_name', 'event__name', 'start_time', 'end_time', 'hall')
    list_display_links = ('session_name', 'event__name', 'start_time', 'end_time', 'hall')
    list_filter = ('hall',)
    search_fields = ('session_name',)
    ordering = ('event__name', 'hall', 'start_time',)


@admin.register(Hall)
class HallAdmin(admin.ModelAdmin):
    list_display = ('hall_name', 'event__name')                                                                     
    list_display_links = ('hall_name', 'event__name')
    search_fields = ('hall_name', 'event__name')
    ordering = ('event__name', 'hall_name',)


@admin.register(RegisteredSession)
class RegisteredSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'session', 'created_at')
    list_display_links = ('user', 'session', 'created_at')
    search_fields = ('user',)
    readonly_fields = ('user', 'session')