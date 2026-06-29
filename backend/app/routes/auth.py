from datetime import datetime

from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.extensions import db
from app.models import User
from app.services.auth_service import create_password_reset, issue_tokens, login_user, register_user
from app.utils.responses import error, ok
from app.utils.security import hash_password
from app.utils.validators import validate_password

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    try:
        return ok(register_user(request.get_json() or {}), "Account created.", 201)
    except ValueError as exc:
        return error(str(exc), 400)


@auth_bp.post("/login")
def login():
    try:
        return ok(login_user(request.get_json() or {}), "Signed in.")
    except ValueError as exc:
        return error(str(exc), 401)


@auth_bp.post("/logout")
@jwt_required()
def logout():
    return ok(message="Signed out.")


@auth_bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return error("Authenticated user was not found.", 401)
    return ok(issue_tokens(user), "Token refreshed.")


@auth_bp.post("/forgot-password")
def forgot_password():
    payload = request.get_json() or {}
    create_password_reset(payload.get("email"))
    return ok(message="If the email exists, password reset instructions have been prepared.")


@auth_bp.post("/reset-password")
def reset_password():
    payload = request.get_json() or {}
    token = payload.get("token")
    password = payload.get("password") or ""
    valid_password, password_error = validate_password(password)
    if not valid_password:
        return error(password_error, 400)
    user = User.query.filter_by(reset_token=token).first()
    if not user or not user.reset_token_expires_at or user.reset_token_expires_at < datetime.utcnow():
        return error("Reset token is invalid or expired.", 400)
    user.password_hash = hash_password(password)
    user.reset_token = None
    user.reset_token_expires_at = None
    db.session.commit()
    return ok(message="Password updated.")
