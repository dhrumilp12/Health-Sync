import geocoder
import os

from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
from twilio.rest import Client
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import User

load_dotenv() 

SOS_routes = Blueprint("sos", __name__)
TWILIO_ACCOUNT_SID=os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN=os.getenv("TWILIO_AUTH_TOKEN")
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

@SOS_routes.route('/call', methods=['POST'])
@jwt_required()
def makeCalls(): 
    email = get_jwt_identity()  # Get the email of the logged-in user
    user = User.objects(email=email).first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    FROM_NUMBER = user.phone_number
    if not FROM_NUMBER:
        return jsonify({"error": "User phone number not found"}), 404

    # Assuming you want to call the first emergency contact
    if not user.emergency_contacts or not user.emergency_contacts[0].contactNumber:
        return jsonify({"error": "Emergency contact number not found"}), 404

    TO_NUMBER = user.emergency_contacts[0].contactNumber

    call = client.calls.create(
        from_=FROM_NUMBER,
        to=TO_NUMBER,
        url="http://demo.twilio.com/docs/voice.xml",
    )
    print(call.sid)
    return jsonify({"call_sid": call.sid})

@SOS_routes.route('/gpsLocation')
def getLocation(): 
    myloc = geocoder.ip('me')
    return {"Current Location": myloc.latlng}


