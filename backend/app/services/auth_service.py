from ..models.user import User
from ..extensions import db 

class AuthService:
    def register_user(self, username, password):
        """Register a new user"""
        if User.query.filter_by(username=username).first():
            raise ValueError('Username already exists')
        
        new_user = User.create_user(username, password)

        db.session.add(new_user)
        db.session.commit()
        return new_user
    
    def authenticate_user(self, username, password):
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(user.password, password):
            return user
        return None
