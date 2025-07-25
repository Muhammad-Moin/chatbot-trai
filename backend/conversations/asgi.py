# chat/asgi.py
import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
import conversations.routing  # Import your app routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chat.settings')
django.setup()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # Still handle HTTP
    "websocket": AuthMiddlewareStack(
        URLRouter(
            conversations.routing.websocket_urlpatterns  # Your websocket routes
        )
    ),
})



# import os
# from django.core.asgi import get_asgi_application
# from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
# from django.contrib.auth.middleware import get_user
# from rest_framework_simplejwt.tokens import UntypedToken
# from jwt import decode as jwt_decode
# from django.conf import settings
# from channels.db import database_sync_to_async
# from urllib.parse import parse_qs
# import accounts.models  # your custom user model
# import chat.routing  # import your websocket urls

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "chat.settings")

# @database_sync_to_async
# def get_user_from_token(token):
#     from django.contrib.auth import get_user_model
#     from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
#     from rest_framework_simplejwt.tokens import UntypedToken

#     try:
#         decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
#         user_id = decoded_data.get("user_id")
#         return get_user_model().objects.get(id=user_id)
#     except Exception:
#         return None

# class JWTAuthMiddleware:
#     """
#     Custom middleware for JWT authentication in WebSockets.
#     """

#     def __init__(self, inner):
#         self.inner = inner

#     def __call__(self, scope):
#         return JWTAuthMiddlewareInstance(scope, self)

# class JWTAuthMiddlewareInstance:
#     def __init__(self, scope, middleware):
#         self.scope = dict(scope)
#         self.middleware = middleware

#     async def __call__(self, receive, send):
#         # Extract token from query params or headers
#         query_string = parse_qs(self.scope.get("query_string", b"").decode())
#         token = query_string.get("token", [None])[0]

#         if not token:
#             headers = dict(self.scope["headers"])
#             auth_header = headers.get(b'authorization', None)
#             if auth_header:
#                 token = auth_header.decode().split("Bearer ")[-1]

#         # Attach user to scope
#         self.scope["user"] = await get_user_from_token(token) if token else None
#         inner = self.middleware.inner(self.scope)
#         return await inner(receive, send)

# def JWTAuthMiddlewareStack(inner):
#     return JWTAuthMiddleware(AuthMiddlewareStack(inner))

# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),
#     "websocket": JWTAuthMiddlewareStack(
#         URLRouter(
#             chat.routing.websocket_urlpatterns
#         )
#     ),
# })
