# SafeNet AI Backend Guide

## 1. Install dependencies

```bash
pip install -r requirements.txt
```

## 2. Configure environment

Copy .env.example to .env and set your key:

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_TIMEOUT_SECONDS=25
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

## 3. Run locally

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Health check:

- GET /health

API docs:

- /docs

## 4. API endpoints

- POST /api/phishing/check
- POST /api/nmap/translate
- POST /api/tutor/chat

## 5. Docker

Build image:

```bash
docker build -t safenet-ai-backend .
```

Run container:

```bash
docker run -p 8000:8000 --env-file .env safenet-ai-backend
```

## 6. Render deployment

- Create a new Web Service from your repository.
- Runtime: Docker.
- Add environment variables from .env.example.
- Start command is already in Dockerfile.
- Expose port 8000.

## 7. Railway deployment

- New Project -> Deploy from GitHub repo.
- Railway detects Dockerfile automatically.
- Add environment variables from .env.example.
- Public domain can be enabled from Networking tab.

## 8. Frontend integration

Set frontend API URL to your backend URL and call:

- /api/phishing/check with { "text": "..." }
- /api/nmap/translate with { "scan_text": "..." }
- /api/tutor/chat with { "question": "..." }
