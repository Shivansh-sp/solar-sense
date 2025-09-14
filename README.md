# 🌞 SolarSense - Smart Renewable Energy Platform

A comprehensive full-stack platform for managing renewable energy systems, featuring AI-powered forecasting, energy trading, smart home integration, and community energy networks.

## 🚀 Features

### 🔮 **AI-Powered Forecasting**
- Machine learning-based energy production predictions
- Weather integration for accurate forecasting
- Real-time energy consumption analytics
- Predictive maintenance alerts

### 💰 **Energy Trading Platform**
- Peer-to-peer energy trading
- Blockchain-secured transactions
- Dynamic pricing algorithms
- Community energy marketplace

### 🏠 **Smart Home Integration**
- IoT device connectivity
- Automated energy management
- Load balancing and optimization
- Real-time monitoring dashboard

### 🔒 **Security & Blockchain**
- Secure energy transactions
- Immutable trading records
- Smart contract automation
- Data privacy protection

### 🤖 **AI Chatbot Assistant**
- Google Gemini-powered AI assistant
- Renewable energy expertise
- 24/7 customer support
- Mobile-responsive design

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3.4.0
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **State Management**: React Context API
- **HTTP Client**: Axios

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcryptjs
- **Security**: Helmet, CORS, Rate Limiting
- **Real-time**: Socket.io
- **ML Libraries**: ml-regression, ml-kmeans

### **AI & ML**
- **Chatbot**: Google Gemini API
- **Forecasting**: Custom ML algorithms
- **Weather Data**: OpenWeatherMap API
- **Analytics**: Real-time data processing

### **DevOps & Deployment**
- **Containerization**: Docker
- **Deployment**: Vercel (Frontend), Railway/Heroku (Backend)
- **Environment**: Development, Staging, Production
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
solar-hackthon-software-solution/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   ├── config/          # Configuration files
│   │   └── types/           # TypeScript type definitions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   └── package.json
├── docs/                    # Documentation
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/solar-hackthon-software-solution.git
   cd solar-hackthon-software-solution
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend environment
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   
   # Frontend environment
   cd ../frontend
   cp .env.example .env.local
   # Add your Google Gemini API key
   ```

4. **Start the development servers**
   ```bash
   # From root directory
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/solarsense
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
GOOGLE_GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Google Gemini API Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file
4. Restart the development server

## 📱 Features Overview

### 🏠 **Landing Page**
- Modern, responsive design
- Interactive feature showcase
- Smooth animations and transitions
- Mobile-optimized interface

### 🔐 **Authentication System**
- Secure login/signup with JWT
- Comprehensive user registration
- Password validation and encryption
- Session management

### 📊 **Dashboard**
- Real-time energy monitoring
- Interactive charts and graphs
- Device control interface
- Household energy grid view

### 🤖 **AI Chatbot**
- Google Gemini-powered responses
- Renewable energy expertise
- Mobile-responsive design
- Quick question suggestions

### 🔮 **Forecasting**
- ML-based energy predictions
- Weather data integration
- Historical analysis
- Trend visualization

### 💱 **Trading Platform**
- P2P energy trading
- Dynamic pricing
- Transaction history
- Market analytics

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test

# Run all tests
npm run test:all
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku)
1. Create a new project on Railway/Heroku
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Energy Data Endpoints
- `GET /api/energy/consumption` - Get energy consumption data
- `GET /api/energy/production` - Get energy production data
- `POST /api/energy/forecast` - Generate energy forecast

### Trading Endpoints
- `GET /api/trading/offers` - Get available energy offers
- `POST /api/trading/buy` - Buy energy
- `POST /api/trading/sell` - Sell energy

### Chatbot Endpoint
- `POST /api/chatbot` - Send message to AI assistant

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development**: React, Next.js, TypeScript
- **Backend Development**: Node.js, Express, MongoDB
- **AI/ML Integration**: Google Gemini, Custom ML algorithms
- **UI/UX Design**: Tailwind CSS, Framer Motion
- **DevOps**: Docker, Vercel, Railway

## 🎯 Roadmap

- [ ] Mobile app development (React Native)
- [ ] Advanced ML forecasting models
- [ ] Blockchain integration for trading
- [ ] IoT device management
- [ ] Community features
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

## 📞 Support

For support, email support@solarsense.com or join our Discord community.

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- MongoDB for database services
- Vercel for hosting
- The open-source community for amazing libraries

---

**Built with ❤️ for a sustainable future** 🌱