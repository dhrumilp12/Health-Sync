from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models.user import User

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
    username = get_jwt_identity()  # If using JWT to identify the user
    if not question:
        return jsonify({"error": "Question is required"}), 400

    try:
        components = setup_langchain()
        result = process_langchain_query(question, username, components)
        return jsonify({"response": result}), 200
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500