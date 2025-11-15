from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from decimal import Decimal
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from PIL import Image
import json

from api.models import (
    Category, Product, ProductImage, Cart, CartItem,
    Order, OrderItem, Review
)

User = get_user_model()


# ==================== Helper Functions ====================

def create_test_image():
    """Create a test image file"""
    file = BytesIO()
    image = Image.new('RGB', (100, 100), color='red')
    image.save(file, 'png')
    file.name = 'test.png'
    file.seek(0)
    return SimpleUploadedFile(
        name='test.png',
        content=file.read(),
        content_type='image/png'
    )


# ==================== Model Tests ====================

class CategoryModelTest(TestCase):
    """Test Category model"""

    def setUp(self):
        self.category = Category.objects.create(
            name="Books",
            slug="books",
            description="Self-help books for adolescents"
        )

    def test_category_creation(self):
        """Test category is created properly"""
        self.assertEqual(self.category.name, "Books")
        self.assertEqual(self.category.slug, "books")
        self.assertEqual(str(self.category), "Books")

    def test_products_count_property(self):
        """Test products_count property"""
        # Initially no products
        self.assertEqual(self.category.products_count, 0)

        # Create a product
        Product.objects.create(
            name="Test Book",
            description="Test description",
            price=Decimal('19.99'),
            category=self.category,
            in_stock=True
        )
        self.assertEqual(self.category.products_count, 1)


class ProductModelTest(TestCase):
    """Test Product model"""

    def setUp(self):
        self.category = Category.objects.create(
            name="Books",
            slug="books",
            description="Self-help books"
        )
        self.product = Product.objects.create(
            name="The Mindful Teen",
            description="A guide to mindfulness",
            price=Decimal('24.99'),
            discount_price=Decimal('19.99'),
            category=self.category,
            stock_quantity=10,
            in_stock=True,
            tags=["mindfulness", "mental health"],
            features=["200 pages", "Paperback"],
            benefits=["Stress reduction", "Better focus"]
        )

    def test_product_creation(self):
        """Test product is created properly"""
        self.assertEqual(self.product.name, "The Mindful Teen")
        self.assertEqual(self.product.price, Decimal('24.99'))
        self.assertEqual(self.product.discount_price, Decimal('19.99'))
        self.assertTrue(self.product.in_stock)
        self.assertEqual(str(self.product), "The Mindful Teen")

    def test_product_rating_property(self):
        """Test rating property calculation"""
        user = User.objects.create_user(
            email="test@example.com",
            username="testuser",
            password="testpass123"
        )

        # No reviews yet
        self.assertEqual(self.product.rating, 0.0)

        # Add reviews
        Review.objects.create(
            product=self.product,
            user=user,
            rating=5,
            title="Great!",
            comment="Loved it"
        )

        # Rating should be 5.0
        self.assertEqual(self.product.rating, 5.0)

    def test_reduce_stock(self):
        """Test reduce_stock method"""
        initial_stock = self.product.stock_quantity

        # Reduce stock by 5
        result = self.product.reduce_stock(5)
        self.assertTrue(result)
        self.assertEqual(self.product.stock_quantity, initial_stock - 5)

        # Try to reduce more than available
        result = self.product.reduce_stock(100)
        self.assertFalse(result)

        # Reduce to zero
        self.product.reduce_stock(5)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 0)
        self.assertFalse(self.product.in_stock)

    def test_increase_stock(self):
        """Test increase_stock method"""
        self.product.stock_quantity = 0
        self.product.in_stock = False
        self.product.save()

        # Increase stock
        self.product.increase_stock(10)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 10)
        self.assertTrue(self.product.in_stock)


class CartModelTest(TestCase):
    """Test Cart model"""

    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            username="testuser",
            password="testpass123"
        )
        self.category = Category.objects.create(
            name="Books",
            slug="books",
            description="Books"
        )
        self.product1 = Product.objects.create(
            name="Product 1",
            description="Description 1",
            price=Decimal('10.00'),
            category=self.category,
            in_stock=True
        )
        self.product2 = Product.objects.create(
            name="Product 2",
            description="Description 2",
            price=Decimal('20.00'),
            discount_price=Decimal('15.00'),
            category=self.category,
            in_stock=True
        )
        self.cart = Cart.objects.create(user=self.user)

    def test_cart_creation(self):
        """Test cart is created properly"""
        self.assertEqual(self.cart.user, self.user)
        self.assertEqual(str(self.cart), f"Cart for {self.user.username}")

    def test_cart_subtotal(self):
        """Test cart subtotal calculation"""
        # Add items to cart
        CartItem.objects.create(
            cart=self.cart, product=self.product1, quantity=2)
        CartItem.objects.create(
            cart=self.cart, product=self.product2, quantity=1)

        # Subtotal should be: (10.00 * 2) + (15.00 * 1) = 35.00
        self.assertEqual(self.cart.subtotal, Decimal('35.00'))

    def test_cart_tax(self):
        """Test cart tax calculation (10%)"""
        CartItem.objects.create(
            cart=self.cart, product=self.product1, quantity=2)

        # Tax should be 10% of subtotal: 20.00 * 0.10 = 2.00
        self.assertEqual(self.cart.tax, Decimal('2.00'))

    def test_cart_shipping(self):
        """Test cart shipping calculation"""
        # Under $50 - should have $5 shipping
        CartItem.objects.create(
            cart=self.cart, product=self.product1, quantity=2)
        self.assertEqual(self.cart.shipping, Decimal('5.00'))

        # Over $50 - should have free shipping
        CartItem.objects.create(
            cart=self.cart, product=self.product2, quantity=3)
        self.assertEqual(self.cart.shipping, Decimal('0.00'))

    def test_cart_total(self):
        """Test cart total calculation"""
        CartItem.objects.create(
            cart=self.cart, product=self.product1, quantity=2)

        # Total = subtotal + tax + shipping = 20.00 + 2.00 + 5.00 = 27.00
        self.assertEqual(self.cart.total, Decimal('27.00'))

    def test_items_count(self):
        """Test items_count property"""
        CartItem.objects.create(
            cart=self.cart, product=self.product1, quantity=2)
        CartItem.objects.create(
            cart=self.cart, product=self.product2, quantity=3)

        self.assertEqual(self.cart.items_count, 5)


class OrderModelTest(TestCase):
    """Test Order model"""

    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            username="testuser",
            password="testpass123"
        )
        self.category = Category.objects.create(
            name="Books",
            slug="books",
            description="Books"
        )
        self.product = Product.objects.create(
            name="Test Product",
            description="Test",
            price=Decimal('25.00'),
            category=self.category,
            in_stock=True
        )

    def test_order_creation(self):
        """Test order is created with auto-generated order number"""
        order = Order.objects.create(
            user=self.user,
            shipping_full_name="Test User",
            shipping_address_line1="123 Main St",
            shipping_city="Test City",
            shipping_state="Test State",
            shipping_zipcode="12345",
            shipping_country="Test Country",
            shipping_phone="1234567890",
            payment_method="credit_card",
            subtotal=Decimal('25.00'),
            tax=Decimal('2.50'),
            shipping_cost=Decimal('5.00'),
            total=Decimal('32.50')
        )

        self.assertIsNotNone(order.order_number)
        self.assertTrue(order.order_number.startswith('ORD-'))

    def test_order_number_generation(self):
        """Test unique order number generation"""
        order1 = Order.objects.create(
            user=self.user,
            shipping_full_name="Test User",
            shipping_address_line1="123 Main St",
            shipping_city="Test City",
            shipping_state="Test State",
            shipping_zipcode="12345",
            shipping_country="Test Country",
            shipping_phone="1234567890",
            payment_method="credit_card",
            subtotal=Decimal('25.00'),
            tax=Decimal('2.50'),
            shipping_cost=Decimal('5.00'),
            total=Decimal('32.50')
        )
        order2 = Order.objects.create(
            user=self.user,
            shipping_full_name="Test User",
            shipping_address_line1="123 Main St",
            shipping_city="Test City",
            shipping_state="Test State",
            shipping_zipcode="12345",
            shipping_country="Test Country",
            shipping_phone="1234567890",
            payment_method="credit_card",
            subtotal=Decimal('25.00'),
            tax=Decimal('2.50'),
            shipping_cost=Decimal('5.00'),
            total=Decimal('32.50')
        )

        self.assertNotEqual(order1.order_number, order2.order_number)


# ==================== API Tests ====================

