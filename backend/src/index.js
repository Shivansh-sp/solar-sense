const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config({ path: './env' });

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const initializeDatabase = require('./utils/initDatabase');

// Import routes
const authRoutes = require('./routes/auth');
const energyRoutes = require('./routes/energy');
const marketRoutes = require('./routes/market');
const forecastRoutes = require('./routes/forecast');
const deviceRoutes = require('./routes/device');
const dashboardRoutes = require('./routes/dashboard');

// Import services
const MLService = require('./services/MLService');
const MarketEngine = require('./services/MarketEngine');
const WeatherService = require('./services/WeatherService');
const SimulationService = require('./services/SimulationService');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  // Join energy trading room
  socket.on('join-trading', (data) => {
    socket.join(`trading-${data.householdId}`);
    console.log(`Client ${socket.id} joined trading room for household ${data.householdId}`);
  });
  
  // Join grid monitoring room
  socket.on('join-grid', () => {
    socket.join('grid-monitoring');
    console.log(`Client ${socket.id} joined grid monitoring`);
  });
  
  // Handle energy trade requests
  socket.on('energy-trade-request', async (data) => {
    try {
      const result = await MarketEngine.processTradeRequest(data);
      io.to(`trading-${data.buyerId}`).emit('trade-update', result);
      io.to(`trading-${data.sellerId}`).emit('trade-update', result);
    } catch (error) {
      socket.emit('trade-error', { message: error.message });
    }
  });
  
  // Handle device control
  socket.on('device-control', async (data) => {
    try {
      const result = await SimulationService.controlDevice(data);
      io.to(`trading-${data.householdId}`).emit('device-update', result);
    } catch (error) {
      socket.emit('device-error', { message: error.message });
    }
  });
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Make io available to other modules
app.set('io', io);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Initialize services
const initializeServices = async () => {
  try {
    await MLService.initialize();
    await MarketEngine.initialize();
    await WeatherService.initialize();
    await SimulationService.initialize();
    
    // Initialize database with sample data
    await initializeDatabase();
    
    console.log('All services initialized successfully');
  } catch (error) {
    console.error('Error initializing services:', error);
  }
};

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 SolarSense Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 CORS enabled for: ${process.env.CORS_ORIGIN || "http://localhost:3000"}`);
  
  // Initialize services after server starts
  initializeServices();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;
