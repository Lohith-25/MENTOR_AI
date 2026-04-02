#!/usr/bin/env python3
"""
MongoDB Connection Test Script
Run this after setting up your .env file to verify MongoDB connection
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).parent / ".env"
load_dotenv(env_path)

# Test imports
print("Testing imports...")
try:
    from pymongo import MongoClient
    print("✓ pymongo imported successfully")
except ImportError:
    print("✗ pymongo not installed. Run: pip install -r requirements.txt")
    sys.exit(1)

print("\nTesting MongoDB connection...")

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("MONGODB_DB_NAME", "mentor_ai")

if not MONGODB_URI:
    print("✗ MONGODB_URI not found in .env file")
    print("  Please copy .env.example to .env and update with your connection string")
    sys.exit(1)

print(f"  Connection URI: {MONGODB_URI[:50]}...")
print(f"  Database: {DB_NAME}")

try:
    # Connect
    print("\n  Connecting to MongoDB...")
    client = MongoClient(MONGODB_URI, connectTimeoutMS=10000, serverSelectionTimeoutMS=5000)
    
    # Ping to verify connection
    print("  Pinging server...")
    client.admin.command("ping")
    print("✓ Connection successful!")
    
    # Get database
    db = client[DB_NAME]
    print(f"\n  Database info:")
    print(f"  - Name: {db.name}")
    print(f"  - Collections: {db.list_collection_names()}")
    
    # Show connection stats
    server_info = client.server_info()
    print(f"  - MongoDB Version: {server_info.get('version', 'Unknown')}")
    
    client.close()
    print("\n✓ All tests passed! MongoDB is ready to use.")
    
except Exception as e:
    print(f"\n✗ Connection failed!")
    print(f"  Error: {type(e).__name__}: {str(e)}")
    print("\nTroubleshooting:")
    print("  1. Check your .env file has correct MONGODB_URI")
    print("  2. Verify MongoDB Atlas cluster is created and running")
    print("  3. Check IP address is whitelisted in Network Access")
    print("  4. Ensure username/password in connection string are correct")
    sys.exit(1)
