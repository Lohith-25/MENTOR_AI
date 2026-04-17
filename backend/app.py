"""
Flask Backend for Placement Eligibility Predictor
Production-grade API with validation, error handling, and persistence
"""

import logging
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from models.score_calculator import ScoreCalculator
from database import init_db, save_prediction, get_prediction_history, get_prediction_by_id, get_analytics, close_db, get_user_tasks, toggle_task

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:5174"])  # Vite default ports

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

@app.route("/api/tasks", methods=["GET"])
def fetch_tasks():
    email = request.args.get("email")
    if not email:
        return jsonify({"success": False, "error": "Email required"}), 400
    
    data = get_user_tasks(email)
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
    logger.info("Starting Flask server...")
    try:
        app.run(debug=False, host="0.0.0.0", port=5000)
    except KeyboardInterrupt:
        logger.info("Shutting down...")
        close_db()
