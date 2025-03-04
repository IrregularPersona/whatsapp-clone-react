import random
import uuid
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from ..extensions import db, login_manager
from .base import BaseModel

class User(BaseModel, UserMixin, db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(150), unique=True, nullable=False, index=True)
    email = db.Column(db.String(255), unique=True, nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    last_login = db.Column(db.DateTime, nullable=True)
    profile_picture = db.Column(db.String(255), nullable=True)

    # Relationships
    global_messages = db.relationship('GlobalMessage', backref='author', lazy='dynamic')
    sent_direct_messages = db.relationship('DirectMessage', 
                                           foreign_keys='DirectMessage.sender_id', 
                                           backref='sender', 
                                           lazy='dynamic')
    received_direct_messages = db.relationship('DirectMessage', 
                                               foreign_keys='DirectMessage.recipient_id', 
                                               backref='recipient', 
                                               lazy='dynamic')
    group_memberships = db.relationship('GroupMembership', backref='user', lazy='dynamic')
    group_messages = db.relationship('GroupMessage', backref='sender', lazy='dynamic')

    # Password management
    def set_password(self, password):
        """Set secure password hash"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Check password against hash"""
        return check_password_hash(self.password_hash, password)

    @classmethod
    def create(cls, username, password, email=None):
        """
        Create a new user with validated and hashed password
        
        Args:
            username (str): Unique username
            password (str): Plain text password
            email (str, optional): User email
        
        Returns:
            User: Newly created user instance
        """
        # Check if username already exists
        if cls.query.filter_by(username=username).first():
            raise ValueError("Username already exists")

        new_user = cls(
            username=username,
            email=email
        )
        new_user.set_password(password)
        return new_user

    def __repr__(self):
        return f'<User {self.username}>'

@login_manager.user_loader
def load_user(user_id):
    """Load user for Flask-Login"""
    return User.query.get(int(user_id))