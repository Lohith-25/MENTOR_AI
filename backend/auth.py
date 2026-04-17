"""
Authentication module - handles user registration, login, and JWT token management
"""

import os
import jwt
import bcrypt
import logging
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
from database import get_db

logger = logging.getLogger(__name__)

# Config
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Password hashing
SALT_ROUNDS = 12


def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(SALT_ROUNDS)).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    except Exception as e:
        logger.error(f"Password verification error: {e}")
        return False


def create_jwt_token(user_id: str, email: str) -> str:
    """Create JWT token for user"""
    try:
        payload = {
            'user_id': str(user_id),
            'email': email,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        return token
    except Exception as e:
        logger.error(f"Token creation error: {e}")
        return None


def verify_jwt_token(token: str) -> dict:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        logger.warning("Token expired")
        return None
    except jwt.InvalidTokenError:
        logger.warning("Invalid token")
        return None
    except Exception as e:
        logger.error(f"Token verification error: {e}")
        return None


def token_required(f):
    """Decorator to require valid JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check for token in Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({"success": False, "error": "Invalid token format"}), 401
        
        if not token:
            return jsonify({"success": False, "error": "Token is missing"}), 401
        
        payload = verify_jwt_token(token)
        if not payload:
            return jsonify({"success": False, "error": "Token is invalid or expired"}), 401
        
        # Add user info to request context
        request.user_id = payload.get('user_id')
        request.user_email = payload.get('email')
        
        return f(*args, **kwargs)
    
    return decorated


def register_user(email: str, password: str, full_name: str = "") -> tuple[bool, dict]:
    """Register new user"""
    try:
        db = get_db()
        if db is None:
            logger.error(f"Registration for {email}: Database connection failed")
            return False, {"error": "Database connection failed"}
        
        users_collection = db['users']
        
        # Check if user already exists
        logger.info(f"Checking if user {email.lower()} already exists...")
        existing = users_collection.find_one({"email": email.lower()})
        if existing:
            logger.warning(f"Registration failed for {email}: Email already registered")
            return False, {"error": "Email already registered"}
        
        logger.info(f"Email {email.lower()} is new, validating password...")
        
        # Validate password
        if len(password) < 6:
            logger.warning(f"Registration failed for {email}: Password too short")
            return False, {"error": "Password must be at least 6 characters"}
        
        # Create user document
        hashed_pwd = hash_password(password)
        user_doc = {
            "email": email.lower(),
            "password": hashed_pwd,
            "full_name": full_name or email.split('@')[0],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True
        }
        
        logger.info(f"Saving user {email.lower()} to database...")
        result = users_collection.insert_one(user_doc)
        
        logger.info(f"✅ User registered successfully: {email} (ID: {result.inserted_id})")
        
        return True, {
            "success": True,
            "user_id": str(result.inserted_id),
            "email": email,
            "message": "Registration successful"
        }
    
    except Exception as e:
        logger.error(f"Registration error for {email}: {e}", exc_info=True)
        return False, {"error": str(e)}


def login_user(email: str, password: str) -> tuple[bool, dict]:
    """Authenticate user and return JWT token"""
    try:
        db = get_db()
        if db is None:
            logger.error(f"Login attempt for {email}: Database connection failed")
            return False, {"error": "Database connection failed"}
        
        users_collection = db['users']
        
        # Find user
        logger.info(f"Attempting login for email: {email.lower()}")
        user = users_collection.find_one({"email": email.lower()})
        
        if not user:
            logger.warning(f"Login failed for {email}: User not found in database")
            return False, {"error": "Invalid email or password"}
        
        logger.info(f"User found in DB for {email}, verifying password...")
        
        # Verify password
        password_match = verify_password(password, user['password'])
        if not password_match:
            logger.warning(f"Login failed for {email}: Invalid password")
            return False, {"error": "Invalid email or password"}
        
        logger.info(f"Password verified for {email}")
        
        # Check if user is active
        if not user.get('is_active', True):
            logger.warning(f"Login failed for {email}: Account disabled")
            return False, {"error": "User account is disabled"}
        
        # Create JWT token
        token = create_jwt_token(str(user['_id']), user['email'])
        if not token:
            logger.error(f"Token generation failed for {email}")
            return False, {"error": "Token generation failed"}
        
        # Update last_login
        users_collection.update_one(
            {"_id": user['_id']},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        logger.info(f"✅ User logged in successfully: {email}")
        
        return True, {
            "success": True,
            "token": token,
            "user": {
                "user_id": str(user['_id']),
                "email": user['email'],
                "full_name": user.get('full_name', ''),
            },
            "message": "Login successful"
        }
    
    except Exception as e:
        logger.error(f"Login error for {email}: {e}", exc_info=True)
        return False, {"error": str(e)}


def get_current_user(user_id: str) -> dict:
    """Get current user details"""
    try:
        from bson.objectid import ObjectId
        
        db = get_db()
        if db is None:
            return None
        
        users_collection = db['users']
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            return None
        
        return {
            "user_id": str(user['_id']),
            "email": user['email'],
            "full_name": user.get('full_name', ''),
            "created_at": user.get('created_at'),
            "is_active": user.get('is_active', True)
        }
    
    except Exception as e:
        logger.error(f"Error getting user: {e}")
        return None
