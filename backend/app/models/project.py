from datetime import datetime

from app.extensions import db


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    title = db.Column(db.String(180), nullable=False)
    prompt = db.Column(db.Text, nullable=False)
    html = db.Column(db.Text, nullable=False)
    css = db.Column(db.Text, nullable=False)
    javascript = db.Column(db.Text, nullable=False, default="")
    thumbnail_color = db.Column(db.String(20), default="#0f172a")
    category = db.Column(db.String(80), default="custom")
    is_published = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "prompt": self.prompt,
            "html": self.html,
            "css": self.css,
            "javascript": self.javascript,
            "thumbnailColor": self.thumbnail_color,
            "category": self.category,
            "isPublished": self.is_published,
            "createdAt": self.created_at.isoformat(),
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }
