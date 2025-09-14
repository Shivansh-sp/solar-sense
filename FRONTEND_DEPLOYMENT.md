# SolarSense Frontend Deployment Guide

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set the root directory to `frontend/`
3. Vercel will automatically detect Next.js and configure everything
4. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: `https://solar-sense-backend.onrender.com/api`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
   - `NEXT_PUBLIC_APP_URL`: Your Vercel app URL

### Option 2: Render (Using Dockerfile)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the root directory to `frontend/`
4. Use the provided Dockerfile
5. Set environment variables in Render dashboard

### Option 3: Render (Manual Configuration)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the root directory to `frontend/`
4. Use these settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: 18.x

## 🔧 Environment Variables

```bash
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://solar-sense-backend.onrender.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=https://your-frontend-url.com
NEXT_PUBLIC_WEATHER_API_KEY=your-weather-api-key
NEXT_PUBLIC_MQTT_BROKER_URL=mqtt://localhost:1883
NEXT_PUBLIC_MQTT_TOPIC_PREFIX=solarsense
```

## 📁 Build Output

Next.js builds to `.next/` directory, not `./dist`. The build process:
1. `npm run build` creates optimized production build in `.next/`
2. `npm start` serves the built application
3. Static files are served from `.next/static/`

## 🐛 Troubleshooting

### Render Deployment Issues
- **Error**: "Publish directory ./dist does not exist"
- **Solution**: Use the Dockerfile or set correct build/start commands
- **Alternative**: Deploy to Vercel (recommended for Next.js)

### Build Cache Warnings
- **Warning**: "No build cache found"
- **Solution**: Use `npm run build:cache` for faster rebuilds
- **Note**: This is just a performance optimization, not critical

### Workspace Root Warnings
- **Warning**: "Next.js inferred your workspace root"
- **Solution**: Already fixed in `next.config.ts` with `outputFileTracingRoot`

## ✅ Pre-deployment Checklist

- [ ] All TypeScript errors resolved
- [ ] Build passes locally (`npm run build`)
- [ ] Environment variables configured
- [ ] API endpoints updated to production URLs
- [ ] Stripe keys configured
- [ ] CORS settings updated in backend

## 🎯 Quick Deploy Commands

```bash
# Local build test
cd frontend
npm run build
npm start

# Deploy to Vercel (if using Vercel CLI)
vercel --prod

# Deploy to Render (if using Render CLI)
render deploy
```
