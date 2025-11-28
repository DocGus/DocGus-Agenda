"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
# Compatibility shim: ensure `werkzeug.__version__` exists for Werkzeug 3.x
from compat import werkzeug_shim  # noqa: F401
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# JWT configuration (used to create access tokens)
app.config.setdefault('JWT_SECRET_KEY', os.environ.get(
    'JWT_SECRET_KEY', 'dev-secret-key'))
jwt = JWTManager(app)

# Rate limiting
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=[os.getenv('RATELIMIT_DEFAULT', '200 per day;50 per hour')]
)

# Enforce secure JWT secret in non-development environments
if ENV != "development":
    configured_jwt = app.config.get('JWT_SECRET_KEY')
    if not configured_jwt or configured_jwt == 'dev-secret-key':
        raise RuntimeError("JWT_SECRET_KEY must be set to a secure value in production")

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code


@app.errorhandler(Exception)
def handle_unexpected_error(error):
    # Para peticiones a la API devolver JSON en lugar de HTML
    try:
        from flask import request
        status = getattr(error, 'code', 500)
        if request.path.startswith('/api'):
            # Log full exception for debugging/CI
            app.logger.exception(error)
            # En desarrollo incluimos detalles; en producción ocultamos detalles
            details = str(error) if ENV == "development" else None
            payload = {"message": "Internal server error", "details": details}
            return jsonify(payload), status
    except Exception:
        # Si algo falla al intentar construir la respuesta JSON, caemos al manejador por defecto
        pass

    # Para rutas no-API en desarrollo, re-lanzar el error para ver la página de debug
    if ENV == "development":
        raise error

    # En producción devolver un mensaje genérico
    return jsonify({"message": "Internal server error"}), 500

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
