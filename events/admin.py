from django.contrib import admin

from accounts.models import Profile
from events.models import (
   Hall,
   Session,
)

@admin.register(Hall)
class HallAdmin(admin.ModelAdmin):
   list_display = ('hall_name', 'venue')
   list_display_links = ('hall_name', 'venue')
   search_fields = ('hall_name', 'venue')
   list_filter = ('venue',)
   ordering = ('hall_name',)


class ModeratorInline(admin.TabularInline):
   model = Session.moderator.through
   extra = 1
   verbose_name = "Moderator"
   verbose_name_plural = "Moderators"
   readonly_fields = ('name', 'email')

   def name(self, obj):
      return obj.profile.user.name if obj.profile and obj.profile.user else "-"

   def email(self, obj):
      return obj.profile.user.email if obj.profile and obj.profile.user else "-"
   

class PerformerInline(admin.TabularInline):
   model = Session.performers.through
   extra = 1
   verbose_name = "Performer"
   verbose_name_plural = "Performers"
   readonly_fields = ('name', 'email')

   def name(self, obj):
      return obj.profile.user.name if obj.profile and obj.profile.user else "-"

   def email(self, obj):
      return obj.profile.user.email if obj.profile and obj.profile.user else "-"
   
   def formfield_for_foreignkey(self, db_field, request=None, **kwargs):
      if db_field.name == "profile":
         kwargs["queryset"] = Profile.objects.filter(
               user__user_type__name="performer", status="Accepted"
         )
      return super().formfield_for_foreignkey(db_field, request, **kwargs)
   


class AttendeeInline(admin.TabularInline):
   model = Session.attendees.through
   extra = 1
   verbose_name = "Attendee"
   verbose_name_plural = "Attendees"
   readonly_fields = ('name', 'email')

   def name(self, obj):
      return obj.profile.user.name if obj.profile and obj.profile.user else "-"

   def email(self, obj):
      return obj.profile.user.email if obj.profile and obj.profile.user else "-"
   
   def formfield_for_foreignkey(self, db_field, request=None, **kwargs):
      if db_field.name == "profile":
         kwargs["queryset"] = Profile.objects.filter(
               user__user_type__name="attendee", status="Accepted"
         )
      return super().formfield_for_foreignkey(db_field, request, **kwargs)


class SpeakerInline(admin.TabularInline):
   model = Session.speakers.through
   extra = 1
   verbose_name = "Speaker"
   verbose_name_plural = "Speakers"
   readonly_fields = ('name', 'email')

   def name(self, obj):
      return obj.profile.user.name if obj.profile and obj.profile.user else "-"

   def email(self, obj):
      return obj.profile.user.email if obj.profile and obj.profile.user else "-"
   
   def formfield_for_foreignkey(self, db_field, request=None, **kwargs):
      if db_field.name == "profile":
         kwargs["queryset"] = Profile.objects.filter(
               user__user_type__name="speaker", status="Accepted"
         )
      return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
   list_display = ('session_name', 'date', 'start_time', 'end_time', 'hall')
   list_display_links = ('session_name', 'date', 'start_time', 'end_time', 'hall')
   list_filter = ('date', 'hall')
   search_fields = ('session_name',)
   ordering = ('date', 'hall__hall_name', 'start_time')
   readonly_fields = ('slug',)
   exclude = ('speakers', 'performers', 'moderator')
   inlines = (SpeakerInline, PerformerInline, ModeratorInline, AttendeeInline)