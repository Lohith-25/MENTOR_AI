"""
SQLite database initialization and management for prediction history
"""

import sqlite3
import json
import logging
from datetime import datetime
from pathlib import Path

logger = logging.getLogger(__name__)

DB_PATH = Path(__file__).parent / "database.db"


def init_db():
    """Initialize SQLite database with predictions table"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            form_data TEXT NOT NULL,
            total_score REAL NOT NULL,
            eligibility TEXT NOT NULL,
            color TEXT NOT NULL,
            category_breakdown TEXT NOT NULL,
            suggestions TEXT NOT NULL
        )
    """)
    
    conn.commit()
    conn.close()
    logger.info(f"Database initialized at {DB_PATH}")


def save_prediction(
    form_data: dict,
    total_score: float,
    eligibility: str,
    color: str,
    category_breakdown: dict,
    suggestions: list,
):
    """Save a prediction to the database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO predictions (
            form_data,
            total_score,
            eligibility,
            color,
            category_breakdown,
            suggestions
        ) VALUES (?, ?, ?, ?, ?, ?)
    """, (
        json.dumps(form_data),
        total_score,
        eligibility,
        color,
        json.dumps(category_breakdown),
        json.dumps(suggestions),
    ))
    
    conn.commit()
    prediction_id = cursor.lastrowid
    conn.close()
    
    logger.info(f"Prediction saved with ID: {prediction_id}")
    return prediction_id


def get_prediction_history(limit: int = 10) -> list:
    """Get latest predictions from database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT id, timestamp, total_score, eligibility, color
        FROM predictions
        ORDER BY timestamp DESC
        LIMIT ?
    """, (limit,))
    
    rows = cursor.fetchall()
    conn.close()
    
    history = [
        {
            "id": row[0],
            "timestamp": row[1],
            "total_score": row[2],
            "eligibility": row[3],
            "color": row[4],
        }
        for row in rows
    ]
    
    logger.info(f"Retrieved {len(history)} predictions from history")
    return history


def get_prediction_by_id(prediction_id: int) -> dict:
    """Get a specific prediction by ID"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT id, timestamp, form_data, total_score, eligibility, 
               color, category_breakdown, suggestions
        FROM predictions
        WHERE id = ?
    """, (prediction_id,))
    
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return None
    
    return {
        "id": row[0],
        "timestamp": row[1],
        "form_data": json.loads(row[2]),
        "total_score": row[3],
        "eligibility": row[4],
        "color": row[5],
        "category_breakdown": json.loads(row[6]),
        "suggestions": json.loads(row[7]),
    }
