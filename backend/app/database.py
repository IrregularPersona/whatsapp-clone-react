from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.pool import QueuePool
from app.extensions import db
import os

class DatabaseFactory:
    """Factory class for creating database connections"""
    
    @staticmethod
    def create_engine(config):
        """
        Create a database engine based on configuration
        
        Args:
            config: Configuration object containing database settings
            
        Returns:
            SQLAlchemy engine instance
        """
        if config.TESTING:
            # Use in-memory SQLite for testing
            return create_engine('sqlite:///:memory:')
            
        elif config.DEBUG:
            # Use SQLite for development
            db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'chat.db')
            return create_engine(
                f'sqlite:///{db_path}',
                poolclass=QueuePool,
                pool_size=5,
                max_overflow=10
            )
            
        else:
            # Production database configuration
            # You can easily switch to PostgreSQL, MySQL, etc.
            return create_engine(
                config.SQLALCHEMY_DATABASE_URI,
                poolclass=QueuePool,
                pool_size=20,
                max_overflow=30,
                pool_timeout=30,
                pool_recycle=1800
            )

    @staticmethod
    def init_app(app, config):
        """
        Initialize the database for the application
        
        Args:
            app: Flask application instance
            config: Configuration object
        """
        # Create engine
        engine = DatabaseFactory.create_engine(config)
        
        # Create session factory
        session_factory = sessionmaker(bind=engine)
        Session = scoped_session(session_factory)
        
        # Configure SQLAlchemy
        app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DATABASE_URI
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = config.SQLALCHEMY_TRACK_MODIFICATIONS
        
        # Initialize Flask-SQLAlchemy
        db.init_app(app)
        
        # Create all tables
        with app.app_context():
            db.create_all()
            
        return Session 