class CategoryAPITest(APITestCase):
    """Test Category API endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(
            name="Books",
            slug="books",
            description="Self-help books"
        )

    def test_get_categories(self):
        """Test GET /api/store/categories/"""
        url = '/api/store/categories/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['name'], "Books")


class ProductAPITest(APITestCase):
    """Test Product API endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(
            name="Books",
            slug="books",
            description="Books"
        )
        self.product = Product.objects.create(
            name="Test Product",
            description="Test description",
            price=Decimal('24.99'),
            discount_price=Decimal('19.99'),
            category=self.category,
            stock_quantity=10,
            in_stock=True,
            tags=["test", "product"]
        )

    def test_get_products(self):
        """Test GET /api/store/products/"""
        url = '/api/store/products/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['name'], "Test Product")

    def test_get_product_detail(self):
        """Test GET /api/store/products/<id>/"""
        url = f'/api/store/products/{self.product.id}/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['name'], "Test Product")
        self.assertEqual(response.data['data']['price'], '24.99')

    def test_filter_products_by_category(self):
        """Test filtering products by category"""
        url = '/api/store/products/?category=books'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)

    def test_search_products(self):
        """Test searching products"""
        url = '/api/store/products/?search=Test'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)


class CartAPITest(APITestCase):
    """Test Cart API endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="test@example.com",
            username="testuser",
            password="testpass123"
        )
        self.client.force_authenticate(user=self.user)

        self.category = Category.objects.create(
            name="Books",
            slug="books",
            description="Books"
        )
        self.product = Product.objects.create(
            name="Test Product",
            description="Test",
            price=Decimal('25.00'),
            category=self.category,
            stock_quantity=10,
            in_stock=True
        )

    def test_get_cart(self):
        """Test GET /api/store/cart/"""
        url = '/api/store/cart/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('items', response.data['data'])

    def test_add_to_cart(self):
        """Test POST /api/store/cart/items/"""
        url = '/api/store/cart/items/'
        data = {
            'product_id': str(self.product.id),
            'quantity': 2
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['data']['quantity'], 2)

    def test_add_to_cart_insufficient_stock(self):
        """Test adding more items than available stock"""
        url = '/api/store/cart/items/'
        data = {
            'product_id': str(self.product.id),
            'quantity': 100
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('INSUFFICIENT_STOCK', response.data['error']['code'])

    def test_update_cart_item(self):
        """Test PATCH /api/cart/items/<id>/"""
        # First add item to cart
        cart = Cart.objects.create(user=self.user)
        cart_item = CartItem.objects.create(
            cart=cart,
            product=self.product,
            quantity=1
        )

        url = f'/api/store/cart/items/{cart_item.id}/'
        data = {'quantity': 3}
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['quantity'], 3)

    def test_remove_cart_item(self):
        """Test DELETE /api/cart/items/<id>/"""
        # First add item to cart
        cart = Cart.objects.create(user=self.user)
        cart_item = CartItem.objects.create(
            cart=cart,
            product=self.product,
            quantity=1
        )

        url = f'/api/store/cart/items/{cart_item.id}/'
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(CartItem.objects.filter(id=cart_item.id).exists())

    def test_clear_cart(self):
        """Test DELETE /api/store/cart/"""
        cart = Cart.objects.create(user=self.user)
        CartItem.objects.create(cart=cart, product=self.product, quantity=1)

        url = '/api/store/cart/'
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(cart.items.count(), 0)


class OrderAPITest(APITestCase):
    """Test Order API endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="test@example.com",
            username="testuser",
            password="testpass123"
        )
        self.client.force_authenticate(user=self.user)

        self.category = Category.objects.create(
            name="Books",
            slug="books",
            description="Books"
        )
        self.product = Product.objects.create(
            name="Test Product",
            description="Test",
            price=Decimal('25.00'),
            category=self.category,
            stock_quantity=10,
            in_stock=True
        )

    def test_create_order(self):
        """Test POST /api/orders/"""
        # First add items to cart
        cart = Cart.objects.create(user=self.user)
        CartItem.objects.create(cart=cart, product=self.product, quantity=2)

        url = '/api/orders/'
        data = {
            'shipping_address': {
                'full_name': 'Test User',
                'address_line1': '123 Main St',
                'city': 'Test City',
                'state': 'Test State',
                'zipcode': '12345',
                'country': 'Test Country',
                'phone': '1234567890'
            },
            'payment_method': 'credit_card'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('order_number', response.data['data'])
        self.assertEqual(cart.items.count(), 0)  # Cart should be cleared

    def test_create_order_empty_cart(self):
        """Test creating order with empty cart"""
        Cart.objects.create(user=self.user)  # Empty cart

        url = '/api/store/orders/'
        data = {
            'shipping_address': {
                'full_name': 'Test User',
                'address_line1': '123 Main St',
                'city': 'Test City',
                'state': 'Test State',
                'zipcode': '12345',
                'country': 'Test Country',
                'phone': '1234567890'
            },
            'payment_method': 'credit_card'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_orders(self):
        """Test GET /api/orders/"""
        # Create an order
        order = Order.objects.create(
            user=self.user,
            shipping_full_name="Test User",
            shipping_address_line1="123 Main St",
            shipping_city="Test City",
            shipping_state="Test State",
            shipping_zipcode="12345",
            shipping_country="Test Country",
            shipping_phone="1234567890",
            payment_method="credit_card",
            subtotal=Decimal('25.00'),
            tax=Decimal('2.50'),
            shipping_cost=Decimal('5.00'),
            total=Decimal('32.50')
        )

        url = '/api/store/orders/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)

    def test_get_order_detail(self):
        """Test GET /api/orders/<id>/"""
        order = Order.objects.create(
            user=self.user,
            shipping_full_name="Test User",
            shipping_address_line1="123 Main St",
            shipping_city="Test City",
            shipping_state="Test State",
            shipping_zipcode="12345",
            shipping_country="Test Country",
            shipping_phone="1234567890",
            payment_method="credit_card",
            subtotal=Decimal('25.00'),
            tax=Decimal('2.50'),
            shipping_cost=Decimal('5.00'),
            total=Decimal('32.50')
        )

        url = f'/api/store/orders/{order.id}/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']
                         ['order_number'], order.order_number)


