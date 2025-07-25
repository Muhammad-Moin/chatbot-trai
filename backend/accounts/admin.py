from django.contrib import admin
from accounts.models import User
from django.contrib import admin
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from rest_framework_simplejwt.token_blacklist.admin import OutstandingTokenAdmin


# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "username",
        "email",
    )
    search_fields = ("username",)  # Make sure to pass search fields as a tuple

    search_fields = ("email", "username")

    fieldsets = (
        (
            "User Information",
            {  # Added a comma here
                "fields": (
                    "username",
                    "email",
                    "password",
                )  # Added a comma here
            },
        ),
        (
            "Permissions",
            {  # Added a comma here
                "fields": (
                    # "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Important dates",
            {  # Added a comma here
                "fields": ("last_login", "date_joined"),
                "classes": ("collapse",),
            },
        ),
    )
    readonly_fields = ("last_login", "date_joined")


class CustomTokenBlacklistAdmin(OutstandingTokenAdmin):
    list_display = (
        "jti",
        "user",
        "created_at",
        "expires_at",
    )
    search_fields = (
        "user__id",
        "jti",
    )
    ordering = ("user",)
    actions = ["delete_selected"]  # Add this line

    def delete_selected(self, request, queryset):
        for token in queryset:
            token.delete()

    delete_selected.short_description = "Delete selected tokens"


admin.site.unregister(OutstandingToken)
admin.site.register(OutstandingToken, CustomTokenBlacklistAdmin)

admin.site.register(User, UserAdmin)
