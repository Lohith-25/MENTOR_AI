"""
Real-time Dashboard API Endpoints
"""
from flask import Blueprint, request, jsonify
from functools import wraps
from datetime import datetime, timedelta
from database import (
    get_db, get_user_profile, get_user_tasks, toggle_task,
    get_user_analytics, get_activity_logs, log_activity
)
from auth import token_required
import logging

logger = logging.getLogger(__name__)

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api')

def get_current_user_from_token(f):
    """Decorator to extract user from JWT token"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        try:
            from auth import verify_jwt_token
            user_data = verify_jwt_token(token)
            if user_data:
                return f(user_data['user_id'], *args, **kwargs)
        except:
            pass
        
        return jsonify({'error': 'Invalid token'}), 401
    return decorated_function


@dashboard_bp.route('/dashboard/<user_id>', methods=['GET'])
@token_required
def get_dashboard_data(user_id):
    """Get complete dashboard data for real-time updates"""
    try:
        # Get user profile
        user = get_user_profile(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get tasks
        tasks = get_user_tasks(user_id)
        total_tasks = len(tasks)
        completed_tasks = len([t for t in tasks if t.get('completed')])
        progress_percentage = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
        # Get analytics
        analytics = get_user_analytics(user_id)
        
        # Generate chart data
        chart_data = generate_progress_chart(user_id)
        weekly_performance = generate_weekly_stats(user_id, tasks)
        weekly_activity = generate_weekly_activity(user_id)
        ai_insights = generate_dashboard_insights(user_id, analytics)
        
        # Calculate level and XP
        xp = user.get('xp', 0)
        level = calculate_level(xp)
        
        response_data = {
            'user': {
                'id': str(user.get('_id', '')),
                'name': user.get('full_name', 'User'),
                'email': user.get('email', ''),
            },
            'tasks': format_tasks_for_frontend(tasks),
            'streak': user.get('streak', 0),
            'streakHistory': user.get('streak_history', []),
            'progress': {
                'completed': completed_tasks,
                'total': total_tasks,
                'percentage': progress_percentage
            },
            'successRate': analytics.get('success_rate', 0),
            'level': level,
            'xp': xp,
            'chartData': chart_data,
            'weeklyPerformance': weekly_performance,
            'weeklyActivity': weekly_activity,
            'aiInsights': ai_insights,
            'aiGuide': user.get('ai_guide', 'Keep uploading your resume for AI guidance!'),
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(response_data), 200
    except Exception as e:
        logger.error(f"Dashboard data error: {e}")
        return jsonify({'error': 'Failed to load dashboard'}), 500


@dashboard_bp.route('/task/update', methods=['POST'])
@token_required
def update_task():
    """Update task completion status"""
    try:
        data = request.json
        user_id = data.get('userId')
        task_id = data.get('taskId')
        completed = data.get('completed', False)
        
        # Update in database
        result = toggle_task(task_id, completed)
        
        if result:
            # Log the activity
            log_activity(user_id, {
                'type': 'task_completed' if completed else 'task_uncompleted',
                'task_id': task_id,
                'timestamp': datetime.now()
            })
            
            # Get updated stats
            tasks = get_user_tasks(user_id)
            completed_count = len([t for t in tasks if t.get('completed')])
            total = len(tasks)
            percentage = (completed_count / total * 100) if total > 0 else 0
            
            return jsonify({
                'success': True,
                'taskId': task_id,
                'completed': completed,
                'totalCompleted': completed_count,
                'total': total,
                'percentage': percentage
            }), 200
        else:
            return jsonify({'error': 'Task not found'}), 404
    except Exception as e:
        logger.error(f"Task update error: {e}")
        return jsonify({'error': 'Failed to update task'}), 500


@dashboard_bp.route('/activity/logs', methods=['GET'])
@token_required
def get_activity_logs_endpoint():
    """Get user's activity logs"""
    try:
        user_id = request.args.get('userId')
        days = int(request.args.get('days', 7))
        
        logs = get_activity_logs(user_id, days=days)
        
        # Format logs
        formatted_logs = []
        for log in logs:
            formatted_logs.append({
                'id': str(log.get('_id', '')),
                'type': log.get('type', ''),
                'description': log.get('description', ''),
                'timestamp': log.get('date', '').isoformat() if hasattr(log.get('date', ''), 'isoformat') else str(log.get('date', '')),
            })
        
        return jsonify({
            'success': True,
            'logs': formatted_logs,
            'count': len(formatted_logs)
        }), 200
    except Exception as e:
        logger.error(f"Activity logs error: {e}")
        return jsonify({'error': 'Failed to load logs'}), 500


