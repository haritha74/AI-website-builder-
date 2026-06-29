# AI Website Builder

Production-oriented AI website builder built with React, Vite, Tailwind CSS, Flask, SQLAlchemy, JWT authentication, and OpenAI-compatible generation.

## Run Locally

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python run.py
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## MySQL

Set `DATABASE_URL=mysql+pymysql://builder:builderpassword@localhost:3306/ai_website_builder` in `backend/.env`, or start MySQL and the backend with:

```bash
docker compose up --build
```

## OpenAI

Set `OPENAI_API_KEY` in `backend/.env`. Without a key, the app uses a local deterministic generator so the builder remains usable for development.

## Gemini Round Robin

Gemini is preferred when `GEMINI_API_KEYS` is configured. Add multiple keys as a comma-separated list in `backend/.env`; the backend rotates through them and automatically tries the next key when one is rate-limited or quota-limited.

```env
GEMINI_API_KEYS=first_key,second_key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_FALLBACK_MODELS=gemini-flash-latest,gemini-2.5-flash-lite,gemini-flash-lite-latest
GEMINI_TIMEOUT_SECONDS=180
```
