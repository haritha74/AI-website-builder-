from flask import Blueprint, send_file

from app.middleware.auth import current_user_required
from app.models import Project
from app.services.export_service import build_react_project_zip, build_zip, compose_html_document
from app.utils.responses import error

export_bp = Blueprint("export", __name__)


@export_bp.get("/projects/<int:project_id>/export/html")
@current_user_required
def export_html(user, project_id):
    project = Project.query.filter_by(id=project_id, user_id=user.id).first()
    if not project:
        return error("Project not found.", 404)
    html = compose_html_document(project)
    return send_file(
        __import__("io").BytesIO(html.encode("utf-8")),
        as_attachment=True,
        download_name=f"{project.title.lower().replace(' ', '-')}.html",
        mimetype="text/html",
    )


@export_bp.get("/projects/<int:project_id>/export/zip")
@current_user_required
def export_zip(user, project_id):
    project = Project.query.filter_by(id=project_id, user_id=user.id).first()
    if not project:
        return error("Project not found.", 404)
    return send_file(build_zip(project), as_attachment=True, download_name=f"{project.title}.zip", mimetype="application/zip")


@export_bp.get("/projects/<int:project_id>/export/react")
@current_user_required
def export_react(user, project_id):
    project = Project.query.filter_by(id=project_id, user_id=user.id).first()
    if not project:
        return error("Project not found.", 404)
    return send_file(build_react_project_zip(project), as_attachment=True, download_name=f"{project.title}-react.zip", mimetype="application/zip")
