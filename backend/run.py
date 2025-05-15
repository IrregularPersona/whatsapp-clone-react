import os
import sys
from dotenv import load_dotenv

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import create_app
from backend.app.extensions import db, socketio
from backend.config import get_config

load_dotenv()

env = os.getenv('FLASK_ENV', 'development')
config_class = get_config(env)

app = create_app(config_class)

def create_tables():
    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")

if __name__ == '__main__':
    create_tables()

    socketio.run(
        app, 
        host='0.0.0.0', 
        port=5000, 
        debug=True
    )