const mongoose = require('mongoose');

// Middleware to check database connection
const checkDatabase = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database not available',
      error: 'Service temporarily unavailable',
      databaseState: mongoose.connection.readyState
    });
  }
  next();
};

module.exports = { checkDatabase };
