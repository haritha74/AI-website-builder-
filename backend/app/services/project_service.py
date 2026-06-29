from app.extensions import db
from app.models import ActivityLog, Project


def create_project(user_id, payload):
    project = Project(
        user_id=user_id,
        title=payload["title"].strip(),
        prompt=payload.get("prompt", "").strip(),
        html=payload.get("html", ""),
        css=payload.get("css", ""),
        javascript=payload.get("javascript", ""),
        category=payload.get("category", "custom"),
        thumbnail_color=payload.get("thumbnailColor", "#0f172a"),
    )
    db.session.add(project)
    db.session.add(ActivityLog(user_id=user_id, action="project_created", details=project.title))
    db.session.commit()
    return project


def update_project(project, payload):
    for attr, key in [
        ("title", "title"),
        ("prompt", "prompt"),
        ("html", "html"),
        ("css", "css"),
        ("javascript", "javascript"),
        ("category", "category"),
        ("thumbnail_color", "thumbnailColor"),
        ("is_published", "isPublished"),
    ]:
        if key in payload:
            setattr(project, attr, payload[key])
    db.session.commit()
    return project
