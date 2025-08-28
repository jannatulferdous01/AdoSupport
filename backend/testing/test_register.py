import json
from unittest.mock import patch, Mock
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from unittest.mock import patch, Mock
from api.json_input import (
    VALID_REGISTRATION_DATA,
    INVALID_REGISTRATION_DATA,
)

User = get_user_model()

# ==================================== Register test =====================================

class RegisterUserViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/register/'
        self.valid_adolescent_data = VALID_REGISTRATION_DATA["adolescent"]
        self.valid_parent_data = VALID_REGISTRATION_DATA["parent"]

    def test_successful_registration_adolescent(self):
        """successful registration with adolescent role"""
        with patch('api.views.RefreshToken.for_user') as mock_refresh:
            mock_token = Mock()
            mock_token.access_token = 'mock_access_token'
            mock_refresh.return_value = mock_token
            mock_refresh.return_value.__str__ = Mock(
                return_value='mock_refresh_token')

            response = self.client.post(
                self.register_url, self.valid_adolescent_data)

            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertTrue(User.objects.filter(
                email='test@example.com').exists())

            user = User.objects.get(email='test@example.com')
            self.assertEqual(user.username, 'testuser')
            self.assertEqual(user.role, 'adolescent')

            response_data = response.json()
            self.assertIn('success', response_data)
            self.assertIn('data', response_data)
            self.assertEqual(response_data['data']
                             ['email'], 'test@example.com')
            self.assertEqual(response_data['data']['role'], 'adolescent')

    def test_successful_registration_parent(self):
        """successful registration with parent role"""
        with patch('api.views.RefreshToken.for_user') as mock_refresh:
            mock_token = Mock()
            mock_token.access_token = 'mock_access_token'
            mock_refresh.return_value = mock_token
            mock_refresh.return_value.__str__ = Mock(
                return_value='mock_refresh_token')

            response = self.client.post(
                self.register_url, self.valid_parent_data)

            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertTrue(User.objects.filter(
                email='parent@example.com').exists())

            user = User.objects.get(email='parent@example.com')
            self.assertEqual(user.username, 'parentuser')
            self.assertEqual(user.role, 'parent')

    def test_invalid_role_selection(self):
        """registration with invalid role"""
        invalid_data = INVALID_REGISTRATION_DATA["invalid_role"]

        response = self.client.post(self.register_url, invalid_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertEqual(
            response_data['error'],
            "Invalid role selected. Choose either 'adolescent' or 'parent'."
        )
        self.assertFalse(User.objects.filter(
            email='test@example.com').exists())

    def test_duplicate_email_registration(self):
        """registration with existing email"""
        User.objects.create_user(
            email=self.valid_adolescent_data['email'],
            username='existinguser',
            password='123456',
            role='adolescent'
        )

        response = self.client.post(
            self.register_url, self.valid_adolescent_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertEqual(
            response_data['error'],
            "A user with this email already exists."
        )

    def test_duplicate_username_registration(self):
        """registration with existing username"""
        User.objects.create_user(
            email='existing@example.com',
            username=self.valid_adolescent_data['username'],
            password='123456',
            role='parent'
        )

        response = self.client.post(
            self.register_url, self.valid_adolescent_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertEqual(
            response_data['error'],
            "A user with this username already exists."
        )

    def test_missing_email(self):
        """registration without email"""
        invalid_data = INVALID_REGISTRATION_DATA["missing_email"]

        response = self.client.post(self.register_url, invalid_data)

        self.assertIn(response.status_code, [
                      status.HTTP_400_BAD_REQUEST, status.HTTP_500_INTERNAL_SERVER_ERROR])

    def test_missing_username(self):
        """registration without username"""
        invalid_data = self.valid_adolescent_data.copy()
        del invalid_data['username']

        response = self.client.post(self.register_url, invalid_data)

        self.assertIn(response.status_code, [
                      status.HTTP_400_BAD_REQUEST, status.HTTP_500_INTERNAL_SERVER_ERROR])

    def test_missing_password(self):
        """registration without password"""
        invalid_data = self.valid_adolescent_data.copy()
        del invalid_data['password']

        response = self.client.post(self.register_url, invalid_data)

        self.assertIn(response.status_code, [
                      status.HTTP_400_BAD_REQUEST, status.HTTP_500_INTERNAL_SERVER_ERROR])

    def test_missing_role(self):
        """registration without role"""
        invalid_data = self.valid_adolescent_data.copy()
        del invalid_data['role']

        response = self.client.post(self.register_url, invalid_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertEqual(
            response_data['error'],
            "Invalid role selected. Choose either 'adolescent' or 'parent'."
        )

    @patch('api.views.User.objects.create_user')
    def test_database_integrity_error(self, mock_create_user):
        """handling of IntegrityError during user creation"""
        mock_create_user.side_effect = IntegrityError(
            "Database integrity error")

        response = self.client.post(
            self.register_url, self.valid_adolescent_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertIn('Database integrity error', response_data['error'])

    @patch('api.views.User.objects.create_user')
    def test_general_exception_handling(self, mock_create_user):
        """handling of general exceptions during user creation"""
        mock_create_user.side_effect = Exception("Unexpected error occurred")

        response = self.client.post(
            self.register_url, self.valid_adolescent_data)

        self.assertEqual(response.status_code,
                         status.HTTP_500_INTERNAL_SERVER_ERROR)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertIn('An unexpected error occurred', response_data['error'])

    @patch('api.views.RefreshToken.for_user')
    def test_jwt_token_generation_error(self, mock_refresh):
        """handling of JWT token generation errors"""
        mock_refresh.side_effect = Exception("Token generation failed")

        response = self.client.post(
            self.register_url, self.valid_adolescent_data)

        self.assertEqual(response.status_code,
                         status.HTTP_500_INTERNAL_SERVER_ERROR)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertIn('An unexpected error occurred', response_data['error'])

    def test_empty_request_data(self):
        """registration with empty request data"""
        response = self.client.post(
            self.register_url, INVALID_REGISTRATION_DATA["empty_data"])

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertEqual(
            response_data['error'],
            "Invalid role selected. Choose either 'adolescent' or 'parent'."
        )

    def test_null_values_in_request(self):
        """registration with null values"""
        null_data = {
            'email': '',
            'username': '',
            'password': '',
            'role': ''
        }

        response = self.client.post(self.register_url, null_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertEqual(
            response_data['error'],
            "Invalid role selected. Choose either 'adolescent' or 'parent'."
        )

    @patch('api.views.RefreshToken.for_user')
    def test_response_structure(self, mock_refresh):
        """for the structure of successful registration response"""
        mock_token = Mock()
        mock_token.access_token = 'mock_access_token'
        mock_refresh.return_value = mock_token
        mock_refresh.return_value.__str__ = Mock(
            return_value='mock_refresh_token')

        response = self.client.post(
            self.register_url, self.valid_adolescent_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()