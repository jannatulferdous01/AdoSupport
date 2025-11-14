from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from api.json_input import (
    VALID_LOGIN_DATA,
    VALID_REGISTRATION_DATA,
)
from api.models import (
    ChatHistory, Post, Comment, PostReaction, SavedPost, PostReport,
    Product, Category, Cart, CartItem, Order, OrderItem, Review
)
from unittest.mock import patch, Mock
from decimal import Decimal

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


class CommunityIntegrationTest(APITestCase):
    """Integration tests for Community features"""

    def setUp(self):
        """Set up test data"""
        self.register_url = '/api/register/'
        self.login_url = '/api/login/'
        self.posts_url = '/api/community/posts/'

        self.user_data = {
            'email': 'communityuser@example.com',
            'username': 'communityuser',
            'password': 'testpass123',
            'role': 'adolescent'
        }

        # Register and login user
        self.client.post(self.register_url, self.user_data)
        login_res = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        })
        self.access_token = login_res.json()['data']['access']
        self.user = User.objects.get(email=self.user_data['email'])
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

    def test_complete_post_flow(self):
        """Test: Create post → View post → React → Comment → Save → Report"""

        # 1. Create a post
        post_data = {
            'title': 'My Mental Health Journey',
            'content': 'Sharing my experience with anxiety and how I cope with it.',
            'category': 'experiences',
            'tags': ['anxiety', 'coping', 'wellness']
        }

        create_res = self.client.post(self.posts_url, post_data, format='json')
        self.assertEqual(create_res.status_code, 201)
        post_id = create_res.json()['data']['id']

        # Verify post was created
        self.assertTrue(Post.objects.filter(id=post_id).exists())
        post = Post.objects.get(id=post_id)
        self.assertEqual(post.title, post_data['title'])
        self.assertEqual(post.author, self.user)

        # 2. View post detail
        detail_url = f'/api/community/posts/{post_id}/'
        detail_res = self.client.get(detail_url)
        self.assertEqual(detail_res.status_code, 200)
        detail_data = detail_res.json()['data']
        self.assertEqual(detail_data['title'], post_data['title'])

        # 3. React to post
        reaction_url = f'/api/community/posts/{post_id}/reactions/'
        reaction_data = {'reaction_type': 'support'}
        reaction_res = self.client.post(
            reaction_url, reaction_data, format='json')
        self.assertEqual(reaction_res.status_code, 200)

        # Verify reaction was created
        self.assertTrue(PostReaction.objects.filter(
            post=post, user=self.user).exists())

        # 4. Comment on post
        comment_url = f'/api/community/posts/{post_id}/comments/'
        comment_data = {
            'content': 'Thank you for sharing! This is really helpful.'}
        comment_res = self.client.post(
            comment_url, comment_data, format='json')
        self.assertEqual(comment_res.status_code, 201)

        # Verify comment was created
        self.assertTrue(Comment.objects.filter(
            post=post, author=self.user).exists())
        comment_id = Comment.objects.filter(
            post=post, author=self.user).first().id

        # 5. Like the comment
        like_comment_url = f'/api/community/comments/{comment_id}/like/'
        like_res = self.client.post(like_comment_url, {}, format='json')
        self.assertEqual(like_res.status_code, 200)

        # 6. Save post
        save_url = f'/api/community/posts/{post_id}/save/'
        save_res = self.client.post(save_url, {}, format='json')
        self.assertEqual(save_res.status_code, 200)

        # Verify post was saved
        self.assertTrue(SavedPost.objects.filter(
            post=post, user=self.user).exists())

        # 7. Report post (create another user for this)
        reporter_data = {
            'email': 'reporter@example.com',
            'username': 'reporter',
            'password': 'testpass123',
            'role': 'adolescent'
        }
        self.client.post(self.register_url, reporter_data)
        reporter_login = self.client.post(self.login_url, {
            'email': reporter_data['email'],
            'password': reporter_data['password']
        })
        reporter_token = reporter_login.json()['data']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {reporter_token}')

        report_url = f'/api/community/posts/{post_id}/report/'
        report_data = {
            'reason': 'spam',
            'description': 'This looks like spam content'
        }
        report_res = self.client.post(report_url, report_data, format='json')
        self.assertEqual(report_res.status_code, 201)

        # Verify report was created
        self.assertTrue(PostReport.objects.filter(post=post).exists())

    def test_post_update_and_delete(self):
        """Test: Update post → Delete post"""

        # Create a post
        post_data = {
            'title': 'Original Title',
            'content': 'Original content',
            'category': 'questions',
            'tags': ['help']
        }
        create_res = self.client.post(self.posts_url, post_data, format='json')
        post_id = create_res.json()['data']['id']

        # Update post
        update_url = f'/api/community/posts/{post_id}/'
        update_data = {
            'title': 'Updated Title',
            'content': 'Updated content with more details'
        }
        update_res = self.client.patch(update_url, update_data, format='json')
        self.assertEqual(update_res.status_code, 200)

        # Verify update
        updated_post = Post.objects.get(id=post_id)
        self.assertEqual(updated_post.title, 'Updated Title')
        self.assertEqual(updated_post.content,
                         'Updated content with more details')

        # Delete post
        delete_res = self.client.delete(update_url)
        self.assertEqual(delete_res.status_code, 200)

        # Verify soft delete
        deleted_post = Post.objects.get(id=post_id)
        self.assertTrue(deleted_post.is_deleted)

    def test_comment_reply_flow(self):
        """Test: Create comment → Reply to comment"""

        # Create a post
        post_data = {
            'title': 'Discussion Post',
            'content': 'Let\'s discuss mental health',
            'category': 'general',
            'tags': ['discussion']
        }
        create_res = self.client.post(self.posts_url, post_data, format='json')
        post_id = create_res.json()['data']['id']

        # Add a comment
        comment_url = f'/api/community/posts/{post_id}/comments/'
        comment_data = {'content': 'Great topic!'}
        comment_res = self.client.post(
            comment_url, comment_data, format='json')
        comment_id = comment_res.json()['data']['id']

        # Reply to comment
        reply_url = f'/api/community/comments/{comment_id}/replies/'
        reply_data = {'content': 'I agree with you!'}
        reply_res = self.client.post(reply_url, reply_data, format='json')
        self.assertEqual(reply_res.status_code, 201)

        # Verify reply
        reply = Comment.objects.filter(parent_id=comment_id).first()
        self.assertIsNotNone(reply)
        self.assertEqual(reply.content, 'I agree with you!')

    def test_unauthorized_community_access(self):
        """Test that unauthorized users cannot access community features"""

        # Remove credentials
        self.client.credentials()

        # Try to create post without auth
        post_data = {
            'title': 'Test',
            'content': 'Test content',
            'category': 'general',
            'tags': []
        }
        create_res = self.client.post(self.posts_url, post_data, format='json')
        self.assertEqual(create_res.status_code, 401)

    def tearDown(self):
        """Clean up test data"""
        Post.objects.all().delete()
        Comment.objects.all().delete()
        PostReaction.objects.all().delete()
        SavedPost.objects.all().delete()
        PostReport.objects.all().delete()
        User.objects.all().delete()


