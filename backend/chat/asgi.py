import os

# 1. Set Django settings before anything else
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chat.settings')

# 2. Setup Django
import django
django.setup()

# 3. Now safe to import Django stuff
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from .middleware import JWTAuthMiddleware
import conversations.routing

# 4. Build the application
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddleware(
        URLRouter(
            conversations.routing.websocket_urlpatterns
        )
    ),
})
