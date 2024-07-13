import os
import pymongo
from dotenv import load_dotenv
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
from langchain_community.vectorstores import AzureCosmosDBVectorSearch
from langchain.prompts import PromptTemplate
from bson.objectid import ObjectId
from models.user import User
from bson import json_util
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def setup_langchain():
    """
    Sets up and returns the components necessary for LangChain interaction with Azure OpenAI,
    tailored for the HealthSync application focusing on elderly health management.
    """
    load_dotenv()
    CONNECTION_STRING = os.getenv("MONGO_URI")
    AOAI_KEY = os.getenv("AOAI_KEY")
    AOAI_ENDPOINT = os.getenv("AOAI_ENDPOINT")
    EMBEDDINGS_DEPLOYMENT_NAME = os.getenv("EMBEDDINGS_DEPLOYMENT_NAME")
    COMPLETIONS_DEPLOYMENT_NAME = os.getenv("COMPLETIONS_DEPLOYMENT_NAME")
    AOAI_API_VERSION = "2024-02-15-preview"

    # Establish Azure OpenAI connectivity
    llm = AzureChatOpenAI(
        model="gpt-35-turbo",
        deployment_name=COMPLETIONS_DEPLOYMENT_NAME,
        azure_endpoint=AOAI_ENDPOINT,
        api_key=AOAI_KEY,
        api_version=AOAI_API_VERSION
    )

    embedding_model = AzureOpenAIEmbeddings(
        azure_endpoint=AOAI_ENDPOINT,
        api_key=AOAI_KEY,
        api_version=AOAI_API_VERSION,
        model="text-embedding-ada-002",
        deployment_name=EMBEDDINGS_DEPLOYMENT_NAME,
        chunk_size=10
    )

    # Establish connection to the MongoDB database
    db_client = pymongo.MongoClient(CONNECTION_STRING)
    db = db_client['healthsync']
    
    # Initialize vector stores for multiple collections
    vector_stores = setup_vector_store(db, embedding_model)

    # Define the system prompt template focusing on elderly health management
    system_prompt = """
    You are a knowledgeable health assistant trained to provide health management information and support for the elderly. You can answer questions based on your training data.

    Medication Information:
    {medications}
    Doctor Contact Information:
    {doctor_contacts}
    Emergency Contact Information:
    {emergency_contacts}

    Question:
    {question}
    """

    # Instantiate PromptTemplate with the system prompt
    prompt_template = PromptTemplate.from_template(system_prompt)

    return {
        "llm": llm,
        "embedding_model": embedding_model,
        "vector_stores": vector_stores,
        "prompt_template": prompt_template,
        "db": db
    }

def setup_vector_store(db, embedding_model):
    collections = ['Medication', 'DoctorContact', 'EmergencyContact']  # List additional collections here
    vector_stores = {}
    for collection_name in collections:
        collection = db[collection_name]
        vector_store = AzureCosmosDBVectorSearch(
            collection=collection,
            embedding=embedding_model,
            index_name=f"{collection_name}VectorSearchIndex",
            text_key="textContent",
            embedding_key="vectorContent"
        )
        vector_stores[collection_name] = vector_store
    return vector_stores

def extract_text(docs, key='description'):
    """
    Extracts text from MongoDB documents using a specified key for displaying relevant information.

    Args:
        docs (list of pymongo documents): Documents from which to extract text.
        key (str): The key used to extract text from documents.

    Returns:
        list: A list containing the extracted text from each document.
    """
    return [doc.get(key, 'No description available') for doc in docs]

def process_langchain_query(question, email, components):
    llm = components["llm"]
    prompt_template = components["prompt_template"]
    db = components["db"]

    # Fetch user-specific data using MongoEngine's filtering
    user = User.objects(email=email).first()  # This returns a User object or None
    logger.info(f"Attempting to find user with email: {email}")
    if not user:
        logger.info("User not found.")
        return "User not found."
    else:
        logger.info(f"User found: {user.to_json()}")  # Log the user's data in JSON format for verification

     # Accessing medications, doctor_contacts, and emergency_contacts
    medications = user.medications if hasattr(user, 'medications') else []
    doctor_contacts = user.doctor_contacts if hasattr(user, 'doctor_contacts') else []
    emergency_contacts = user.emergency_contacts if hasattr(user, 'emergency_contacts') else []

    # Preparing lists for the prompt
    medications_list = json.dumps([med.to_mongo() for med in medications], indent=2) if medications else "No medications found."
    doctor_contacts_list = json.dumps([doc.to_mongo() for doc in doctor_contacts], indent=2) if doctor_contacts else "No doctor contacts found."
    emergency_contacts_list = json.dumps([ec.to_mongo() for ec in emergency_contacts], indent=2) if emergency_contacts else "No emergency contacts found."

    # Construct the full prompt
    full_prompt = prompt_template.format(medications=medications_list, doctor_contacts=doctor_contacts_list, emergency_contacts=emergency_contacts_list, question=question)
    logger.info(f"Full prompt: {full_prompt}")

    # Invoke the model
    result = llm.invoke(full_prompt)
    logger.info(f"Raw result from model: {result}")
    logger.info(f"Result type: {type(result)}, keys: {result.keys() if isinstance(result, dict) else 'N/A'}")


    try:
        if isinstance(result, dict):
            response_content = result.get('content', "No response generated.")
        elif hasattr(result, 'content'):  # Checking if result has 'content' attribute
            response_content = result.content
        else:
            response_content = "No response generated."
            logger.info("No valid response in model result.")

        # Clean up the response to remove "Answer:\n"
        response_content = response_content.replace("Answer:\n", "").strip()
    except Exception as e:
        logger.error(f"Error processing response: {str(e)}")
        response_content = "Error processing response."

    return response_content