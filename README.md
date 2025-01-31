# Spam Email Detection

## Project Overview
This project focuses on developing a spam email detection system using machine learning techniques. The system classifies emails as either **"spam"** (junk or unwanted emails) or **"ham"** (legitimate emails) based on textual content. It leverages the **Naive Bayes** algorithm, a probabilistic model known for its efficiency in text classification tasks. A web-based interface allows users to input email content and receive real-time classification results.

## Features
- **Real-time Email Classification:** Users can input email content to check if it's spam or ham.
- **Machine Learning Model:** Utilizes the **Naive Bayes** algorithm for text classification.
- **Text Preprocessing:** Tokenization, stop word removal, and vectorization using **Count Vectorizer**.
- **Web-based Interface:** A user-friendly UI for easy interaction.
- **Dataset Training & Evaluation:** The model is trained on a labeled dataset to ensure high accuracy.

## Technologies Used
- **Programming Language:** Python
- **Machine Learning:** Scikit-learn (Naive Bayes classifier)
- **Web Framework:** Flask
- **Data Preprocessing:** Pandas, Numpy, Scikit-learn
- **Front-end:** HTML, CSS, JavaScript

## Installation & Setup
### Prerequisites:
Ensure you have the following installed:
- Python (>=3.7)
- Pip package manager
- Virtual environment (optional but recommended)

### Step 1: Clone the Repository
```bash
git clone https://github.com/RajaMuhammadHammad/Spam_Email_Detection.git
cd spam-email-detection
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Run the Application
```bash
python app.py
```
The application will be available at `http://127.0.0.1:5000/`.

## Dataset & Model Training
1. **Data Collection:** The dataset consists of labeled emails categorized as spam or ham.
2. **Preprocessing:** Tokenization, stop word removal, and vectorization using Count Vectorizer.
3. **Training:** The Naive Bayes model is trained on the processed dataset.
4. **Evaluation:** Accuracy and performance metrics are measured to ensure model reliability.

## Project Modules & Responsibilities
- **Raja Muhammad Hammad:** Model Implementation & Data Gathering
- **Muhammad Haris Tahiri:** Data Cleaning & Preprocessing
- **AbdulAhad Khan:** Front-End Development

## Usage
1. Open the web application.
2. Enter the email content (subject and body).
3. Click on "Check Email" to get the classification result.
4. The system will return whether the email is **spam** or **ham**.

## Contributors
- **Raja Muhammad Hammad** (Team Lead)
- **Muhammad Haris Tahiri**
- **AbdulAhad Khan**


