#!/usr/bin/env python3
"""
Quick test script to verify authentication system is working
Run this after starting MongoDB and the Flask backend
"""

import requests
import json
import sys
from datetime import datetime

API_BASE_URL = "http://localhost:5000"

def print_header(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")

def print_result(test_name, success, message=""):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {test_name}")
    if message:
        print(f"   {message}")

def test_health():
    """Test backend is running"""
    print_header("1. Health Check")
    try:
        response = requests.get(f"{API_BASE_URL}/api/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        print_result("Backend is running", response.status_code == 200)
        return response.status_code == 200
    except Exception as e:
        print_result("Backend is running", False, str(e))
        return False

def test_register():
    """Test user registration"""
    print_header("2. User Registration")
    
    test_user = {
        "email": f"test_{datetime.now().timestamp()}@example.com",
        "password": "testpass123",
        "full_name": "Test User"
    }
    
    print(f"Registering user: {test_user['email']}")
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/api/auth/register",
            json=test_user
        )
        
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        success = response.status_code == 201 and data.get("success")
        print_result("User registration", success)
        
        return test_user if success else None
    except Exception as e:
        print_result("User registration", False, str(e))
        return None

def test_login(user):
    """Test user login"""
    print_header("3. User Login")
    
    if not user:
        print("Skipping - no user from registration test")
        return None
    
    print(f"Logging in user: {user['email']}")
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/api/auth/login",
            json={
                "email": user['email'],
                "password": user['password']
            }
        )
        
        print(f"Status: {response.status_code}")
        data = response.json()
        
        if data.get("success"):
            print(f"Response: success, token received")
            print(f"Token: {data['token'][:50]}...")
            print(f"User: {data['user']}")
        else:
            print(f"Response: {json.dumps(data, indent=2)}")
        
        success = response.status_code == 200 and data.get("success")
        print_result("User login", success)
        
        return data.get("token") if success else None
    except Exception as e:
        print_result("User login", False, str(e))
        return None

def test_get_profile(token):
    """Test getting user profile with token"""
    print_header("4. Get User Profile (Protected Route)")
    
    if not token:
        print("Skipping - no token from login test")
        return
    
    print("Requesting user profile with valid token...")
    
    try:
        response = requests.get(
            f"{API_BASE_URL}/api/auth/me",
            headers={
                "Authorization": f"Bearer {token}"
            }
        )
        
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        success = response.status_code == 200 and data.get("success")
        print_result("Get user profile", success)
    except Exception as e:
        print_result("Get user profile", False, str(e))

def test_invalid_token():
    """Test with invalid token"""
    print_header("5. Test Invalid Token")
    
    print("Requesting with invalid token...")
    
    try:
        response = requests.get(
            f"{API_BASE_URL}/api/auth/me",
            headers={
                "Authorization": "Bearer invalid_token_12345"
            }
        )
        
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        success = response.status_code == 401
        print_result("Invalid token rejection", success)
    except Exception as e:
        print_result("Invalid token rejection", False, str(e))

def test_duplicate_email(user):
    """Test registering with duplicate email"""
    print_header("6. Test Duplicate Email Prevention")
    
    if not user:
        print("Skipping - no user from registration test")
        return
    
    print(f"Attempting to register with duplicate email: {user['email']}")
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/api/auth/register",
            json=user
        )
        
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        success = response.status_code == 400 and not data.get("success")
        print_result("Duplicate email prevention", success)
    except Exception as e:
        print_result("Duplicate email prevention", False, str(e))

def main():
    print("\n" + "🔐 Authentication System Test Suite".center(60))
    print("=" * 60)
    print(f"API Base URL: {API_BASE_URL}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Run tests
    if test_health():
        user = test_register()
        token = test_login(user)
        test_get_profile(token)
        test_invalid_token()
        test_duplicate_email(user)
    
    # Summary
    print_header("Test Complete")
    print("\n✅ If all tests passed, authentication is working correctly!")
    print("❌ If any tests failed, check:")
    print("   1. MongoDB is running (mongod)")
    print("   2. Backend is running (python app.py)")
    print("   3. .env file has correct MongoDB URI")
    print("   4. Packages installed (pip install PyJWT bcrypt)")
    print("\n" + "=" * 60 + "\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")
        sys.exit(1)
