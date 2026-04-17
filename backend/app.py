"""
Flask Backend for Placement Eligibility Predictor
Production-grade API with validation, error handling, persistence, and real-time updates
"""

import logging
import json
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from models.score_calculator import ScoreCalculator

# Load environment variables from .env file
load_dotenv()
from database import init_db, save_prediction, get_prediction_history, get_prediction_by_id, get_analytics, close_db, get_user_tasks, toggle_task
from auth import register_user, login_user, token_required, get_current_user

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Dynamic CORS configuration - supports both development and production
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174,http://localhost:3000").split(",")
CORS(app, origins=ALLOWED_ORIGINS)

# Initialize Socket.IO for real-time updates
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Initialize database with fallback
try:
    init_db()
except Exception as e:
    logger.warning(f"Database initialization failed. App will run in memory-only mode. Error: {e}")

@app.before_request
def log_request():
    """Log incoming requests"""
    logger.info(f"{request.method} {request.path}")


@app.after_request
def log_response(response):
    """Log outgoing responses"""
    logger.info(f"Response: {response.status_code}")
    return response


@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Backend is running"}), 200


# ==================== AUTHENTICATION ENDPOINTS ====================

@app.route("/api/auth/register", methods=["POST"])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "error": "Request body is required"
            }), 400
        
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()
        full_name = data.get("full_name", "").strip()
        
        # Validate input
        if not email or not password:
            return jsonify({
                "success": False,
                "error": "Email and password are required"
            }), 400
        
        if "@" not in email:
            return jsonify({
                "success": False,
                "error": "Invalid email format"
            }), 400
        
        # Register user
        success, result = register_user(email, password, full_name)
        
        if success:
            return jsonify(result), 201
        else:
            return jsonify(result), 400
    
    except Exception as e:
        logger.error(f"Registration error: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": "Registration failed"
        }), 500


@app.route("/api/auth/login", methods=["POST"])
def login():
    """User login - returns JWT token"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "error": "Request body is required"
            }), 400
        
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()
        
        # Validate input
        if not email or not password:
            return jsonify({
                "success": False,
                "error": "Email and password are required"
            }), 400
        
        # Authenticate user
        success, result = login_user(email, password)
        
        if success:
            return jsonify(result), 200
        else:
            return jsonify(result), 401
    
    except Exception as e:
        logger.error(f"Login error: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": "Login failed"
        }), 500


@app.route("/api/auth/me", methods=["GET"])
@token_required
def get_user_profile():
    """Get current user profile (requires auth token)"""
    try:
        user = get_current_user(request.user_id)
        
        if not user:
            return jsonify({
                "success": False,
                "error": "User not found"
            }), 404
        
        return jsonify({
            "success": True,
            "user": user
        }), 200
    
    except Exception as e:
        logger.error(f"Get user error: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": "Failed to get user profile"
        }), 500


@app.route("/api/auth/logout", methods=["POST"])
@token_required
def logout():
    """Logout user (frontend should delete token)"""
    try:
        logger.info(f"User {request.user_email} logged out")
        return jsonify({
            "success": True,
            "message": "Logged out successfully. Please delete the token from client."
        }), 200
    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Logout failed"
        }), 500


# ==================== PREDICTION ENDPOINTS ====================
@app.route("/api/predict", methods=["POST"])
def predict():
    """
    Main prediction endpoint
    Receives form data, validates, calculates score, returns eligibility + suggestions
    
    Expected JSON body:
    {
        "coding_problems": number,
        "leetcode_problems": number,
        "open_source": string (Beginner/Intermediate/Advanced),
        "competitions": string (Beginner/Intermediate/Advanced/Expert),
        "cp_rating": string (1-star to 6-star),
        "projects": string (Beginner/Intermediate/Advanced),
        "aptitude": number (0-100),
        "skillrank": number (0-100),
        "certificate_marks": number (0-100, optional),
        "certificates": array of { fileName, type, marks } (optional)
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            logger.warning("Empty request body")
            return jsonify({
                "success": False,
                "error": "Request body is empty",
            }), 400
        
        logger.info(f"Received prediction request with data: {data}")
        
        # Calculate prediction
        success, result = ScoreCalculator.predict(data)
        
        if not success:
            logger.warning(f"Prediction validation failed: {result}")
            return jsonify(result), 400
        
        # Save to database
        try:
            prediction_id = save_prediction(
                form_data=data,
                total_score=result["total_score"],
                eligibility=result["eligibility"]["tier"],
                color=result["eligibility"]["color"],
                category_breakdown=result["category_breakdown"],
                suggestions=result["suggestions"],
                certificate_marks=result.get("certificate_marks", 0),
                certificates=data.get("certificates", []),
            )
            result["prediction_id"] = prediction_id
        except Exception as db_error:
            logger.error(f"Database save error: {db_error}")
            # Don't fail the response, just log the error
        
        logger.info(f"Prediction successful: {result}")
        return jsonify(result), 200
    
    except Exception as e:
        logger.error(f"Unexpected error in /predict: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": "Internal server error",
            "details": str(e),
        }), 500


