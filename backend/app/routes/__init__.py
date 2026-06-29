from .ai import ai_bp
from .auth import auth_bp
from .export import export_bp
from .profile import profile_bp
from .projects import projects_bp
from .templates import templates_bp


def register_routes(app):
    for bp in [auth_bp, profile_bp, ai_bp, projects_bp, templates_bp, export_bp]:
        app.register_blueprint(bp, url_prefix="/api")
        app.register_blueprint(bp, name=f"{bp.name}_root")
