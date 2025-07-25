from rest_framework import serializers
from .models import Conversation
from django.contrib.auth import get_user_model
from .models import Conversation

User = get_user_model()


class ConversationSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ["id", "participants", "updated_at", "last_message", "unread_count"]

    def get_last_message(self, obj):
        msg = obj.last_message()
        return {"text": msg.text, "created_at": msg.created_at} if msg else None

    def get_unread_count(self, obj):
        user = self.context["request"].user
        return obj.messages.filter(is_read=False, receiver=user).count()



class CreateConversationSerializer(serializers.ModelSerializer):
    participants = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all()
    )

    class Meta:
        model = Conversation
        fields = ["id", "participants"]

    def create(self, validated_data):
        participants = validated_data.pop("participants")
        request_user = self.context["request"].user
        
        # Ensure current user is in the conversation
        if request_user not in participants:
            participants = list(participants) + [request_user]

        # Check if conversation already exists with same participants
        existing = Conversation.objects.filter(participants=request_user)
        for user in participants:
            existing = existing.filter(participants=user)
        existing = existing.distinct()

        if existing.exists():
            return existing.first()
        
        # Otherwise, create new
        conversation = Conversation.objects.create()
        conversation.participants.set(participants)
        return conversation