from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_socketio import SocketIO
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
socketio = SocketIO()
migrate = Migrate()
jwtmanager = JWTManager()

login_manager.login_view = 'auth.login'
login_manager.session_protection = 'strong'