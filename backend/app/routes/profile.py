from flask import Blueprint, request

from app.extensions import db
from app.middleware.auth import current_user_required
from app.models import ActivityLog
from app.utils.responses import error, ok
from app.utils.security import hash_password, verify_password
from app.utils.validators import validate_password

profile_bp = Blueprint("profile", __name__)


@profile_bp.get("/profile")
@current_user_required
def profile(user):
    return ok({"user": user.to_dict(), "activity": [item.to_dict() for item in user.activity_logs[-10:]]})


@profile_bp.put("/profile")
@current_user_required
def update_profile(user):
    payload = request.get_json() or {}
    if "name" in payload and len(payload["name"].strip()) >= 2:
        user.name = payload["name"].strip()
    if "theme" in payload and payload["theme"] in {"dark", "light"}:
        user.theme = payload["theme"]
    db.session.add(ActivityLog(user_id=user.id, action="profile_updated", details="Profile settings changed"))
    db.session.commit()
    return ok({"user": user.to_dict()}, "Profile updated.")


@profile_bp.put("/profile/password")
@current_user_required
def change_password(user):
    payload = request.get_json() or {}
    if not verify_password(payload.get("currentPassword") or "", user.password_hash):
        return error("Current password is incorrect.", 400)
    valid_password, password_error = validate_password(payload.get("newPassword") or "")
    if not valid_password:
        return error(password_error, 400)
    user.password_hash = hash_password(payload["newPassword"])
    db.session.commit()
    return ok(message="Password changed.")


@profile_bp.delete("/profile")
@current_user_required
def delete_account(user):
    db.session.delete(user)
    db.session.commit()
    return ok(message="Account deleted.")
