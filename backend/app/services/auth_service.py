from flask_jwt_extended import create_access_token, create_refresh_token

from app.extensions import db
from app.models import ActivityLog, User
from app.services.mail_service import send_password_reset_email
from app.utils.security import hash_password, make_reset_token, verify_password
from app.utils.validators import validate_email, validate_password


def register_user(payload):
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    if len(name) < 2:
        raise ValueError("Name must be at least 2 characters.")
    if not validate_email(email):
        raise ValueError("Enter a valid email address.")
    valid_password, password_error = validate_password(password)
    if not valid_password:
        raise ValueError(password_error)
    if User.query.filter_by(email=email).first():
        raise ValueError("An account with this email already exists.")

    user = User(name=name, email=email, password_hash=hash_password(password))
    db.session.add(user)
    db.session.commit()
    log_activity(user.id, "registered", "Account created")
    return issue_tokens(user)


def login_user(payload):
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""
    user = User.query.filter_by(email=email).first()
    if not user or not verify_password(password, user.password_hash):
        raise ValueError("Invalid email or password.")
    log_activity(user.id, "logged_in", "User signed in")
    return issue_tokens(user)


def issue_tokens(user):
    identity = str(user.id)
    return {
        "user": user.to_dict(),
        "accessToken": create_access_token(identity=identity),
        "refreshToken": create_refresh_token(identity=identity),
    }


def create_password_reset(email):
    user = User.query.filter_by(email=(email or "").strip().lower()).first()
    if not user:
        return None
    token, expires_at = make_reset_token()
    user.reset_token = token
    user.reset_token_expires_at = expires_at
    db.session.commit()
    send_password_reset_email(user, token)
    log_activity(user.id, "password_reset_requested", "Password reset token generated")
    return True


def log_activity(user_id, action, details=None):
    db.session.add(ActivityLog(user_id=user_id, action=action, details=details))
    db.session.commit()
