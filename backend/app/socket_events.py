from flask_socketio import emit
from flask_jwt_extended import jwt_required, get_jwt_identity
from .extensions import socketio
from .models.user import User
from flask import request

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    token = request.args.get('token')
    if not token:
        print('No token provided')
        return False 
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            print('User not found')
            return False
        print(f'User {user.username} connected')
    except Exception as e:
        print(f'Connection error: {str(e)}')
        return False

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('send_message')
def handle_send_message(data):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            print('User not found for message')
            return
        
        emit('receive_message', {
            'username': user.username,
            'message': data['message'],
            'timestamp': data['timestamp']
        }, broadcast=True)
        
    except Exception as e:
        print(f"Error handling message: {str(e)}") 