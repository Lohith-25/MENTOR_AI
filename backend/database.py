"""
MongoDB database initialization and management for prediction history.
Optimized for web application workload with development configuration.
"""

import os
import logging
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from pymongo import MongoClient, DESCENDING
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure
from bson.objectid import ObjectId
import json

logger = logging.getLogger(__name__)

# MongoDB Configuration
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGODB_DB_NAME", "mentor_ai")
COLLECTION_NAME = "predictions"

# Connection pool configuration for development/moderate traffic
# Rationale: Development environment with expected 1-5 concurrent users
# maxPoolSize: 15 connections (supports ~10-15 concurrent ops with buffer)
# minPoolSize: 2 (keeps 2 warm connections, reduces cold start latency)
# Other timeouts: Conservative values to catch issues early in development
MONGO_CLIENT_OPTS = {
    "maxPoolSize": 15,
    "minPoolSize": 2,
    "connectTimeoutMS": 10000,  # 10s - fail fast on network issues
    "socketTimeoutMS": 30000,   # 30s - timeout for individual operations
    "serverSelectionTimeoutMS": 5000,  # 5s - quick replica set discovery
    "maxIdleTimeMS": 300000,    # 5min - close unused connections after 5 minutes
    "retryWrites": True,        # Automatic retry for network glitches
}

# Global MongoDB client (singleton pattern)
_mongo_client: Optional[MongoClient] = None
_db = None


def get_db():
    """Get MongoDB database connection (lazy initialization)"""
    global _mongo_client, _db
    
    if _mongo_client is None:
        try:
            logger.info(f"Connecting to MongoDB at {MONGODB_URI}")
            _mongo_client = MongoClient(MONGODB_URI, **MONGO_CLIENT_OPTS)
            
            # Test connection by pinging server
            _mongo_client.admin.command("ping")
            logger.info("✓ MongoDB connection successful")
            
            _db = _mongo_client[DB_NAME]
        except (ServerSelectionTimeoutError, ConnectionFailure) as e:
            logger.error(f"✗ Failed to connect to MongoDB: {e}")
            raise
    
    return _db


def init_db():
    """Initialize MongoDB database and create indexes"""
    try:
        db = get_db()
        
        # Create collection if it doesn't exist
        if COLLECTION_NAME not in db.list_collection_names():
            db.create_collection(COLLECTION_NAME)
            logger.info(f"✓ Created collection '{COLLECTION_NAME}'")
        
        collection = db[COLLECTION_NAME]
        
        # Create indexes for efficient querying
        # Index 1: Query recent predictions by timestamp
        collection.create_index([("timestamp", DESCENDING)], name="idx_timestamp")
        logger.info("✓ Created index on timestamp")
        
        # Index 2: Query by eligibility tier for analytics
        collection.create_index([("eligibility", 1)], name="idx_eligibility")
        logger.info("✓ Created index on eligibility")
        
        # Index 3: TTL index to auto-delete old predictions after 90 days (optional)
        collection.create_index(
            [("timestamp", 1)],
            expireAfterSeconds=7776000,  # 90 days
            name="idx_ttl_90days",
            sparse=True
        )
        logger.info("✓ Created TTL index (90-day retention)")
        
        logger.info(f"✓ MongoDB database '{DB_NAME}' initialized successfully")
        
    except Exception as e:
        logger.error(f"✗ Database initialization failed: {e}")
        raise


def save_prediction(
    form_data: dict,
    total_score: float,
    eligibility: str,
    color: str,
    category_breakdown: dict,
    suggestions: list,
    certificate_marks: float = 0,
    certificates: list = None,
) -> str:
    """
    Save a prediction to MongoDB.
    
    Args:
        form_data: Form input data
        total_score: Calculated total score
        eligibility: Eligibility tier (e.g., "Above 10 LPA")
        color: Badge color (red/yellow/green)
        category_breakdown: Category-wise score breakdown
        suggestions: List of improvement suggestions
        certificate_marks: Total certificate marks
        certificates: List of uploaded certificates
    
    Returns:
        Prediction ID (string) for later retrieval
    """
    if certificates is None:
        certificates = []
    
    try:
        db = get_db()
        collection = db[COLLECTION_NAME]
        
        # Create prediction document
        prediction_doc = {
            "timestamp": datetime.utcnow(),
            "form_data": form_data,
            "total_score": total_score,
            "eligibility": eligibility,
            "color": color,
            "category_breakdown": category_breakdown,
            "suggestions": suggestions,
            "certificate_marks": certificate_marks,
            "certificates": certificates,
        }
        
        # Insert and get ID
        result = collection.insert_one(prediction_doc)
        prediction_id = str(result.inserted_id)
        
        logger.info(f"✓ Prediction saved with ID: {prediction_id}")
        return prediction_id
        
    except Exception as e:
        logger.error(f"✗ Error saving prediction: {e}")
        raise


