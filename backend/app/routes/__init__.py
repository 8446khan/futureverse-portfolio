from .api import api
from .admin import admin
from .auth import auth

def register_routes(app):
    app.register_blueprint(api, url_prefix="/api")
    app.register_blueprint(auth, url_prefix="/api/auth")
    app.register_blueprint(admin, url_prefix="/api/admin")
