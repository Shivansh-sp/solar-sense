const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config({ path: './env' });

// Import logger
const { logger, createLogger } = require('./utils/logger');

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
const debugRoutes = require('./routes/debug');
const testRoutes = require('./routes/test');

// Import services
const MLService = require('./services/MLService');
const MarketEngine = require('./services/MarketEngine');
const WeatherService = require('./services/WeatherService');
const SimulationService = require('./services/SimulationService');

const app = express();
const server = createServer(app);

// Log startup
logger.system('APP', 'Starting SolarSense Backend Server');
logger.info('Environment Variables Check', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not Set',
  JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not Set',
  CORS_ORIGIN: process.env.CORS_ORIGIN
});

const io = new Server(server, {
  cors: {
    origin: [
      process.env.CORS_ORIGIN || "https://solar-sense-frontend.vercel.app",
      "https://solar-sense-final.onrender.com",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST"]
  }
});

logger.info('WebSocket Server initialized', {
  corsOrigins: [
    process.env.CORS_ORIGIN || "https://solar-sense-frontend.vercel.app",
    "https://solar-sense-final.onrender.com",
    "http://localhost:3000"
  ]
});

// Connect to MongoDB
logger.system('DATABASE', 'Attempting to connect to MongoDB');
connectDB();

// Security middleware
logger.system('MIDDLEWARE', 'Setting up security middleware');
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
logger.system('RATE_LIMIT', 'Rate limiting configured', {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
});

// CORS configuration
const corsOrigins = [
  process.env.CORS_ORIGIN || "https://solar-sense-frontend.vercel.app",
  "https://solar-sense-final.onrender.com",
  "http://localhost:3000"
];

app.use(cors({
  origin: corsOrigins,
  credentials: true
}));

logger.system('CORS', 'CORS configured', {
  origins: corsOrigins,
  credentials: true
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
logger.system('MIDDLEWARE', 'Body parsing middleware configured');

// Request logging middleware
app.use(logger.request.bind(logger));

// Morgan logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  logger.system('LOGGING', 'Morgan dev logging enabled');
}

// Health check endpoint
app.get('/health', (req, res) => {
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    memory: process.memoryUsage()
  };
  
  logger.debug('Health check requested', healthData);
  res.status(200).json(healthData);
});

// API routes
logger.system('ROUTES', 'Setting up API routes');
app.use('/api/auth', authRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/test', testRoutes);
logger.success('All API routes configured');

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info(`WebSocket client connected: ${socket.id}`);
  
  // Join energy trading room
  socket.on('join-trading', (data) => {
    socket.join(`trading-${data.householdId}`);
    logger.info(`WebSocket client ${socket.id} joined trading room for household ${data.householdId}`);
  });
  
  // Join grid monitoring room
  socket.on('join-grid', () => {
    socket.join('grid-monitoring');
    logger.info(`WebSocket client ${socket.id} joined grid monitoring`);
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
    logger.info(`WebSocket client disconnected: ${socket.id}`);
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
    logger.system('SERVICES', 'Initializing all services');
    
    await MLService.initialize();
    logger.success('ML Service initialized');
    
    await MarketEngine.initialize();
    logger.success('Market Engine initialized');
    
    await WeatherService.initialize();
    logger.success('Weather Service initialized');
    
    await SimulationService.initialize();
    logger.success('Simulation Service initialized');
    
    // Initialize database with sample data
    await initializeDatabase();
    logger.success('Database initialization completed');
    
    logger.success('All services initialized successfully');
  } catch (error) {
    logger.error('Error initializing services', error);
  }
};

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.success(`SolarSense Backend running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
  logger.info(`CORS enabled for: ${process.env.CORS_ORIGIN || "https://solar-sense-frontend.vercel.app"}`);
  
  // Initialize services after server starts
  initializeServices();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.warning('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

process.on('SIGINT', () => {
  logger.warning('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

module.exports = app;
