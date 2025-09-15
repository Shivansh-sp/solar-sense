const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

const connectDB = async () => {
  try {
    // Configure mongoose options for better connection handling
    const options = {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5, // Maintain a minimum of 5 socket connections
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      connectTimeoutMS: 30000, // Give up initial connection after 30 seconds
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/solarsense', options);

    logger.success(`MongoDB Connected: ${conn.connection.host}`);
    logger.info(`Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warning('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error('Database connection failed', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    
    // Don't exit immediately, let the app try to continue
    // The app can still serve some functionality without DB
    logger.warning('Continuing without database connection...');
    logger.warning('Some features may not work properly without database access');
    
    // Set a flag to indicate database is not available
    global.databaseAvailable = false;
  }
};

module.exports = connectDB;
