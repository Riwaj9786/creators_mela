from django.contrib import admin

from events.models import Event, EventSpeakers, EventAttendees

# Register your models here.
class AttendeesInline(admin.TabularInline):
    model = EventAttendees
    extra = 1
    fields = ('attendee',)
    can_delete = False


class SpeakersInline(admin.TabularInline):
    model = EventSpeakers
    extra = 1
    fields = ('speaker',)
    can_delete = False


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'start_time', 'end_time', 'hall')
    list_display_links = ('name', 'start_time', 'end_time', 'hall')
    list_filter = ('hall',)
    search_fields = ('name',)
    ordering = ('hall', 'start_time')
    inlines = (SpeakersInline, AttendeesInline,)


# @admin.register(EventSpeakers)
# class EventSpeakersAdmin(admin.ModelAdmin):
#     list_display = ('event', 'speaker', 'event__start_time', 'event__end_time')
#     list_display_links = ('event', 'speaker')


# @admin.register(EventAttendees)
# class AttendeesAdmin(admin.ModelAdmin):
#     list_display = ('event', 'attendee')
#     list_display_links = ('event', 'attendee')