def get_prediction_history(limit: int = 10) -> list:
    """
    Get latest predictions from database.
    
    Args:
        limit: Maximum number of predictions to retrieve (max 50)
    
    Returns:
        List of predictions with basic info (id, timestamp, score, eligibility)
    """
    limit = min(limit, 50)  # Cap at 50 for performance
    
    try:
        db = get_db()
        collection = db[COLLECTION_NAME]
        
        # Query: latest predictions, sorted by timestamp descending
        predictions = list(
            collection.find(
                {},
                {
                    "_id": 1,
                    "timestamp": 1,
                    "total_score": 1,
                    "eligibility": 1,
                    "color": 1,
                }
            )
            .sort("timestamp", DESCENDING)
            .limit(limit)
        )
        
        # Convert MongoDB ObjectId to string for JSON serialization
        history = [
            {
                "id": str(pred["_id"]),
                "timestamp": pred["timestamp"].isoformat(),
                "total_score": pred["total_score"],
                "eligibility": pred["eligibility"],
                "color": pred["color"],
            }
            for pred in predictions
        ]
        
        logger.info(f"✓ Retrieved {len(history)} predictions from history")
        return history
        
    except Exception as e:
        logger.error(f"✗ Error retrieving prediction history: {e}")
        return []


def get_prediction_by_id(prediction_id: str) -> Optional[Dict[str, Any]]:
    """
    Get a specific prediction by ObjectId.
    
    Args:
        prediction_id: MongoDB ObjectId as string
    
    Returns:
        Prediction document dict, or None if not found
    """
    try:
        db = get_db()
        collection = db[COLLECTION_NAME]
        
        # Convert string ID to ObjectId
        try:
            obj_id = ObjectId(prediction_id)
        except Exception:
            logger.warning(f"Invalid prediction ID format: {prediction_id}")
            return None
        
        # Query by ID
        prediction = collection.find_one({"_id": obj_id})
        
        if not prediction:
            logger.warning(f"Prediction not found: {prediction_id}")
            return None
        
        # Convert ObjectId to string and datetime to ISO format for JSON
        prediction["id"] = str(prediction["_id"])
        del prediction["_id"]
        if "timestamp" in prediction:
            prediction["timestamp"] = prediction["timestamp"].isoformat()
        
        logger.info(f"✓ Retrieved prediction: {prediction_id}")
        return prediction
        
    except Exception as e:
        logger.error(f"✗ Error retrieving prediction {prediction_id}: {e}")
        return None


def get_analytics() -> dict:
    """
    Get analytics/statistics about predictions.
    
    Returns:
        Analytics dictionary with counts and breakdowns
    """
    try:
        db = get_db()
        collection = db[COLLECTION_NAME]
        
        # Total predictions
        total = collection.count_documents({})
        
        # Breakdown by eligibility tier
        tier_breakdown = list(
            collection.aggregate([
                {
                    "$group": {
                        "_id": "$eligibility",
                        "count": {"$sum": 1}
                    }
                },
                {"$sort": {"count": DESCENDING}}
            ])
        )
        
        # Average score
        avg_score_result = list(
            collection.aggregate([
                {
                    "$group": {
                        "_id": None,
                        "avg_score": {"$avg": "$total_score"},
                        "max_score": {"$max": "$total_score"},
                        "min_score": {"$min": "$total_score"},
                    }
                }
            ])
        )
        
        avg_data = avg_score_result[0] if avg_score_result else {}
        
        analytics = {
            "total_predictions": total,
            "average_score": round(avg_data.get("avg_score", 0), 2),
            "max_score": avg_data.get("max_score", 0),
            "min_score": avg_data.get("min_score", 0),
            "tier_breakdown": [
                {"tier": item["_id"], "count": item["count"]}
                for item in tier_breakdown
            ]
        }
        
        logger.info(f"✓ Analytics retrieved: {total} predictions")
        return analytics
        
    except Exception as e:
        logger.error(f"✗ Error retrieving analytics: {e}")
        return {}


def close_db():
    """Close MongoDB connection (call on app shutdown)"""
    global _mongo_client
    
    if _mongo_client:
        try:
            _mongo_client.close()
            _mongo_client = None
            logger.info("✓ MongoDB connection closed")
        except Exception as e:
            logger.error(f"✗ Error closing MongoDB connection: {e}")
