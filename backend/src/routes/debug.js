const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/debug/status
// @desc    Debug endpoint to check system status
// @access  Public
router.get('/status', async (req, res) => {
  try {
    const status = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        connected: mongoose.connection.readyState === 1,
        state: mongoose.connection.readyState,
        host: mongoose.connection.host || 'Not connected'
      },
      environment_vars: {
        MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
        JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
        NODE_ENV: process.env.NODE_ENV || 'Not set',
        PORT: process.env.PORT || 'Not set'
      }
    };

    // Test database query if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const userCount = await User.countDocuments();
        status.database.userCount = userCount;
      } catch (dbError) {
        status.database.queryError = dbError.message;
      }
    }

    res.json({
      success: true,
      status
    });

  } catch (error) {
    console.error('Debug status error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// @route   POST /api/debug/test-register
// @desc    Test registration with detailed error info
// @access  Public
router.post('/test-register', async (req, res) => {
  try {
    const { name, email, password, role = 'resident' } = req.body;

    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        error: 'Database not connected',
        connectionState: mongoose.connection.readyState
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
        existingUser: {
          id: existingUser._id,
          email: existingUser.email,
          name: existingUser.name
        }
      });
    }

    // Create user
    const newUser = await User.create({
      email,
      password,
      role,
      name,
      householdId: role === 'resident' ? `household-${Date.now()}` : null
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Debug test-register error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
  }
});

module.exports = router;