class StoreIntegrationTest(APITestCase):
    """Integration tests for Store features"""

    def setUp(self):
        """Set up test data"""
        self.register_url = '/api/register/'
        self.login_url = '/api/login/'
        self.products_url = '/api/store/products/'
        self.cart_url = '/api/store/cart/'
        self.orders_url = '/api/store/orders/'

        self.user_data = {
            'email': 'shopper@example.com',
            'username': 'shopper',
            'password': 'testpass123',
            'role': 'parent'
        }

        # Register and login user
        self.client.post(self.register_url, self.user_data)
        login_res = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        })
        self.access_token = login_res.json()['data']['access']
        self.user = User.objects.get(email=self.user_data['email'])
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        # Create test category and products
        self.category = Category.objects.create(
            name='Wellness Products',
            slug='wellness-products',
            description='Products for mental wellness'
        )

        self.product1 = Product.objects.create(
            name='Stress Relief Journal',
            description='A guided journal for stress management',
            price=Decimal('19.99'),
            category=self.category,
            in_stock=True,
            stock_quantity=50
        )

        self.product2 = Product.objects.create(
            name='Meditation Guide Book',
            description='Complete guide to meditation practices',
            price=Decimal('24.99'),
            discount_price=Decimal('19.99'),
            category=self.category,
            in_stock=True,
            stock_quantity=30
        )

    def test_complete_shopping_flow(self):
        """Test: Browse → Add to cart → Update cart → Checkout → Order"""

        # 1. Browse products
        browse_res = self.client.get(self.products_url)
        self.assertEqual(browse_res.status_code, 200)
        products_data = browse_res.json()['data']
        self.assertGreater(len(products_data['products']), 0)

        # 2. View product detail
        detail_url = f'/api/store/products/{self.product1.id}/'
        detail_res = self.client.get(detail_url)
        self.assertEqual(detail_res.status_code, 200)
        product_detail = detail_res.json()['data']
        self.assertEqual(product_detail['name'], self.product1.name)

        # 3. Add products to cart
        add_cart_url = '/api/store/cart/items/'

        # Add product 1
        cart_data1 = {
            'product_id': self.product1.id,
            'quantity': 2
        }
        add_res1 = self.client.post(add_cart_url, cart_data1, format='json')
        self.assertEqual(add_res1.status_code, 201)

        # Add product 2
        cart_data2 = {
            'product_id': self.product2.id,
            'quantity': 1
        }
        add_res2 = self.client.post(add_cart_url, cart_data2, format='json')
        self.assertEqual(add_res2.status_code, 201)

        # 4. View cart
        cart_res = self.client.get(self.cart_url)
        self.assertEqual(cart_res.status_code, 200)
        cart_data = cart_res.json()['data']
        self.assertEqual(len(cart_data['items']), 2)

        # Verify cart items
        cart = Cart.objects.get(user=self.user)
        self.assertEqual(cart.items.count(), 2)

        # 5. Update cart item quantity
        cart_item = CartItem.objects.filter(
            cart=cart, product=self.product1).first()
        update_cart_url = f'/api/store/cart/items/{cart_item.id}/'
        update_data = {'quantity': 3}
        update_res = self.client.patch(
            update_cart_url, update_data, format='json')
        self.assertEqual(update_res.status_code, 200)

        # Verify update
        cart_item.refresh_from_db()
        self.assertEqual(cart_item.quantity, 3)

        # 6. Create order (checkout)
        order_data = {
            'shipping_full_name': 'John Doe',
            'shipping_address_line1': '123 Main St',
            'shipping_city': 'San Francisco',
            'shipping_state': 'CA',
            'shipping_zipcode': '94102',
            'shipping_country': 'USA',
            'shipping_phone': '+1234567890',
            'payment_method': 'card'
        }

        order_res = self.client.post(
            self.orders_url, order_data, format='json')
        self.assertEqual(order_res.status_code, 201)
        order_id = order_res.json()['data']['order_id']

        # Verify order was created
        order = Order.objects.get(id=order_id)
        self.assertEqual(order.user, self.user)
        self.assertEqual(order.items.count(), 2)
        self.assertEqual(order.status, 'pending')

        # Verify cart was cleared
        cart.refresh_from_db()
        self.assertEqual(cart.items.count(), 0)

        # Verify stock was reduced
        self.product1.refresh_from_db()
        self.assertEqual(self.product1.stock_quantity, 47)  # 50 - 3

        # 7. View order details
        order_detail_url = f'/api/store/orders/{order_id}/'
        order_detail_res = self.client.get(order_detail_url)
        self.assertEqual(order_detail_res.status_code, 200)
        order_detail = order_detail_res.json()['data']
        self.assertEqual(order_detail['status'], 'pending')

    def test_product_review_flow(self):
        """Test: Purchase product → Add review"""

        # Create an order first (user must purchase to review)
        cart = Cart.objects.create(user=self.user)
        CartItem.objects.create(
            cart=cart,
            product=self.product1,
            quantity=1
        )

        order = Order.objects.create(
            user=self.user,
            order_number='TEST123',
            shipping_full_name='Test User',
            shipping_address_line1='123 Test St',
            shipping_city='Test City',
            shipping_state='TS',
            shipping_zipcode='12345',
            shipping_country='USA',
            shipping_phone='+1234567890',
            payment_method='card',
            subtotal=self.product1.price,
            tax=Decimal('2.00'),
            shipping_cost=Decimal('5.00'),
            total=self.product1.price + Decimal('7.00'),
            status='delivered'
        )

        OrderItem.objects.create(
            order=order,
            product=self.product1,
            product_name=self.product1.name,
            quantity=1,
            price=self.product1.price
        )

        # Add review
        review_url = f'/api/store/products/{self.product1.id}/reviews/'
        review_data = {
            'rating': 5,
            'title': 'Excellent Product',
            'comment': 'This journal really helped me manage stress!'
        }

        review_res = self.client.post(review_url, review_data, format='json')
        self.assertEqual(review_res.status_code, 201)

        # Verify review was created
        review = Review.objects.filter(
            product=self.product1, user=self.user).first()
        self.assertIsNotNone(review)
        self.assertEqual(review.rating, 5)
        self.assertEqual(review.title, 'Excellent Product')

        # View reviews
        reviews_res = self.client.get(review_url)
        self.assertEqual(reviews_res.status_code, 200)
        reviews_data = reviews_res.json()['data']
        self.assertGreater(len(reviews_data['reviews']), 0)

    def test_cart_item_removal(self):
        """Test: Add to cart → Remove from cart"""

        # Add to cart
        add_cart_url = '/api/store/cart/items/'
        cart_data = {
            'product_id': self.product1.id,
            'quantity': 1
        }
        self.client.post(add_cart_url, cart_data, format='json')

        # Get cart item
        cart = Cart.objects.get(user=self.user)
        cart_item = CartItem.objects.filter(
            cart=cart, product=self.product1).first()

        # Remove from cart
        remove_url = f'/api/store/cart/items/{cart_item.id}/'
        remove_res = self.client.delete(remove_url)
        self.assertEqual(remove_res.status_code, 200)

        # Verify removal
        self.assertFalse(CartItem.objects.filter(id=cart_item.id).exists())

    def test_clear_cart(self):
        """Test: Add items → Clear entire cart"""

        # Add multiple items
        add_cart_url = '/api/store/cart/items/'

        cart_data1 = {'product_id': self.product1.id, 'quantity': 2}
        self.client.post(add_cart_url, cart_data1, format='json')

        cart_data2 = {'product_id': self.product2.id, 'quantity': 1}
        self.client.post(add_cart_url, cart_data2, format='json')

        # Clear cart
        clear_res = self.client.delete(self.cart_url)
        self.assertEqual(clear_res.status_code, 200)

        # Verify cart is empty
        cart = Cart.objects.get(user=self.user)
        self.assertEqual(cart.items.count(), 0)

    def test_product_search_and_filter(self):
        """Test: Search products → Filter by category"""

        # Search products
        search_url = f'{self.products_url}?search=journal'
        search_res = self.client.get(search_url)
        self.assertEqual(search_res.status_code, 200)
        search_data = search_res.json()['data']
        self.assertGreater(len(search_data['products']), 0)

        # Filter by category
        filter_url = f'{self.products_url}?category={self.category.id}'
        filter_res = self.client.get(filter_url)
        self.assertEqual(filter_res.status_code, 200)
        filter_data = filter_res.json()['data']
        self.assertEqual(len(filter_data['products']), 2)

    def test_out_of_stock_handling(self):
        """Test: Try to add out of stock product"""

        # Set product out of stock
        self.product1.in_stock = False
        self.product1.stock_quantity = 0
        self.product1.save()

        # Try to add to cart
        add_cart_url = '/api/store/cart/items/'
        cart_data = {
            'product_id': self.product1.id,
            'quantity': 1
        }
        add_res = self.client.post(add_cart_url, cart_data, format='json')
        self.assertEqual(add_res.status_code, 400)

    def test_unauthorized_store_access(self):
        """Test that unauthorized users can browse but not purchase"""

        # Remove credentials
        self.client.credentials()

        # Can browse products
        browse_res = self.client.get(self.products_url)
        self.assertEqual(browse_res.status_code, 200)

        # Cannot add to cart
        add_cart_url = '/api/store/cart/items/'
        cart_data = {
            'product_id': self.product1.id,
            'quantity': 1
        }
        add_res = self.client.post(add_cart_url, cart_data, format='json')
        self.assertEqual(add_res.status_code, 401)

    def tearDown(self):
        """Clean up test data"""
        Order.objects.all().delete()
        OrderItem.objects.all().delete()
        Cart.objects.all().delete()
        CartItem.objects.all().delete()
        Review.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()
        User.objects.all().delete()
