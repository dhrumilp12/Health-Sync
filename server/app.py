from flask import Flask
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')  # Change this to a random secret key in production
jwt = JWTManager(app)

@app.route('/')
def home():
    return "Hello, HealthSync!"

if __name__ == '__main__':
    app.run(debug=True)
