from mongoengine import Document, StringField, EmailField, FloatField, DateTimeField, ReferenceField, ListField, BooleanField, EmbeddedDocument, EmbeddedDocumentField, IntField, ValidationError
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

class AppointmentSchedule(Document): 
    name = StringField(required=True)
    doctorName = StringField(required=True)
    date = DateTimeField(required=True)

class FoodItem(EmbeddedDocument):
    name = StringField(required=True)
    calories = FloatField(required=True, min_value=0)
    protein = FloatField(default=0.0, min_value=0)
    carbs = FloatField(default=0.0, min_value=0)
    fats = FloatField(default=0.0, min_value=0)
    fiber = FloatField(default=0.0, min_value=0)  # Additional nutritional information

    def clean(self):
        """ Ensure that total macronutrients do not exceed total calories unexpectedly """
        if (self.protein * 4 + self.carbs * 4 + self.fats * 9) > self.calories:
            raise ValidationError("Caloric content does not match macronutrient profile.")

class Meal(Document):
    user = ReferenceField('User', required=True)
    date = DateTimeField(required=True)
    meals = ListField(EmbeddedDocumentField(FoodItem))
    created_at = DateTimeField(default=datetime.utcnow)  # Timestamp of when the meal was logged