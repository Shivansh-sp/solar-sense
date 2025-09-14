#!/usr/bin/env node

/**
 * SolarSense Backend Server
 * Main entry point for the SolarSense backend API
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config({ path: './env' });

const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');
const initializeDatabase = require('./src/utils/initDatabase');
const {
  securityHeaders,
  generalLimiter,
  authLimiter,
  paymentLimiter,
  apiLimiter,
  sanitizeData,
  xssProtection,
  hppProtection,
  corsOptions,
  validateInput,
  requestLogger,
  securityErrorHandler
} = require('./src/middleware/security');

// Import routes
const authRoutes = require('./src/routes/auth');
const energyRoutes = require('./src/routes/energy');
const marketRoutes = require('./src/routes/market');
const forecastRoutes = require('./src/routes/forecast');
const deviceRoutes = require('./src/routes/device');
const dashboardRoutes = require('./src/routes/dashboard');
const paymentRoutes = require('./src/routes/payments');

// Import services
const MLService = require('./src/services/MLService');
const MarketEngine = require('./src/services/MarketEngine');
const WeatherService = require('./src/services/WeatherService');
const SimulationService = require('./src/services/SimulationService');

// Create Express app
const app = express();
const server = createServer(app);

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(securityHeaders);
app.use(compression());

// Data sanitization and protection
app.use(sanitizeData);
app.use(xssProtection);
app.use(hppProtection);
app.use(validateInput);

// Request logging
app.use(requestLogger);

// CORS configuration
app.use(cors(corsOptions));

// Rate limiting
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: process.memoryUsage(),
    platform: process.platform,
    nodeVersion: process.version
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SolarSense API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// API routes with specific rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/energy', apiLimiter, energyRoutes);
app.use('/api/market', apiLimiter, marketRoutes);
app.use('/api/forecast', apiLimiter, forecastRoutes);
app.use('/api/device', apiLimiter, deviceRoutes);
app.use('/api/dashboard', apiLimiter, dashboardRoutes);
app.use('/api/payments', paymentLimiter, paymentRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  
  // Join energy trading room
  socket.on('join-trading', (data) => {
    socket.join(`trading-${data.householdId}`);
    console.log(`📊 Client ${socket.id} joined trading room for household ${data.householdId}`);
  });
  
  // Join grid monitoring room
  socket.on('join-grid', () => {
    socket.join('grid-monitoring');
    console.log(`⚡ Client ${socket.id} joined grid monitoring`);
  });
  
  // Handle energy trade requests
  socket.on('energy-trade-request', async (data) => {
    try {
      console.log(`💰 Processing trade request from ${socket.id}:`, data);
      const result = await MarketEngine.processTradeRequest(data);
      io.to(`trading-${data.buyerId}`).emit('trade-update', result);
      io.to(`trading-${data.sellerId}`).emit('trade-update', result);
      console.log(`✅ Trade processed successfully:`, result);
    } catch (error) {
      console.error(`❌ Trade processing error:`, error);
      socket.emit('trade-error', { message: error.message });
    }
  });
  
  // Handle device control
  socket.on('device-control', async (data) => {
    try {
      console.log(`🎛️ Device control request from ${socket.id}:`, data);
      const result = await SimulationService.controlDevice(data);
      io.to(`trading-${data.householdId}`).emit('device-update', result);
      console.log(`✅ Device control processed:`, result);
    } catch (error) {
      console.error(`❌ Device control error:`, error);
      socket.emit('device-error', { message: error.message });
    }
  });
  
  // Handle forecasting requests
  socket.on('forecast-request', async (data) => {
    try {
      console.log(`🔮 Forecast request from ${socket.id}:`, data);
      const result = await MLService.generateForecast(data);
      socket.emit('forecast-result', result);
      console.log(`✅ Forecast generated:`, result);
    } catch (error) {
      console.error(`❌ Forecast error:`, error);
      socket.emit('forecast-error', { message: error.message });
    }
  });
  
  socket.on('disconnect', (reason) => {
    console.log(`🔌 Client disconnected: ${socket.id}, reason: ${reason}`);
  });
});

// Make io available to other modules
app.set('io', io);

// Security error handling
app.use(securityErrorHandler);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Initialize services
const initializeServices = async () => {
  try {
    console.log('🚀 Initializing SolarSense services...');
    
    await MLService.initialize();
    console.log('✅ ML Service initialized');
    
    await MarketEngine.initialize();
    console.log('✅ Market Engine initialized');
    
    await WeatherService.initialize();
    console.log('✅ Weather Service initialized');
    
    await SimulationService.initialize();
    console.log('✅ Simulation Service initialized');
    
    // Initialize database with sample data
    await initializeDatabase();
    console.log('✅ Database initialized with sample data');
    
    console.log('🎉 All services initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing services:', error);
    process.exit(1);
  }
};

// Get port from environment or default
const PORT = process.env.PORT || 5000;

// Start server
server.listen(PORT, () => {
  console.log('🌞 SolarSense Backend Server');
  console.log('============================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 CORS enabled for: ${process.env.CORS_ORIGIN || "http://localhost:3000"}`);
  console.log(`💾 Database: MongoDB Atlas`);
  console.log(`🔌 WebSocket: Enabled`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log('============================');
  
  // Initialize services after server starts
  initializeServices();
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 ${signal} received. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    
    // Close database connection
    if (global.mongoose && global.mongoose.connection) {
      global.mongoose.connection.close(() => {
        console.log('✅ Database connection closed');
        console.log('👋 Process terminated gracefully');
        process.exit(0);
      });
    } else {
      console.log('👋 Process terminated gracefully');
      process.exit(0);
    }
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.log('⚠️ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Export app for testing
module.exports = app;
