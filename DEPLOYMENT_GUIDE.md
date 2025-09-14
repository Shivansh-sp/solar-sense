# SolarSense Full-Stack Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Render (Recommended for Backend)

**Backend on Render:**
1. Go to [Render](https://render.com)
2. Sign up with GitHub
3. Connect your repository
4. Create new Web Service
5. Select your repository
6. Configure:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node
   - **Plan**: Free

**Environment Variables:**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/solarsense
JWT_SECRET=your-secure-jwt-secret
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### Option 2: Railway (Alternative Backend)

**Backend on Railway:**
1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Deploy from GitHub
4. Select your repository
5. Railway will auto-detect Node.js

### Option 3: Vercel (Frontend)

**Frontend on Vercel:**
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
```

## 🔧 Step-by-Step Deployment

### 1. Deploy Backend First

1. **Choose Platform**: Render or Railway
2. **Connect Repository**: Link your GitHub repo
3. **Configure Build**:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Set Environment Variables** (see above)
5. **Deploy**: Click deploy and wait for success

### 2. Set Up MongoDB Atlas

1. **Create Account**: [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create Cluster**: Free M0 tier
3. **Create Database User**: Username/password
4. **Whitelist IPs**: Add `0.0.0.0/0` for all IPs
5. **Get Connection String**: Copy from Atlas dashboard
6. **Update Backend**: Add MONGODB_URI to environment variables

### 3. Deploy Frontend

1. **Go to Vercel**: [vercel.com](https://vercel.com)
2. **Import Project**: Select your GitHub repository
3. **Configure**:
   - Framework: Next.js
   - Root Directory: `frontend`
4. **Set Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
   - `NEXT_PUBLIC_GEMINI_API_KEY`: Your Gemini API key
5. **Deploy**: Click deploy

### 4. Update CORS Settings

After both are deployed:
1. **Get Frontend URL**: Copy from Vercel dashboard
2. **Update Backend**: Add frontend URL to CORS_ORIGIN
3. **Redeploy Backend**: Trigger new deployment

## 🔗 Environment Variables Reference

### Backend (Render/Railway)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/solarsense
JWT_SECRET=your-secure-jwt-secret-here
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
LOG_LEVEL=info
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
```

## 🧪 Testing Your Deployment

1. **Backend Health Check**: `https://your-backend.onrender.com/health`
2. **Frontend**: `https://your-frontend.vercel.app`
3. **Test API Connection**: Check browser network tab
4. **Test Chatbot**: Try asking questions
5. **Test Login**: Try the login/signup flow

## 🆓 Free Tier Limits

### Render (Backend)
- **Free Tier**: 750 hours/month
- **Sleep**: After 15 minutes of inactivity
- **Bandwidth**: 100 GB/month
- **Perfect for**: Development and small production

### Vercel (Frontend)
- **Free Tier**: Unlimited static sites
- **Bandwidth**: 100 GB/month
- **Builds**: 100 builds/month
- **Perfect for**: React/Next.js apps

### MongoDB Atlas
- **Free Tier**: 512 MB storage
- **Connections**: 100 concurrent
- **Bandwidth**: 1 GB/month
- **Perfect for**: Development and small production

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors**: Update CORS_ORIGIN in backend
2. **Database Connection**: Check MONGODB_URI format
3. **Build Failures**: Check Node.js version compatibility
4. **Environment Variables**: Ensure all required vars are set
5. **API Timeouts**: Check network connectivity

### Debug Steps:

1. **Check Logs**: View deployment logs
2. **Test Endpoints**: Use Postman or curl
3. **Verify Environment**: Check all variables are set
4. **Check Dependencies**: Ensure all packages are installed

## 📞 Support

If you encounter issues:
1. Check the deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Check MongoDB Atlas connection
5. Review CORS settings

Your SolarSense platform will be live and accessible worldwide! 🌍
