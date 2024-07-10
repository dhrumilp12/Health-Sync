from transformers import TFBertForSequenceClassification, BertTokenizer
import tensorflow as tf
from sklearn.model_selection import train_test_split
from tensorflow.data import Dataset
from models.user import User

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

def create_model(num_labels):
    """Create a classification model with specified number of labels."""
    model = TFBertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=num_labels)
    return model

model = create_model(num_labels=5)  # Assuming num_labels aligns with different intents

def encode_examples(queries, labels):
    """Prepare text inputs and labels for training."""
    input_ids = []
    attention_masks = []
    for query in queries:
        encoding = tokenizer.encode_plus(query, max_length=512, padding='max_length', truncation=True, return_tensors='tf')
        input_ids.append(encoding['input_ids'][0])  # Ensure flat tensors are appended
        attention_masks.append(encoding['attention_mask'][0])

    # Ensure tensors are stacked correctly to form batch dimensions
    input_ids = tf.stack(input_ids)
    attention_masks = tf.stack(attention_masks)
    labels = tf.convert_to_tensor(labels, dtype=tf.int32)  # Ensure labels are tensors with correct type

    return input_ids, attention_masks, labels


def fine_tune_model(train_queries, train_labels, val_queries, val_labels, epochs=3):
    """Fine-tune the model on training and validation data."""
    train_input_ids, train_attention_masks, train_labels = encode_examples(train_queries, train_labels)
    val_input_ids, val_attention_masks, val_labels = encode_examples(val_queries, val_labels)

    # Create datasets from tensor slices
    train_dataset = Dataset.from_tensor_slices(({'input_ids': train_input_ids, 'attention_mask': train_attention_masks}, train_labels))
    val_dataset = Dataset.from_tensor_slices(({'input_ids': val_input_ids, 'attention_mask': val_attention_masks}, val_labels))

    # Debug: Print shapes to confirm dimensions
    for features, label in train_dataset.take(1):
        print("Feature shapes:", {k: v.shape for k, v in features.items()}, "Label shape:", label.shape)

    optimizer = tf.keras.optimizers.Adam(learning_rate=2e-5, epsilon=1e-8)
    loss = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)
    model.compile(optimizer=optimizer, loss=loss, metrics=['accuracy'])
    model.fit(train_dataset.batch(32), epochs=epochs, validation_data=val_dataset.batch(32))

    return model


def predict(query):
    """Generate model predictions for the given query."""
    print(f"Original query: {query}")
    inputs = tokenizer.encode_plus(query, return_tensors='tf', max_length=512, truncation=True, padding='max_length')
    predictions = model(inputs['input_ids'], attention_mask=inputs['attention_mask'])
    logits = predictions.logits
    softmax_scores = tf.nn.softmax(logits, axis=1).numpy()[0]
    print(f"Logits: {logits}")
    print(f"Softmax scores: {softmax_scores}")
    return logits



def save_model(model, path):
    """Save the trained model to a specified path."""
    model.save_pretrained(path)

def decode_prediction(prediction, user):
    """Decode model predictions into human-readable text."""
    # Applying softmax to get probabilities
    probabilities = tf.nn.softmax(prediction, axis=1)
    print("Probabilities shape:", probabilities.shape)  # Debug: Check shape

    # Get the class ID safely
    class_id = tf.argmax(probabilities, axis=1).numpy()[0]
    print("Class ID:", class_id)  # Debug: Check class ID

    # Extract confidence safely and convert it to a native Python float
    confidence = float(probabilities.numpy()[0][class_id])
    print("Confidence:", confidence)  # Debug: Check confidence

    # Custom responses
    responses = {
        0: f"You should take your {user.medications[0].name} at {user.medications[0].reminderTimes[0]}" if user.medications else "No medication information available.",
        1: "Drink water regularly throughout the day.",
        2: "Ensure you get at least 7-8 hours of sleep each night.",
        3: "Include more fruits and vegetables in your diet.",
        4: "Regular exercise is important, aim for at least 30 minutes a day."
    }
    
    response_text = responses.get(class_id, "I'm not sure how to respond to that.")
    return {"response": response_text, "confidence": confidence}



def update_model_with_feedback(query, correct_label):
    """Update the model based on user feedback."""
    train_queries = [query]
    train_labels = [correct_label]
    print("Updating model with:", train_queries, train_labels)  # Confirm input data
    fine_tune_model(train_queries, train_labels, train_queries, train_labels, epochs=1)
