from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import User
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

user_routes = Blueprint("user", __name__)

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

    # Convert date_of_birth to datetime
    try:
        date_of_birth = datetime.strptime(date_of_birth_str, '%Y-%m-%d')
    except ValueError:
        return jsonify({"msg": "Invalid date format. Use YYYY-MM-DD."}), 400

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
    access_token = create_access_token(identity=email)
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
        access_token = create_access_token(identity=user.email)  # Using email as the identity
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Invalid login credentials"}), 401

@user_routes.get('/protected')
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200
