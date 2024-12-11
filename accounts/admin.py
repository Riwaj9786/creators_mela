from django.contrib import admin
from accounts.models import AppUser, Profile, SocialMediaLinks, UserType

# Register your models here.
@admin.register(AppUser)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'is_active', 'is_staff', 'is_superuser')
    list_display_links = ('email', 'name')
    list_filter = ('is_active', 'is_staff', 'is_superuser')
    search_fields = ('email', 'name')
    readonly_fields = ('email', 'name', 'last_login',)
    exclude = ('otp', 'otp_expiry', 'password')


class SocialMediaInline(admin.TabularInline):
    model = SocialMediaLinks
    extra = 1
    fields = ('platform', 'url')
    can_delete = False

    
# admin.site.register(Profile)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'user__name', 'gender', 'status')
    list_display_links = ('user', 'user__name', 'gender')
    list_filter = ('gender', 'status', 'user_type')
    list_editable = ('status',)
    exclude = ('slug',)
    readonly_fields = ('user', 'profile_picture', 'phone', 'age', 'province', 'district', 'municipality', 'gender', 'created_at')
    inlines = (SocialMediaInline,)


# admin.site.register(UserType)