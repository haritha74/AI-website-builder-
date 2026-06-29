from flask import Flask, jsonify
from flask_cors import CORS

from .config import Config
from .extensions import bcrypt, db, jwt
from .routes import register_routes
from .services.seed_service import seed_templates


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(
        app,
        resources={r"/*": {"origins": app.config["FRONTEND_ORIGIN"]}},
        supports_credentials=True,
    )
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    register_routes(app)

    @app.get("/health")
    def health_check():
        return jsonify({"status": "healthy", "service": "ai-website-builder"})

    with app.app_context():
        db.create_all()
        seed_templates()

    return app
