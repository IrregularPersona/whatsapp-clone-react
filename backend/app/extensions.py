from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_socketio import SocketIO
from flask_migrate import Migrate
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
bcrypt = Bcrypt()
socketio = SocketIO()
migrate = Migrate()
limiter = Limiter(key_func=get_remote_address)
jwt = JWTManager()