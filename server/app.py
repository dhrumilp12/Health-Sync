from dotenv import load_dotenv
from flask import Flask
import os
from twilio.rest import Client
import geocoder

load_dotenv()

app = Flask(__name__)

TWILIO_ACCOUNT_SID=os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN=os.getenv("TWILIO_AUTH_TOKEN")
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

@app.route('/')
def home():
    return "Hello, HealthSync!"

@app.route('/call')
def makeCalls(): 
    FROM_NUMBER = os.getenv("FROM_NUMBER")
    TO_NUMBER = os.getenv("TO_NUMBER")
    
    call=client.calls.create(
        from_=FROM_NUMBER,
        to=TO_NUMBER,
        url="http://demo.twilio.com/docs/voice.xml",
    )
    print(call.sid)
    return {call.sid}

@app.route('/gpsLocation')
def getLocation(): 
    myloc = geocoder.ip('me')
    return {"Current Location": myloc.latlng}

if __name__ == '__main__':
    app.run(debug=True)
