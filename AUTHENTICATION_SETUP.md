# Real Authentication Setup Guide

## Overview
Your application now has a complete JWT-based authentication system replacing the dummy login. Users can register, login, and get secure JWT tokens.

## What Changed

### Backend Changes
1. **New `auth.py` module** - Handles all authentication logic:
   - `hash_password()` - Securely hash passwords using bcrypt
   - `verify_password()` - Verify passwords against stored hashes
   - `create_jwt_token()` - Generate JWT tokens for authenticated users
   - `verify_jwt_token()` - Validate JWT tokens
   - `register_user()` - Register new users in MongoDB
   - `login_user()` - Authenticate users and issue tokens
   - `token_required` - Decorator to protect routes requiring auth

2. **Updated `database.py`** - Added users collection with indexes:
   - Creates `users` collection on initialization
   - Unique index on email to prevent duplicate registrations
   - Indexes for efficient user lookups

3. **Updated `app.py`** - New authentication endpoints:
   - `POST /api/auth/register` - Register new user
   - `POST /api/auth/login` - Login and get JWT token
   - `GET /api/auth/me` - Get current user profile (requires auth)
   - `POST /api/auth/logout` - Logout (mostly for frontend cleanup)

4. **Updated `requirements.txt`** - Added dependencies:
   - `PyJWT>=2.8.0` - JWT token handling
   - `bcrypt>=4.1.0` - Password hashing

### Frontend Changes
1. **Updated `LoginPage.jsx`**:
   - Replaced dummy login with real API calls
   - Added registration functionality (signup form)
   - JWT token stored in localStorage
   - User information (email, name, ID) stored in localStorage

## Setup Instructions

### Step 1: Install New Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Configure Environment Variables
Create a `.env` file in the `backend/` folder:

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=mentor_ai
JWT_SECRET=your-super-secret-key-change-this-12345
FLASK_ENV=production
FLASK_PORT=5000
```

**⚠️ IMPORTANT for Production:**
- Change `JWT_SECRET` to a strong random string
- Use a proper MongoDB connection string, not localhost
- Set `FLASK_ENV=production` (not development)

### Step 3: Start MongoDB
Ensure MongoDB is running:
```bash
mongod
```

### Step 4: Start Backend
```bash
cd backend
python app.py
```

Server will start at `http://localhost:5000`

### Step 5: Start Frontend
In a new terminal:
```bash
cd frontend
npm run dev
```

Frontend will start at `http://localhost:5173`

## API Endpoints

### Authentication Routes

#### 1. Register User
**POST** `/api/auth/register`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

Response (Success):
```json
{
  "success": true,
  "user_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "message": "Registration successful"
}
```

#### 2. Login User
**POST** `/api/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response (Success):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "full_name": "John Doe"
  },
  "message": "Login successful"
}
```

#### 3. Get Current User Profile
**GET** `/api/auth/me`

Headers:
```
Authorization: Bearer <JWT_TOKEN>
```

Response:
```json
{
  "success": true,
  "user": {
    "user_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00"
  }
}
```

#### 4. Logout
**POST** `/api/auth/logout`

Headers:
```
Authorization: Bearer <JWT_TOKEN>
```

Response:
```json
{
  "success": true,
  "message": "Logged out successfully. Please delete the token from client."
}
```

## How the Frontend Works

### Login Flow
1. User enters email and password
2. Frontend calls `POST /api/auth/login`
3. Backend validates credentials and returns JWT token
4. Token is stored in localStorage as `authToken`
5. User info stored: `userEmail`, `userName`, `userId`
6. User is redirected to dashboard

### Registration Flow
1. User enters email, password, and full name
2. Frontend calls `POST /api/auth/register`
3. If successful, backend returns user info
4. Frontend automatically logs in the new user
5. JWT token is stored and user is redirected to dashboard

### Protected Routes
The frontend checks `localStorage.authToken` to determine if user is logged in:
```javascript
const isAuthenticated = localStorage.getItem('authToken')

if (!isAuthenticated) {
  // Redirect to login
  navigate('/login')
}
```

### API Requests with Token
To make authenticated API requests, include the token:
```javascript
const response = await fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  }
})
```

## MongoDB User Collection Schema

Users are stored with the following structure:
```json
{
  "_id": ObjectId,
  "email": "user@example.com",
  "password": "hashed_password_bcrypt",
  "full_name": "John Doe",
  "is_active": true,
  "created_at": ISODate("2024-01-15T10:30:00Z"),
  "updated_at": ISODate("2024-01-15T10:30:00Z"),
  "last_login": ISODate("2024-01-15T11:00:00Z")
}
```

## Testing the Authentication

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get Profile (replace TOKEN with actual JWT):**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman
1. Create new collection
2. POST to `http://localhost:5000/api/auth/login`
3. Copy the token from response
4. Use token in Authorization tab for protected routes

## Security Features

✅ **Bcrypt Password Hashing** - Passwords are hashed with salt rounds=12
✅ **JWT Token Expiration** - Tokens expire after 24 hours
✅ **Unique Email Constraint** - MongoDB unique index prevents duplicate emails
✅ **Token Validation** - All protected routes validate JWT signature
✅ **Password Validation** - Minimum 6 characters required
✅ **Secure Headers** - CORS properly configured

## Next Steps (Optional Enhancements)

1. **Add Password Reset** - Email-based password recovery
2. **Add Email Verification** - Verify email before account activation
3. **Add Refresh Tokens** - Implement token renewal without re-login
4. **Add Rate Limiting** - Prevent brute force attacks
5. **Add 2FA** - Two-factor authentication
6. **Add OAuth** - Google/GitHub login integration

## Troubleshooting

### Issue: "Token is missing"
- Ensure `Authorization` header is sent with token
- Format: `Authorization: Bearer <token>`

### Issue: "Invalid email or password"
- Check email and password are correct
- Ensure user exists in database
- Check MongoDB is running

### Issue: CORS Error
- Ensure backend CORS is configured for your frontend URL
- Check `CORS(app, origins=[...])` in app.py

### Issue: MongoDB Connection Failed
- Verify MongoDB is running: `mongod`
- Check `MONGODB_URI` in .env file
- Try connecting with MongoDB Compass

## Support
For issues, check:
1. Backend logs: `python app.py`
2. Browser console: Check for JavaScript errors
3. Network tab: Inspect API requests and responses
4. MongoDB logs: Check database connectivity
