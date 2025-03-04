from ..extensions import db
from .base import BaseModel
from datetime import datetime
import uuid

class Group(BaseModel, db.Model):
    """Group chat model"""
    __tablename__ = 'groups'

    group_id = db.Column(db.String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    is_private = db.Column(db.Boolean, default=False)

    # Relationships
    memberships = db.relationship('GroupMembership', backref='group', lazy='dynamic')
    messages = db.relationship('GroupMessage', backref='group', lazy='dynamic')

    @classmethod
    def create(cls, name, description=None, is_private=False):
        """
        Create a new group
        
        Args:
            name (str): Group name
            description (str, optional): Group description
            is_private (bool, optional): Private group flag
        
        Returns:
            Group: Newly created group instance
        """
        return cls(
            name=name,
            description=description,
            is_private=is_private
        )

class GroupMembership(BaseModel, db.Model):
    """Group membership tracking"""
    __tablename__ = 'group_memberships'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'), nullable=False)
    role = db.Column(db.String(50), default='member')  # admin, member, moderator
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'group_id', name='_user_group_uc'),
    )

class GroupMessage(BaseModel, db.Model):
    """Messages within a group chat"""
    __tablename__ = 'group_messages'

    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.String(500), nullable=False)

    def to_dict(self):
        """Serialize group message with sender username"""
        base_dict = super().to_dict()
        base_dict['sender_username'] = self.sender.username
        base_dict['group_name'] = self.group.name
        return base_dict