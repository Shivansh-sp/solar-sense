# 🔧 Environment Setup Guide

## Backend Environment Variables

### Required Variables
```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/solarsense?retryWrites=true&w=majority&appName=Cluster0

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRE=7d

# API Configuration
API_VERSION=v1
CORS_ORIGIN=https://solar-sense-frontend.vercel.app

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Stripe Payment Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Frontend Environment Variables

### Required Variables (.env.local)
```env
NEXT_PUBLIC_API_URL=https://solar-sense-backend.onrender.com/api
NEXT_PUBLIC_WS_URL=wss://solar-sense-backend.onrender.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
```

## 🔑 Key Generation

### JWT Secret
Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your test keys from API Keys section
3. For webhooks, create an endpoint and get the webhook secret

### MongoDB URI
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Get the connection string
5. Replace `<username>`, `<password>`, and `<dbname>` with your values

## 🚀 Quick Setup

### Backend
```bash
cd backend
cp env.example .env
# Edit .env with your actual values
npm install
npm start
```

### Frontend
```bash
cd frontend
# Create .env.local file with your values
npm install
npm run dev
```

## 🔒 Security Notes

1. **Never commit** `.env` files to version control
2. **Use different keys** for development and production
3. **Rotate keys** regularly
4. **Use strong passwords** for database
5. **Enable 2FA** for all services

## 📋 Production Checklist

- [ ] Environment variables set
- [ ] HTTPS enabled
- [ ] Database access restricted
- [ ] Stripe live keys configured
- [ ] Monitoring enabled
- [ ] Backup configured
