import os
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()


def default_database_url():
    if os.getenv("VERCEL"):
        return "sqlite:////tmp/ai_website_builder.db"
    return "sqlite:///ai_website_builder.db"


def database_url():
    if os.getenv("VERCEL") and os.getenv("USE_EXTERNAL_DATABASE", "false").lower() not in {"1", "true", "yes"}:
        return "sqlite:////tmp/ai_website_builder.db"
    return os.getenv("DATABASE_URL", default_database_url())


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "local-development-secret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "local-development-jwt-secret")
    SQLALCHEMY_DATABASE_URI = database_url()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=12)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    RESET_BASE_URL = os.getenv("RESET_BASE_URL", "http://localhost:5173/reset-password")
    SMTP_HOST = os.getenv("SMTP_HOST", "")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM = os.getenv("SMTP_FROM", "no-reply@aiwebsitebuilder.local")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    GEMINI_API_KEYS = [
        key.strip()
        for key in os.getenv("GEMINI_API_KEYS", "").replace("\n", ",").split(",")
        if key.strip()
    ]
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    GEMINI_FALLBACK_MODELS = [
        model.strip()
        for model in os.getenv(
            "GEMINI_FALLBACK_MODELS",
            "gemini-flash-latest,gemini-2.5-flash-lite,gemini-flash-lite-latest",
        ).split(",")
        if model.strip()
    ]
    GEMINI_TIMEOUT_SECONDS = int(os.getenv("GEMINI_TIMEOUT_SECONDS", "180"))
    GEMINI_VERIFY_SSL = os.getenv("GEMINI_VERIFY_SSL", "true").lower() not in {"0", "false", "no"}
