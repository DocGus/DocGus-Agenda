import os
from flask_cors import CORS
from flask import request
from flask import current_app
from flask_limiter.util import get_remote_address
from flask_limiter import Limiter
from functools import wraps
import time
import threading
from api.utils import generate_sitemap, APIException
from api.models import db, User
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

# single Blueprint for api endpoints
api = Blueprint('api', __name__)

# Configure CORS for the API blueprint. Use `CORS_ORIGINS` env var to restrict in production.
CORS(api, resources={r"/api/*": {"origins": os.getenv('CORS_ORIGINS', '*')}})

# If the app hasn't already initialized Limiter (it is initialized in app.py), attach
# a local limiter for blueprint-level decorators access. This avoids duplicate inits.
try:
    limiter = current_app.extensions.get('limiter') if current_app and hasattr(current_app, 'extensions') else None
except RuntimeError:
    limiter = None

if not limiter:
    # fallback - create a limiter instance that will be replaced by the app-level one when available
    limiter = Limiter(key_func=get_remote_address)


def _apply_limit(limit_str):
    """Decorator factory that applies a limiter limit using the app's Limiter instance
    at request time. Falls back to no-op if Limiter not configured.
    """
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            try:
                limiter = current_app.extensions.get('limiter')
            except RuntimeError:
                limiter = None

            if limiter:
                # Obtain decorator from limiter and call it dynamically
                return limiter.limit(limit_str)(f)(*args, **kwargs)
            return f(*args, **kwargs)

        return wrapped
    return decorator
 


@api.route('/login', methods=['POST'])
@_simple_rate_limit('10 per minute')
def login_user():
    data = request.get_json(silent=True) or {}
    email = data.get("email")
    password = data.get("password")

    # Basic validation
    if not isinstance(email, str) or not isinstance(password, str):
        return jsonify({"message": "Email and password required"}), 400
    # Allow short passwords for legacy tests/dev; enforce reasonable max length
    min_password_len = int(os.getenv('MIN_PASSWORD_LEN', 3))
    if len(email) > 254 or len(password) < min_password_len or len(password) > 128:
        return jsonify({"message": "Invalid email or password length"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Credenciales incorrectas"}), 401

    # Generar token JWT (usar string para la identidad asegura compatibilidad con el backend de JWT)
    token = create_access_token(identity=str(user.id))
    user_data = {
        "id": user.id,
        "email": user.email,
        "role": getattr(user, "role", "UsuarioAgenda")
    }
    return jsonify({"token": token, "user": user_data}), 200


@api.route('/register', methods=['POST'])
@_simple_rate_limit('5 per minute')
def register_user():
    data = request.get_json(silent=True) or {}
    email = data.get("email")
    password = data.get("password")
    role = data.get("role") or "UsuarioAgenda"

    # Basic validation
    if not isinstance(email, str) or not isinstance(password, str):
        return jsonify({"message": "Email and password required"}), 400
    min_password_len = int(os.getenv('MIN_PASSWORD_LEN', 3))
    if len(email) > 254 or len(password) < min_password_len or len(password) > 128:
        return jsonify({"message": "Invalid email or password length"}), 400

    # Check if user already exists
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"message": "User already exists"}), 409

    new_user = User(email=email, is_active=True, role=role)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuario registrado exitosamente"}), 201


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/private', methods=['GET'])
@jwt_required()
def private_route():
    # Return basic user info for authenticated requests
    identity = get_jwt_identity()
    if not identity:
        return jsonify({"message": "Invalid token"}), 401

    # Identity may be stored as string in the token; convert safely to int
    try:
        user_id = int(identity)
    except (TypeError, ValueError):
        return jsonify({"message": "Invalid token identity"}), 401

    # use Session.get(...) via db.session.get to avoid SQLAlchemy legacy warning
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"user": user.serialize()}), 200


def _apply_limit(limit_str):
    """Decorator factory that applies a limiter limit using the app's Limiter instance
    at request time. Falls back to no-op if Limiter not configured.
    """
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            try:
                limiter = current_app.extensions.get('limiter')
            except RuntimeError:
                limiter = None

            if limiter:
                # Obtain decorator from limiter and call it dynamically
                return limiter.limit(limit_str)(f)(*args, **kwargs)
            return f(*args, **kwargs)

        return wrapped
    return decorator


# Simple in-memory per-IP rate limiter for specific endpoints (development-only).
RATE_STORE: dict = {}
RATE_LOCK = threading.Lock()

def _simple_rate_limit(limit_str):
    """Simple decorator enforcing limits like '5 per minute' per remote IP."""
    parts = limit_str.split(' per ')
    try:
        count = int(parts[0].strip())
        unit = parts[1].strip()
    except Exception:
        # fallback: no limit
        def _noop(f):
            return f
        return _noop

    unit_seconds = {'second': 1, 'minute': 60, 'hour': 3600, 'day': 86400}
    # accept plural
    for k in list(unit_seconds.keys()):
        if unit.startswith(k):
            seconds = unit_seconds[k]
            break
    else:
        seconds = 60

    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            ip = request.remote_addr or get_remote_address()
            key = (ip, request.path)
            now = time.time()
            with RATE_LOCK:
                entries = RATE_STORE.get(key, [])
                # prune old
                entries = [t for t in entries if now - t < seconds]
                if len(entries) >= count:
                    return jsonify({"message": "Rate limit exceeded"}), 429
                entries.append(now)
                RATE_STORE[key] = entries
            return f(*args, **kwargs)
        return wrapped
    return decorator
