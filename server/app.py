import collections

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from mongoengine import connect

collections.Iterable = collections.abc.Iterable

import os

from routes.meals import meals_routes
from routes.OpenAI import OpenAI_routes
from routes.SOS import SOS_routes
from routes.user import user_routes
from twilio.rest import Client

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')  # Change this to a random secret key in production
app.config['MONGODB_SETTINGS'] = {
    'db': 'healthsync',
    'host': os.getenv('MONGO_URI')
}
connect(db="healthsync", host=os.getenv('MONGO_URI'), alias='default')
jwt = JWTManager(app)

# Register routes
app.register_blueprint(user_routes, url_prefix='/api')
app.register_blueprint(OpenAI_routes, url_prefix='/api')
app.register_blueprint(SOS_routes)
app.register_blueprint(meals_routes, url_prefix='/api')

TWILIO_ACCOUNT_SID=os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN=os.getenv("TWILIO_AUTH_TOKEN")
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
print("Account SID: ",TWILIO_ACCOUNT_SID)
print("Auth Token: ",TWILIO_AUTH_TOKEN)

@app.route('/')
def home():
    return "Hello, HealthSync!"


if __name__ == '__main__':
    app.run(debug=True)
