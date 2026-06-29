from functools import wraps

from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from app.models import User
from app.utils.responses import error


def current_user_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user = User.query.get(int(get_jwt_identity()))
        if not user:
            return error("Authenticated user was not found.", 401)
        return fn(user, *args, **kwargs)

    return wrapper
