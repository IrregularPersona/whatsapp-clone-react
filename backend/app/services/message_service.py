from ..models.messages import GlobalMessage, DirectMessage 
from ..extensions import db
from datetime import datetime

class MessageService:
    def create_global_message(self, user_id, text):
        message = GlobalMessage(
            text=text,
            user_id=user_id,
            timestamp=datetime.utcnow()
        )

        db.session.add(message)
        db.session.commit()
        return message
    
    def get_global_message(self, limit=50):
        return GlobalMessage.query.order_by(
            GlobalMessage.timestamp.desc()
        ).limit(limit).all()

    def create_direct_message(self, sender_id, recipient_id, message):
        """Create a direct message"""
        dm = DirectMessage(
            sender_id=sender_id,
            recipient_id=recipient_id,
            message=message,
            timestamp=datetime.utcnow()
        )
        db.session.add(dm)
        db.session.commit()
        return dm
