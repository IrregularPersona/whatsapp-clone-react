#rconfig/__init__.py
import os

class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'super_secret_fallback_key')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', 
        'sqlite:///chat.db'
    )

class DevelopmentConfig(Config):
    """Development-specific configuration"""
    DEBUG = True
    TESTING = False
    ALLOWED_ORIGINS = [ 'http://localhost:5000' ]

class ProductionConfig(Config):
    """Production-specific configuration"""
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    """Testing-specific configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

def get_config(config_name):
    """
    Return configuration based on environment
    
    Args:
        config_name (str): Name of the configuration environment
    
    Returns:
        Config: Configuration class
    """
    config_map = {
        'development': DevelopmentConfig,
        'production': ProductionConfig,
        'testing': TestingConfig
    }
    return config_map.get(config_name, DevelopmentConfig)
