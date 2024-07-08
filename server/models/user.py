from mongoengine import Document, StringField, EmailField, DateTimeField, ListField, BooleanField, EmbeddedDocument, EmbeddedDocumentField, IntField
from datetime import datetime

class Medication(EmbeddedDocument):
    name = StringField(required=True)
    dosage = StringField(required=True)
    frequency = StringField(required=True)
    reminderTimes = ListField(StringField())

class DoctorContact(EmbeddedDocument):
    name = StringField(required=True)
    specialization = StringField(required=True)
    contactNumber = StringField(required=True)

class EmergencyContact(EmbeddedDocument):
    name = StringField(required=True)
    relation = StringField(required=True)
    contactNumber = StringField(required=True)

class User(Document):
    username = StringField(required=True, unique=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    first_name = StringField(required=True)
    last_name = StringField(required=True)
    date_of_birth = DateTimeField(required=True)
    gender = StringField()
    phone_number = StringField()
    medical_conditions = ListField(StringField())
    medications = ListField(EmbeddedDocumentField(Medication))
    doctor_contacts = ListField(EmbeddedDocumentField(DoctorContact))
    emergency_contacts = ListField(EmbeddedDocumentField(EmergencyContact))
    sos_location = StringField()
    language_preference = StringField()
    notification_enabled = BooleanField(default=True)
    login_attempts = IntField(default=0)
    account_locked = BooleanField(default=False)
