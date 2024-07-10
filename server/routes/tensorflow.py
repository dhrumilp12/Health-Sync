from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.tensorflow import predict, tokenizer, update_model_with_feedback, decode_prediction
from models.user import User
import tensorflow as tf

tensorflow_routes = Blueprint("tensorflow", __name__)

@tensorflow_routes.route('/query', methods=['POST'])
@jwt_required()
def handle_query():
    user_email = get_jwt_identity()  # Fetch the identity from JWT token

    try:
        user = User.objects(email=user_email).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.json
        query = data.get('query')
        if not query:
            return jsonify({"error": "No query provided"}), 400

        prediction = predict(query)
        response = decode_prediction(prediction, user)
        return jsonify(response=response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@tensorflow_routes.route('/feedback', methods=['POST'])
@jwt_required()
def handle_feedback():
    user_email = get_jwt_identity()
    try:
        user = User.objects(email=user_email).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.json
        query = data.get('query')
        correct_label = data.get('correct_label')
        print("Received for feedback:", query, correct_label)
        if not query or correct_label is None:
            return jsonify({"error": "Query or correct label not provided"}), 400

        update_model_with_feedback(query, correct_label)
        return jsonify({"message": "Feedback received and model updated"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500