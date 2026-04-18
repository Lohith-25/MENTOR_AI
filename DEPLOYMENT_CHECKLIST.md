# 📋 MENTOR AI - Deployment Checklist

## Current Status
- ✅ Code on GitHub
- ✅ Railway account ready
- ✅ Vercel account ready
- ⏳ MongoDB Atlas (in progress)

---

## 🔧 STEP 1: MongoDB Atlas (In Progress)

### Your MongoDB Connection String
```
AWAITING INPUT - Once you get it from MongoDB Atlas, paste it here:
mongodb+srv://[YOUR_FULL_CONNECTION_STRING]
```

### MongoDB Setup Checklist
- [ ] Create MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- [ ] Create M0 (Free) cluster
- [ ] Wait for cluster to deploy (~5-10 minutes)
- [ ] Click "Connect" → "Drivers" → Copy connection string
- [ ] Whitelist all IPs (Settings → Network Access → Allow from Anywhere)
- [ ] Copy the full connection string

---

## 📝 STEP 2: Configure Backend Environment

Once you have MongoDB connection string:

1. Create `backend/.env` with:
```
MONGODB_URI=YOUR_CONNECTION_STRING_HERE
MONGODB_DB_NAME=mentor_ai
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

2. Verify `.env` is in `.gitignore` (don't commit!)

---

## 🚂 STEP 3: Deploy Backend to Railway

1. Go to Railway Dashboard (https://railway.app/dashboard)
2. Create new project → "Deploy from GitHub"
3. Select your **MENTOR_AI** repository
4. Configure:
   - **Root Directory**: `backend/`
   - **Environment Variables**:
     - `MONGODB_URI`: Your MongoDB connection string
     - `MONGODB_DB_NAME`: mentor_ai
     - `FLASK_ENV`: production
     - `PORT`: 5000
     - `ALLOWED_ORIGINS`: (add after Vercel URL is ready)
5. Click "Deploy"
6. Wait for deployment to complete
7. Note your Railway URL: `https://your-app.up.railway.app`

---

## 🌐 STEP 4: Configure Frontend Environment

After Railway deployment, update `frontend/.env.local`:

```
VITE_API_URL=https://your-app.up.railway.app
```

Or create the file if it doesn't exist.

---

## 🚀 STEP 5: Deploy Frontend to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import **MENTOR_AI** GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend/`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   - `VITE_API_URL`: Your Railway backend URL
6. Click "Deploy"
7. Wait for deployment
8. Note your Vercel URL: `https://your-app.vercel.app`

---

## 🔒 STEP 6: Update CORS Configuration

After frontend deployment, update Railway environment variables:

```
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:5173
```

Restart the deployment on Railway.

---

## ✅ STEP 7: Testing

Once both are deployed:

1. Go to your Vercel frontend URL
2. Register a new account
3. Login with your credentials
4. Fill out the prediction form
5. Submit and verify results display

---

## 📚 Important URLs

| Component | URL | Status |
|-----------|-----|--------|
| GitHub Repo | https://github.com/YOUR_USERNAME/mentor-ai | Ready |
| MongoDB Atlas | https://www.mongodb.com/cloud/atlas | ⏳ In Progress |
| Railway Backend | https://your-app.up.railway.app | Pending |
| Vercel Frontend | https://your-app.vercel.app | Pending |

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot connect" on form submit | Check VITE_API_URL environment variable |
| Login page blank | Clear browser cache, hard refresh (Ctrl+F5) |
| MongoDB connection error | Verify connection string, whitelist IPs in Atlas |
| Railway deployment fails | Check build logs, ensure root directory is `backend/` |
| Vercel shows 404 | Verify root directory is `frontend/`, check build logs |

---

## 🎉 Next Steps After Deployment

For future updates:
```bash
git add .
git commit -m "Your update description"
git push origin main
```

Both Railway and Vercel will automatically redeploy!

---

**Estimated Total Time: 30-40 minutes**

Need help? Ask in the deployment checklist section! 🚀
