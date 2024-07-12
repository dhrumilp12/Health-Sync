import os
import pymongo
from dotenv import load_dotenv
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
from langchain_community.vectorstores import AzureCosmosDBVectorSearch
from langchain.prompts import PromptTemplate
from bson.objectid import ObjectId

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
    medication_collection = db['Medication']

    # Initialize vector store for searching through embedded text content
    vector_store = AzureCosmosDBVectorSearch(
        collection=medication_collection,
        embedding=embedding_model,
        index_name="VectorSearchIndex",
        text_key="textContent",
        embedding_key="vectorContent"
    )

    # Define the system prompt template focusing on elderly health management
    system_prompt = """
    You are a knowledgeable health assistant trained to provide health management information and support for the elderly. You can answer questions based on your training data.

    Medication Information:
    {medications}

    Question:
    {question}
    """

    # Instantiate PromptTemplate with the system prompt
    prompt_template = PromptTemplate.from_template(system_prompt)

    return {
        "llm": llm,
        "embedding_model": embedding_model,
        "vector_store": vector_store,
        "prompt_template": prompt_template,
        "db": db
    }

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

def process_langchain_query(question, username, components):
    llm = components["llm"]
    prompt_template = components["prompt_template"]
    db = components["db"]

    # Fetch user-specific data
    user = db.User.find_one({'username': username})  # Assuming username is unique
    if not user:
        return "User not found."

    # Assuming the user document includes an embedded list of medications
    medications = user.get('medications', [])

    # If medications exist, prepare the list for the prompt
    medications_list = json.dumps(medications, indent=2) if medications else "No medications found."

    # Construct the full prompt
    full_prompt = prompt_template.format(medications=medications_list, question=question)
    logger.info(f"Full prompt: {full_prompt}")

    # Invoke the model
    result = llm.invoke(full_prompt)
    logger.info(f"Raw result from model: {result}")

    try:
        if isinstance(result, dict) and 'content' in result:
            response_content = result['content']
        elif 'choices' in result and result['choices']:
            response_content = result['choices'][0]['text']
        else:
            response_content = "No response generated."
    except Exception as e:
        logger.error(f"Error processing response: {str(e)}")
        response_content = "Error processing response."

    return response_content