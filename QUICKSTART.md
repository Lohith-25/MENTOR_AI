# ⚡ Quick Start - Get Your Dashboard Running in 5 Minutes

## Step 1: Install Dependencies (2 minutes)

### Backend
```bash
cd MENTOR_AI/backend
pip install -r requirements.txt
```

### Frontend
```bash
cd MENTOR_AI/frontend
npm install
```

---

## Step 2: Configure Environment (1 minute)

### Create `backend/.env`
```bash
MONGO_URI=mongodb://localhost:27017/mentor_ai
SECRET_KEY=your-secret-key-here
DEBUG=True
```

### Create `frontend/.env`
```bash
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## Step 3: Start Backend (30 seconds)

### Open Terminal 1
```bash
cd MENTOR_AI/backend
python app.py
```

**Expected Output:**
```
🚀 Starting Flask server with Socket.IO real-time support...
📡 Socket.IO server available at ws://localhost:5000
 * Running on http://0.0.0.0:5000
```

✅ Backend ready!

---

## Step 4: Start Frontend (30 seconds)

### Open Terminal 2
```bash
cd MENTOR_AI/frontend
npm run dev
```

**Expected Output:**
```
VITE v5.0.0  ready in 234 ms
➜  Local:   http://localhost:5173/user-dashboard
```

✅ Frontend ready!

---

## Step 5: Open Dashboard! (30 seconds)

```
👉 http://localhost:5173/user-dashboard
```

### You Should See:
- ✅ User profile section
- ✅ **🟢 Live** indicator (top right)
- ✅ Task list with checkboxes
- ✅ Progress bar
- ✅ Charts
- ✅ AI insights panel
- ✅ Weekly activity heatmap

---

## 🎯 Test It Works

### Test 1: Click a Task
```
1. Find any task in the list
2. Click the checkbox
3. Should see:
   ✅ Checkmark appears instantly
   ✅ Progress bar increases
   ✅ Success rate updates
   ✅ Toast notification appears
   ✅ (Optional) Sound plays
```

### Test 2: Check Real-Time Connection
```
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Filter by "WS" (WebSocket)
4. Should show connection to:
   ws://localhost:5000/socket.io/?...
5. See messages being sent/received
```

### Test 3: Refresh Page
```
1. Press F5 to refresh
2. Data should persist (from MongoDB)
3. Task states should remain
4. Connection should auto-reconnect
```

---

## 🎓 What's Running

| Component | Port | Tech Stack |
|-----------|------|-----------|
| **Backend API** | 5000 | Flask + Flask-SocketIO |
| **Frontend App** | 5173 | React + Vite + Socket.IO Client |
| **Database** | 27017 | MongoDB |
| **WebSocket** | 5000 | Socket.IO (ws:// protocol) |

---

## 🚀 Next: Explore Features

### Real-Time Demo
1. Open dashboard in 2 browser tabs
2. Click task in Tab 1
3. Watch Tab 2 update automatically! ✨

### Navigate Pages
- **Dashboard**: http://localhost:5173/user-dashboard
- **Login**: http://localhost:5173/login
- **Input Page**: http://localhost:5173/input

---

## 🐛 Troubleshooting

### Problem: 🔴 Disconnected (Red indicator)
```bash
# Check if backend is running
ps aux | grep python

# Restart backend
cd MENTOR_AI/backend
python app.py
```

### Problem: Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill it
kill -9 <PID>

# Or use different port
python app.py --port 5001
```

### Problem: npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install

# If still fails, check Node version
node --version  # Should be 16+
```

### Problem: MongoDB Connection Error
```bash
# Check MongoDB is running
mongo --version

# Start MongoDB (if installed locally)
mongod

# Or update MONGO_URI for cloud
# In backend/.env:
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/mentor_ai
```

---

## 📊 Architecture at a Glance

```
Browser                 Backend Server              Database
   │                         │                          │
   │--(Edit Task)--→         │                          │
   │                 Socket.IO emit                     │
   │                         │                          │
   │                    Process Request                 │
   │                         │                          │
   │                    Update DB ─────────────────────→│
   │                         │                          │
   │                   Emit Response                    │
   │←--(taskUpdated)--        │                          │
   │                                                     │
   │  Render Update                                     │
   │  + Animation                                       │
   │  + Sound                                           │
   │  + Notification                                    │
```

---

## ⚡ Performance Tips

### Enable Sound (Optional)
```javascript
// Click the sound icon in dashboard navbar
// Enabled: 🔊 Sound
// Disabled: 🔇 Sound
```

### Monitor Performance
```bash
# In Chrome DevTools:
1. Open Console
2. Search for "connected" message
3. Check WebSocket tab for latency
4. Should see updates in < 100ms
```

### Optimize Charts (if slow)
```javascript
// In UserDashboard.jsx
// Wrap Recharts in React.memo()
const MemoChart = React.memo(ComposedChart)
```

---

## 🔐 Security Note

Before deploying to production:

1. **Change SECRET_KEY**
   ```bash
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

2. **Use HTTPS/WSS**
   ```python
   # In app.py
   socketio = SocketIO(
       app,
       cors_allowed_origins="https://yourdomain.com"
   )
   ```

3. **Restrict CORS**
   ```python
   # Don't use "*" in production!
   cors_allowed_origins=["https://yourdomain.com"]
   ```

4. **Enable Rate Limiting**
   ```python
   from flask_limiter import Limiter
   limiter = Limiter(app)
   @limiter.limit("100 per hour")
   ```

---

## 📚 Documentation

- **Full Guide**: `REALTIME_SYSTEM_GUIDE.md`
- **Implementation Details**: `IMPLEMENTATION_SUMMARY.md`
- **API Reference**: See `backend/dashboard_routes.py`
- **Socket Events**: See `backend/socket_events.py`

---

## ✅ Checklist

- [ ] Installed backend dependencies
- [ ] Installed frontend dependencies
- [ ] Created `.env` files
- [ ] Started backend server (port 5000)
- [ ] Started frontend server (port 5173)
- [ ] Opened dashboard in browser
- [ ] Saw 🟢 Live indicator
- [ ] Tested task completion
- [ ] Verified WebSocket connection
- [ ] Read about real-time features

---

## 🎉 You're All Set!

Your real-time AI dashboard is now running! 

### What You Can Do Now:
✅ Create and manage tasks in real-time
✅ Watch progress bars update instantly
✅ View AI-generated insights
✅ See beautiful animated charts
✅ Share live dashboard with others (2 tabs)

### What's Next:
📱 Deploy to production server
🤖 Integrate real ML models for AI insights
📊 Add more analytics and reporting
🎮 Implement leaderboards
🌍 Make it available to all users

---

## 💬 Questions?

1. Check `REALTIME_SYSTEM_GUIDE.md` for detailed documentation
2. Review code comments in `app.py` and `UserDashboard.jsx`
3. Use browser DevTools to inspect requests and WebSocket messages
4. Check backend console logs for errors

---

**Happy coding! 🚀**

*Time: ~5 minutes to have a production-ready real-time dashboard running*
