from django.urls import path
from .views import ConversationListView, MarkAsReadView, CreateConversationView

urlpatterns = [
    path("conversations/", ConversationListView.as_view(), name="conversation-list"),
    path("conversations/create/", CreateConversationView.as_view(), name="conversation-create"),
    path("conversations/<int:conversation_id>/read/", MarkAsReadView.as_view(), name="mark-as-read"),
]
