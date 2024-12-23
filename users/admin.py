from django.contrib import admin
from users import models

# Register your models here.
@admin.register(models.InvitedEmail)
class InvitedEmailAdmin(admin.ModelAdmin):
   list_display = ('email', 'user_type__name')
   list_display_links = ('email', 'user_type__name')
