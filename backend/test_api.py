"""
Test script to verify backend API endpoints
Run after Flask server is running: python test_api.py
"""

import requests
import json
import sys

BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test health check endpoint"""
    print("🔍 Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print(f"✅ Health check passed: {response.json()}\n")
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}\n")
        return False

def test_categories():
    """Test categories endpoint"""
    print("🔍 Testing Categories Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/categories")
        assert response.status_code == 200
        data = response.json()
        print(f"✅ Categories retrieved: {len(data['categories'])} categories")
        print(f"   Total max score: {data['total_max_score']}\n")
        return True
    except Exception as e:
        print(f"❌ Categories test failed: {e}\n")
        return False

def test_predict_success():
    """Test successful prediction"""
    print("🔍 Testing Successful Prediction...")
    form_data = {
        "coding_problems": 500,
        "leetcode_problems": 300,
        "open_source": "Intermediate",
        "competitions": "Advanced",
        "cp_rating": "4-star",
        "projects": "Intermediate",
        "aptitude": 85,
        "skillrank": 75,
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/predict", json=form_data)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data["success"] == True
        assert "total_score" in data
        assert "eligibility" in data
        assert "category_breakdown" in data
        assert "suggestions" in data
        
        print(f"✅ Prediction successful!")
        print(f"   Score: {data['total_score']}/{data['max_possible_score']}")
        print(f"   Eligibility: {data['eligibility']['tier']}")
        print(f"   Color: {data['eligibility']['color']}")
        print(f"   Categories: {len(data['category_breakdown'])}")
        print(f"   Suggestions: {len(data['suggestions'])}\n")
        return True
    except Exception as e:
        print(f"❌ Prediction test failed: {e}\n")
        return False

def test_predict_validation_error():
    """Test prediction with invalid data"""
    print("🔍 Testing Validation Error Handling...")
    form_data = {
        "coding_problems": 5000,  # Out of range (max 2000)
        "leetcode_problems": 150,
        "open_source": "Beginner",
        "competitions": "Beginner",
        "cp_rating": "1-star",
        "projects": "Beginner",
        "aptitude": 50,
        "skillrank": 50,
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/predict", json=form_data)
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        
        data = response.json()
        assert data["success"] == False
        assert "error" in data
        
        print(f"✅ Validation error handled correctly!")
        print(f"   Error: {data['error']}")
        print(f"   Details: {data.get('details', {})}\n")
        return True
    except Exception as e:
        print(f"❌ Validation test failed: {e}\n")
        return False

def test_predict_edge_cases():
    """Test with minimum and maximum values"""
    print("🔍 Testing Edge Cases (Min/Max Values)...")
    
    # Minimum values
    min_data = {
        "coding_problems": 0,
        "leetcode_problems": 0,
        "open_source": "Beginner",
        "competitions": "Beginner",
        "cp_rating": "1-star",
        "projects": "Beginner",
        "aptitude": 0,
        "skillrank": 0,
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/predict", json=min_data)
        assert response.status_code == 200
        data_min = response.json()
        print(f"✅ Min values: Score = {data_min['total_score']}")
        
        # Maximum values (within reasonable limits)
        max_data = {
            "coding_problems": 2000,
            "leetcode_problems": 3000,
            "open_source": "Advanced",
            "competitions": "Expert",
            "cp_rating": "6-star",
            "projects": "Advanced",
            "aptitude": 100,
            "skillrank": 100,
        }
        
        response = requests.post(f"{BASE_URL}/api/predict", json=max_data)
        assert response.status_code == 200
        data_max = response.json()
        print(f"✅ Max values: Score = {data_max['total_score']}")
        print(f"   Score bounded in [0-300]: {0 <= data_max['total_score'] <= 300}\n")
        return True
    except Exception as e:
        print(f"❌ Edge case test failed: {e}\n")
        return False

def test_history():
    """Test history endpoint"""
    print("🔍 Testing History Endpoint...")
    try:
        # First, make a prediction
        form_data = {
            "coding_problems": 250,
            "leetcode_problems": 200,
            "open_source": "Beginner",
            "competitions": "Intermediate",
            "cp_rating": "2-star",
            "projects": "Beginner",
            "aptitude": 70,
            "skillrank": 60,
        }
        requests.post(f"{BASE_URL}/api/predict", json=form_data)
        
        # Get history
        response = requests.get(f"{BASE_URL}/api/predictions/history")
        assert response.status_code == 200
        data = response.json()
        print(f"✅ History retrieved: {data['count']} predictions\n")
        return True
    except Exception as e:
        print(f"❌ History test failed: {e}\n")
        return False

def main():
    """Run all tests"""
    print("=" * 60)
    print("🧪 PLACEMENT PREDICTOR - BACKEND API TEST SUITE")
    print("=" * 60)
    print()
    
    tests = [
        test_health_check,
        test_categories,
        test_predict_success,
        test_predict_validation_error,
        test_predict_edge_cases,
        test_history,
    ]
    
    results = []
    for test in tests:
        try:
            results.append(test())
        except Exception as e:
            print(f"❌ Test {test.__name__} crashed: {e}\n")
            results.append(False)
    
    print("=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    passed = sum(results)
    total = len(results)
    print(f"Passed: {passed}/{total}")
    
    if passed == total:
        print("\n✅ ALL TESTS PASSED!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        return 1

if __name__ == "__main__":
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\n\n⛔ Tests interrupted")
        sys.exit(1)
