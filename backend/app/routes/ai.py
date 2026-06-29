from flask import Blueprint, request

from app.middleware.auth import current_user_required
from app.services.ai_service import generate_site
from app.utils.responses import error, ok

ai_bp = Blueprint("ai", __name__)


@ai_bp.post("/generate")
@current_user_required
def generate(user):
    payload = request.get_json() or {}
    prompt = (payload.get("prompt") or "").strip()
    if len(prompt) < 12:
        return error("Describe the website in at least 12 characters.", 400)
    try:
        return ok(generate_site(prompt), "Website generated.")
    except Exception as exc:
        return error("AI generation failed.", 502, str(exc))
