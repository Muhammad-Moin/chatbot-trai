# import json
# from channels.generic.websocket import AsyncWebsocketConsumer
# from channels.db import database_sync_to_async
# from .models import Conversation, Message
# from django.contrib.auth.models import User

# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         if not self.scope["user"].is_authenticated:
#             await self.close()
#             return

#         self.user = self.scope["user"]
#         self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
#         self.room_group_name = f"chat_{self.conversation_id}"

#         # Verify user belongs to this conversation
#         is_participant = await self.check_user_in_conversation()
#         if not is_participant:
#             await self.close()
#             return

#         await self.channel_layer.group_add(self.room_group_name, self.channel_name)
#         await self.accept()

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         message = data["message"]

#         # Save message to DB
#         new_message = await self.save_message(message)

#         # Broadcast to conversation group
#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {
#                 "type": "chat_message",
#                 "id": new_message.id,
#                 "message": new_message.text,
#                 "sender": new_message.sender.username,
#                 "receiver": new_message.receiver.username,
#                 "created_at": new_message.created_at.strftime("%Y-%m-%d %H:%M:%S"),
#                 "is_read": new_message.is_read
#             }
#         )

#     async def chat_message(self, event):
#         await self.send(text_data=json.dumps(event))

#     @database_sync_to_async
#     def save_message(self, message):
#         conversation = Conversation.objects.get(id=self.conversation_id)
#         receiver = conversation.participants.exclude(id=self.user.id).first()
#         conversation.updated_at = conversation.updated_at  # Update timestamp
#         conversation.save()
#         return Message.objects.create(conversation=conversation, sender=self.user, receiver=receiver, text=message)

#     @database_sync_to_async
#     def check_user_in_conversation(self):
#         return Conversation.objects.filter(id=self.conversation_id, participants=self.user).exists()


import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Conversation, Message

class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_group_name = None
        self.user = None
        self.conversation_id = None

    async def connect(self):
        if not self.scope["user"].is_authenticated:
            await self.close()
            return

        self.user = self.scope["user"]
        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.room_group_name = f"chat_{self.conversation_id}"

        # Verify user belongs to this conversation
        is_participant = await self.check_user_in_conversation()
        if not is_participant:
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if self.room_group_name:  # Only discard if set
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]

        # Save message
        new_message = await self.save_message(message)

        # Broadcast to group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "id": new_message.id,
                "message": new_message.text,
                "sender": new_message.sender.username,
                "receiver": new_message.receiver.username,
                "created_at": new_message.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "is_read": new_message.is_read
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def save_message(self, message):
        conversation = Conversation.objects.get(id=self.conversation_id)
        print(conversation, )
        receiver = conversation.participants.exclude(id=self.user.id).first()
        conversation.save(update_fields=["updated_at"])
        return Message.objects.create(conversation=conversation, sender=self.user, receiver=receiver, text=message)

    @database_sync_to_async
    def check_user_in_conversation(self):
        return Conversation.objects.filter(id=self.conversation_id, participants=self.user).exists()