@app.route("/api/predictions/history", methods=["GET"])
def get_history():
    """Get prediction history (latest 10 by default)"""
    try:
        limit = request.args.get("limit", 10, type=int)
        limit = min(limit, 50)  # Cap at 50 for performance
        
        history = get_prediction_history(limit=limit)
        logger.info(f"Retrieved {len(history)} predictions from history")
        
        return jsonify({
            "success": True,
            "count": len(history),
            "predictions": history,
        }), 200
    
    except Exception as e:
        logger.error(f"Error retrieving history: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": "Failed to retrieve history",
        }), 500


@app.route("/api/predictions/<string:prediction_id>", methods=["GET"])
def get_prediction(prediction_id):
    """Get a specific prediction by ID"""
    try:
        prediction = get_prediction_by_id(prediction_id)
        
        if not prediction:
            logger.warning(f"Prediction not found: {prediction_id}")
            return jsonify({
                "success": False,
                "error": "Prediction not found",
            }), 404
        
        return jsonify({
            "success": True,
            "prediction": prediction,
        }), 200
    
    except Exception as e:
        logger.error(f"Error retrieving prediction: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": "Failed to retrieve prediction",
        }), 500


@app.route("/api/predictions/analytics", methods=["GET"])
def analytics():
    """Get analytics about predictions"""
    try:
        analytics_data = get_analytics()
        return jsonify({
            "success": True,
            "analytics": analytics_data,
        }), 200
    except Exception as e:
        logger.error(f"Error retrieving analytics: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": "Failed to retrieve analytics",
        }), 500


