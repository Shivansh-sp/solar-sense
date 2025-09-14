#!/bin/bash

# SolarSense Deployment Script
echo "🚀 Starting SolarSense deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f server/.env ]; then
    echo "📝 Creating environment file..."
    cat > server/.env << EOF
PORT=5000
MONGODB_URI=mongodb://admin:password@mongodb:27017/solarsense?authSource=admin
JWT_SECRET=$(openssl rand -base64 32)
CLIENT_URL=http://localhost:3000
WEATHER_API_KEY=your_openweather_api_key
REDIS_URL=redis://redis:6379
NODE_ENV=production
EOF
    echo "✅ Environment file created. Please update WEATHER_API_KEY in server/.env"
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

# Display access information
echo ""
echo "🎉 SolarSense is now running!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "🗄️  MongoDB: mongodb://localhost:27017"
echo "📊 Redis: redis://localhost:6379"
echo ""
echo "📚 Documentation: See README.md for detailed information"
echo "🐛 Logs: docker-compose logs -f"
echo "🛑 Stop: docker-compose down"
echo ""
echo "Happy coding! ⚡🌱"
