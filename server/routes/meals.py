import logging
import json

from services.langchain import setup_langchain, process_langchain_query
from dateutil import parser
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import Meal, FoodItem, User
from mongoengine.errors import ValidationError

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

meals_routes = Blueprint('meals', __name__)

@meals_routes.route('/meals', methods=['POST'])
@jwt_required()
def add_meal():
    user_email = get_jwt_identity()
    user = User.objects(email=user_email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    try:
        data = request.get_json()
        meal_items = [FoodItem(**item) for item in data.get('meals', [])]
        # Parse the date using dateutil's parser to handle various formats
        date = parser.parse(data['date'])
        meal = Meal(user=user, date=date, meals=meal_items)
        meal.save()
        return jsonify({'status': 'success', 'message': 'Meal added successfully', 'meal': meal.to_json()}), 201
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'message': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Internal server error', 'message': str(e)}), 500

@meals_routes.route('/meals', methods=['GET'])
@jwt_required()
def get_meals():
    user_email = get_jwt_identity()
    user = User.objects(email=user_email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    meals = Meal.objects(user=user).order_by('-date')  # Use the user reference directly
    return jsonify({'status': 'success', 'meals': [meal.to_json() for meal in meals]}), 200


@meals_routes.route('/meals/<meal_id>', methods=['PUT'])
@jwt_required()
def update_meal(meal_id):
    user_email = get_jwt_identity()
    user = User.objects(email=user_email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    meal = Meal.objects(id=meal_id, user=user).first()
    if not meal:
        return jsonify({'error': 'Meal not found'}), 404

    data = request.get_json()
    try:
        # Parse date from the request, ensure it's present
        update_date = data.get('date')
        if not update_date:
            raise Exception("Date field is required")
        meal_items = [FoodItem(**item) for item in data.get('meals', [])]
        meal.update(set__meals=meal_items, set__date=update_date)
        meal.reload()  # Reload the updated meal
        return jsonify({'status': 'success', 'message': 'Meal updated successfully', 'meal': meal.to_json()}), 200
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'message': str(e)}), 400
    except Exception as e:
        print(f"Unexpected Error: {str(e)}")
        return jsonify({'error': 'Internal server error', 'message': str(e)}), 500


@meals_routes.route('/meals/<meal_id>', methods=['DELETE'])
@jwt_required()
def delete_meal(meal_id):
    user_email = get_jwt_identity()
    user = User.objects(email=user_email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    meal = Meal.objects(id=meal_id, user=user).first()

    if not meal:
        return jsonify({'error': 'Meal not found'}), 404

    meal.delete()
    return jsonify({'status': 'success', 'message': 'Meal deleted successfully'}), 200

@meals_routes.route('/suggest_meals', methods=['POST'])
@jwt_required()
def suggest_meals():
    user_email = get_jwt_identity()
    user = User.objects(email=user_email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    try:
        # Collecting dietary data for analysis
        meals = Meal.objects(user=user).as_pymongo()
        meal_data = json.dumps([{
        'id': str(meal['_id']),
        'date': meal['date'].isoformat(),
        'meals': [{
            'name': item['name'],
            'calories': item['calories'],
            'protein': item['protein'],
            'carbs': item['carbs'],
            'fats': item['fats'],
            'fiber': item.get('fiber', 0)
        } for item in meal['meals']]
    } for meal in meals])
        
        dietary_preferences = request.json.get('preferences', {})  # Collect dietary preferences if provided
        # Construct the prompt for the AI
        prompt = f"User dietary data: {meal_data}, medical conditions: {user.medical_conditions}, dietary preferences: {dietary_preferences}. Suggest a meal plan for the next week based on this information."

        # Process query with LangChain or similar AI service
        components = setup_langchain()
        suggested_plan = process_langchain_query(prompt, user.email, components)

        return jsonify({'response': suggested_plan}), 200
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        return jsonify({'error': str(e)}), 500
