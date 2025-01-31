from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Use non-GUI backend for server-side plotting
import matplotlib.pyplot as plt
import io
import joblib
import os
import warnings
warnings.filterwarnings("ignore", category=UserWarning, module="matplotlib")
from matplotlib import rcParams
from google.oauth2 import id_token
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import re

# Set the font to DejaVu Sans or Times New Roman
rcParams['font.family'] = 'DejaVu Sans'  

# Initialize Flask app
app = Flask(__name__)
app.secret_key = "Enter your key"  # Flask secret key

# Enable CORS for all routes
CORS(app)

dataset = None

# Correct path to the CSV file for analysis (set this path according to your system)
FILE_PATH = r'D:\BSE\FIFTH SEMESTER\IDE LAB\Spam Email Project\mail_data.csv'

# Load your pre-trained model and vectorizer
model = joblib.load(r'D:\BSE\FIFTH SEMESTER\IDE LAB\Spam Email Project\spam_classifier.pkl')
vectorizer = joblib.load(r'D:\BSE\FIFTH SEMESTER\IDE LAB\Spam Email Project\vectorizer (1).pkl')

# Google OAuth client secret and scopes
CLIENT_SECRET_FILE = r'Enter your path'
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

# Route to render the index HTML
@app.route('/')
def index():
    return render_template('index.html')

# Route to check if the email content is spam or not
@app.route('/check_spam', methods=['POST'])
def check_spam():
    # Get email content from the request
    email_content = request.json['email_content']
    
    # Vectorize the email content
    email_vect = vectorizer.transform([email_content])
    
    # Make prediction
    prediction = model.predict(email_vect)[0]
    
    # Return result as JSON
    if prediction == 'spam':
        return jsonify({"result": "spam"})
    else:
        return jsonify({"result": "ham"})
    
# Route to handle the path of the dataset and analyze spam trend
@app.route('/analyze-trend', methods=['GET'])
def analyze_trend():
    global dataset
    # Read the dataset using the file path (FILE_PATH is defined in the backend)
    dataset = pd.read_csv(FILE_PATH)

    # Analyze the trend of spam vs ham in the dataset
    trend = analyze_spam_trend()

    # Return trend as JSON
    return jsonify({
        "trend": trend
    })

def analyze_spam_trend():
    """Analyzes the trend of spam vs ham in the dataset."""
    # Check if the global dataset variable exists
    global dataset
    if dataset is None:
        return {"error": "Dataset not loaded"}

    # Assuming the dataset has a column 'Category' with values 'spam' or 'ham'
    trend = dataset['Category'].value_counts().to_dict()

    return trend

# OAuth token verification
@app.route('/verify_google_token', methods=['POST'])
def verify_google_token():
    data = request.get_json()
    token = data.get('token')
    
    try:
        # Verify the token using Google's library
        idinfo = id_token.verify_oauth2_token(token, Request(), "83395420658-t39pcu4uj4pj4otvhjg1dj1vm70dig0s.apps.googleusercontent.com")

        # The ID token is valid. Get user info from the token.
        user_email = idinfo['email']
        user_name = idinfo.get('name', 'Unknown User')

        return jsonify({
            'email': user_email,
            'name': user_name
        })
    except ValueError as e:
        # Invalid token
        return jsonify({'error': 'Invalid token'}), 400

# Gmail API setup
def get_gmail_service():
    # Authenticate and create a Gmail API service
    flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
    credentials = flow.run_local_server(port=0)
    service = build('gmail', 'v1', credentials=credentials)
    return service

@app.route('/fetch_emails', methods=['GET'])
def fetch_emails():
    try:
        # Authenticate Gmail API
        service = get_gmail_service()

        # Fetch messages from the inbox
        results = service.users().messages().list(userId='me', labelIds=['INBOX'], maxResults=50).execute()
        messages = results.get('messages', [])

        spam_count = 0
        ham_count = 0
        total_emails = len(messages)
        email_data = []

        for message in messages:
            msg = service.users().messages().get(userId='me', id=message['id']).execute()
            payload = msg.get('payload', {})
            headers = payload.get('headers', [])

            # Extract email subject
            subject = ''
            for header in headers:
                if header['name'] == 'Subject':
                    subject = header['value']
                    break

            # Check if the email is spam or ham (based on custom logic or model)
            if re.search(r'\b(win|offer|free|lottery|urgent)\b', subject, re.IGNORECASE):
                spam_count += 1
                email_data.append({'subject': subject, 'type': 'Spam'})
            else:
                ham_count += 1
                email_data.append({'subject': subject, 'type': 'Ham'})

        # Calculate percentages
        spam_percentage = (spam_count / total_emails) * 100 if total_emails > 0 else 0
        ham_percentage = (ham_count / total_emails) * 100 if total_emails > 0 else 0

        return jsonify({
            'spam_count': spam_count,
            'ham_count': ham_count,
            'spam_percentage': spam_percentage,
            'ham_percentage': ham_percentage,
            'emails': email_data
        })

    except HttpError as error:
        print(f'An error occurred: {error}')
        return jsonify({'error': 'Failed to fetch emails'}), 500

@app.route('/analysis')
def analysis():
    return render_template('analysis.html')  # Create analysis.html for the Email Analysis page

if __name__ == '__main__':
    app.run(debug=True)
