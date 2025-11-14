"""
Profile API Testing Script
Tests all profile management endpoints
"""

import requests
import json
import os
from pathlib import Path

# Configuration
BASE_URL = "http://localhost:8000/api"
TEST_USER = {
    "email": "profiletest@example.com",
    "username": "profiletest",
    "password": "testpass123",
    "role": "adolescent"
}

class ProfileAPITester:
    def __init__(self):
        self.access_token = None
        self.user_id = None
        
    def print_response(self, title, response):
        """Pretty print API response"""
        print(f"\n{'='*60}")
        print(f"🔍 {title}")
        print(f"{'='*60}")
        print(f"Status Code: {response.status_code}")
        try:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
        except:
            print(f"Response: {response.text}")
        print(f"{'='*60}\n")
        
    def register_user(self):
        """Register a test user"""
        print("📝 Step 1: Registering test user...")
        response = requests.post(
            f"{BASE_URL}/register/",
            json=TEST_USER
        )
        self.print_response("User Registration", response)
        
        if response.status_code == 200:
            data = response.json()
            self.access_token = data.get("data", {}).get("access")
            print(f"✅ Registration successful! Token: {self.access_token[:20]}...")
            return True
        else:
            print("❌ Registration failed!")
            return False
            
    def login_user(self):
        """Login if registration fails (user already exists)"""
        print("🔑 Attempting login...")
        response = requests.post(
            f"{BASE_URL}/login/",
            json={
                "email": TEST_USER["email"],
                "password": TEST_USER["password"]
            }
        )
        self.print_response("User Login", response)
        
        if response.status_code == 200:
            data = response.json()
            self.access_token = data.get("data", {}).get("access")
            print(f"✅ Login successful! Token: {self.access_token[:20]}...")
            return True
        return False
        
    def get_headers(self):
        """Get authorization headers"""
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
    def test_get_profile(self):
        """Test GET /api/profile/"""
        print("👤 Step 2: Getting user profile...")
        response = requests.get(
            f"{BASE_URL}/profile/",
            headers=self.get_headers()
        )
        self.print_response("GET Profile", response)
        
        if response.status_code == 200:
            data = response.json()
            self.user_id = data.get("data", {}).get("id")
            print("✅ Profile retrieved successfully!")
            return True
        else:
            print("❌ Failed to retrieve profile!")
            return False
            
    def test_update_profile(self):
        """Test PATCH /api/profile/"""
        print("✏️ Step 3: Updating user profile...")
        
        # Create form data
        files = {
            'name': (None, 'Test User Updated'),
            'address': (None, 'San Francisco, CA'),
            'dob': (None, '1995-05-15')
        }
        
        headers = {"Authorization": f"Bearer {self.access_token}"}
        
        response = requests.patch(
            f"{BASE_URL}/profile/",
            files=files,
            headers=headers
        )
        self.print_response("UPDATE Profile", response)
        
        if response.status_code == 200:
            print("✅ Profile updated successfully!")
            return True
        else:
            print("❌ Failed to update profile!")
            return False
            
    def test_update_avatar(self):
        """Test PATCH /api/profile/avatar/"""
        print("🖼️ Step 4: Updating profile avatar...")
        
        # Create a dummy image file
        dummy_image = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
        
        files = {
            'avatar': ('test_avatar.png', dummy_image, 'image/png')
        }
        
        headers = {"Authorization": f"Bearer {self.access_token}"}
        
        response = requests.patch(
            f"{BASE_URL}/profile/avatar/",
            files=files,
            headers=headers
        )
        self.print_response("UPDATE Avatar", response)
        
        if response.status_code == 200:
            print("✅ Avatar updated successfully!")
            return True
        else:
            print("❌ Failed to update avatar!")
            return False
            
    def test_remove_avatar(self):
        """Test DELETE /api/profile/avatar/"""
        print("🗑️ Step 5: Removing profile avatar...")
        
        response = requests.delete(
            f"{BASE_URL}/profile/avatar/",
            headers=self.get_headers()
        )
        self.print_response("DELETE Avatar", response)
        
        if response.status_code == 200:
            print("✅ Avatar removed successfully!")
            return True
        else:
            print("❌ Failed to remove avatar!")
            return False
            
    def test_change_password(self):
        """Test POST /api/profile/password/change/"""
        print("🔐 Step 6: Changing password...")
        
        new_password = "newtestpass456"
        
        response = requests.post(
            f"{BASE_URL}/profile/password/change/",
            json={
                "current_password": TEST_USER["password"],
                "new_password": new_password,
                "confirm_password": new_password
            },
            headers=self.get_headers()
        )
        self.print_response("Change Password", response)
        
        if response.status_code == 200:
            print("✅ Password changed successfully!")
            # Update test user password for future tests
            TEST_USER["password"] = new_password
            return True
        else:
            print("❌ Failed to change password!")
            return False
            
    def test_invalid_password_change(self):
        """Test password change with invalid data"""
        print("🚫 Step 7: Testing invalid password change scenarios...")
        
        # Test 1: Wrong current password
        print("\n  Test 7a: Wrong current password")
        response = requests.post(
            f"{BASE_URL}/profile/password/change/",
            json={
                "current_password": "wrongpassword",
                "new_password": "newtestpass789",
                "confirm_password": "newtestpass789"
            },
            headers=self.get_headers()
        )
        self.print_response("Wrong Current Password", response)
        
        # Test 2: Passwords don't match
        print("\n  Test 7b: Passwords don't match")
        response = requests.post(
            f"{BASE_URL}/profile/password/change/",
            json={
                "current_password": TEST_USER["password"],
                "new_password": "newtestpass789",
                "confirm_password": "differentpass789"
            },
            headers=self.get_headers()
        )
        self.print_response("Passwords Don't Match", response)
        
        # Test 3: Password too short
        print("\n  Test 7c: Password too short")
        response = requests.post(
            f"{BASE_URL}/profile/password/change/",
            json={
                "current_password": TEST_USER["password"],
                "new_password": "short",
                "confirm_password": "short"
            },
            headers=self.get_headers()
        )
        self.print_response("Password Too Short", response)
        
        print("✅ Invalid password change tests completed!")
        return True
        
    def test_unauthorized_access(self):
        """Test accessing endpoints without authentication"""
        print("🚫 Step 8: Testing unauthorized access...")
        
        response = requests.get(f"{BASE_URL}/profile/")
        self.print_response("Unauthorized Profile Access", response)
        
        if response.status_code == 401:
            print("✅ Unauthorized access properly blocked!")
            return True
        else:
            print("❌ Security issue: Unauthorized access not blocked!")
            return False
            
    def run_all_tests(self):
        """Run all profile API tests"""
        print("\n" + "="*60)
        print("🚀 PROFILE API TESTING SUITE")
        print("="*60)
        
        # Register or login
        if not self.register_user():
            if not self.login_user():
                print("❌ Failed to authenticate. Stopping tests.")
                return
                
        # Run tests
        tests = [
            ("Get Profile", self.test_get_profile),
            ("Update Profile", self.test_update_profile),
            ("Update Avatar", self.test_update_avatar),
            ("Remove Avatar", self.test_remove_avatar),
            ("Change Password", self.test_change_password),
            ("Invalid Password Changes", self.test_invalid_password_change),
            ("Unauthorized Access", self.test_unauthorized_access)
        ]
        
        results = []
        for test_name, test_func in tests:
            try:
                result = test_func()
                results.append((test_name, result))
            except Exception as e:
                print(f"❌ Test '{test_name}' failed with exception: {str(e)}")
                results.append((test_name, False))
                
        # Print summary
        print("\n" + "="*60)
        print("📊 TEST SUMMARY")
        print("="*60)
        passed = sum(1 for _, result in results if result)
        total = len(results)
        
        for test_name, result in results:
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{status} - {test_name}")
            
        print(f"\n{'='*60}")
        print(f"Results: {passed}/{total} tests passed")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        print("="*60)

if __name__ == "__main__":
    tester = ProfileAPITester()
    tester.run_all_tests()
