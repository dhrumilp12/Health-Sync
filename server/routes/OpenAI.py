from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.speech_service import speech_to_text
from models.user import User
from services.escalation import escalate_issue

import logging
from services.langchain import setup_langchain, process_langchain_query

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

OpenAI_routes = Blueprint("OpenAI", __name__)


    
@OpenAI_routes.route('/OpenAI', methods=['POST'])
@jwt_required()
def query_langchain():
    question = request.json.get('question', '')
    email = get_jwt_identity()  # If using JWT to identify the user
    logger.info(f"Received question: {question} for user: {email}")
    if not question:
        return jsonify({"error": "Question is required"}), 400

    try:
        components = setup_langchain()
        result = process_langchain_query(question, email, components)
        return jsonify({"response": result}), 200
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        escalate_issue(email, question, str(e))
        return jsonify({"error": str(e), "message": "Your issue has been escalated to human support. You will receive a response shortly."}), 500
    
@OpenAI_routes.route("/speech_to_text", methods=['POST'])
def handle_voice_input():
        # Check if the part 'audio' is present in files
        if 'audio' not in request.files:
            return jsonify({'error': 'Audio file is required'}), 400
        # Assume the voice data is sent as a file or binary data
        voice_data = request.files['audio']

        # Save the temporary audio file if needed or pass directly to the speech_to_text function
        text_output = speech_to_text(voice_data)
        
        if text_output:
            return jsonify({'message': text_output}), 200
        else:
            return jsonify({'error': 'Speech recognition failed'}), 400