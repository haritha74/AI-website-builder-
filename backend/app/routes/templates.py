from flask import Blueprint, request

from app.models import Template
from app.utils.responses import ok

templates_bp = Blueprint("templates", __name__)


@templates_bp.get("/templates")
def list_templates():
    category = request.args.get("category")
    query = Template.query
    if category:
        query = query.filter_by(category=category)
    templates = query.order_by(Template.category.asc()).all()
    return ok({"templates": [template.to_dict() for template in templates]})
