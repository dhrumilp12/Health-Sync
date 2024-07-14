
## Created with ❤️ by Dhrumil,Anup and Vidip
`Dhrumil Patel - Full Stack Developer & Software Engineer`<br>

# HealthSync
**HealthSync** is more than just an app; it's a **lifeline for the elderly**. This web application streamlines complex health management tasks into a user-friendly interface. By integrating **medication schedules, doctor's appointments, emergency services, and real-time health monitoring**, **HealthSync** acts as a **comprehensive health assistant** that enhances the autonomy and safety of its users, ensuring they feel secure and supported every day.

## Features

- **Medication Management:** Automated schedules and reminders for medications, including dosage timings with a feature to reorder prescriptions seamlessly.
- **Appointment Scheduler:** Direct integration with healthcare providers to schedule appointments, featuring transportation arrangements like Uber for easy access to healthcare facilities.
- **SOS Emergency Button:** A one-click emergency call feature that promptly alerts emergency services and shares the user’s location and medical profile with predefined contacts.
- **AI-Powered Health Assistant:** Employs natural language processing to facilitate interaction through voice commands, helping users recall appointment details and access medical advice.
- **Interactive Health Education:** Provides customized educational content on common elderly health issues, medication management, and lifestyle tips.
- **AI Nutritionist:** An AI-driven feature that analyzes dietary habits and recommends personalized meal plans to promote a healthier lifestyle.

## Technologies Used

- **Languages:** 
  - **[JavaScript (React Native)](https://react.dev/)** was chosen for its efficiency in building interactive user interfaces, with **[Create React App](https://create-react-app.dev/)** used to optimize the development experience
  - **[Python](https://www.python.org/)** Employs robust scripting capabilities that manage backend logic and data processing.

- **Frameworks:** 
  - **[Flask](hhttps://flask.palletsprojects.com/en/3.0.x/)** was chosen to manage backend operations, including API routing and middleware functionalities, due to its lightweight and unopinionated structure.

- **Platforms:** 
  - **[Azure for cloud services and AI functionalities](https://azure.microsoft.com/en-us/solutions/migration/migrate-modernize-innovate?ef_id=_k_ab0ededb1c7f18961d7cb8483cd18aaa_k_&OCID=AIDcmme9zx2qiz_SEM__k_ab0ededb1c7f18961d7cb8483cd18aaa_k_&msclkid=ab0ededb1c7f18961d7cb8483cd18aaa)** Provides cloud services and AI functionalities, essential for hosting and scaling our application.

- **Services:** 
  - **[window.speechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/Window/speechSynthesis)** facilitates text-to-speech functionalities, improving accessibility for users with different needs.
  - **[Geocoder](https://pypi.org/project/geocoder/)** offers precise location-based services, critical for effective emergency response features.

- **Cloud Services:** 
  - The **[Azure's OpenAI API](https://learn.microsoft.com/en-us/azure/ai-services/openai/overview)** platform was integrated for generating empathetic, context-aware responses through advanced AI models like GPT 3.5.
  - **[Azure Speech Service](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/overview)** enable users to interact with the platform using their voice, improving accessibility and user experience. Speech-to-text allowed users to input requests through speech.

- **Databases:** 
  - **[MongoDB](https://www.mongodb.com/)**, utilized for its flexibility and scalability, securely storing user data and medical records.

- **APIs:** 
  - **[Twilio](https://www.twilio.com/):** Provides reliable communication services for emergency contact notifications.
  - **[Transportation APIs](https://rapidapi.com/category/Transportation):** Facilitates the integration of transportation booking features directly within the app.
  - **[Strip API](https://stripe.com/):** Manages financial transactions such as prescription reordering.
  - **[Food API](https://rapidapi.com/collection/food-apis):** Supports the AI Nutritionist feature, aiding in dietary tracking and meal planning.

## Getting Started

### Prerequisites

- Node.js
- Python 3.8+
- MongoDB

### Installation

1. Clone the repo
```
https://github.com/dhrumilp12/Health-Sync.git
```
3. Setup the backend environment with PIP
```
cd .\server\
pip install -r requirements.txt
```
3. Setup the frontend environment with NPM
```
cd .\healthsync-frontend\
npm install
```
4. Run the backend:
```
python App.py
```
5. run the frontend:
```
npm start
```
6. Build the frontend:
```
npm run build
```

