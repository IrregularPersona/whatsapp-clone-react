from ..models.user import User
from ..extensions import db, bcrypt

class AuthService:
    def register_user(self, username, password):
        """Register a new user"""
        if User.query.filter_by(username=username).first():
            raise ValueError('Username already exists')
        
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User.create_user(username, hashed_password)

        db.session.add(new_user)
        db.session.commit()
        return new_user
    
    def authenticate_user(self, username, password):
        user = User.query.filter_by(username=username).first()
        if user and bcrypt.check_password_hash(user.password, password):
            return user
        return None
