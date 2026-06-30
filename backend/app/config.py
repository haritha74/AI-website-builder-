import os
from pathlib import Path
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()


def _database_url():
    url = os.getenv("DATABASE_URL") or _tidb_database_url() or "sqlite:///ai_website_builder.db"
    if url.startswith("mysql://"):
        url = url.replace("mysql://", "mysql+pymysql://", 1)
    if _truthy(os.getenv("REQUIRE_SQL_DATABASE")) and url.startswith("sqlite"):
        raise RuntimeError("REQUIRE_SQL_DATABASE=true but DATABASE_URL is SQLite. Use a hosted MySQL DATABASE_URL.")
    return url


def _tidb_database_url():
    host = os.getenv("TIDB_HOST")
    port = os.getenv("TIDB_PORT")
    user = os.getenv("TIDB_USER")
    password = os.getenv("TIDB_PASSWORD")
    database = os.getenv("TIDB_DATABASE")
    if all([host, port, user, password, database]):
        return f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}"
    return None


def _sqlalchemy_engine_options():
    if not _database_url().startswith("mysql"):
        return {}

    ssl_ca = (os.getenv("MYSQL_SSL_CA") or "").strip()
    ssl_enabled = _truthy(os.getenv("MYSQL_SSL"))

    if ssl_ca:
        ca_path = Path(os.getenv("MYSQL_SSL_CA_PATH", "/tmp/mysql-ca.pem"))
        ca_path.write_text(ssl_ca.replace("\\n", "\n"), encoding="utf-8")
        return {"connect_args": {"ssl": {"ca": str(ca_path)}}}

    if ssl_enabled:
        return {"connect_args": {"ssl": {}}}

    return {}


def _truthy(value):
    return str(value or "").strip().lower() in {"1", "true", "yes", "on"}


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "local-development-secret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "local-development-jwt-secret")
    SQLALCHEMY_DATABASE_URI = _database_url()
    SQLALCHEMY_ENGINE_OPTIONS = _sqlalchemy_engine_options()
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
