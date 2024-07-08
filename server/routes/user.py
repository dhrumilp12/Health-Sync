import logging
import re
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import User
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta,datetime

user_routes = Blueprint("user", __name__)

# Helper function to validate email
def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

@user_routes.post('/register')
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    date_of_birth_str = data.get('date_of_birth')

    # Validate all required fields are provided
    if None in [username, email, password, first_name, last_name, date_of_birth_str]:
        return jsonify({"msg": "Missing required parameter"}), 400
    
    if not is_valid_email(email):
        return jsonify({"msg": "Invalid email format"}), 400
    # Convert date_of_birth to datetime
    try:
        date_of_birth = datetime.strptime(date_of_birth_str, '%Y-%m-%d')
        if date_of_birth >= datetime.now():
            return jsonify({"msg": "Date of birth cannot be in the future"}), 400
    except ValueError:
        return jsonify({"msg": "Date of birth must be in YYYY-MM-DD format"}), 400
    
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
        date_of_birth=date_of_birth
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
    user.modify(
        first_name=data.get('first_name', user.first_name),
        last_name=data.get('last_name', user.last_name),
        gender=data.get('gender', user.gender),
        phone_number=data.get('phone_number', user.phone_number),
        language_preference=data.get('language_preference', user.language_preference),
        notification_enabled=data.get('notification_enabled', user.notification_enabled)
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