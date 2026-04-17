"""
Real-time Socket.IO event handlers for live dashboard updates
"""
import logging
from flask import request
from flask_socketio import emit, join_room, leave_room
from datetime import datetime, timedelta
from database import (
    get_user_tasks, toggle_task, update_user_streak,
    get_user_analytics, log_activity, get_activity_logs
)

logger = logging.getLogger(__name__)

# Store connected users
connected_users = {}

def init_socket_events(socketio):
    """Initialize all Socket.IO event handlers"""
    
    @socketio.on('connect')
    def handle_connect(auth):
        """Handle user connection"""
        try:
            # Verify token from auth
            user_id = auth.get('userId') if auth else None
            if user_id:
                connected_users[user_id] = {
                    'socket_id': request.sid,
                    'connected_at': datetime.now()
                }
                logger.info(f"✅ User {user_id} connected")
                emit('connection_response', {'status': 'connected'})
        except Exception as e:
            logger.error(f"Connection error: {e}")
    
    @socketio.on('join_room')
    def handle_join_room(data):
        """User joins their personal room for updates"""
        try:
            user_id = data.get('userId')
            if user_id:
                join_room(f'user_{user_id}')
                logger.info(f"User {user_id} joined room")
        except Exception as e:
            logger.error(f"Join room error: {e}")
    
    @socketio.on('task_completed')
    def handle_task_completed(data):
        """Handle real-time task completion"""
        try:
            user_id = data.get('userId')
            task_id = data.get('taskId')
            completed = data.get('completed', True)
            
            # Update database
            if toggle_task(task_id, completed):
                # Fetch updated data
                tasks = get_user_tasks(user_id)
                total = len(tasks)
                completed_count = len([t for t in tasks if t.get('completed')])
                percentage = (completed_count / total * 100) if total > 0 else 0
                
                # Emit update to user's room
                emit('taskUpdated', {
                    'taskId': task_id,
                    'completed': completed,
                    'totalCompleted': completed_count,
                    'total': total,
                    'percentage': percentage,
                    'timestamp': datetime.now().isoformat()
                }, room=f'user_{user_id}')
                
                logger.info(f"Task {task_id} updated for user {user_id}")
        except Exception as e:
            logger.error(f"Task completion error: {e}")
    
    @socketio.on('request_progress_update')
    def handle_progress_update(data):
        """Send real-time progress update"""
        try:
            user_id = data.get('userId')
            tasks = get_user_tasks(user_id)
            analytics = get_user_analytics(user_id)
            
            total = len(tasks)
            completed = len([t for t in tasks if t.get('completed')])
            percentage = (completed / total * 100) if total > 0 else 0
            success_rate = analytics.get('success_rate', 0)
            
            # Generate chart data
            chart_data = generate_progress_chart(user_id)
            
            emit('progressUpdated', {
                'progress': {
                    'completed': completed,
                    'total': total,
                    'percentage': percentage
                },
                'successRate': success_rate,
                'chartData': chart_data,
                'timestamp': datetime.now().isoformat()
            }, room=f'user_{user_id}')
        except Exception as e:
            logger.error(f"Progress update error: {e}")
    
    @socketio.on('disconnect')
    def handle_disconnect():
        """Handle user disconnection"""
        for user_id, user_info in list(connected_users.items()):
            if user_info['socket_id'] == request.sid:
                del connected_users[user_id]
                logger.info(f"User {user_id} disconnected")
                break


def generate_progress_chart(user_id):
    """Generate 7-day progress chart data"""
    logs = get_activity_logs(user_id, days=7)
    
    chart_data = []
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    
    for i in range(7):
        date = datetime.now() - timedelta(days=6-i)
        day_name = days[i]
        
        # Count completed tasks for this day
        completed_today = len([
            log for log in logs 
            if log['type'] == 'task_completed' 
            and log['date'].date() == date.date()
        ])
        
        chart_data.append({
            'date': day_name,
            'completed': completed_today,
            'target': 5  # Default target
        })
    
    return chart_data


def emit_streak_update(user_id, socket_io):
    """Emit streak update to user"""
    from database import get_user_profile
    user = get_user_profile(user_id)
    
    if user:
        socket_io.emit('streakUpdated', {
            'streak': user.get('streak', 0),
            'xp': user.get('xp', 0),
            'level': calculate_level(user.get('xp', 0)),
            'timestamp': datetime.now().isoformat()
        }, room=f'user_{user_id}')


def emit_ai_insights(user_id, socket_io):
    """Emit AI-generated insights to user"""
    insights = generate_ai_insights(user_id)
    
    socket_io.emit('insightsGenerated', {
        'insights': insights,
        'timestamp': datetime.now().isoformat()
    }, room=f'user_{user_id}')


def generate_ai_insights(user_id):
    """Generate AI insights based on user activity"""
    analytics = get_user_analytics(user_id)
    logs = get_activity_logs(user_id, days=7)
    
    insights = []
    
    # Analyze productivity patterns
    day_productivity = {}
    for log in logs:
        day = log['date'].strftime('%A')
        day_productivity[day] = day_productivity.get(day, 0) + 1
    
    if day_productivity:
        peak_day = max(day_productivity, key=day_productivity.get)
        insights.append({
            'title': 'Peak Productivity',
            'description': f"You're most productive on {peak_day}s",
            'icon': '⚡',
            'color': 'blue'
        })
    
    # Check consistency trend
    success_rate = analytics.get('success_rate', 0)
    if success_rate < 70:
        insights.append({
            'title': 'Consistency Alert',
            'description': f'Your success rate is {success_rate}%. Try daily habits!',
            'icon': '📉',
            'color': 'orange'
        })
    else:
        insights.append({
            'title': 'Great Progress',
            'description': f'Maintaining {success_rate}% success rate! Keep it up!',
            'icon': '🚀',
            'color': 'green'
        })
    
    return insights


def calculate_level(xp):
    """Calculate user level based on XP"""
    if xp >= 5000:
        return 'Expert'
    elif xp >= 2000:
        return 'Pro'
    else:
        return 'Beginner'


def broadcast_activity_update(user_id, activity_data):
    """Broadcast activity update to user's connections"""
    # This would be called from app.py when an activity occurs
    log_activity(user_id, activity_data)
