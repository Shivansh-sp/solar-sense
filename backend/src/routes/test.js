const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// @route   GET /api/test/simple
// @desc    Simple test endpoint
// @access  Public
router.get('/simple', (req, res) => {
  res.json({
    success: true,
    message: 'Simple test endpoint working',
    timestamp: new Date().toISOString(),
    database: {
      connected: mongoose.connection.readyState === 1,
      state: mongoose.connection.readyState
    }
  });
});

// @route   POST /api/test/user-create
// @desc    Test user creation without validation
// @access  Public
router.post('/user-create', async (req, res) => {
  try {
    console.log('Test user creation started');
    console.log('Database state:', mongoose.connection.readyState);
    
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        error: 'Database not connected',
        state: mongoose.connection.readyState
      });
    }

    // Try to require User model
    let User;
    try {
      User = require('../models/User');
      console.log('User model loaded successfully');
    } catch (modelError) {
      console.error('Error loading User model:', modelError);
      return res.status(500).json({
        success: false,
        error: 'Failed to load User model',
        details: modelError.message
      });
    }

    // Test basic user creation
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'resident',
      householdId: 'test-household'
    };

    console.log('Attempting to create user...');
    const newUser = await User.create(testUser);
    console.log('User created successfully:', newUser._id);

    res.json({
      success: true,
      message: 'User created successfully',
      userId: newUser._id
    });

  } catch (error) {
    console.error('Test user creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack
    });
  }
});

module.exports = router;
