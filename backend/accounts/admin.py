from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin


admin.site.unregister(User)


@admin.action(description="Make selected users staff")
def make_staff(modeladmin, request, queryset):
    queryset.update(is_staff=True)


@admin.action(description="Remove staff role from selected users")
def remove_staff(modeladmin, request, queryset):
    queryset.update(is_staff=False)


@admin.action(description="Ban selected users")
def ban_users(modeladmin, request, queryset):
    queryset.update(is_active=False)


@admin.action(description="Unban selected users")
def unban_users(modeladmin, request, queryset):
    queryset.update(is_active=True)


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = (
        'id',
        'username',
        'email',
        'is_staff',
        'is_superuser',
        'is_active',
        'date_joined',
    )
    list_filter = (
        'is_staff',
        'is_superuser',
        'is_active',
        'date_joined',
    )
    search_fields = (
        'username',
        'email',
    )
    ordering = ('-date_joined',)
    actions = [make_staff, remove_staff, ban_users, unban_users]
