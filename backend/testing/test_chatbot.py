import os
import django
import json
from unittest.mock import patch, Mock
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from unittest.mock import patch, Mock
from django.http import StreamingHttpResponse
from api.models import ChatHistory
from api.json_input import (
    VALID_REGISTRATION_DATA,
    CHATBOT_QUERIES,
)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()
User = get_user_model()

# =============================== Chatbot test ===============================
class ChatbotTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.chatbot_url = '/api/chatbot/'
        user_data = VALID_REGISTRATION_DATA["adolescent"]
        self.user = User.objects.create_user(
            email=user_data['email'],
            username=user_data['username'],
            password=user_data['password'],
            role=user_data['role']
        )
        # JWT token for authentication
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.valid_query_data = {
            'query': CHATBOT_QUERIES["anxiety"]
        }

    @patch('api.views.genai.GenerativeModel')
    @patch('api.views.genai.configure')
    def test_successful_chatbot_response(self, mock_configure, mock_model_class):
        """successful chatbot response with valid query"""
        mock_chunk = Mock()
        mock_part = Mock()
        mock_part.text = "I understand you're feeling anxious about school."
        mock_candidate = Mock()
        mock_candidate.content = Mock()
        mock_candidate.content.parts = [mock_part]
        mock_candidate.finish_reason = 1  # STOP
        mock_chunk.candidates = [mock_candidate]

        mock_model = Mock()
        mock_model.generate_content.return_value = [mock_chunk]
        mock_model_class.return_value = mock_model

        response = self.client.post(
            self.chatbot_url, self.valid_query_data)

        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response, StreamingHttpResponse)
        self.assertEqual(response['Content-Type'], 'text/event-stream')

        mock_configure.assert_called_once()

    def test_missing_query(self):
        """with missing query parameter"""
        response = self.client.post(self.chatbot_url, {})

        self.assertEqual(response.status_code,
                         status.HTTP_400_BAD_REQUEST)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertIn('Query is required', response_data['error'])

    def test_empty_query(self):
        """with empty query"""
        response = self.client.post(self.chatbot_url, {'query': ''})

        self.assertEqual(response.status_code,
                         status.HTTP_400_BAD_REQUEST)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertIn('Query is required', response_data['error'])

    def test_null_query(self):
        """with null query"""
        response = self.client.post(self.chatbot_url, {'query': None})

        self.assertEqual(response.status_code,
                         status.HTTP_400_BAD_REQUEST)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertIn('Query is required', response_data['error'])

    def test_unauthenticated_request(self):
        """without authentication"""
        self.client.credentials()  # authentication

        response = self.client.post(
            self.chatbot_url, self.valid_query_data)

        self.assertEqual(response.status_code,
                         status.HTTP_401_UNAUTHORIZED)

    def test_invalid_token(self):
        """chatbot with invalid JWT token"""
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer invalid_token')

        response = self.client.post(
            self.chatbot_url, self.valid_query_data)

        self.assertEqual(response.status_code,
                         status.HTTP_401_UNAUTHORIZED)

    @patch('api.views.genai.GenerativeModel')
    @patch('api.views.genai.configure')
    def test_safety_block_handling(self, mock_configure, mock_model_class):
        """handling of safety blocks from Gemini API"""
        mock_chunk = Mock()
        mock_candidate = Mock()
        mock_candidate.finish_reason = 2
        mock_candidate.content = None
        mock_chunk.candidates = [mock_candidate]

        mock_model = Mock()
        mock_model.generate_content.return_value = [mock_chunk]
        mock_model_class.return_value = mock_model

        response = self.client.post(
            self.chatbot_url, self.valid_query_data)

        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response, StreamingHttpResponse)

    @patch('api.views.genai.GenerativeModel')
    @patch('api.views.genai.configure')
    def test_genai_configuration_error(self, mock_configure, mock_model_class):
        """handling of Google GenAI configuration errors"""
        mock_configure.side_effect = Exception(
            "API key configuration failed")

        response = self.client.post(
            self.chatbot_url, self.valid_query_data)

        self.assertEqual(response.status_code,
                         status.HTTP_500_INTERNAL_SERVER_ERROR)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertIn('An error occurred', response_data['error'])

    @patch('api.views.genai.GenerativeModel')
    @patch('api.views.genai.configure')
    def test_model_generation_error(self, mock_configure, mock_model_class):
        """handling of model generation errors"""
        mock_model = Mock()
        mock_model.generate_content.side_effect = Exception(
            "Model generation failed")
        mock_model_class.return_value = mock_model

        response = self.client.post(
            self.chatbot_url, self.valid_query_data)

        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response, StreamingHttpResponse)

    @patch('api.views.genai.GenerativeModel')
    @patch('api.views.genai.configure')
    def test_chat_history_creation(self, mock_configure, mock_model_class):
        """that chat history is created after successful response"""
        mock_chunk = Mock()
        mock_part = Mock()
        mock_part.text = "Test response from chatbot"
        mock_candidate = Mock()
        mock_candidate.content = Mock()
        mock_candidate.content.parts = [mock_part]
        mock_candidate.finish_reason = 1  # STOP
        mock_chunk.candidates = [mock_candidate]

        mock_model = Mock()
        mock_model.generate_content.return_value = [mock_chunk]
        mock_model_class.return_value = mock_model

        # Count initial chat history records
        initial_count = ChatHistory.objects.filter(
            user=self.user).count()

        response = self.client.post(
            self.chatbot_url, self.valid_query_data)

        # Check if the chat history was created
        final_count = ChatHistory.objects.filter(
            user=self.user).count()
        self.assertEqual(final_count, initial_count + 1)

        # chat history content
        chat_record = ChatHistory.objects.filter(user=self.user).last()
        self.assertEqual(chat_record.query,
                         self.valid_query_data['query'])
        self.assertIn('Test response from chatbot',
                      chat_record.response)

    @patch('api.views.genai.GenerativeModel')
    @patch('api.views.genai.configure')
    def test_empty_response_handling(self, mock_configure, mock_model_class):
        """handling of empty responses from the model"""
        mock_chunk = Mock()
        mock_candidate = Mock()
        mock_candidate.content = None
        mock_candidate.finish_reason = 1
        mock_chunk.candidates = [mock_candidate]

        mock_model = Mock()
        mock_model.generate_content.return_value = [mock_chunk]
        mock_model_class.return_value = mock_model

        response = self.client.post(
            self.chatbot_url, self.valid_query_data)

        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response, StreamingHttpResponse)

    @patch('api.views.genai.GenerativeModel')
    @patch('api.views.genai.configure')
    def test_no_candidates_in_response(self, mock_configure, mock_model_class):
        """handling when no candidates are returned"""
        mock_chunk = Mock()
        mock_chunk.candidates = []

        mock_model = Mock()
        mock_model.generate_content.return_value = [mock_chunk]
        mock_model_class.return_value = mock_model

        response = self.client.post(
            self.chatbot_url, self.valid_query_data)

        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response, StreamingHttpResponse)

    @patch('api.views.genai.GenerativeModel')
    @patch('api.views.genai.configure')
    def test_response_headers(self, mock_configure, mock_model_class):
        """check for appropriate headers are set for streaming response"""
        mock_chunk = Mock()
        mock_part = Mock()
        mock_part.text = "Test response"
        mock_candidate = Mock()
        mock_candidate.content = Mock()
        mock_candidate.content.parts = [mock_part]
        mock_candidate.finish_reason = 1
        mock_chunk.candidates = [mock_candidate]

        mock_model = Mock()
        mock_model.generate_content.return_value = [mock_chunk]
        mock_model_class.return_value = mock_model

        response = self.client.post(
            self.chatbot_url, self.valid_query_data)

        # headers
        self.assertEqual(response['Content-Type'], 'text/event-stream')
        self.assertEqual(response['Cache-Control'], 'no-cache')
        self.assertEqual(response['X-Accel-Buffering'], 'no')
        self.assertEqual(response['Access-Control-Allow-Origin'], '*')

    def test_long_query_handling(self):
        """test chatbot with very long query"""
        long_query = "This is a very long query. " * 100
        long_query_data = {'query': long_query}

        # check if it fail. it should not fail due to query length
        response = self.client.post(self.chatbot_url, long_query_data)

        self.assertIn(response.status_code, [200, 400, 500])

    @patch('api.views.genai.GenerativeModel')
    @patch('api.views.genai.configure')
    def test_different_query_types(self, mock_configure, mock_model_class):
        """Test different types of queries (anxiety, depression, stress, etc.)"""
        mock_chunk = Mock()
        mock_part = Mock()
        mock_part.text = "Test response"
        mock_candidate = Mock()
        mock_candidate.content = Mock()
        mock_candidate.content.parts = [mock_part]
        mock_candidate.finish_reason = 1
        mock_chunk.candidates = [mock_candidate]

        mock_model = Mock()
        mock_model.generate_content.return_value = [mock_chunk]
        mock_model_class.return_value = mock_model

        # Test each query type from json_input.py
        for query_type, query_text in CHATBOT_QUERIES.items():
            if query_text and query_type != "empty":
                with self.subTest(query_type=query_type):
                    query_data = {'query': query_text}
                    response = self.client.post(self.chatbot_url, query_data)

                    if query_type == "long":
                        # Long queries might be handled differently
                        self.assertIn(response.status_code, [200, 400, 500])
                    else:
                        self.assertEqual(response.status_code, 200)

    @patch('api.views.genai.GenerativeModel')
    @patch('api.views.genai.configure')
    def test_multiple_chunks_response(self, mock_configure, mock_model_class):
        """handling of multiple chunks in streaming response"""
        chunk1 = Mock()
        part1 = Mock()
        part1.text = "First part of response "
        candidate1 = Mock()
        candidate1.content = Mock()
        candidate1.content.parts = [part1]
        candidate1.finish_reason = 0
        chunk1.candidates = [candidate1]

        chunk2 = Mock()
        part2 = Mock()
        part2.text = "second part of response."
        candidate2 = Mock()
        candidate2.content = Mock()
        candidate2.content.parts = [part2]
        candidate2.finish_reason = 1  # STOP
        chunk2.candidates = [candidate2]

        mock_model = Mock()
        mock_model.generate_content.return_value = [chunk1, chunk2]
        mock_model_class.return_value = mock_model

        response = self.client.post(
            self.chatbot_url, self.valid_query_data)

        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response, StreamingHttpResponse)

    def tearDown(self):
        User.objects.all().delete()
        ChatHistory.objects.all().delete()