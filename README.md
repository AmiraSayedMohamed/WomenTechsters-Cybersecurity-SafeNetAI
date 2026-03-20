# SafeNet AI

SafeNet AI is a cybersecurity assistant built for everyday users, especially in African digital contexts where phishing, mobile money fraud, and low-tech security barriers are common.

It combines a modern React frontend with a FastAPI backend and AI-powered analysis to help users:
- Check suspicious messages for phishing risks
- Translate technical Nmap scan output into plain language
- Ask cybersecurity questions in simple, friendly terms

## Why This Project Matters

Many security tools are too technical for non-specialists. SafeNet AI focuses on:
- Simple, clear language
- Fast responses
- Mobile-first usability
- Privacy-first behavior

## Core Features

1. Phishing Detector
- Input: suspicious message, email text, or link context
- Output: verdict, explanation, red flags, and immediate actions

2. Nmap Translator
- Input: raw Nmap scan output
- Output: summary, risk level, risk explanation, and next steps

3. AI Tutor
- Input: user cybersecurity question
- Output: short, practical guidance

4. Learning Hub
- Built-in quiz content for basic cybersecurity education

5. Production-Oriented Setup
- Frontend deployable on Vercel
- Backend deployable on Hugging Face Spaces (Docker)

## Architecture

- Frontend: React + Vite + TypeScript + Tailwind CSS + Radix UI
- Backend: FastAPI + Pydantic
- AI Provider: OpenAI-compatible endpoint (configured for Groq in env example)

Data flow:
1. User submits input on frontend
2. Frontend calls backend API
3. Backend validates request with Pydantic schemas
4. Backend calls AI service and normalizes output
5. Frontend displays user-friendly result

## Project Structure

```text
SafeNetAi/
  app/
    core/
      config.py
    routers/
      phishing.py
      nmap.py
      tutor.py
    schemas/
      models.py
    services/
      ai_service.py
    main.py
  src/
    components/
      AIEngine.ts
      Header.tsx
      Footer.tsx
    pages/
      Home.tsx
      PhishingDetector.tsx
      NmapTranslator.tsx
      LearningHub.tsx
      About.tsx
  public/
  App.tsx
  package.json
  requirements.txt
  Dockerfile
  .env.example
```

## API Endpoints

Base URL (local):
- http://localhost:8000

Health:
- GET /health

Feature endpoints:
- POST /api/phishing/check
- POST /api/nmap/translate
- POST /api/tutor/chat

### Example Request Bodies

Phishing:

```json
{
  "text": "Congratulations! You won. Click this link now."
}
```

Nmap:

```json
{
  "scan_text": "Starting Nmap..."
}
```

Tutor:

```json
{
  "question": "How can I protect my WhatsApp account?"
}
```

## Environment Variables

Use .env.example as your template.

Backend:
- OPENAI_API_KEY
- OPENAI_MODEL
- OPENAI_BASE_URL
- OPENAI_TIMEOUT_SECONDS
- CORS_ALLOWED_ORIGINS

Frontend:
- VITE_API_BASE_URL

Default local frontend API value:
- http://localhost:8000/api

## Local Development

## 1. Prerequisites

- Node.js 18+
- Python 3.11+
- pip

## 2. Install Frontend Dependencies

```bash
npm install
```

## 3. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

## 4. Configure Environment

Copy and edit env file:

```bash
copy .env.example .env
```

Then update your real API key and values in .env.

## 5. Run Backend

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## 6. Run Frontend

```bash
npm run dev
```

## 7. Open Application

- Frontend: http://localhost:5173
- Backend docs: http://localhost:8000/docs
- Backend health: http://localhost:8000/health

## Docker (Backend)

Build:

```bash
docker build -t safenet-ai-backend .
```

Run:

```bash
docker run -p 7860:7860 --env-file .env safenet-ai-backend
```

Note: Dockerfile currently exposes and serves on port 7860 for Hugging Face Spaces compatibility.

## Deployment

Recommended:
- Frontend on Vercel
- Backend on Hugging Face Spaces (Docker)

Detailed guides available in this repo:
- DEPLOYMENT_GUIDE.md
- DEPLOYMENT_CHECKLIST.md
- BACKEND_DEPLOYMENT.md
- QUICK_REFERENCE.md

## Error Handling and Reliability

Backend includes:
- Input validation with user-friendly 400 errors
- Consistent API error format
- Timeout and connection handling for AI calls
- Local fallback responses when AI provider fails

## Security and Privacy Notes

- .env is ignored by git; never commit real secrets
- CORS is configurable via CORS_ALLOWED_ORIGINS
- Frontend does not require account signup for core usage

## Current Version

- App version: 1.0.0

## Team and Mission

SafeNet AI is designed to make cybersecurity practical, inclusive, and understandable for all users, not only technical experts.

## License

No explicit license file is currently included in this repository. Add a LICENSE file if you want open-source licensing terms.
