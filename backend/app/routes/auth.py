from flask import Blueprint, request, jsonify, make_response, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..services.auth_service import AuthService
from ..extensions import bcrypt, db
from ..models.user import User

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

        access_token = create_access_token(identity=user.id)
        
        response = make_response(jsonify({
            'message':'User registered successfully',
            'user_id': user.user_id,
            'username' : user.username,
            'access_token' : access_token
        }), 201)

        response.set_cookie('access_token', access_token,
                            httponly=True,
                            secure=True,
                            samesite='strict')

        return response

    except ValueError as e:
        return jsonify({
            'error' : str(e)
        }), 400

@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    current_app.logger.info(f"Login attempt for username: {data.get('username')}")
    
    try:
        user = auth_service.authenticate_user(
            data['username'],
            data['password']
        )

        if user:
            current_app.logger.info(f"Login successful for user: {user.username}")
            access_token = create_access_token(identity=user.id)

            response = make_response(jsonify({
                'access_token': access_token,
                'user_id': user.user_id,
                'username': user.username
            }), 200)

            response.set_cookie('access_token', access_token,
                                httponly=True,
                                secure=True,
                                samesite='strict')

            return response
        
        current_app.logger.warning(f"Login failed for username: {data.get('username')}")
        return jsonify({
            'error' : 'Invalid Credentials'
        }), 401
    except Exception as e:
        current_app.logger.error(f"Login error: {str(e)}")
        return jsonify({
            'error': 'An error occurred during login'
        }), 500

@auth_blueprint.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    response = make_response(jsonify({
        'message' : 'Logged out successfully'
    }), 200)

    response.delete_cookie('access_token')

    return response

@auth_blueprint.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user:
        return jsonify({
          'user_id' : user.user_id,
          'username' : user.username,
          'email' : user.email  
        }), 200
    
    return jsonify({
        'error' : 'User not found'
    }), 404