@app.route("/api/categories", methods=["GET"])
def get_categories():
    """Get category definitions (for frontend reference)"""
    categories = []
    for category_key, config in ScoreCalculator.CATEGORIES.items():
        categories.append({
            "key": category_key,
            "name": config["name"],
            "max": config["max"],
            "weight": config["weight"],
        })
    
    return jsonify({
        "success": True,
        "categories": categories,
        "total_max_score": ScoreCalculator.TOTAL_MAX_SCORE,
    }), 200


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    logger.warning(f"404 error: {request.path}")
    return jsonify({
        "success": False,
        "error": "Endpoint not found",
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"500 error: {str(error)}")
    return jsonify({
        "success": False,
        "error": "Internal server error",
    }), 500


@app.teardown_appcontext
def shutdown_db(exception):
    """Close MongoDB connection on app shutdown"""
    close_db()


# ==================== SOCKET.IO REAL-TIME EVENTS ====================

@socketio.on('connect')
def handle_connect(auth):
    """Handle client connection"""
    logger.info(f"Client connected: {request.sid}")
    emit('connection_response', {'status': 'connected'})


@socketio.on('join_room')
def on_join(data):
    """User joins their personal room for real-time updates"""
    try:
        user_id = data.get('userId')
        if user_id:
            from flask_socketio import join_room
            join_room(f'user_{user_id}')
            logger.info(f"User {user_id} joined room")
    except Exception as e:
        logger.error(f"Join room error: {e}")


@socketio.on('task_completed')
def handle_task_completed(data):
    """Handle real-time task completion via Socket.IO"""
    try:
        user_id = data.get('userId')
        task_id = data.get('taskId')
        completed = data.get('completed', True)
        
        # Update in database
        if toggle_task(task_id, completed):
            # Get updated stats
            tasks = get_user_tasks(user_id)
            total = len(tasks)
            completed_count = len([t for t in tasks if t.get('completed')])
            percentage = (completed_count / total * 100) if total > 0 else 0
            
            # Emit update to user
            socketio.emit('taskUpdated', {
                'taskId': task_id,
                'completed': completed,
                'totalCompleted': completed_count,
                'total': total,
                'percentage': percentage,
                'timestamp': str(__import__('datetime').datetime.now())
            }, room=f'user_{user_id}')
            
            logger.info(f"Task {task_id} completed for user {user_id}")
    except Exception as e:
        logger.error(f"Task completion error: {e}")


@socketio.on('request_progress')
def handle_progress_request(data):
    """Handle request for real-time progress update"""
    try:
        user_id = data.get('userId')
        tasks = get_user_tasks(user_id)
        analytics = get_analytics(user_id)
        
        completed = len([t for t in tasks if t.get('completed')])
        total = len(tasks)
        percentage = (completed / total * 100) if total > 0 else 0
        
        socketio.emit('progressUpdated', {
            'progress': {
                'completed': completed,
                'total': total,
                'percentage': percentage
            },
            'successRate': analytics.get('success_rate', 0),
            'timestamp': str(__import__('datetime').datetime.now())
        }, room=f'user_{user_id}')
    except Exception as e:
        logger.error(f"Progress update error: {e}")


@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    logger.info(f"Client disconnected: {request.sid}")


# ==================== REAL-TIME DASHBOARD ENDPOINTS ====================

@app.route('/api/dashboard/<user_id>', methods=['GET'])
@token_required
def get_dashboard_data(user_id):
    """Get complete dashboard data for real-time updates - OPTIMIZED FOR SPEED"""
    try:
        import random
        from datetime import datetime
        
        # Fetch essential data only (no heavy queries)
        tasks = get_user_tasks(user_id) or []
        
        # Quick calculations
        total_tasks = len(tasks)
        completed_tasks = len([t for t in tasks if t.get('completed')])
        progress_percentage = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
        # Quick analytics (non-blocking)
        analytics = get_analytics(user_id) or {}
        xp = analytics.get('total_xp', 0)
        
        # Determine level
        if xp >= 5000:
            level = 'Expert'
        elif xp >= 2000:
            level = 'Pro'
        else:
            level = 'Beginner'
        
        # Generate lightweight chart data (mock for speed)
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        chart_data = [{'date': day, 'completed': random.randint(2, 5), 'target': 5} for day in days]
        
        # Minimal response - load analytics separately
        response_data = {
            'tasks': [
                {
                    'id': str(t.get('_id', '')),
                    'title': t.get('title', 'Task'),
                    'completed': t.get('completed', False),
                    'priority': t.get('priority', 'Medium'),
                    'createdAt': str(t.get('created_at', ''))
                }
                for t in tasks[:20]  # Limit to 20 tasks for speed
            ],
            'streak': analytics.get('streak', 0),
            'progress': {
                'completed': completed_tasks,
                'total': total_tasks,
                'percentage': progress_percentage
            },
            'successRate': analytics.get('success_rate', 78),
            'level': level,
            'xp': xp,
            'chartData': chart_data,
            'timestamp': str(datetime.now())
        }
        
        return jsonify(response_data), 200
    except Exception as e:
        logger.error(f"Dashboard data error: {e}")
        return jsonify({'error': 'Failed to load dashboard'}), 500


@app.route('/api/task/update', methods=['POST'])
@token_required
def update_task():
    """Update task completion status"""
    try:
        data = request.get_json()
        task_id = data.get('taskId')
        completed = data.get('completed', False)
        
        # Update in database
        result = toggle_task(task_id, completed)
        
        if result:
            return jsonify({
                'success': True,
                'taskId': task_id,
                'completed': completed,
                'timestamp': str(__import__('datetime').datetime.now())
            }), 200
        else:
            return jsonify({'error': 'Task not found'}), 404
    except Exception as e:
        logger.error(f"Task update error: {e}")
        return jsonify({'error': 'Failed to update task'}), 500


@app.route('/api/activity/logs', methods=['GET'])
@token_required
def get_activity_logs():
    """Get user's activity logs"""
    try:
        user_id = request.args.get('userId')
        days = int(request.args.get('days', 7))
        
        # In a real app, fetch from database
        logs = []
        
        return jsonify({
            'success': True,
            'logs': logs,
            'count': len(logs)
        }), 200
    except Exception as e:
        logger.error(f"Activity logs error: {e}")
        return jsonify({'error': 'Failed to load logs'}), 500


@app.route('/api/analytics/<user_id>', methods=['GET'])
@token_required
def get_user_analytics(user_id):
    """Get detailed analytics for user"""
    try:
        analytics = get_analytics(user_id)
        tasks = get_user_tasks(user_id)
        
        total_tasks = len(tasks) if tasks else 0
        completed_tasks = len([t for t in tasks if t.get('completed')]) if tasks else 0
        
        response_data = {
            'success': True,
            'successRate': analytics.get('success_rate', 0) if analytics else 0,
            'totalTasks': total_tasks,
            'completedTasks': completed_tasks,
            'streak': analytics.get('streak', 0) if analytics else 0
        }
        
        return jsonify(response_data), 200
    except Exception as e:
        logger.error(f"Analytics error: {e}")
        return jsonify({'error': 'Failed to load analytics'}), 500

    return jsonify({"success": True, "data": data}), 200

@app.route("/api/tasks/toggle", methods=["POST"])
def toggle_user_task():
    data = request.get_json()
    task_id = data.get("task_id")
    if not task_id:
        return jsonify({"success": False, "error": "Task ID required"}), 400
    
    success = toggle_task(task_id)
    return jsonify({"success": success}), 200

@app.route("/api/ai/guide", methods=["POST"])
def ai_guide():
    data = request.get_json()
    email = data.get("email", "User")
    
    # Mock AI response
    suggestions = [
        "Consistent daily practice is key to acing interviews! Keep tackling LeetCode.",
        "Your resume projects look good, try contributing to an open source repo next.",
        "Aptitude tests are crucial for the first round, don't ignore them.",
        "Stay motivated! You're on a great path towards your goal package."
    ]
    import random
    advice = random.choice(suggestions)
    
    return jsonify({
        "success": True,
        "guide": advice
    }), 200


if __name__ == "__main__":
    logger.info("🚀 Starting Flask server with Socket.IO real-time support...")
    port = int(os.getenv("PORT", 5000))
    logger.info(f"📡 Socket.IO server available at ws://localhost:{port}")
    try:
        # Run with Socket.IO support for real-time events
        socketio.run(app, debug=False, host="0.0.0.0", port=port, allow_unsafe_werkzeug=True)
    except KeyboardInterrupt:
        logger.info("🛑 Shutting down...")
        close_db()