class ReviewAPITest(APITestCase):
    """Test Review API endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="test@example.com",
            username="testuser",
            password="testpass123"
        )
        self.client.force_authenticate(user=self.user)

        self.category = Category.objects.create(
            name="Books",
            slug="books",
            description="Books"
        )
        self.product = Product.objects.create(
            name="Test Product",
            description="Test",
            price=Decimal('25.00'),
            category=self.category,
            stock_quantity=10,
            in_stock=True
        )

        # Create a completed order so user can review
        order = Order.objects.create(
            user=self.user,
            shipping_full_name="Test User",
            shipping_address_line1="123 Main St",
            shipping_city="Test City",
            shipping_state="Test State",
            shipping_zipcode="12345",
            shipping_country="Test Country",
            shipping_phone="1234567890",
            payment_method="credit_card",
            subtotal=Decimal('25.00'),
            tax=Decimal('2.50'),
            shipping_cost=Decimal('5.00'),
            total=Decimal('32.50'),
            status='delivered'
        )
        OrderItem.objects.create(
            order=order,
            product=self.product,
            product_name=self.product.name,
            quantity=1,
            price=self.product.price
        )

    def test_get_product_reviews(self):
        """Test GET /api/products/<id>/reviews/"""
        # Create a review
        Review.objects.create(
            product=self.product,
            user=self.user,
            rating=5,
            title="Great!",
            comment="Loved it"
        )

        url = f'/api/store/products/{self.product.id}/reviews/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)

    def test_create_review(self):
        """Test POST /api/store/products/<id>/reviews/"""
        url = f'/api/store/products/{self.product.id}/reviews/'
        data = {
            'rating': 5,
            'title': 'Excellent product',
            'comment': 'Really helped me with mindfulness'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Review.objects.filter(
            user=self.user, product=self.product).exists())

    def test_create_duplicate_review(self):
        """Test creating duplicate review"""
        Review.objects.create(
            product=self.product,
            user=self.user,
            rating=5,
            title="Great!",
            comment="Loved it"
        )

        url = f'/api/store/products/{self.product.id}/reviews/'
        data = {
            'rating': 4,
            'title': 'Another review',
            'comment': 'Still good'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_update_review(self):
        """Test PATCH /api/store/reviews/<id>/"""
        review = Review.objects.create(
            product=self.product,
            user=self.user,
            rating=4,
            title="Good",
            comment="Nice product"
        )

        url = f'/api/store/reviews/{review.id}/'
        data = {
            'rating': 5,
            'title': 'Excellent!',
            'comment': 'Changed my mind, this is amazing'
        }
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        review.refresh_from_db()
        self.assertEqual(review.rating, 5)

    def test_delete_review(self):
        """Test DELETE /api/store/reviews/<id>/"""
        review = Review.objects.create(
            product=self.product,
            user=self.user,
            rating=4,
            title="Good",
            comment="Nice product"
        )

        url = f'/api/store/reviews/{review.id}/'
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Review.objects.filter(id=review.id).exists())


# ==================== Admin API Tests ====================

class AdminProductAPITest(APITestCase):
    """Test Admin Product API endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            email="admin@example.com",
            username="admin",
            password="adminpass123"
        )
        self.admin_user.is_staff = True
        self.admin_user.save()
        self.client.force_authenticate(user=self.admin_user)

        self.category = Category.objects.create(
            name="Books",
            slug="books",
            description="Books"
        )

    def test_admin_create_product(self):
        """Test POST /api/store/admin/products/"""
        url = '/api/store/admin/products/'
        data = {
            'name': 'New Product',
            'description': 'New description',
            'price': '29.99',
            'category': 'books',
            'stock_quantity': '20',
            'tags': json.dumps(['new', 'test']),
            'features': json.dumps(['Feature 1']),
            'benefits': json.dumps(['Benefit 1'])
        }
        response = self.client.post(url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Product.objects.filter(name='New Product').exists())

    def test_non_admin_cannot_create_product(self):
        """Test non-admin cannot create products"""
        regular_user = User.objects.create_user(
            email="user@example.com",
            username="user",
            password="userpass123"
        )
        self.client.force_authenticate(user=regular_user)

        url = '/api/store/admin/products/'
        data = {
            'name': 'New Product',
            'description': 'New description',
            'price': '29.99',
            'category': 'books'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class AdminOrderAPITest(APITestCase):
    """Test Admin Order API endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            email="admin@example.com",
            username="admin",
            password="adminpass123"
        )
        self.admin_user.is_staff = True
        self.admin_user.save()
        self.client.force_authenticate(user=self.admin_user)

        self.user = User.objects.create_user(
            email="test@example.com",
            username="testuser",
            password="testpass123"
        )
        self.order = Order.objects.create(
            user=self.user,
            shipping_full_name="Test User",
            shipping_address_line1="123 Main St",
            shipping_city="Test City",
            shipping_state="Test State",
            shipping_zipcode="12345",
            shipping_country="Test Country",
            shipping_phone="1234567890",
            payment_method="credit_card",
            subtotal=Decimal('25.00'),
            tax=Decimal('2.50'),
            shipping_cost=Decimal('5.00'),
            total=Decimal('32.50'),
            status='pending'
        )

    def test_admin_get_all_orders(self):
        """Test GET /api/store/admin/orders/"""
        url = '/api/store/admin/orders/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)

    def test_admin_update_order_status(self):
        """Test PATCH /api/store/admin/orders/<id>/"""
        url = f'/api/store/admin/orders/{self.order.id}/'
        data = {
            'status': 'processing',
            'tracking_number': 'TRACK123'
        }
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, 'processing')
        self.assertEqual(self.order.tracking_number, 'TRACK123')

    def test_invalid_status_transition(self):
        """Test invalid order status transition"""
        self.order.status = 'delivered'
        self.order.save()

        url = f'/api/store/admin/orders/{self.order.id}/'
        data = {'status': 'pending'}
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# ==================== Integration Tests ====================

class StoreIntegrationTest(APITestCase):
    """Integration tests for complete store workflows"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="test@example.com",
            username="testuser",
            password="testpass123"
        )
        self.client.force_authenticate(user=self.user)

        # Create test data
        self.category = Category.objects.create(
            name="Books",
            slug="books",
            description="Self-help books"
        )
        self.product1 = Product.objects.create(
            name="Mindfulness Guide",
            description="Learn mindfulness",
            price=Decimal('24.99'),
            discount_price=Decimal('19.99'),
            category=self.category,
            stock_quantity=10,
            in_stock=True
        )
        self.product2 = Product.objects.create(
            name="Teen Wellness",
            description="Wellness guide for teens",
            price=Decimal('29.99'),
            category=self.category,
            stock_quantity=5,
            in_stock=True
        )

    def test_complete_shopping_flow(self):
        """Test complete flow: browse -> add to cart -> checkout -> order"""

        # 1. Browse products
        response = self.client.get('/api/store/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 2)

        # 2. View product detail
        response = self.client.get(f'/api/store/products/{self.product1.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['name'], 'Mindfulness Guide')

        # 3. Add products to cart
        response = self.client.post('/api/store/cart/items/', {
            'product_id': str(self.product1.id),
            'quantity': 2
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.post('/api/store/cart/items/', {
            'product_id': str(self.product2.id),
            'quantity': 1
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # 4. View cart
        response = self.client.get('/api/store/cart/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']['items']), 2)

        # Cart total: (19.99 * 2) + 29.99 = 69.97
        # Tax: 6.997 rounded to 7.00
        # Shipping: Free (over $50)
        # Total: 69.97 + 7.00 + 0.00 = 76.97
        cart_total = Decimal(response.data['data']['total'])
        self.assertGreater(cart_total, Decimal('70.00'))

        # 5. Create order
        response = self.client.post('/api/store/orders/', {
            'shipping_address': {
                'full_name': 'Test User',
                'address_line1': '123 Main St',
                'city': 'Test City',
                'state': 'Test State',
                'zipcode': '12345',
                'country': 'USA',
                'phone': '1234567890'
            },
            'payment_method': 'credit_card'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        order_id = response.data['data']['order_id']

        # 6. Verify order was created
        response = self.client.get(f'/api/store/orders/{order_id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']['items']), 2)

        # 7. Verify cart is empty
        response = self.client.get('/api/store/cart/')
        self.assertEqual(len(response.data['data']['items']), 0)

        # 8. Verify stock was reduced
        self.product1.refresh_from_db()
        self.assertEqual(self.product1.stock_quantity, 8)
        self.product2.refresh_from_db()
        self.assertEqual(self.product2.stock_quantity, 4)

    def test_review_workflow(self):
        """Test complete review workflow"""

        # 1. Create a completed order
        order = Order.objects.create(
            user=self.user,
            shipping_full_name="Test User",
            shipping_address_line1="123 Main St",
            shipping_city="Test City",
            shipping_state="Test State",
            shipping_zipcode="12345",
            shipping_country="USA",
            shipping_phone="1234567890",
            payment_method="credit_card",
            subtotal=Decimal('19.99'),
            tax=Decimal('2.00'),
            shipping_cost=Decimal('5.00'),
            total=Decimal('26.99'),
            status='delivered'
        )
        OrderItem.objects.create(
            order=order,
            product=self.product1,
            product_name=self.product1.name,
            quantity=1,
            price=self.product1.discount_price
        )

        # 2. Add review
        response = self.client.post(f'/api/store/products/{self.product1.id}/reviews/', {
            'rating': 5,
            'title': 'Excellent book!',
            'comment': 'This book really helped me with mindfulness practices.'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # 3. View product with review
        response = self.client.get(f'/api/store/products/{self.product1.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['rating'], 5.0)
        self.assertEqual(response.data['data']['review_count'], 1)

        # 4. Get all reviews for product
        response = self.client.get(
            f'/api/store/products/{self.product1.id}/reviews/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['meta']['average_rating'], 5.0)

        # 5. Update review
        review_id = response.data['data'][0]['id']
        response = self.client.patch(f'/api/store/reviews/{review_id}/', {
            'rating': 4,
            'title': 'Good book',
            'comment': 'Updated: Still good but not perfect'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 6. Verify updated rating
        response = self.client.get(f'/api/store/products/{self.product1.id}/')
        self.assertEqual(response.data['data']['rating'], 4.0)


# ==================== Edge Case Tests ====================

class StoreEdgeCaseTest(APITestCase):
    """Test edge cases and error handling"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="test@example.com",
            username="testuser",
            password="testpass123"
        )
        self.client.force_authenticate(user=self.user)

        self.category = Category.objects.create(
            name="Books",
            slug="books",
            description="Books"
        )
        self.product = Product.objects.create(
            name="Test Product",
            description="Test",
            price=Decimal('25.00'),
            category=self.category,
            stock_quantity=2,
            in_stock=True
        )

    def test_concurrent_cart_updates(self):
        """Test handling concurrent updates to same cart item"""
        cart = Cart.objects.create(user=self.user)
        cart_item = CartItem.objects.create(
            cart=cart,
            product=self.product,
            quantity=1
        )

        # Simulate concurrent update
        url = f'/api/store/cart/items/{cart_item.id}/'

        # First update
        response1 = self.client.patch(url, {'quantity': 2}, format='json')
        self.assertEqual(response1.status_code, status.HTTP_200_OK)

        # Second update (should work)
        response2 = self.client.patch(url, {'quantity': 1}, format='json')
        self.assertEqual(response2.status_code, status.HTTP_200_OK)

    def test_order_with_out_of_stock_item(self):
        """Test creating order when item goes out of stock"""
        cart = Cart.objects.create(user=self.user)
        CartItem.objects.create(cart=cart, product=self.product, quantity=1)

        # Make product out of stock
        self.product.in_stock = False
        self.product.stock_quantity = 0
        self.product.save()

        response = self.client.post('/api/store/orders/', {
            'shipping_address': {
                'full_name': 'Test User',
                'address_line1': '123 Main St',
                'city': 'Test City',
                'state': 'Test State',
                'zipcode': '12345',
                'country': 'USA',
                'phone': '1234567890'
            },
            'payment_method': 'credit_card'
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_multiple_carts_same_user(self):
        """Test that user can only have one cart"""
        cart1 = Cart.objects.create(user=self.user)

        # Try to create another cart (should fail due to OneToOne relationship)
        with self.assertRaises(Exception):
            Cart.objects.create(user=self.user)

    def test_review_without_purchase(self):
        """Test that user cannot review without purchasing"""
        response = self.client.post(f'/api/store/products/{self.product.id}/reviews/', {
            'rating': 5,
            'title': 'Great!',
            'comment': 'Love it'
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('PURCHASE_REQUIRED', response.data['error']['code'])

    def test_negative_price_validation(self):
        """Test that negative prices are not allowed"""
        from django.core.exceptions import ValidationError

        product = Product(
            name="Invalid Product",
            description="Test",
            price=Decimal('-10.00'),
            category=self.category
        )

        with self.assertRaises(ValidationError):
            product.full_clean()

    def test_product_search_with_special_characters(self):
        """Test product search handles special characters"""
        response = self.client.get(
            '/api/store/products/?search=<script>alert("xss")</script>')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cart_item_quantity_boundary(self):
        """Test cart item quantity boundaries"""
        cart = Cart.objects.create(user=self.user)

        # Try adding 0 quantity (should fail)
        response = self.client.post('/api/store/cart/items/', {
            'product_id': str(self.product.id),
            'quantity': 0
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Try adding negative quantity (should fail)
        response = self.client.post('/api/store/cart/items/', {
            'product_id': str(self.product.id),
            'quantity': -5
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# ==================== Performance Tests ====================

class StorePerformanceTest(APITestCase):
    """Test performance and query optimization"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="test@example.com",
            username="testuser",
            password="testpass123"
        )
        self.client.force_authenticate(user=self.user)

        self.category = Category.objects.create(
            name="Books",
            slug="books",
            description="Books"
        )

        # Create multiple products
        self.products = []
        for i in range(50):
            product = Product.objects.create(
                name=f"Product {i}",
                description=f"Description {i}",
                price=Decimal('20.00') + Decimal(str(i)),
                category=self.category,
                stock_quantity=10,
                in_stock=True
            )
            self.products.append(product)

    def test_product_list_pagination(self):
        """Test product list pagination works efficiently"""
        from django.test.utils import override_settings
        from django.db import connection
        from django.test.utils import CaptureQueriesContext

        # Test with pagination
        with CaptureQueriesContext(connection) as context:
            response = self.client.get('/api/store/products/?limit=20&page=1')
            query_count = len(context.captured_queries)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 20)

        # Should not have excessive queries (adjust based on your actual implementation)
        self.assertLess(query_count, 10)

    def test_cart_with_many_items(self):
        """Test cart performance with many items"""
        cart = Cart.objects.create(user=self.user)

        # Add 20 items to cart
        for i in range(20):
            CartItem.objects.create(
                cart=cart,
                product=self.products[i],
                quantity=1
            )

        response = self.client.get('/api/store/cart/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']['items']), 20)
