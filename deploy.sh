#!/bin/bash

# SolarSense Deployment Script
# This script helps deploy the SolarSense application

echo "🚀 SolarSense Deployment Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "backend/server.js" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
    echo "✅ Backend dependencies installed"
else
    echo "✅ Backend dependencies already installed"
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    echo "✅ Frontend dependencies installed"
else
    echo "✅ Frontend dependencies already installed"
fi

# Test backend server
echo "🧪 Testing backend server..."
cd backend
timeout 10s node server.js &
SERVER_PID=$!
sleep 3

# Test health endpoint
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Backend server is working"
else
    echo "❌ Backend server test failed"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Stop test server
kill $SERVER_PID 2>/dev/null
cd ..

echo ""
echo "🎉 All tests passed! Your application is ready for deployment."
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Deploy backend to Render (see RENDER_DEPLOYMENT.md)"
echo "3. Deploy frontend to Vercel"
echo "4. Configure environment variables"
echo "5. Test the deployed application"
echo ""
echo "📚 Documentation:"
echo "- RENDER_DEPLOYMENT.md - Backend deployment guide"
echo "- SECURITY.md - Security configuration"
echo "- PAYMENT_INTEGRATION.md - Payment setup"
echo ""