# 🚀 Quick Deployment Checklist

## Phase 1: Database Setup (15 mins)
- [ ] Create MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- [ ] Create free M0 cluster
- [ ] Get connection string from Atlas
- [ ] Whitelist all IPs (Settings → Network Access → Allow from Anywhere)
- [ ] Save connection string for next steps

## Phase 2: GitHub Setup (10 mins)
- [ ] Create GitHub account (if needed)
- [ ] Initialize git in project root: `git init`
- [ ] Create `.env` file in `backend/` folder
- [ ] Add MongoDB connection string to `backend/.env`
- [ ] Add `backend/.env` to `.gitignore`
- [ ] Push project to GitHub: `git push`

## Phase 3: Backend Deployment (10 mins)
- [ ] Create Railway account (https://railway.app)
- [ ] Connect GitHub repository to Railway
- [ ] Set root directory to `backend`
- [ ] Add environment variables in Railway
- [ ] Deploy and note the Railway URL
- [ ] Save Railway URL: `https://your-app.up.railway.app`

## Phase 4: Frontend Deployment (10 mins)
- [ ] Create Vercel account (https://vercel.com)
- [ ] Import GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Add `VITE_API_URL` environment variable (Railway URL)
- [ ] Deploy to Vercel
- [ ] Save Vercel URL: `https://your-app.vercel.app`

## Phase 5: Final Configuration (5 mins)
- [ ] Update Railway `ALLOWED_ORIGINS` with Vercel URL
- [ ] Test login at Vercel URL from mobile

## Testing (5 mins)
- [ ] Open frontend URL on mobile browser
- [ ] Register new account
- [ ] Login with credentials
- [ ] Submit prediction form
- [ ] Verify results display

---

## Total Time: ~50 minutes

### Files to Modify:
1. `backend/.env` - MongoDB connection string
2. `frontend/.env.local` - Backend API URL
3. Push to GitHub

### Important URLs:
- GitHub: `https://github.com/YOUR_USERNAME/mentor-ai`
- Railway Backend: `https://your-app.up.railway.app` (will be provided)
- Vercel Frontend: `https://your-app.vercel.app` (will be provided)

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Network Error on form submit | Check backend URL in `VITE_API_URL` |
| Login page blank on mobile | Clear browser cache, check Vercel deployment |
| MongoDB connection error | Verify connection string, whitelist all IPs in Atlas |
| 404 Not Found errors | Check root directory settings in both platforms |

---

## Next Time You Update Code:
```bash
git add .
git commit -m "Your description"
git push origin main
```
Both Railway and Vercel will auto-deploy! 🎉
