from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from .db import close_db, init_db
from .routes import register_routes

jwt = JWTManager()


def create_app(test_config=None):
    app = Flask(__name__)

    app.config.from_object(Config)

    if test_config:
        app.config.update(test_config)

    if not app.config.get("SECRET_KEY"):
        raise RuntimeError("SECRET_KEY is missing from environment variables")

    if not app.config.get("JWT_SECRET_KEY"):
        raise RuntimeError("JWT_SECRET_KEY is missing from environment variables")

    if app.config["SECRET_KEY"] == app.config["JWT_SECRET_KEY"]:
        raise RuntimeError("Flask and JWT secrets must be different")

    jwt.init_app(app)

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": app.config["FRONTEND_ORIGIN"],
                "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
            }
        },
    )

    app.teardown_appcontext(close_db)

    with app.app_context():
        init_db()

    register_routes(app)

    @app.route("/")
    def home():
        return jsonify({"message": "Futureverse API is running", "status": "success"})

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(413)
    def file_too_large(error):
        return jsonify({"error": "Request payload is too large"}), 413

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({"error": "Internal server error"}), 500

    return app
