# 🚀 MENTOR AI - Complete Deployment Guide

## Overview
This guide will help you deploy the MENTOR AI application to the cloud so you can access it from your mobile device.

**Deployment Architecture:**
- **Frontend**: Vercel (free, automatic deployments)
- **Backend**: Railway or Render (free tier available)
- **Database**: MongoDB Atlas (free M0 cluster)

---

## ✅ Prerequisites

### 1. Create MongoDB Atlas Account
**Time: ~15 minutes**

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Sign Up"** (use Google account for faster setup)
3. Create a new **Organization** → **Project**
4. Click **"Build a Cluster"**
5. Select **M0 (Free)** tier
6. Choose your preferred region (closest to you for better speed)
7. Wait for cluster to deploy (~10 minutes)

### 2. Get MongoDB Connection String
1. Click your cluster → **"Connect"** button
2. Select **"Drivers"** → **Python 3.6 or later**
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)
4. **Save this** - you'll need it in the next steps

### 3. Create GitHub Account (if you don't have one)
- Go to [https://github.com/signup](https://github.com/signup)

### 4. Create Railway Account
1. Go to [https://railway.app](https://railway.app)
2. Sign up with GitHub

### 5. Create Vercel Account
1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub

---

## 📝 Step 1: Push Project to GitHub

### 1.1 Create `.env` File (Backend)

In `backend/.env` file, add:

```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster-name.mongodb.net/mentor_ai?retryWrites=true&w=majority
MONGODB_DB_NAME=mentor_ai
FLASK_ENV=production
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://your-frontend-domain.vercel.app
```

**Replace:**
- `your-username:your-password` → Your MongoDB Atlas credentials
- `cluster-name` → Your MongoDB cluster name
- `https://your-frontend-domain.vercel.app` → Will update after frontend deployment

### 1.2 Create `.env.local` File (Frontend)

In `frontend/.env.local` file, add:

```
VITE_API_URL=http://localhost:5000
```

You'll update this to the deployed backend URL later.

### 1.3 Add Files to .gitignore

Make sure `backend/.env` and `frontend/.env.local` are in `.gitignore` (don't commit secrets!)

### 1.4 Initialize Git & Push

```bash
# In your project root directory
git init
git add .
git commit -m "Initial commit - MENTOR AI"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/mentor-ai.git
git push -u origin main
```

---

## 🚀 Step 2: Deploy Backend to Railway

### 2.1 Connect Repository

1. Go to [https://railway.app](https://railway.app)
2. Login with GitHub
3. Click **"Create New Project"**
4. Select **"Deploy from GitHub repo"**
5. Authorize Railway and select your `mentor-ai` repository
6. Select the `main` branch

### 2.2 Configure Environment Variables

1. In Railway dashboard, click your project
2. Go to **Variables** tab
3. Add these variables:

```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster-name.mongodb.net/mentor_ai?retryWrites=true&w=majority
MONGODB_DB_NAME=mentor_ai
FLASK_ENV=production
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://your-vercel-frontend.vercel.app
PORT=8000
```

### 2.3 Configure Root Directory

1. Go to **Settings** tab
2. Set **Root Directory** to `backend`
3. Set **Start Command** to `python app.py`

### 2.4 Deploy

Railway will automatically deploy! Once complete, you'll get a URL like:
`https://mentor-ai-production.up.railway.app`

**Save this URL** - you need it for frontend configuration!

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Connect Repository

1. Go to [https://vercel.com](https://vercel.com)
2. Login with GitHub
3. Click **"New Project"**
4. Select your `mentor-ai` repository
5. Click **"Import"**

### 3.2 Configure Project

1. **Framework Preset**: Select **Vite**
2. **Root Directory**: Select `frontend`
3. Click **"Environment Variables"**
4. Add:

```
VITE_API_URL=https://mentor-ai-production.up.railway.app
```

(Replace with your actual Railway backend URL)

### 3.3 Deploy

Click **"Deploy"** and wait. You'll get a URL like:
`https://mentor-ai.vercel.app`

---

## 🔄 Step 4: Update Backend with Frontend URL

Now that frontend is deployed:

1. Go back to Railway dashboard
2. Go to **Variables** tab
3. Update `ALLOWED_ORIGINS` to:

```
ALLOWED_ORIGINS=https://mentor-ai.vercel.app,http://localhost:5173,http://localhost:3000
```

4. Save - Railway will auto-redeploy ✅

---

## 📱 Step 5: Access on Mobile

### Option A: Same WiFi Network (Fastest)
1. Get your computer's IP address:
   - Windows: `ipconfig` → Look for "IPv4 Address"
   - Mac/Linux: `ifconfig` → Look for "inet"
2. From mobile: `http://YOUR_IP:5000` (if backend on localhost)

### Option B: Public Cloud (Recommended)
Just open: `https://mentor-ai.vercel.app`

---

## ✅ Testing Checklist

- [ ] Can access login page from mobile
- [ ] Can register new user
- [ ] Can login with email/password
- [ ] Can see user dashboard
- [ ] Can navigate to predictor page
- [ ] Can submit prediction form
- [ ] Can see results on dashboard

---

## 🐛 Troubleshooting

### "Network Error" when submitting form
**Solution**: Check that `VITE_API_URL` in frontend env matches your Railway backend URL

### "Connection refused" to MongoDB
**Solution**: 
1. Check MongoDB Atlas is running
2. Verify connection string in backend environment variables
3. Make sure IP is whitelisted in MongoDB Atlas (Settings → Network Access → Allow from Anywhere)

### Blank page on mobile
**Solution**:
1. Check browser console for errors
2. Verify frontend is deployed and URL is accessible
3. Clear browser cache

### Database migrations not running
**Solution**: Run manually in Railway terminal:
```bash
python -c "from database import init_db; init_db()"
```

---

## 📚 Environment Variables Reference

### Backend (.env)
```
MONGODB_URI          # MongoDB Atlas connection string
MONGODB_DB_NAME      # Database name (default: mentor_ai)
FLASK_ENV            # development or production
FLASK_SECRET_KEY     # Secret key for sessions
ALLOWED_ORIGINS      # Comma-separated CORS origins
PORT                 # Server port (Railway sets automatically)
```

### Frontend (.env.local)
```
VITE_API_URL         # Backend API URL (e.g., https://backend.railway.app)
```

---

## 🎯 Next Steps

After successful deployment:

1. **Monitor logs**:
   - Railway: Dashboard → Deployments tab
   - Vercel: Deployments tab

2. **Set up custom domain** (optional):
   - Railway & Vercel both support free custom domains

3. **Enable HTTPS** (automatic on both platforms)

4. **Set up CI/CD** (automatic on both platforms)

---

## 💡 Cost Summary

- **MongoDB Atlas**: FREE (M0 tier)
- **Railway**: FREE tier includes 500 compute hours/month
- **Vercel**: FREE for up to 3 projects

**Total Cost: $0** ✅

---

## 📞 Support

If you're stuck:
1. Check Railway logs: Dashboard → Deployments
2. Check Vercel logs: Deployments → View Details
3. Check MongoDB connection in backend .env
4. Ensure all environment variables are set correctly

