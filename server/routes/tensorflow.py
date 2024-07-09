from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.tensorflow import predict, tokenizer
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

def decode_prediction(prediction, user):
    class_id = int(tf.argmax(prediction, axis=1).numpy()[0])
    confidence = float(tf.nn.softmax(prediction, axis=1).numpy()[0][class_id])

    # Customize responses based on the user's data
    if class_id == 0:  # Assuming class_id 0 relates to medication timing queries
        if user.medications:
            medication_response = f"You should take your {user.medications[0].name} at {user.medications[0].reminderTimes[0]}"
        else:
            medication_response = "No medication information available."
        return {"response": medication_response, "confidence": confidence}
    
    # Add more detailed responses for other class_ids
    responses = {
        1: "Drink water regularly throughout the day.",
        2: "Ensure you get at least 7-8 hours of sleep each night.",
        3: "Include more fruits and vegetables in your diet.",
        4: "Regular exercise is important, aim for at least 30 minutes a day.",
        # Add other specific responses as needed
    }

    response_text = responses.get(class_id, "I'm not sure how to respond to that.")
    return {"response": response_text, "confidence": confidence}
