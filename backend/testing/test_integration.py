from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from api.json_input import (
    VALID_LOGIN_DATA,
    VALID_REGISTRATION_DATA,
)
from api.models import ChatHistory
from unittest.mock import patch, Mock

User = get_user_model()


class IntegrationFlowTest(APITestCase):
    def setUp(self):
        self.register_url = '/api/register/'
        self.login_url = '/api/login/'
        self.chatbot_url = '/api/chatbot/'

        self.user_data = {
            'email': 'adoluser2@example.com',
            'username': 'adoluser2',
            'password': '123456',
            'role': 'adolescent'
        }

    @patch('api.views.genai.GenerativeModel')
    @patch('api.views.genai.configure')
    def test_system_flow(self, mock_config, mock_model):
        """Register"""
        reg_res = self.client.post(self.register_url, self.user_data)
        self.assertEqual(reg_res.status_code, 200)
        self.assertTrue(User.objects.filter(
            email=self.user_data["email"]).exists())

        """Login"""
        login_data = {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }
        login_res = self.client.post(self.login_url, login_data)
        self.assertEqual(login_res.status_code, 200)

        login_res_data = login_res.json()
        access_token = login_res_data["data"]["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

        # mock part for chatbot
        mock_chunk = Mock()
        mock_part = Mock()
        mock_part.text = "adolescence is a trasitional stage of physical and psychological development..."
        mock_candidate = Mock()
        mock_candidate.content = Mock()
        mock_candidate.content.parts = [mock_part]
        mock_candidate.finish_reason = 1
        mock_chunk.candidates = [mock_candidate]

        mock_model = Mock()
        mock_model.generate_content.return_value = [mock_chunk]
        mock_model.return_value = mock_model

        chatbot_query = {
            "query": "tell me about the adolescence"
        }
        chatbot_res = self.client.post(self.chatbot_url, chatbot_query)
        self.assertEqual(chatbot_res.status_code, 200)
        self.assertEqual(chatbot_res['Content-Type'], 'text/event-stream')

        mock_config.assert_called_once()
        mock_model.assert_called_once()

        chat_history = ChatHistory.objects.filter(
            user__username=self.user_data["username"])
        self.assertTrue(chat_history.exists())

    def test_unauthorized_chatbot_access(self):
        chatbot_query = {"query": "tell me about the adolescence"}
        chatbot_res = self.client.post(self.chatbot_url, chatbot_query)
        self.assertEqual(chatbot_res.status_code, 401)

    @patch('api.views.genai.GenerativeModel')
    @patch('api.views.genai.configure')
    def test_chatbot_invalid_input(self, mock_config, mock_model):
        self.client.post(self.register_url, self.user_data)
        login_res = self.client.post(
            self.login_url, {
                "email": self.user_data["email"],
                "password": self.user_data["password"]
            }
        )
        login_res_data = login_res.json()
        access_token = login_res_data["data"]["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

        chatbot_query = {"query": ""}
        chatbot_res = self.client.post(self.chatbot_url, chatbot_query)
        self.assertEqual(chatbot_res.status_code, 400)

    @patch('api.views.genai.GenerativeModel')
    @patch('api.views.genai.configure')
    def test_genai_error_handling(self, mock_config, mock_model):
        self.client.post(self.register_url, self.user_data)
        login_data = {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }
        login_res = self.client.post(self.login_url, login_data)
        login_res_data = login_res.json()
        access_token = login_res_data["data"]["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

        # Mock GenAI to raise an exception
        mock_config.side_effect = Exception("GenAI API error")

        chatbot_query = {"query": "test query"}
        chatbot_res = self.client.post(self.chatbot_url, chatbot_query)

        # Should handle the error gracefully
        self.assertEqual(chatbot_res.status_code, 500)

    def tearDown(self):
        """Clean up test data"""
        User.objects.all().delete()
        ChatHistory.objects.all().delete()
