import logging
from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from .extensions import (
    db,
    bcrypt,
    jwt,
    socketio,
    migrate
)
from config import get_config
from .database import DatabaseFactory

def create_app(config_name='development'):
    """
    Application factory to create the app
    Args:
        config_name (str): Configuration environment (dev/prod)
    """

    app = Flask(__name__)

    config = get_config(config_name)
    app.config.from_object(config)

    configure_logging(app)

    # Initialize database
    Session = DatabaseFactory.init_app(app, config)
    app.config['SQLALCHEMY_SESSION'] = Session

    # Initialize other extensions
    bcrypt.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app)
    migrate.init_app(app, db)

    limiter = Limiter(
        key_func=get_remote_address,
        default_limits=["100 per day", "30 per hour"]
    )

    limiter.init_app(app)

    CORS(app, resources={
        r"/api/*": {
            "origins": config.ALLOWED_ORIGINS,
            "supports_credentials": True,
            "allow_headers": [
                "Content-Type",
                "Authorization",
                "Access-Control-Allow-Credentials"
            ],
            "methods": ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        }
    })

    from .routes.auth import auth_blueprint
    #from .routes.chat import chat_blueprint
    from .routes.messages import message_blueprint
    #from .routes.group import group_blueprint

    app.register_blueprint(auth_blueprint, url_prefix='/api/auth')
    #app.register_blueprint(chat_blueprint, url_prefix='/api/chat')
    #app.register_blueprint(group_blueprint, url_prefix='/api/groups')
    app.register_blueprint(message_blueprint, url_prefix='/api/messages')

    register_error_handlers(app)
    return app

def configure_logging(app):
    """Configuer app logging"""

    handler = logging.FileHandler('app.log')
    handler.setLevel(logging.INFO)
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s %(message)s' 
    )
    handler.setFormatter(formatter)
    app.logger.addHandler(handler)

def register_error_handlers(app):
    """Register app-wide error handlers"""
    @app.errorhandler(404)
    def not_found_error(error):
        app.logger.error(f'Not found: {error}')
        return {'error': 'Resource not found'}, 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        app.logger.error(f'Server Error: {error}')
        return {'error' : 'Internal Server error'}, 500

    @app.errorhandler(Exception)
    def unhandled_exception(error):
        app.logger.error(f'Unhandled Exception: {error}')
        return {'error' : 'An unexpected error occurred'}, 500
