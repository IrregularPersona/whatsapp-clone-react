import os

class BaseConfig:
    """Base configuration class"""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'super_secret_fallback_key')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', SECRET_KEY)
    
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', 
        'sqlite:///chat.db'
    )

    # Security Settings
    SESSION_COOKIE_SECURE = True
    REMEMBER_COOKIE_SECURE = True

    ALLOWED_ORIGINS = [
        'http://localhost:3000',
    #    'https://yourdomain.com'
    ]