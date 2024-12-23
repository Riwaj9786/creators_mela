from django.contrib import admin

from events.models import Session, Hall, RegisteredSession


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ('session_name','start_time', 'end_time', 'hall')
    list_display_links = ('session_name','start_time', 'end_time', 'hall')
    list_filter = ('hall',)
    search_fields = ('session_name',)
    ordering = ('hall', 'start_time',)


@admin.register(Hall)
class HallAdmin(admin.ModelAdmin):
    list_display = ('hall_name',)                                                                     
    list_display_links = ('hall_name',)
    search_fields = ('hall_name',)
    ordering = ('hall_name',)


@admin.register(RegisteredSession)
class RegisteredSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'session', 'created_at')
    list_display_links = ('user', 'session', 'created_at')
    search_fields = ('user',)
    readonly_fields = ('user', 'session')