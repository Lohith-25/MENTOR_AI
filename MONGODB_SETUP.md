# MongoDB Setup Guide for MENTOR_AI

Your project is now configured to use **MongoDB Atlas** (cloud database) instead of SQLite. This provides better scalability, cloud backup, and analytics capabilities.

## ✅ Quick Setup (5 minutes)

### Step 1: Create MongoDB Atlas Account (Free)
1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Sign Up for free"**
3. Create account with email
4. Verify email address
5. Accept terms and create account

### Step 2: Create a Cluster
1. Click **"Create a Deployment"**
2. Choose **M0 (free tier)** - unlimited usage for development
3. Select cloud provider and region (AWS recommended)
4. Click **"Create Cluster"**
5. Wait 1-2 minutes for cluster to be created

### Step 3: Create Database User
1. Go to **"Database Access"** tab
2. Click **"Add New Database User"**
3. Username: `mentor_ai_user` (or your choice)
4. Password: Create a strong password (save it!)
5. Click **"Add User"**

### Step 4: Whitelist Your IP
1. Go to **"Network Access"** tab
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (or specific IP for production)
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go to **"Cluster"** tab
2. Click **"Connect"** button
3. Choose **"Drivers"** option
4. Select **Python** and **3.6 or later**
5. Copy the connection string

### Step 6: Configure .env File
Open `/backend/.env` and replace the values:

```
MONGODB_URI=mongodb+srv://mentor_ai_user:YOUR_PASSWORD@your-cluster.mongodb.net/mentor_ai?retryWrites=true&w=majority
MONGODB_DB_NAME=mentor_ai
FLASK_ENV=development
FLASK_DEBUG=True
```

**Important:** Replace:
- `YOUR_PASSWORD` with your database password from Step 3
- `your-cluster` with your actual cluster name from Step 5

### Step 7: Test Connection
```bash
cd backend
pip install -r requirements.txt
python test_mongodb.py
```

Expected output:
```
✓ Connection successful!
✓ All tests passed! MongoDB is ready to use.
```

---

## 🔄 Migrating from SQLite to MongoDB

Your existing SQLite data is preserved in `database.db`. To keep using it, you can continue with SQLite. But to migrate to MongoDB:

1. **For new predictions**: They automatically save to MongoDB
2. **For historical data**: Manually export from SQLite if needed (contact support)

---

## 📊 New Features Available

### 1. **Analytics Endpoint**
```bash
curl http://localhost:5000/api/predictions/analytics
```
Returns:
- Total predictions count
- Average score
- Score distribution by eligibility tier

### 2. **Automatic Indexes**
MongoDB automatically creates indexes for:
- Fast timestamp queries (for history)
- Fast eligibility tier queries (for filtering)
- TTL: Auto-delete predictions after 90 days

### 3. **Cloud Backup**
All your data automatically backs up to MongoDB Atlas cloud

### 4. **Connection Pooling**
Optimized connection pool (15 max connections) for your development workload

---

## 🧪 Testing the Connection

### Quick Test
```bash
python test_mongodb.py
```

### Interactive Test
```python
from database import get_db, init_db

# Initialize
init_db()

# Get database
db = get_db()

# List collections
print(db.list_collection_names())

# Count predictions
count = db['predictions'].count_documents({})
print(f"Total predictions: {count}")
```

---

## 🚀 Starting the Server

```bash
cd backend
python app.py
```

Server will:
1. ✓ Load .env configuration
2. ✓ Connect to MongoDB Atlas
3. ✓ Create indexes and collections
4. ✓ Start Flask on http://localhost:5000

---

## 📋 Troubleshooting

### ❌ "Connection refused" or "Connection timeout"
- Check your IP is whitelisted in MongoDB Atlas Network Access
- Verify MONGODB_URI is correct (copy-paste carefully)
- Try `python test_mongodb.py` to see detailed error

### ❌ "Authentication failed"
- Check password is correct (don't include special chars in URL)
- If password has special characters, URL-encode them
- Example: `@` becomes `%40`, `:` becomes `%3A`

### ❌ "MONGODB_URI not set"
- Make sure `.env` file exists in `/backend/` directory
- Restart your terminal after creating `.env`

### ❌ "pymongo module not found"
```bash
pip install pymongo python-dateutil
```

---

## 🔐 Security Notes

1. **Never commit .env** - It's in .gitignore (don't remove!)
2. **Use strong passwords** - MongoDB Atlas requires 8+ characters
3. **For production:** Use IP whitelist instead of "Allow from Anywhere"
4. **Rotate passwords** periodically

---

## 📚 API Reference

### Get Prediction History
```
GET /api/predictions/history?limit=10
```

### Get Specific Prediction
```
GET /api/predictions/{prediction_id}
```
Note: `prediction_id` is now a MongoDB ObjectId (string format)

### Get Analytics
```
GET /api/predictions/analytics
```
Returns: `{ total_predictions, average_score, tier_breakdown }`

---

## ❓ FAQs

**Q: Do I need to pay?**
A: No. MongoDB Atlas M0 tier is completely free for development.

**Q: How much data can I store?**
A: 512 MB at a time with M0, but old predictions auto-delete after 90 days.

**Q: Can I export my data?**
A: Yes. MongoDB Atlas provides export tools in the UI, or use `mongodump`.

**Q: Do I need to modify my frontend?**
A: No. Frontend works exactly the same. Database change is transparent.

---

## 🆘 Need Help?

1. Check `/backend/test_mongodb.py` output for detailed error messages
2. Review MongoDB Atlas documentation: https://docs.atlas.mongodb.com
3. Check Flask-PyMongo integration: https://docs.mongodb.com/drivers/pymongo

---

**Connected to MongoDB!** 🎉
Your application is now using MongoDB Atlas for data persistence.
