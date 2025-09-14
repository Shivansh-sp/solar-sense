# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the free M0 tier)

## Step 2: Configure Database

1. **Create Database User:**
   - Go to Database Access
   - Click "Add New Database User"
   - Username: `solarsense-user`
   - Password: Generate a secure password
   - Database User Privileges: "Read and write to any database"

2. **Whitelist IP Addresses:**
   - Go to Network Access
   - Click "Add IP Address"
   - Add `0.0.0.0/0` for all IPs (or specific IPs for security)

3. **Get Connection String:**
   - Go to Clusters
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

## Step 3: Update Environment Variables

Replace the connection string in your deployment platform:

```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/solarsense?retryWrites=true&w=majority
```

**⚠️ SECURITY WARNING**: Never commit real credentials to your repository. Use environment variables or secure secret management.

## Step 4: Test Connection

Your backend will automatically connect to MongoDB Atlas when deployed.

## Free Tier Limits

- **Storage**: 512 MB
- **Connections**: 100 concurrent connections
- **Bandwidth**: 1 GB per month
- **Perfect for**: Development and small production apps
