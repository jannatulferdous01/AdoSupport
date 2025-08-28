"""Test data for API testing"""

# sample valid registration data
VALID_REGISTRATION_DATA = {
    "adolescent": {
        'email': 'adoluser1@example.com',
        'username': 'adoluser1',
        'password': '123456',
        'role': 'adolescent'
    },
    "parent": {
        'email': 'parent1@example.com',
        'username': 'parent1',
        'password': '123456',
        'role': 'parent'
    }
}

# Sample invalid registration data
INVALID_REGISTRATION_DATA = {
    "invalid_role": {
        'email': 'test@example.com',
        'username': 'testuser',
        'password': 'password123',
        'role': 'invalid_role'
    },
    "missing_email": {
        'username': 'testuser',
        'password': 'password123',
        'role': 'adolescent'
    },
    "empty_data": {}
}

# Sample login data
VALID_LOGIN_DATA = {
    'email': 'test@example.com',
    'password': 'testpassword123'
}

INVALID_LOGIN_DATA = {
    "wrong_password": {
        'email': 'test@example.com',
        'password': 'wrongpassword'
    },
    "missing_email": {
        'password': 'testpassword123'
    },
    "missing_password": {
        'email': 'test@example.com'
    }
}

# Sample chatbot queries
CHATBOT_QUERIES = {
    "anxiety": "I am feeling anxious about school",
    "depression": "I feel sad and don't want to do anything",
    "stress": "I'm stressed about my exams",
    "relationships": "I'm having problems with my friends",
    "empty": "",
    "long": "This is a very long query. " * 50
}