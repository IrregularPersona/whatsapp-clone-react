#rconfig/__init__.py
import os

class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'super_secret_fallback_key')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Database configuration defaults - these are read by the SQLALCHEMY_DATABASE_URI property
    # Subclasses can override these class attributes.
    DB_TYPE = os.environ.get('DB_TYPE', 'sqlite')
    DB_HOST = os.environ.get('DB_HOST', 'localhost')
    DB_PORT = os.environ.get('DB_PORT', '5432')
    DB_NAME = os.environ.get('DB_NAME', 'chat.db') # Default filename for SQLite if DB_TYPE is sqlite
    DB_USER = os.environ.get('DB_USER', 'postgres')
    DB_PASSWORD = os.environ.get('DB_PASSWORD', '')

    DEBUG = False
    TESTING = False
    
    @property
    def SQLALCHEMY_DATABASE_URI(self):
        """Computes the database URI based on instance attributes like DB_TYPE, TESTING, DB_NAME"""
        if self.TESTING and self.DB_TYPE == 'sqlite':
            return 'sqlite:///:memory:'
        
        if self.DB_TYPE == 'postgresql':
            return f'postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}'
        elif self.DB_TYPE == 'mysql':
            return f'mysql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}'
        elif self.DB_TYPE == 'sqlite':
            # DB_NAME is expected to be a filename like 'chat.db' for file-based SQLite.
            # Flask-SQLAlchemy prepends app.instance_path if a relative path is given for SQLite.
            return f'sqlite:///{self.DB_NAME}' 
        else:
            raise ValueError(f"Unsupported DB_TYPE: {self.DB_TYPE}")

class DevelopmentConfig(Config):
    """Development-specific configuration"""
    DEBUG = True
    TESTING = False # Explicitly not testing
    DB_TYPE = 'sqlite' # Override DB_TYPE for development
    DB_NAME = 'chat_dev.db' # Specific database file for development
    ALLOWED_ORIGINS = [
        'http://localhost:3000',  # React development server
        'http://localhost:5000'   # Flask development server
    ]

class ProductionConfig(Config):
    """Production-specific configuration"""
    DEBUG = False
    TESTING = False
    # For production, DB_TYPE, DB_HOST, etc., will primarily be sourced from environment variables
    # by the base Config attributes. We can override the *default value* for os.environ.get here if necessary.
    DB_TYPE = os.environ.get('DB_TYPE', 'postgresql') # e.g., Default to PostgreSQL if env var not set

class TestingConfig(Config):
    """Testing-specific configuration"""
    TESTING = True
    DEBUG = True # Often useful for tests to have debug mode on
    DB_TYPE = 'sqlite' # This ensures the property SQLALCHEMY_DATABASE_URI returns 'sqlite:///:memory:'
    # DB_NAME is not needed here as :memory: is used.

def get_config(config_name):
    """
    Return configuration instance based on environment name.
    
    Args:
        config_name (str): Name of the configuration environment (e.g., 'development', 'production', 'testing')
    
    Returns:
        Config: An instance of the appropriate configuration class.
    """
    config_map = {
        'development': DevelopmentConfig,
        'production': ProductionConfig,
        'testing': TestingConfig
    }
    # Fallback to DevelopmentConfig if config_name is not found or is invalid
    config_class = config_map.get(str(config_name).lower(), DevelopmentConfig)
    return config_class() # Return an instance
