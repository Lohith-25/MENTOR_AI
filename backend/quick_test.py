import requests
import time

time.sleep(2)  # Give server time to handle requests

print("Testing Flask Backend...")
print("=" * 50)

# Test health and categories
methods = [
    ("GET", "http://localhost:5000/api/health"),
    ("GET", "http://localhost:5000/api/categories"),
]

for method, url in methods:
    try:
        if method == "GET":
            resp = requests.get(url, timeout=5)
        print(f"\n✓ {method} {url}")
        print(f"  Status: {resp.status_code}")
        print(f"  Response: {resp.json()}")
    except Exception as e:
        print(f"\n✗ {method} {url}")
        print(f"  Error: {e}")

print("\n" + "=" * 50)
print("Testing prediction endpoint...")
pred_data = {
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
    resp = requests.post("http://localhost:5000/api/predict", json=pred_data, timeout=5)
    print(f"\n✓ POST /api/predict")
    print(f"  Status: {resp.status_code}")
    data = resp.json()
    print(f"  Success: {data.get('success')}")
    if data.get('success'):
        print(f"  Total Score: {data.get('total_score')}")
        print(f"  Eligibility: {data.get('eligibility', {}).get('tier')}")
        print(f"  Suggestions: {data.get('suggestions', [])[:2]}")
except Exception as e:
    print(f"\n✗ POST /api/predict")
    print(f"  Error: {e}")
    import traceback
    traceback.print_exc()
