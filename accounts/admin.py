from django.contrib import admin
from django.http import HttpRequest
from accounts.models import AppUser, Profile, SocialMediaLinks, UserType, Platform

# Register your models here.
@admin.register(AppUser)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'user_type', 'is_active', 'is_staff', 'is_superuser')
    list_display_links = ('email', 'name', 'user_type')
    list_filter = ('user_type', 'is_active', 'is_staff', 'is_superuser')
    search_fields = ('email', 'name')
    readonly_fields = ('email', 'name', 'last_login',)
    exclude = ('otp', 'otp_expiry', 'password')


class SocialMediaInline(admin.TabularInline):
    model = SocialMediaLinks
    extra = 1
    fields = ('platform', 'url')
    can_delete = False


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'user__name', 'gender', 'status')
    list_display_links = ('user', 'user__name', 'gender')
    list_filter = ('gender', 'status', 'user__user_type')
    list_editable = ('status',)
    readonly_fields = ('user', 'profile_picture', 'phone', 'date_of_birth', 'bio', 'province', 'district', 'municipality', 'gender', 'interest', 'slug', 'created_at', 'heard_from')
    inlines = (SocialMediaInline,)

    # def has_delete_permission(self, request, obj=None):
    #     return False

    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions


@admin.register(UserType)
class UserTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    list_display_links = ('name', 'description')


admin.site.register(SocialMediaLinks)
admin.site.register(Platform)