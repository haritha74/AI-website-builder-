from datetime import datetime

from app.extensions import db


class Template(db.Model):
    __tablename__ = "templates"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(140), nullable=False)
    category = db.Column(db.String(80), nullable=False, index=True)
    description = db.Column(db.String(255), nullable=False)
    prompt = db.Column(db.Text, nullable=False)
    accent_color = db.Column(db.String(20), default="#3b82f6")
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "prompt": self.prompt,
            "accentColor": self.accent_color,
        }
