from flask_cors import CORS
from api.utils import generate_sitemap, APIException
from api.models import db, User
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

# single Blueprint for api endpoints
api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/login', methods=['POST'])
def login_user():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400

        email = data.get("email")
        password = data.get("password")
        if not email or not password:
            return jsonify({"message": "Email and password required"}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({"message": "Credenciales incorrectas"}), 401

        # Generar token JWT
        token = create_access_token(identity=user.id)
        user_data = {
            "id": user.id,
            "email": user.email,
            "role": getattr(user, "role", "UsuarioAgenda")
        }
        return jsonify({"token": token, "user": user_data}), 200
    except Exception as e:
        api.logger.error(f"Error in login_user: {e}")
        return jsonify({"message": "Internal server error"}), 500


@api.route('/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400

        email = data.get("email")
        password = data.get("password")
        role = data.get("role") or "UsuarioAgenda"
        if not email or not password:
            return jsonify({"message": "Email and password required"}), 400

        # Check if user already exists
        user = User.query.filter_by(email=email).first()
        if user:
            return jsonify({"message": "User already exists"}), 409

        new_user = User(email=email, is_active=True, role=role)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "Usuario registrado exitosamente"}), 201
    except Exception as e:
        api.logger.error(f"Error in register_user: {e}")
        # Attempt to rollback session on error
        try:
            db.session.rollback()
        except Exception:
            pass
        return jsonify({"message": "Internal server error"}), 500


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

    user = User.query.get(identity)
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"user": user.serialize()}), 200