@dashboard_bp.route('/analytics/<user_id>', methods=['GET'])
@token_required
def get_analytics(user_id):
    """Get detailed analytics for user"""
    try:
        analytics = get_user_analytics(user_id)
        tasks = get_user_tasks(user_id)
        logs = get_activity_logs(user_id, days=30)
        
        # Calculate metrics
        success_rate = analytics.get('success_rate', 0)
        total_tasks = len(tasks)
        completed_tasks = len([t for t in tasks if t.get('completed')])
        
        # Daily breakdown
        daily_metrics = {}
        for log in logs:
            day = log['date'].strftime('%Y-%m-%d')
            daily_metrics[day] = daily_metrics.get(day, 0) + 1
        
        response_data = {
            'success': True,
            'successRate': success_rate,
            'totalTasks': total_tasks,
            'completedTasks': completed_tasks,
            'dailyMetrics': daily_metrics,
            'periodAnalysis': {
                'week': calculate_weekly_stats(user_id),
                'month': calculate_monthly_stats(user_id)
            }
        }
        
        return jsonify(response_data), 200
    except Exception as e:
        logger.error(f"Analytics error: {e}")
        return jsonify({'error': 'Failed to load analytics'}), 500


# Helper functions

def format_tasks_for_frontend(tasks):
    """Format tasks for frontend display"""
    return [
        {
            'id': str(task.get('_id', '')),
            'title': task.get('title', ''),
            'completed': task.get('completed', False),
            'priority': task.get('priority', 'Medium'),
            'createdAt': task.get('created_at', '').isoformat() if hasattr(task.get('created_at', ''), 'isoformat') else '',
            'updatedAt': task.get('updated_at', '').isoformat() if hasattr(task.get('updated_at', ''), 'isoformat') else ''
        }
        for task in tasks
    ]


def generate_progress_chart(user_id):
    """Generate 7-day progress chart"""
    logs = get_activity_logs(user_id, days=7)
    chart_data = []
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    
    for i in range(7):
        date = datetime.now() - timedelta(days=6-i)
        day_name = days[date.weekday()]
        
        completed = len([
            log for log in logs
            if log['type'] == 'task_completed'
            and log['date'].date() == date.date()
        ])
        
        chart_data.append({
            'date': day_name,
            'completed': completed,
            'target': 5
        })
    
    return chart_data


def generate_weekly_stats(user_id, tasks):
    """Generate weekly performance stats"""
    logs = get_activity_logs(user_id, days=7)
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    weekly_stats = []
    
    for i in range(7):
        date = datetime.now() - timedelta(days=6-i)
        day_name = days[date.weekday()]
        
        day_activities = len([
            log for log in logs
            if log['date'].date() == date.date()
        ])
        
        weekly_stats.append({
            'day': day_name,
            'activities': day_activities,
            'tasks': len([t for t in tasks if t['created_at'].date() == date.date()])
        })
    
    return weekly_stats


def generate_weekly_activity(user_id):
    """Generate weekly activity heatmap data"""
    logs = get_activity_logs(user_id, days=7)
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    weekly_activity = []
    
    for i in range(7):
        date = datetime.now() - timedelta(days=6-i)
        day_name = days[date.weekday()]
        
        day_logs = [log for log in logs if log['date'].date() == date.date()]
        
        weekly_activity.append({
            'day': day_name,
            'active': len(day_logs) > 0,
            'tasks': len(day_logs)
        })
    
    return weekly_activity


def generate_dashboard_insights(user_id, analytics):
    """Generate AI insights for dashboard"""
    logs = get_activity_logs(user_id, days=7)
    
    insights = []
    
    # Productivity pattern analysis
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
    
    # Success rate insights
    success_rate = analytics.get('success_rate', 0)
    if success_rate >= 80:
        insights.append({
            'title': 'Excellent Progress',
            'description': f'Maintaining {success_rate}% success! Keep going!',
            'icon': '🚀',
            'color': 'green'
        })
    else:
        insights.append({
            'title': 'Consistency Alert',
            'description': f'Success rate is {success_rate}%. Daily practice helps!',
            'icon': '📈',
            'color': 'orange'
        })
    
    # Streak insights
    user = get_user_profile(user_id)
    streak = user.get('streak', 0) if user else 0
    if streak > 7:
        insights.append({
            'title': 'Streak Champion',
            'description': f'{streak} days in a row! Incredible consistency',
            'icon': '🔥',
            'color': 'red'
        })
    
    return insights[:3]  # Return top 3 insights


def calculate_level(xp):
    """Calculate user level from XP"""
    if xp >= 5000:
        return 'Expert'
    elif xp >= 2000:
        return 'Pro'
    else:
        return 'Beginner'


def calculate_weekly_stats(user_id):
    """Calculate weekly statistics"""
    logs = get_activity_logs(user_id, days=7)
    return {
        'total_activities': len(logs),
        'active_days': len(set(log['date'].date() for log in logs))
    }


def calculate_monthly_stats(user_id):
    """Calculate monthly statistics"""
    logs = get_activity_logs(user_id, days=30)
    return {
        'total_activities': len(logs),
        'active_days': len(set(log['date'].date() for log in logs))
    }
