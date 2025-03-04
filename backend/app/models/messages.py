from ..extensions import db
from .base import BaseModel
from datetime import datetime

class GlobalMessage(BaseModel, db.Model):
    __tablename__ = 'global_messages'

    text = db.Column(db.String(500), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    is_deleted = db.Column(db.Boolean, default=False)

    def to_dict(self):
        base_dict = super().to_dict()
        base_dict['author'] = self.author.username
        return base_dict
    
class DirectMessage(BaseModel, db.Model):
    __tablename__ = 'direct_messages'

    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.String(500), nullable=False)
    is_read = db.Column(db.Boolean, default=False)

    def to_dict(self):
        """Serialize direct message with sender and recipient usernames"""
        base_dict = super().to_dict()
        base_dict.update({
            'sender_username': self.sender.username,
            'recipient_username': self.recipient.username
        })
        return base_dict