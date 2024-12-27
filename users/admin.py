from django.contrib import admin
from users import models

# Register your models here.
@admin.register(models.InvitedEmail)
class InvitedEmailAdmin(admin.ModelAdmin):
   list_display = ('email', 'user_type__name', 'session__session_name')
   list_display_links = ('email', 'user_type__name', 'session__session_name')


@admin.register(models.RegisteredSession)
class RegisteredSessionAdmin(admin.ModelAdmin):
   list_display = ('user', 'session',)
   list_display_links = ('user', 'session')
   list_filter = ('session',)
   readonly_fields = ('user', 'session', 'created_at',)
