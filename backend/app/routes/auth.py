from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from flask_jwt_extended import create_access_token, jwt_required
from ..services.auth_service import AuthService
from ..extensions import bcrypt, db

auth_blueprint = Blueprint('auth', __name__)
auth_service = AuthService()

@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    try:
        user = auth_service.register_user(
            username = data['username'],
            password = data['password']
        )
        return jsonify({
            'message' : 'User registered succesfully',
            'user_id' : user.user_id
        }), 201
    except ValueError as e:
        return jsonify({
            'error' : str(e)
        }), 400

@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = auth_service.authenticate_user(
        data['username'],
        data['password']
    )

    if user:
        access_token = create_access_token(identity=user.id)
        login_user(user)
        return jsonify({
            'access_token' : access_token,
            'user_id' : user.user_id,
            'username' : user.username
        }), 200
    
    return jsonify({
        'error' : 'Invalid Credentials'
    }), 401