from flask import Blueprint, request

from app.extensions import db
from app.middleware.auth import current_user_required
from app.models import Project
from app.services.project_service import create_project, update_project
from app.utils.responses import error, ok

projects_bp = Blueprint("projects", __name__)


@projects_bp.get("/projects")
@current_user_required
def list_projects(user):
    search = (request.args.get("search") or "").strip().lower()
    query = Project.query.filter_by(user_id=user.id)
    if search:
        query = query.filter(Project.title.ilike(f"%{search}%"))
    projects = query.order_by(Project.updated_at.desc()).all()
    return ok({"projects": [project.to_dict() for project in projects]})


@projects_bp.post("/projects")
@current_user_required
def create(user):
    payload = request.get_json() or {}
    if not (payload.get("title") or "").strip():
        return error("Project title is required.", 400)
    project = create_project(user.id, payload)
    return ok({"project": project.to_dict()}, "Project saved.", 201)


@projects_bp.get("/projects/<int:project_id>")
@current_user_required
def get_project(user, project_id):
    project = Project.query.filter_by(id=project_id, user_id=user.id).first()
    if not project:
        return error("Project not found.", 404)
    return ok({"project": project.to_dict()})


@projects_bp.put("/projects/<int:project_id>")
@current_user_required
def update(user, project_id):
    project = Project.query.filter_by(id=project_id, user_id=user.id).first()
    if not project:
        return error("Project not found.", 404)
    return ok({"project": update_project(project, request.get_json() or {}).to_dict()}, "Project updated.")


@projects_bp.post("/projects/<int:project_id>/duplicate")
@current_user_required
def duplicate(user, project_id):
    project = Project.query.filter_by(id=project_id, user_id=user.id).first()
    if not project:
        return error("Project not found.", 404)
    duplicated = create_project(
        user.id,
        {**project.to_dict(), "title": f"{project.title} Copy"},
    )
    return ok({"project": duplicated.to_dict()}, "Project duplicated.", 201)


@projects_bp.delete("/projects/<int:project_id>")
@current_user_required
def delete(user, project_id):
    project = Project.query.filter_by(id=project_id, user_id=user.id).first()
    if not project:
        return error("Project not found.", 404)
    db.session.delete(project)
    db.session.commit()
    return ok(message="Project deleted.")
