# 🚀 Quick Deploy Fix for SolarSense

## ❌ Current Problem
Render is looking for `./dist` directory but Next.js builds to `.next/` directory.

## ✅ Solutions (Choose One)

### Option 1: Vercel (Recommended - 2 minutes)
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your repository
5. Set **Root Directory** to `frontend`
6. Click "Deploy"
7. Done! ✅

### Option 2: Fix Render Settings (5 minutes)
1. Go to Render Dashboard
2. Find your service
3. Go to Settings
4. Update these settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: 18.x
5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=3000
   NEXT_PUBLIC_API_URL=https://solar-sense-backend.onrender.com/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Q8x9y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9
   ```
6. Redeploy

### Option 3: Create New Render Service
1. Create new Web Service on Render
2. Use the `render-frontend.yaml` configuration
3. Connect GitHub repository
4. Deploy

## 🎯 Why This Happens
- Render expects static sites to build to `./dist`
- Next.js builds to `.next/` directory
- Need to tell Render to use Next.js build process

## ✅ After Fix
Your frontend will be available at:
- Vercel: `https://your-app.vercel.app`
- Render: `https://your-app.onrender.com`

## 🔗 Backend is Already Working
Your backend is already deployed at:
`https://solar-sense-backend.onrender.com`
