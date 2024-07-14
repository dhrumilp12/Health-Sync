import logging
import re
import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import User,Medication,DoctorContact,EmergencyContact,AppointmentSchedule,MedicationSchedule
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta,datetime
from twilio.rest import Client
import stripe

TWILIO_ACCOUNT_SID=os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN=os.getenv("TWILIO_AUTH_TOKEN")
STRIPE_SECONDARY_KEY=os.getenv("STRIPE_SECONDARY_KEY")
stripe.api_key=STRIPE_SECONDARY_KEY
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

user_routes = Blueprint("user", __name__)

# Helper function to validate email
def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

@user_routes.post('/register')
def register():
    data = request.get_json(force=True)
    print("Received data:", data)
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    date_of_birth_str = data.get('date_of_birth')
    gender = data.get('gender', None)
    phone_number = data.get('phone_number', None)
    medical_conditions = data.get('medical_conditions', [])
    medications = data.get('medications', [])
    doctor_contacts = data.get('doctor_contacts', [])
    emergency_contacts = data.get('emergency_contacts', [])
    sos_location = data.get('sos_location', None)
    language_preference = data.get('language_preference', None)
    notification_enabled = data.get('notification_enabled', True)

    # Validate all required fields are provided
    print("Checking data:", username, email, password, first_name, last_name, date_of_birth_str)
    if not all([username, email, password, first_name, last_name, date_of_birth_str]):
        return jsonify({"msg": "Missing required parameter"}), 400

    # Convert date_of_birth to datetime
    try:
        date_of_birth = datetime.strptime(date_of_birth_str, '%Y-%m-%d')
        if date_of_birth >= datetime.now():
            return jsonify({"msg": "Date of birth cannot be in the future"}), 400
    except ValueError:
        return jsonify({"msg": "Date of birth must be in YYYY-MM-DD format"}), 400
    
    if not is_valid_email(email):
        return jsonify({"msg": "Invalid email format"}), 400
    
    
    if len(password) < 8 or not re.search("[0-9]", password) or not re.search("[A-Z]", password):
        return jsonify({"msg": "Password must be at least 8 characters long, include a number, and an uppercase letter"}), 400

    if User.objects(email=email).first():
        return jsonify({"msg": "Email already registered"}), 409
    
    if User.objects(username=username).first():
        return jsonify({"msg": "Username already taken"}), 409

    hashed_password = generate_password_hash(password)
    new_user = User(
        username=username,
        email=email,
        password=hashed_password,
        first_name=first_name,
        last_name=last_name,
        date_of_birth=date_of_birth,
        gender=gender,
        phone_number=phone_number,
        medical_conditions=medical_conditions,
        medications=[Medication(**med) for med in medications],
        doctor_contacts=[DoctorContact(**doc) for doc in doctor_contacts],
        emergency_contacts=[EmergencyContact(**emc) for emc in emergency_contacts],
        sos_location=sos_location,
        language_preference=language_preference,
        notification_enabled=notification_enabled
    )
    new_user.save()
    # Create an access token for the new user
    access_token = create_access_token(identity=email, expires_delta=timedelta(hours=48))
    return jsonify({"msg": "User registered successfully", "access_token": access_token}), 201

@user_routes.post('/login')
def login():
    login_val = request.json.get('login', None)
    password = request.json.get('password', None)

    if not login_val or not password:
        return jsonify({"msg": "Missing login or password"}), 400

    # Allow login with either email or username
    user = User.objects(__raw__={'$or': [{'email': login_val}, {'username': login_val}]}).first()
    if user and check_password_hash(user.password, password):
        if user.account_locked:
            return jsonify({"msg": "Account is locked due to too many failed login attempts"}), 403
        user.update(set__login_attempts=0)
        access_token = create_access_token(identity=user.email, expires_delta=timedelta(hours=48))
        return jsonify(access_token=access_token), 200
    else:
        user.update(inc__login_attempts=1)
        if user.login_attempts >= 5:
            user.update(set__account_locked=True)
        return jsonify({"msg": "Invalid login credentials"}), 401

@user_routes.get('/protected')
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@user_routes.get('/profile')
@jwt_required()
def get_profile():
    current_user_email = get_jwt_identity()
    user = User.objects(email=current_user_email).exclude('password').only('username', 'email', 'first_name', 'last_name', 'date_of_birth', 'gender', 'phone_number', 'medical_conditions', 'medications', 'doctor_contacts', 'emergency_contacts', 'sos_location', 'language_preference', 'notification_enabled').first()
    if user:
        user_dict = user.to_mongo().to_dict()
        # Fetch user details without the password field
        user_dict.pop('password', None)  # Remove password from the dictionary
        # Convert ObjectId to string
        user_dict['_id'] = str(user_dict['_id'])
        return jsonify(user_dict), 200
    return jsonify({"msg": "User not found"}), 404

@user_routes.put('/profile')
@jwt_required()
def update_profile():
    current_user_email = get_jwt_identity()
    user = User.objects(email=current_user_email).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    data = request.get_json()
    # Ensure reminderTimes is a list for each medication
    if 'medications' in data:
        for medication in data['medications']:
            if 'reminderTimes' in medication and not isinstance(medication['reminderTimes'], list):
                medication['reminderTimes'] = list(medication['reminderTimes'])
                
    user.modify(
        first_name=data.get('first_name', user.first_name),
        last_name=data.get('last_name', user.last_name),
        gender=data.get('gender', user.gender),
        phone_number=data.get('phone_number', user.phone_number),
        language_preference=data.get('language_preference', user.language_preference),
        notification_enabled=data.get('notification_enabled', user.notification_enabled),
        medical_conditions=data.get('medical_conditions', user.medical_conditions),
        medications=data.get('medications', user.medications),
        doctor_contacts=data.get('doctor_contacts', user.doctor_contacts),
        emergency_contacts=data.get('emergency_contacts', user.emergency_contacts),
        sos_location=data.get('sos_location', user.sos_location)
    )
    user.save()
    return jsonify({"msg": "Profile updated successfully"}), 200

