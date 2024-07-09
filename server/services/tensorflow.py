from transformers import TFBertForSequenceClassification, BertTokenizer
import tensorflow as tf
from sklearn.model_selection import train_test_split
from tensorflow.data import Dataset

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

def create_model(num_labels):
    model = TFBertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=num_labels)
    return model

model = create_model(num_labels=5)  # Assuming num_labels aligns with different intents

def encode_examples(queries, labels):
    input_ids = []
    attention_masks = []
    for query in queries:
        encoding = tokenizer.encode_plus(query, max_length=512, padding='max_length', truncation=True, return_tensors='tf')
        input_ids.append(encoding['input_ids'])
        attention_masks.append(encoding['attention_mask'])
    return tf.constant(input_ids), tf.constant(attention_masks), tf.constant(labels)

def fine_tune_model(train_queries, train_labels, val_queries, val_labels, epochs=3):
    train_input_ids, train_attention_masks, train_labels = encode_examples(train_queries, train_labels)
    val_input_ids, val_attention_masks, val_labels = encode_examples(val_queries, val_labels)

    train_dataset = Dataset.from_tensor_slices(({'input_ids': train_input_ids, 'attention_mask': train_attention_masks}, train_labels))
    val_dataset = Dataset.from_tensor_slices(({'input_ids': val_input_ids, 'attention_mask': val_attention_masks}, val_labels))

    optimizer = tf.keras.optimizers.Adam(learning_rate=2e-5, epsilon=1e-8)
    loss = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)
    model.compile(optimizer=optimizer, loss=loss, metrics=['accuracy'])
    model.fit(train_dataset.shuffle(1000).batch(32), epochs=epochs, validation_data=val_dataset.batch(32))
    return model

def predict(query):
    inputs = tokenizer.encode_plus(query, return_tensors='tf', max_length=512, truncation=True, padding='max_length')
    predictions = model(inputs['input_ids'], attention_mask=inputs['attention_mask'])
    return predictions.logits.numpy()

def save_model(model, path):
    model.save_pretrained(path)
    