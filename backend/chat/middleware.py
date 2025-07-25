import logging
import traceback
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)
User = get_user_model()

@database_sync_to_async
def get_user(user_id):
    """Fetch user or return AnonymousUser."""
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()

class JWTAuthMiddleware:
    """ASGI 3-compatible middleware for WebSocket JWT authentication."""

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        try:
            query_params = parse_qs(scope.get("query_string", b"").decode())
            token = query_params.get("token")

            if token:
                try:
                    access_token = AccessToken(token[0])
                    user = await get_user(access_token["user_id"])
                    scope["user"] = user
                except Exception as e:
                    logger.error(f"JWT decoding failed: {e}")
                    logger.error(traceback.format_exc())
                    scope["user"] = AnonymousUser()
            else:
                scope["user"] = AnonymousUser()

        except Exception as e:
            logger.error(f"Middleware crashed: {e}")
            logger.error(traceback.format_exc())
            scope["user"] = AnonymousUser()

        return await self.inner(scope, receive, send)
