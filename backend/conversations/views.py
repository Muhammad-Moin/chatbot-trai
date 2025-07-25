from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Conversation, Message
from .serializers import ConversationSerializer, CreateConversationSerializer


class ConversationListView(generics.ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user).order_by("-updated_at")


class MarkAsReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, conversation_id):
        Message.objects.filter(conversation_id=conversation_id, receiver=request.user, is_read=False).update(is_read=True)
        return Response({"status": "messages marked as read"})

class CreateConversationView(generics.CreateAPIView):
    serializer_class = CreateConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