@user_routes.post('/change-password')
@jwt_required()
def change_password():
    current_user_email = get_jwt_identity()
    user = User.objects(email=current_user_email).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    
    if not current_password or not new_password:
        return jsonify({"msg": "Please provide current and new passwords"}), 400
    if not check_password_hash(user.password, current_password):
        return jsonify({"msg": "Current password is incorrect"}), 401
    # Validate the new password strength
    if len(new_password) < 8 or not re.search("[0-9]", new_password) or not re.search("[A-Z]", new_password):
        return jsonify({"msg": "New password must be at least 8 characters long, include a number, and an uppercase letter"}), 400
    user.password = generate_password_hash(new_password)
    user.save()
    return jsonify({"msg": "Password changed successfully"}), 200

@user_routes.delete('/delete-account')
@jwt_required()
def delete_account():
    current_user_email = get_jwt_identity()
    user = User.objects(email=current_user_email).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()
    current_password = data.get('password')
    
    if not current_password:
        return jsonify({"msg": "Password required"}), 400

    # Verify the password
    if not check_password_hash(user.password, current_password):
        return jsonify({"msg": "Password is incorrect"}), 401
    
    # Optionally, perform more checks or request re-authentication if necessary
    user.delete()
    return jsonify({"msg": "User account deleted successfully"}), 200


@user_routes.post('/logout')
@jwt_required()
def logout():
    # JWT Revocation or Blacklisting could be implemented here if needed
    jwt_id = get_jwt_identity()
    logging.info(f"User {jwt_id} logged out successfully")
    return jsonify({"msg": "Logout successful"}), 200

@user_routes.post('/schedule-appointment')
def scheduleAppointment():
    data = request.get_json(force=True)
    name = data.get('name')
    doctorName = data.get('doctorName')
    date = data.get('date')
    print("Checking all data: ", name, doctorName, date)
    newAppointment = AppointmentSchedule(
        name=name,
        doctorName=doctorName,
        date=date
    )
    newAppointment.save()
    return jsonify({"msg": "Appointment successfully created"}), 200

@user_routes.get('/get-appointments-list')
def getAppointmentsList():
    appointments = AppointmentSchedule.objects()
    appointments_list = []
    for appointment in appointments:
        appointments_list.append({
            "name": appointment.name,
            "doctorName": appointment.doctorName,  
            "date": appointment.date.isoformat()  
        })
    print("Appointment list: ", appointments_list)
    return jsonify(appointments_list), 200

@user_routes.post('/schedule-medication')
def scheduleMedication(): 
    # Implement scheduling logic and reminder notifications.
    data=request.get_json()
    medicineName = data.get('medicineName')
    dosage = data.get('dosage')
    frequency = data.get('frequency')
    date = data.get('date')
    reminderTimes = data.get('reminderTimes')
    print("Checking all data: ", medicineName, dosage, frequency, date,reminderTimes)
    # Adding the fields - Morning (after breakfast), Night (after dinner)
    newMedication = MedicationSchedule(
        medicineName=medicineName,
        dosage=dosage,
        frequency=frequency,
        date=date,
        reminderTimes=reminderTimes
    )
    newMedication.save()
    return jsonify({"msg": "Medication successfully scheduled"}), 200

@user_routes.get('/get-medications')
def getMedicationsList():
    medications = MedicationSchedule.objects()
    medications_list = []
    for medication in medications:
        medications_list.append({
            "medicineName": medication.medicineName,
            "dosage": medication.dosage,  
            "frequency": medication.frequency,
            "date": medication.date.isoformat(),
            "reminderTimes": medication.reminderTimes
        })
    # Extract the time from the first medication's date
    time = medications_list[0]["date"]
    datetime_obj = datetime.strptime(time, "%Y-%m-%dT%H:%M:%S")
    timeGivenByUser = datetime_obj.time()
    print("Time given by the user: ", timeGivenByUser)
    
    # Get the current time
    currenttime = datetime.now()
    current_time_only = currenttime.time()
    print("Current time: ", current_time_only)  # Prints the current time
    
    # Compare the times
    # if timeGivenByUser <= current_time_only:
    #     TO_NUMBER = os.getenv("TO_NUMBER")
    #     FROM_NUMBER_SMS = os.getenv("FROM_NUMBER_SMS")
    #     message=client.messages.create(to=TO_NUMBER,from_=FROM_NUMBER_SMS,body="Please consume your medicine. Sent from your Health Sync app.")
    #     print(message.body)
    # else:
    #     print("It's not time for your medicine yet")
    
    return jsonify(medications_list), 200

@user_routes.post('/create-checkout-session')
def make_payment():
    try:
        data = request.get_json()
        medicineName=data['medicineName']
        amount = data['amount']  

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price_data': {
                        'currency': 'inr',
                        'product_data': {
                            'name': medicineName,
                        },
                        'unit_amount': amount,  
                    },
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url='https://your-success-url.com',
            cancel_url='https://your-cancel-url.com',
        )
        return jsonify({"msg": "Payment made successfully!!", "sessionId": session.id})
    except stripe.error.StripeError as e:
        return jsonify({"error": str(e)}), 400
