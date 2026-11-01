from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)
from werkzeug.security import check_password_hash

from app.db import find_one, get

auth = Blueprint("auth", __name__)


@auth.post("/login")
def login():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Invalid request data"}), 400

    email = str(data.get("email", "")).strip().lower()
    password = data.get("password", "")

    if not email or not isinstance(password, str) or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = find_one("users", email=email)

    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    password_hash = user.get("password_hash", "")

    try:
        password_valid = (
            isinstance(password_hash, str)
            and bool(password_hash)
            and check_password_hash(password_hash, password)
        )
    except (ValueError, TypeError):
        password_valid = False

    if not password_valid:
        return jsonify({"error": "Invalid email or password"}), 401

    if user.get("role") != "admin":
        return jsonify({"error": "Admin access required"}), 403

    identity = str(user["id"])

    access_token = create_access_token(
        identity=identity, additional_claims={"role": "admin"}
    )

    refresh_token = create_refresh_token(
        identity=identity, additional_claims={"role": "admin"}
    )

    return (
        jsonify(
            {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": {"email": user["email"], "role": "admin"},
            }
        ),
        200,
    )


@auth.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    user = get("users", identity)

    if not user or user.get("role") != "admin":
        return jsonify({"error": "Invalid or unauthorized account"}), 401

    access_token = create_access_token(
        identity=str(user["id"]), additional_claims={"role": "admin"}
    )

    return jsonify({"access_token": access_token}), 200


@auth.get("/me")
@jwt_required()
def me():
    identity = get_jwt_identity()
    user = get("users", identity)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"email": user.get("email"), "role": user.get("role")}), 200
