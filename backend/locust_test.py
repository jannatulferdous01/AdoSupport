from locust import HttpUser, task, between, events
import json
import random
import string
from datetime import datetime

# simulating a user interacting with the adosupport website  backend


class AdoSupportUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        self.base_url = "/api"
        self.access_token = None
        self.user_date = None
        self.register_and_login()

    # register and login to get access token
    def register_and_login(self):
        random_suffix = ''.join(random.choices(
            string.ascii_lowercase + string.digits, k=8))
        self.user_data = {
            "email": f"user{random_suffix}@example.com",
            "username": f"user{random_suffix}",
            "password": "pass1234",
            "role": random.choice(["adolescent", "parent"])
        }

        register_res = self.client.post(
            f"{self.base_url}/register/",
            json=self.user_data,
            headers={"Content-Type": "application/json"}
        )

        if register_res.status_code == 200:
            register_data = register_res.json()
            self.access_token = register_data["data"]["access"]
            print(f"User Registered: {self.user_data['email']}")
        else:
            print(f"Registration failed: {register_res.status_code}")
            print(f"Response: {register_res.text}")

    def get_auth_headers(self):
        if self.access_token:
            return {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
        return {"Content-Type": "application/json"}

    @task(3)
    def test_registration(self):
        random_suffix = ''.join(random.choices(
            string.ascii_lowercase + string.digits, k=8))

        registration_data = {
            "email": f"testuser{random_suffix}@example.com",
            "username": f"testuser{random_suffix}",
            "password": "pass1234",
            "role": random.choice(["adolescent", "parent"])
        }

        with self.client.post(
            f"{self.base_url}/register/",
            json=registration_data,
            headers={"Content-Type": "application/json"},
            catch_response=True
        ) as res:
            if res.status_code == 200:
                res.success()
            else:
                res.failure(
                    f"Registration failed with status code {res.status_code}")

    @task(2)
    def test_login(self):
        if not self.user_data:
            return

        login_data = {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }

        with self.client.post(
            f"{self.base_url}/login/",
            json=login_data,
            headers={"Content-Type": "application/json"},
            catch_response=True
        ) as res:
            if res.status_code == 200:
                res.success()
            else:
                res.failure(f"Login failed with status {res.status_code}")

    @task(5)
    def test_chatbot_interaction(self):
        """Test chatbot endpoint - most frequent user action"""
        if not self.access_token:
            return

        # Different types of queries to simulate real usage
        queries = [
            "I'm feeling anxious about school",
            "How do I deal with stress?",
            "What is depression?",
            "I'm having trouble with my friends",
            "How to manage exam pressure?",
            "Tell me about adolescent development",
            "I feel lonely",
            "How to build confidence?",
            "What are coping strategies?",
            "I'm worried about my future"
        ]

        query_data = {
            "query": random.choice(queries)
        }

        with self.client.post(
            f"{self.base_url}/chatbot/",
            json=query_data,
            headers=self.get_auth_headers(),
            catch_response=True,
            stream=True  # Important for streaming responses
        ) as response:
            if response.status_code == 200:
                # Read streaming response
                content_length = 0
                for chunk in response.iter_content(chunk_size=1024):
                    content_length += len(chunk)

                if content_length > 0:
                    response.success()
                else:
                    response.failure("Empty chatbot response")
            else:
                response.failure(
                    f"Chatbot failed with status {response.status_code}")

    @task(1)
    def test_invalid_requests(self):
        """Test error handling with invalid requests"""
        # Test invalid registration
        invalid_data = {
            "email": "invalid-email",
            "username": "",
            "password": "123",
            "role": "invalid_role"
        }

        with self.client.post(
            f"{self.base_url}/register/",
            json=invalid_data,
            headers={"Content-Type": "application/json"},
            catch_response=True
        ) as response:
            if response.status_code == 400:
                response.success()
            else:
                response.failure(f"Expected 400, got {response.status_code}")

    @task(1)
    def test_unauthorized_access(self):
        """Test accessing protected endpoints without auth"""
        query_data = {"query": "test query"}

        with self.client.post(
            f"{self.base_url}/chatbot/",
            json=query_data,
            headers={"Content-Type": "application/json"},
            catch_response=True
        ) as response:
            if response.status_code == 401:
                response.success()
            else:
                response.failure(f"Expected 401, got {response.status_code}")


class HighLoadUser(HttpUser):
    """Simulates high-load scenarios for stress testing"""

    wait_time = between(0.1, 0.5)  # Faster requests for stress testing

    def on_start(self):
        self.base_url = "/api"
        self.setup_user()

    def setup_user(self):
        """Quick setup for stress testing"""
        random_suffix = ''.join(random.choices(
            string.ascii_lowercase + string.digits, k=8))

        user_data = {
            "email": f"stress{random_suffix}@example.com",
            "username": f"stress{random_suffix}",
            "password": "stresstest123",
            "role": "adolescent"
        }

        # Register and get token
        response = self.client.post(
            f"{self.base_url}/register/", json=user_data)
        if response.status_code == 200:
            self.access_token = response.json()["data"]["access"]
        else:
            self.access_token = None

    @task
    def rapid_chatbot_requests(self):
        """Rapid-fire chatbot requests for stress testing"""
        if not self.access_token:
            return

        query_data = {"query": "Quick stress test query"}
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }

        self.client.post(f"{self.base_url}/chatbot/",
                         json=query_data, headers=headers)


# Custom events for detailed monitoring
@events.request.add_listener
def my_request_handler(request_type, name, response_time, response_length, response, context, exception, start_time, url, **kwargs):
    """Log detailed request information"""
    if exception:
        print(f"Request failed: {request_type} {name} - {exception}")
    elif response.status_code >= 400:
        print(
            f"HTTP Error: {request_type} {name} - Status: {response.status_code}")


@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    print("Starting AdoSupport Website Performance Test")
    print(f"Target host: {environment.host}")


@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    print("Performance test completed")
