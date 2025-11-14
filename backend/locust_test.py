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

    @task(4)
    def test_community_posts(self):
        """Test community posts listing and creation"""
        if not self.access_token:
            return

        # List posts
        with self.client.get(
            f"{self.base_url}/community/posts/",
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed to list posts: {response.status_code}")

        # Create a post - ADD TITLE FIELD
        post_data = {
            "title": f"Test Post {random.randint(1000, 9999)}",  # ✅ Added
            "content": "This is a test post about mental health and wellbeing. Sharing experiences helps us grow.",
            "category": random.choice(["questions", "experiences", "resources", "general"]),
            "tags": random.sample(["anxiety", "stress", "support", "wellness", "coping"], k=2)
        }

        with self.client.post(
            f"{self.base_url}/community/posts/",
            json=post_data,
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code in [200, 201]:
                response.success()
            else:
                response.failure(f"Failed to create post: {response.status_code}")

    @task(3)
    def test_post_interactions(self):
        """Test post reactions, comments, and saves"""
        if not self.access_token:
            return

        # Get a random post - USE SMALLER RANGE OR FETCH EXISTING IDs
        # First, get list of posts to interact with valid IDs
        list_response = self.client.get(
            f"{self.base_url}/community/posts/",
            headers=self.get_auth_headers()
        )
        
        if list_response.status_code == 200:
            try:
                posts_data = list_response.json().get('data', {}).get('posts', [])
                if posts_data:
                    post_id = random.choice(posts_data)['id']
                else:
                    return  # No posts available
            except:
                return
        else:
            return

        # View post detail
        with self.client.get(
            f"{self.base_url}/community/posts/{post_id}/",
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            elif response.status_code == 404:
                response.success()  # Post doesn't exist is ok
            else:
                response.failure(f"Failed to get post: {response.status_code}")

        # Add reaction
        reaction_data = {
            "reaction_type": random.choice(["like", "love", "support", "celebrate"])
        }
        with self.client.post(
            f"{self.base_url}/community/posts/{post_id}/reactions/",
            json=reaction_data,
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code in [200, 201, 404]:
                response.success()
            else:
                response.failure(f"Failed to add reaction: {response.status_code}")

        # Add comment
        comment_data = {
            "content": f"Great post! This is helpful. {random.randint(100, 999)}"
        }
        with self.client.post(
            f"{self.base_url}/community/posts/{post_id}/comments/",
            json=comment_data,
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code in [200, 201, 404]:
                response.success()
            else:
                response.failure(f"Failed to add comment: {response.status_code}")

    @task(2)
    def test_store_products(self):
        """Test store products listing and details"""
        if not self.access_token:
            return

        # List all products
        with self.client.get(
            f"{self.base_url}/store/products/",
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed to list products: {response.status_code}")

        # Get product detail
        product_id = random.randint(1, 10)
        with self.client.get(
            f"{self.base_url}/store/products/{product_id}/",
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code in [200, 404]:
                response.success()
            else:
                response.failure(f"Failed to get product: {response.status_code}")

        # Search products
        search_terms = ["stress", "anxiety", "meditation", "journal", "wellness"]
        with self.client.get(
            f"{self.base_url}/store/products/?search={random.choice(search_terms)}",
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed to search products: {response.status_code}")

    @task(2)
    def test_cart_operations(self):
        """Test cart operations - add, view, update"""
        if not self.access_token:
            return

        # View cart
        with self.client.get(
            f"{self.base_url}/store/cart/",
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed to view cart: {response.status_code}")

        # Add item to cart
        cart_data = {
            "product_id": random.randint(1, 10),
            "quantity": random.randint(1, 3)
        }
        with self.client.post(
            f"{self.base_url}/store/cart/add/",
            json=cart_data,
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code in [200, 201, 400, 404]:
                response.success()
            else:
                response.failure(f"Failed to add to cart: {response.status_code}")

    @task(1)
    def test_orders(self):
        """Test order operations"""
        if not self.access_token:
            return

        # View orders
        with self.client.get(
            f"{self.base_url}/store/orders/",
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed to view orders: {response.status_code}")

    @task(2)
    def test_product_reviews(self):
        """Test product reviews"""
        if not self.access_token:
            return

        product_id = random.randint(1, 10)

        # Get product reviews
        with self.client.get(
            f"{self.base_url}/store/products/{product_id}/reviews/",
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code in [200, 404]:
                response.success()
            else:
                response.failure(f"Failed to get reviews: {response.status_code}")

        # Add review
        review_data = {
            "rating": random.randint(3, 5),
            "title": f"Review {random.randint(100, 999)}",
            "comment": f"Great product! Very helpful. {random.randint(100, 999)}"
        }
        with self.client.post(
            f"{self.base_url}/store/products/{product_id}/reviews/",
            json=review_data,
            headers=self.get_auth_headers(),
            catch_response=True
        ) as response:
            if response.status_code in [200, 201, 400, 404]:
                response.success()
            else:
                response.failure(f"Failed to add review: {response.status_code}")


class CommunityUser(HttpUser):
    """Simulates user primarily using community features"""

    wait_time = between(1, 4)

    def on_start(self):
        self.base_url = "/api"
        self.access_token = None
        self.created_post_ids = []
        self.setup_user()

    def setup_user(self):
        """Setup user for community testing"""
        random_suffix = ''.join(random.choices(
            string.ascii_lowercase + string.digits, k=8))

        user_data = {
            "email": f"community{random_suffix}@example.com",
            "username": f"community{random_suffix}",
            "password": "community123",
            "role": "adolescent"
        }

        response = self.client.post(f"{self.base_url}/register/", json=user_data)
        if response.status_code == 200:
            self.access_token = response.json()["data"]["access"]

    def get_auth_headers(self):
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }

    @task(5)
    def browse_posts(self):
        """Browse community posts"""
        if not self.access_token:
            return

        self.client.get(
            f"{self.base_url}/community/posts/",
            headers=self.get_auth_headers()
        )

    @task(3)
    def create_post(self):
        """Create a community post"""
        if not self.access_token:
            return

        categories = ["questions", "experiences", "resources", "general"]
        tags_pool = ["anxiety", "stress", "depression", "support", "wellness", 
                     "coping", "therapy", "mindfulness", "self-care", "relationships"]

        post_data = {
            "title": f"Community Post {random.randint(1000, 9999)}",  # ✅ Already has title
            "content": f"Sharing my experience with mental health. It's important to talk about these things. {' '.join(random.sample(['Hope', 'Support', 'Growth', 'Healing', 'Progress'], k=3))}",
            "category": random.choice(categories),
            "tags": random.sample(tags_pool, k=random.randint(2, 4))
        }

        response = self.client.post(
            f"{self.base_url}/community/posts/",
            json=post_data,
            headers=self.get_auth_headers()
        )

        if response.status_code in [200, 201]:
            try:
                post_id = response.json().get("data", {}).get("id")
                if post_id:
                    self.created_post_ids.append(post_id)
            except:
                pass

    @task(4)
    def interact_with_posts(self):
        """React to and comment on posts"""
        if not self.access_token:
            return

        # Use created posts or fetch existing ones
        if self.created_post_ids:
            post_id = random.choice(self.created_post_ids)
        else:
            # Fetch available posts
            response = self.client.get(
                f"{self.base_url}/community/posts/",
                headers=self.get_auth_headers()
            )
            if response.status_code == 200:
                try:
                    posts_data = response.json().get('data', {}).get('posts', [])
                    if not posts_data:
                        return
                    post_id = random.choice(posts_data)['id']
                except:
                    return
            else:
                return

        # React to post
        reaction_types = ["like", "love", "support", "celebrate"]
        self.client.post(
            f"{self.base_url}/community/posts/{post_id}/reactions/",
            json={"reaction_type": random.choice(reaction_types)},
            headers=self.get_auth_headers()
        )

        # Comment on post
        comments = [
            "Thank you for sharing this!",
            "I can relate to this experience.",
            "This is really helpful advice.",
            "Stay strong! You've got this.",
            "Sending support your way.",
            "This resonates with me.",
        ]
        self.client.post(
            f"{self.base_url}/community/posts/{post_id}/comments/",
            json={"content": random.choice(comments)},
            headers=self.get_auth_headers()
        )

    @task(2)
    def save_posts(self):
        """Save posts for later"""
        if not self.access_token:
            return

        # Use valid post IDs
        if self.created_post_ids:
            post_id = random.choice(self.created_post_ids)
        else:
            response = self.client.get(
                f"{self.base_url}/community/posts/",
                headers=self.get_auth_headers()
            )
            if response.status_code == 200:
                try:
                    posts_data = response.json().get('data', {}).get('posts', [])
                    if not posts_data:
                        return
                    post_id = random.choice(posts_data)['id']
                except:
                    return
            else:
                return

        self.client.post(
            f"{self.base_url}/community/posts/{post_id}/save/",
            headers=self.get_auth_headers()
        )

    @task(1)
    def report_post(self):
        """Report inappropriate content"""
        if not self.access_token:
            return

        # Use valid post IDs
        response = self.client.get(
            f"{self.base_url}/community/posts/",
            headers=self.get_auth_headers()
        )
        if response.status_code == 200:
            try:
                posts_data = response.json().get('data', {}).get('posts', [])
                if not posts_data:
                    return
                post_id = random.choice(posts_data)['id']
            except:
                return
        else:
            return

        report_data = {
            "reason": random.choice(["spam", "inappropriate_content", "harassment", "other"]),
            "description": "This content violates community guidelines."
        }
        self.client.post(
            f"{self.base_url}/community/posts/{post_id}/report/",
            json=report_data,
            headers=self.get_auth_headers()
        )


class StoreUser(HttpUser):
    """Simulates user primarily using store features"""

    wait_time = between(2, 5)

    def on_start(self):
        self.base_url = "/api"
        self.access_token = None
        self.setup_user()

    def setup_user(self):
        """Setup user for store testing"""
        random_suffix = ''.join(random.choices(
            string.ascii_lowercase + string.digits, k=8))

        user_data = {
            "email": f"shopper{random_suffix}@example.com",
            "username": f"shopper{random_suffix}",
            "password": "shopper123",
            "role": random.choice(["adolescent", "parent"])
        }

        response = self.client.post(f"{self.base_url}/register/", json=user_data)
        if response.status_code == 200:
            self.access_token = response.json()["data"]["access"]

    def get_auth_headers(self):
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }

    @task(5)
    def browse_products(self):
        """Browse products"""
        if not self.access_token:
            return

        # Browse all products
        self.client.get(
            f"{self.base_url}/store/products/",
            headers=self.get_auth_headers()
        )

        # Browse by category
        categories = [1, 2, 3, 4, 5]
        self.client.get(
            f"{self.base_url}/store/products/?category={random.choice(categories)}",
            headers=self.get_auth_headers()
        )

    @task(3)
    def view_product_details(self):
        """View detailed product information"""
        if not self.access_token:
            return

        product_id = random.randint(1, 20)
        self.client.get(
            f"{self.base_url}/store/products/{product_id}/",
            headers=self.get_auth_headers()
        )

    @task(4)
    def search_products(self):
        """Search for products"""
        if not self.access_token:
            return

        search_terms = [
            "stress", "anxiety", "journal", "meditation", "wellness",
            "therapy", "mindfulness", "book", "guide", "relief"
        ]
        
        self.client.get(
            f"{self.base_url}/store/products/?search={random.choice(search_terms)}",
            headers=self.get_auth_headers()
        )

    @task(3)
    def manage_cart(self):
        """Add items to cart and manage cart"""
        if not self.access_token:
            return

        # View cart
        self.client.get(
            f"{self.base_url}/store/cart/",
            headers=self.get_auth_headers()
        )

        # Add to cart
        cart_data = {
            "product_id": random.randint(1, 20),
            "quantity": random.randint(1, 3)
        }
        self.client.post(
            f"{self.base_url}/store/cart/add/",
            json=cart_data,
            headers=self.get_auth_headers()
        )

        # Update cart item
        cart_item_id = random.randint(1, 10)
        self.client.patch(
            f"{self.base_url}/store/cart/items/{cart_item_id}/",
            json={"quantity": random.randint(1, 5)},
            headers=self.get_auth_headers()
        )

    @task(1)
    def checkout(self):
        """Simulate checkout process"""
        if not self.access_token:
            return

        checkout_data = {
            "shipping_address": "123 Test St, Test City, TC 12345",
            "payment_method": "card"
        }
        self.client.post(
            f"{self.base_url}/store/checkout/",
            json=checkout_data,
            headers=self.get_auth_headers()
        )

    @task(2)
    def view_orders(self):
        """View order history"""
        if not self.access_token:
            return

        self.client.get(
            f"{self.base_url}/store/orders/",
            headers=self.get_auth_headers()
        )

        # View specific order
        order_id = random.randint(1, 10)
        self.client.get(
            f"{self.base_url}/store/orders/{order_id}/",
            headers=self.get_auth_headers()
        )

    @task(2)
    def review_products(self):
        """Leave product reviews"""
        if not self.access_token:
            return

        product_id = random.randint(1, 20)

        # View reviews
        self.client.get(
            f"{self.base_url}/store/products/{product_id}/reviews/",
            headers=self.get_auth_headers()
        )

        # Add review
        review_data = {
            "rating": random.randint(3, 5),
            "title": random.choice([
                "Excellent Product",
                "Very Helpful",
                "Highly Recommend",
                "Great Quality",
                "Worth It"
            ]),
            "comment": random.choice([
                "Excellent product! Really helps with stress management.",
                "Good quality and very useful for daily wellness.",
                "Highly recommend this product for mental health support.",
                "Great addition to my self-care routine.",
                "Very satisfied with this purchase."
            ])
        }
        self.client.post(
            f"{self.base_url}/store/products/{product_id}/reviews/",
            json=review_data,
            headers=self.get_auth_headers()
        )


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

    @task(2)
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

    @task(2)
    def rapid_community_browse(self):
        """Rapid community browsing"""
        if not self.access_token:
            return

        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }

        self.client.get(f"{self.base_url}/community/posts/", headers=headers)

    @task(2)
    def rapid_store_browse(self):
        """Rapid store browsing"""
        if not self.access_token:
            return

        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }

        self.client.get(f"{self.base_url}/store/products/", headers=headers)


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
