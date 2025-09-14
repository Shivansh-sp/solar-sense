# 🚀 Render Deployment Guide

## Prerequisites
- GitHub repository with your code
- MongoDB Atlas account
- Stripe account (for payments)

## Step 1: Prepare Your Repository

### 1.1 Update package.json
Ensure your `backend/package.json` has the correct main file:
```json
{
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 1.2 Environment Variables
Create a `.env.example` file in the backend directory:
```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/solarsense?retryWrites=true&w=majority&appName=Cluster0

# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRE=7d

# API Configuration
API_VERSION=v1
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Stripe Payment Configuration
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Step 2: Deploy to Render

### 2.1 Create New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select your repository

### 2.2 Configure Service
- **Name**: `solarsense-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 2.3 Environment Variables
Add these environment variables in Render dashboard:

#### Required Variables
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/solarsense?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend-domain.vercel.app
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

#### Stripe Variables (for payments)
```
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 2.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your service URL (e.g., `https://solarsense-backend.onrender.com`)

## Step 3: Configure MongoDB Atlas

### 3.1 Network Access
1. Go to MongoDB Atlas Dashboard
2. Navigate to "Network Access"
3. Add Render's IP ranges or allow all IPs (0.0.0.0/0)

### 3.2 Database User
1. Go to "Database Access"
2. Create a new database user
3. Use this user in your MONGODB_URI

## Step 4: Configure Stripe

### 4.1 Webhook Endpoint
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-backend-url.onrender.com/api/payments/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.succeeded`
   - `charge.failed`
4. Copy the webhook secret

### 4.2 API Keys
1. Get your live API keys from Stripe Dashboard
2. Add them to Render environment variables

## Step 5: Test Deployment

### 5.1 Health Check
Visit: `https://your-backend-url.onrender.com/health`
Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

### 5.2 API Endpoints
Test these endpoints:
- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/energy` - Energy data
- `POST /api/payments/create-payment-intent` - Payment processing

## Step 6: Frontend Configuration

### 6.1 Update API URL
In your frontend, update the API URL to point to your Render backend:
```typescript
// frontend/src/config/api.ts
export const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
```

### 6.2 Environment Variables
Update your frontend environment variables:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
NEXT_PUBLIC_WS_URL=wss://your-backend-url.onrender.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
```

## Troubleshooting

### Common Issues

#### 1. Module Not Found Error
```
Error: Cannot find module '/opt/render/project/src/backend/serve'
```
**Solution**: Ensure your package.json has the correct main file and start script.

#### 2. MongoDB Connection Error
```
MongooseError: Operation `users.insertOne()` buffering timed out
```
**Solution**: Check your MONGODB_URI and network access settings.

#### 3. CORS Error
```
Access to fetch at 'https://your-backend-url.onrender.com' from origin 'https://your-frontend-url.vercel.app' has been blocked by CORS policy
```
**Solution**: Update CORS_ORIGIN environment variable with your frontend URL.

#### 4. Stripe Webhook Error
```
Error: No signatures found matching the expected signature for payload
```
**Solution**: Check your STRIPE_WEBHOOK_SECRET environment variable.

### Debugging

#### 1. Check Logs
- Go to Render Dashboard
- Click on your service
- Go to "Logs" tab
- Look for error messages

#### 2. Test Locally
```bash
cd backend
npm install
npm start
```

#### 3. Environment Variables
- Verify all required environment variables are set
- Check for typos in variable names
- Ensure values are properly formatted

## Performance Optimization

### 1. Enable Auto-Deploy
- Go to service settings
- Enable "Auto-Deploy" from main branch

### 2. Health Checks
- Render automatically checks `/health` endpoint
- Ensure your health endpoint is working

### 3. Monitoring
- Set up monitoring for your service
- Configure alerts for downtime

## Security Checklist

- [ ] Environment variables are set correctly
- [ ] MongoDB access is restricted
- [ ] CORS is configured properly
- [ ] Stripe webhooks are verified
- [ ] HTTPS is enabled (automatic on Render)
- [ ] Rate limiting is configured
- [ ] Security headers are enabled

## Cost Optimization

### Free Tier Limits
- 750 hours per month
- Service sleeps after 15 minutes of inactivity
- Cold start takes ~30 seconds

### Upgrade Options
- Starter plan: $7/month
- Standard plan: $25/month
- Pro plan: $85/month

## Support

### Render Support
- [Render Documentation](https://render.com/docs)
- [Render Support](https://render.com/support)

### SolarSense Support
- Check logs for errors
- Verify environment variables
- Test endpoints manually
- Contact development team

---

## 🎉 Deployment Complete!

Once deployed, your SolarSense backend will be available at:
`https://your-backend-url.onrender.com`

Update your frontend configuration and you're ready to go! 🚀
