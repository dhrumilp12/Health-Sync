from flask import Flask
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from mongoengine import connect

from routes.user import user_routes
import os

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')  # Change this to a random secret key in production
app.config['MONGODB_SETTINGS'] = {
    'db': 'healthsync',
    'host': os.getenv('MONGO_URI')
}
connect(db="healthsync", host=os.getenv('MONGO_URI'), alias='default')
jwt = JWTManager(app)

# Register routes
app.register_blueprint(user_routes, url_prefix='/api')

@app.route('/')
def home():
    return "Hello, HealthSync!"

if __name__ == '__main__':
    app.run(debug=True)
