from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from ..services.message_service import MessageService

message_blueprint = Blueprint('messages', __name__)
message_service = MessageService()

@message_blueprint.route('/global', methods=['POST'])
@login_required
def send_global_message():
    data = request.get_json()

    message = message_service.create_global_message(
        current_user.id,
        data['text']
    )

    return jsonify({
        'message_id' : message.id,
        'text' : message.text
    }),  201

@message_blueprint.route('/global', methods=['GET'])
@login_required
def get_global_messages():
    messages = message_service.get_global_message()
    return jsonify([
        {
            'id' : msg.id,
            'text' : msg.text,
            'user_id' : msg.user_id,
            'timestamp' : msg.timestamp.isoformat()
        } for msg in messages
    ])
