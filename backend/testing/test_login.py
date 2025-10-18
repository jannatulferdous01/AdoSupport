from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from api.json_input import (
    VALID_LOGIN_DATA,
    INVALID_LOGIN_DATA,
    VALID_REGISTRATION_DATA,
)

User = get_user_model()


class LoginUserViewTests(TestCase):
    """Test suite for user login functionality"""

    def setUp(self):
        """Set up test client and create test users"""
        self.client = APIClient()
        self.login_url = '/api/login/'

        # Create test users
        self.adolescent_user = User.objects.create_user(
            email='adoluser1@example.com',
            username='adoluser1',
            password='123456',
            role='adolescent'
        )

        self.parent_user = User.objects.create_user(
            email='parent1@example.com',
            username='parent1',
            password='123456',
            role='parent'
        )

        self.test_user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpassword123',
            role='adolescent'
        )

    def test_successful_login_adolescent(self):
        """Test successful login with valid adolescent credentials"""
        login_data = {
            'email': 'adoluser1@example.com',
            'password': '123456'
        }

        response = self.client.post(self.login_url, login_data, format='json')

        # Assert response status
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Assert response structure
        self.assertIn('data', response.data)
        data = response.data['data']

        # Assert user data in response
        self.assertEqual(data['email'], 'adoluser1@example.com')
        self.assertEqual(data['username'], 'adoluser1')
        self.assertEqual(data['role'], 'adolescent')

        # Assert tokens are present
        self.assertIn('access', data)
        self.assertIn('refresh', data)
        self.assertIsNotNone(data['access'])
        self.assertIsNotNone(data['refresh'])

        # Assert success message
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Login successful')

    def test_successful_login_parent(self):
        """Test successful login with valid parent credentials"""
        login_data = {
            'email': 'parent1@example.com',
            'password': '123456'
        }

        response = self.client.post(self.login_url, login_data, format='json')

        # Assert response status
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Assert response structure
        self.assertIn('data', response.data)
        data = response.data['data']

        # Assert user data
        self.assertEqual(data['email'], 'parent1@example.com')
        self.assertEqual(data['username'], 'parent1')
        self.assertEqual(data['role'], 'parent')

        # Assert tokens
        self.assertIn('access', data)
        self.assertIn('refresh', data)

    def test_login_with_wrong_password(self):
        """Test login with incorrect password"""
        login_data = {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        }

        response = self.client.post(self.login_url, login_data, format='json')

        # Assert unauthorized status
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Assert error message
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'],
                         'Invalid credentials. Please try again.')

    def test_login_with_nonexistent_email(self):
        """Test login with email that doesn't exist"""
        login_data = {
            'email': 'nonexistent@example.com',
            'password': 'somepassword'
        }

        response = self.client.post(self.login_url, login_data, format='json')

        # Assert unauthorized status
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Assert error message
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'],
                         'Invalid credentials. Please try again.')

    def test_login_missing_email(self):
        """Test login with missing email field"""
        login_data = {
            'password': 'testpassword123'
        }

        response = self.client.post(self.login_url, login_data, format='json')

        # Assert bad request status
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Assert error message
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'],
                         'Email and password are required.')

    def test_login_missing_password(self):
        """Test login with missing password field"""
        login_data = {
            'email': 'test@example.com'
        }

        response = self.client.post(self.login_url, login_data, format='json')

        # Assert bad request status
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Assert error message
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'],
                         'Email and password are required.')

    def test_login_missing_both_fields(self):
        """Test login with both email and password missing"""
        login_data = {}

        response = self.client.post(self.login_url, login_data, format='json')

        # Assert bad request status
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Assert error message
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'],
                         'Email and password are required.')

    def test_login_empty_email(self):
        """Test login with empty email string"""
        login_data = {
            'email': '',
            'password': 'testpassword123'
        }

        response = self.client.post(self.login_url, login_data, format='json')

        # Assert bad request status
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Assert error message
        self.assertEqual(response.data['error'],
                         'Email and password are required.')

    def test_login_empty_password(self):
        """Test login with empty password string"""
        login_data = {
            'email': 'test@example.com',
            'password': ''
        }

        response = self.client.post(self.login_url, login_data, format='json')

        # Assert bad request status
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Assert error message
        self.assertEqual(response.data['error'],
                         'Email and password are required.')

    def test_login_null_email(self):
        """Test login with null email value"""
        login_data = {
            'email': None,
            'password': 'testpassword123'
        }

        response = self.client.post(self.login_url, login_data, format='json')

        # Assert bad request status
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Assert error message
        self.assertEqual(response.data['error'],
                         'Email and password are required.')

    def test_login_null_password(self):
        """Test login with null password value"""
        login_data = {
            'email': 'test@example.com',
            'password': None
        }

        response = self.client.post(self.login_url, login_data, format='json')

        # Assert bad request status
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Assert error message
        self.assertEqual(response.data['error'],
                         'Email and password are required.')

    def test_login_case_sensitive_password(self):
        """Test that password is case-sensitive"""
        login_data = {
            'email': 'test@example.com',
            'password': 'TESTPASSWORD123'  # Wrong case
        }

        response = self.client.post(self.login_url, login_data, format='json')

        # Assert unauthorized status
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['error'],
                         'Invalid credentials. Please try again.')

    def test_login_whitespace_in_email(self):
        """Test login with whitespace in email"""
        login_data = {
            'email': ' test@example.com ',
            'password': 'testpassword123'
        }

        response = self.client.post(self.login_url, login_data, format='json')

        # Should fail as email doesn't match exactly
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_whitespace_in_password(self):
        """Test login with whitespace in password"""
        login_data = {
            'email': 'test@example.com',
            'password': ' testpassword123 '
        }

        response = self.client.post(self.login_url, login_data, format='json')

        # Should fail as password doesn't match exactly
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_sql_injection_attempt(self):
        """Test login with SQL injection attempt in email"""
        login_data = {
            'email': "admin@example.com' OR '1'='1",
            'password': 'password'
        }

        response = self.client.post(self.login_url, login_data, format='json')

        # Should fail safely
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['error'],
                         'Invalid credentials. Please try again.')

    def test_login_xss_attempt(self):
        """Test login with XSS attempt in email"""
        login_data = {
            'email': '<script>alert("XSS")</script>',
            'password': 'password'
        }

        response = self.client.post(self.login_url, login_data, format='json')

        # Should fail safely
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_returns_user_id(self):
        """Test that login returns the user ID"""
        login_data = {
            'email': 'test@example.com',
            'password': 'testpassword123'
        }

        response = self.client.post(self.login_url, login_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('id', response.data['data'])
        self.assertEqual(response.data['data']['id'], str(self.test_user.id))

    def test_login_token_validity(self):
        """Test that returned tokens are valid JWT tokens"""
        login_data = {
            'email': 'test@example.com',
            'password': 'testpassword123'
        }

        response = self.client.post(self.login_url, login_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        access_token = response.data['data']['access']
        refresh_token = response.data['data']['refresh']

        # Tokens should be non-empty strings
        self.assertTrue(isinstance(access_token, str))
        self.assertTrue(isinstance(refresh_token, str))
        self.assertGreater(len(access_token), 0)
        self.assertGreater(len(refresh_token), 0)

        # Tokens should have JWT structure (three parts separated by dots)
        self.assertEqual(len(access_token.split('.')), 3)
        self.assertEqual(len(refresh_token.split('.')), 3)

    def test_login_multiple_times_same_user(self):
        """Test that the same user can login multiple times"""
        login_data = {
            'email': 'test@example.com',
            'password': 'testpassword123'
        }

        # First login
        response1 = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        token1 = response1.data['data']['access']

        # Second login
        response2 = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        token2 = response2.data['data']['access']

        # Both logins should succeed
        self.assertIsNotNone(token1)
        self.assertIsNotNone(token2)
        # Tokens should be different
        self.assertNotEqual(token1, token2)

    def test_login_different_users_simultaneously(self):
        """Test that different users can login simultaneously"""
        # Login adolescent user
        response1 = self.client.post(self.login_url, {
            'email': 'adoluser1@example.com',
            'password': '123456'
        }, format='json')

        # Login parent user
        response2 = self.client.post(self.login_url, {
            'email': 'parent1@example.com',
            'password': '123456'
        }, format='json')

        # Both should succeed
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)

        # Verify correct user data
        self.assertEqual(response1.data['data']
                         ['email'], 'adoluser1@example.com')
        self.assertEqual(response2.data['data']
                         ['email'], 'parent1@example.com')

    def test_login_with_invalid_json(self):
        """Test login with malformed JSON data"""
        response = self.client.post(
            self.login_url,
            data='{"email": "test@example.com", "password": ',  # Invalid JSON
            content_type='application/json'
        )

        # Should return 400 or 500 depending on how Django handles it
        self.assertIn(response.status_code, [
            status.HTTP_400_BAD_REQUEST,
            status.HTTP_500_INTERNAL_SERVER_ERROR
        ])

    def test_login_get_method_not_allowed(self):
        """Test that GET method is not allowed on login endpoint"""
        response = self.client.get(self.login_url)

        # Should return method not allowed
        self.assertEqual(response.status_code,
                         status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_login_put_method_not_allowed(self):
        """Test that PUT method is not allowed on login endpoint"""
        response = self.client.put(self.login_url, {
            'email': 'test@example.com',
            'password': 'testpassword123'
        }, format='json')

        # Should return method not allowed
        self.assertEqual(response.status_code,
                         status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_login_delete_method_not_allowed(self):
        """Test that DELETE method is not allowed on login endpoint"""
        response = self.client.delete(self.login_url)

        # Should return method not allowed
        self.assertEqual(response.status_code,
                         status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_login_response_does_not_contain_password(self):
        """Test that login response doesn't expose the password"""
        login_data = {
            'email': 'test@example.com',
            'password': 'testpassword123'
        }

        response = self.client.post(self.login_url, login_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Convert response to string to check for password
        response_str = str(response.data)
        self.assertNotIn('testpassword123', response_str)
        self.assertNotIn('password', response_str.lower())

    def test_login_with_inactive_user(self):
        """Test login attempt with an inactive user account"""
        # Create inactive user
        inactive_user = User.objects.create_user(
            email='inactive@example.com',
            username='inactiveuser',
            password='password123',
            role='adolescent'
        )
        inactive_user.is_active = False
        inactive_user.save()

        login_data = {
            'email': 'inactive@example.com',
            'password': 'password123'
        }

        response = self.client.post(self.login_url, login_data, format='json')

        # Should fail for inactive user
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_preserves_user_role(self):
        """Test that login returns the correct user role"""
        # Test adolescent role
        response1 = self.client.post(self.login_url, {
            'email': 'adoluser1@example.com',
            'password': '123456'
        }, format='json')

        self.assertEqual(response1.data['data']['role'], 'adolescent')

        # Test parent role
        response2 = self.client.post(self.login_url, {
            'email': 'parent1@example.com',
            'password': '123456'
        }, format='json')

        self.assertEqual(response2.data['data']['role'], 'parent')

    def test_login_rate_limiting_readiness(self):
        """Test multiple rapid login attempts (for rate limiting implementation)"""
        login_data = {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        }

        # Make multiple failed login attempts
        responses = []
        for _ in range(5):
            response = self.client.post(
                self.login_url, login_data, format='json')
            responses.append(response)

        # All should return 401 (rate limiting not implemented yet)
        # This test documents that rate limiting should be implemented
        for response in responses:
            self.assertEqual(response.status_code,
                             status.HTTP_401_UNAUTHORIZED)

    def tearDown(self):
        """Clean up after tests"""
        User.objects.all().delete()


if __name__ == '__main__':
    import django
    import os
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    django.setup()

    from django.test.utils import get_runner
    from django.conf import settings

    TestRunner = get_runner(settings)
    test_runner = TestRunner()
    failures = test_runner.run_tests(['testing.test_login'])
