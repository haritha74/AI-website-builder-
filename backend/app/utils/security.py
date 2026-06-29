import secrets
from datetime import datetime, timedelta

from app.extensions import bcrypt


def hash_password(password):
    return bcrypt.generate_password_hash(password).decode("utf-8")


def verify_password(password, password_hash):
    return bcrypt.check_password_hash(password_hash, password)


def make_reset_token():
    return secrets.token_urlsafe(48), datetime.utcnow() + timedelta(minutes=30)
