from django.contrib import admin
from conversations.models import Conversation, Message


# Register your models here.
class ConversationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "participants",
        
    )

class MessagesAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "sender",
        "receiver",
        "is_read"
    )


admin.site.register(Message, MessagesAdmin)
admin.site.register(Conversation, ConversationAdmin)
