# Chatbot Trainer

A full-stack chat platform with a real-time WebSocket backend and an admin dashboard for managing users, chat sessions and conversation history.

## Architecture

**Backend** (`backend/`): Django, Django REST Framework and Django Channels, served by Daphne, with PostgreSQL.

- JWT authentication (register, login, token refresh and verify) under `/api/v1/auth/`.
- Conversations and messages under `/api/v1/conversations/`, with create, list and mark-as-read endpoints.
- A `ChatConsumer` WebSocket consumer that delivers messages in real time and persists them.
- Dockerfile and `docker-compose.yml` that start the API and a Postgres 14 database together.

**Frontend** (`frontend/`): React with Vite, Material UI, Redux and React Query.

- Login and registration pages backed by the JWT endpoints.
- Chat view with session list, message area and markdown rendering with code highlighting.
- Users management page and chat history browser.
- File uploads to S3.

## Run with Docker

```bash
cd backend
docker compose up --build
```

The API starts on http://127.0.0.1:8000 after migrations run.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server points at `http://127.0.0.1:8000/api/v1` by default (see `src/admin/utils/APIConstants.js`).

## Run the backend without Docker

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
daphne -b 0.0.0.0 -p 8000 chat.asgi:application
```

Set `DATABASE_URL` in a `.env` file to point at your Postgres instance.
