# 🚀 Render Environment Variables Setup Guide

## Step 1: Deploy Your Backend to Render

1. **Go to Render Dashboard**: [https://dashboard.render.com](https://dashboard.render.com)
2. **Click "New +"** → **"Web Service"**
3. **Connect Repository**: Select your GitHub repository
4. **Configure Service**:
   - **Name**: `solarsense-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

## Step 2: Set Environment Variables in Render

### 🔧 Required Environment Variables

Go to your Render service → **Environment** tab and add these variables:

#### **Database Configuration**
```
MONGODB_URI = mongodb+srv://shivanshpushkarna_db_user:CFM6tSoP5vd1mhBE@cluster0.x6fhvdz.mongodb.net/solarsense?retryWrites=true&w=majority&appName=Cluster0
```

#### **Server Configuration**
```
NODE_ENV = production
PORT = 5000
```

#### **JWT Configuration**
```
JWT_SECRET = your-super-secure-production-jwt-secret-here
JWT_EXPIRE = 7d
```

#### **CORS Configuration**
```
CORS_ORIGIN = https://your-frontend-domain.vercel.app
```

#### **Security Configuration**
```
BCRYPT_ROUNDS = 12
RATE_LIMIT_WINDOW_MS = 900000
RATE_LIMIT_MAX_REQUESTS = 100
```

#### **API Configuration**
```
API_VERSION = v1
LOG_LEVEL = info
```

#### **Optional Configuration**
```
WEATHER_API_KEY = your-weather-api-key
REDIS_URL = redis://localhost:6379
ML_MODEL_PATH = ./models
MQTT_BROKER_URL = mqtt://localhost:1883
MQTT_TOPIC_PREFIX = solarsense
```

## Step 3: Deploy Frontend to Vercel

1. **Go to Vercel Dashboard**: [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. **Import Project**: Select your GitHub repository
3. **Configure**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 🔧 Frontend Environment Variables in Vercel

Go to your Vercel project → **Settings** → **Environment Variables**:

```
NEXT_PUBLIC_API_URL = https://solarsense-backend.onrender.com
NEXT_PUBLIC_GEMINI_API_KEY = your-gemini-api-key
```

## Step 4: Update CORS After Deployment

1. **Get your Vercel frontend URL** (e.g., `https://solar-sense.vercel.app`)
2. **Go back to Render** → Your backend service → **Environment** tab
3. **Update CORS_ORIGIN**:
   ```
   CORS_ORIGIN = https://solar-sense.vercel.app
   ```
4. **Redeploy** your backend service

## Step 5: Test Your Deployment

### Backend Health Check
```
https://solarsense-backend.onrender.com/health
```

### Frontend URL
```
https://your-frontend-domain.vercel.app
```

## 🔐 Security Best Practices

### ✅ Do's:
- Use strong, unique JWT secrets for production
- Set different credentials for different environments
- Use environment variables for all sensitive data
- Regularly rotate your MongoDB Atlas password
- Monitor access logs in MongoDB Atlas

### ❌ Don'ts:
- Never commit `.env` files to version control
- Don't use the same credentials for development and production
- Don't hardcode secrets in your code
- Don't share credentials in chat or email

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors**: Update CORS_ORIGIN with your frontend URL
2. **Database Connection**: Verify MONGODB_URI is correct
3. **Build Failures**: Check all required environment variables are set
4. **API Timeouts**: Increase timeout values if needed

### Debug Steps:

1. **Check Render Logs**: Go to your service → **Logs** tab
2. **Verify Environment Variables**: Ensure all variables are set correctly
3. **Test API Endpoints**: Use Postman or curl to test
4. **Check MongoDB Atlas**: Verify database connection

## 📊 Environment Variables Summary

| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `MONGODB_URI` | Database connection | ✅ | `mongodb+srv://...` |
| `NODE_ENV` | Environment mode | ✅ | `production` |
| `PORT` | Server port | ✅ | `5000` |
| `JWT_SECRET` | Authentication | ✅ | `your-secret` |
| `CORS_ORIGIN` | Frontend URL | ✅ | `https://app.vercel.app` |
| `JWT_EXPIRE` | Token expiry | ❌ | `7d` |
| `BCRYPT_ROUNDS` | Password hashing | ❌ | `12` |

Your SolarSense platform will be live and accessible worldwide! 🌍
