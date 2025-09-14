#!/usr/bin/env node

/**
 * Render Deployment Entry Point
 * This file serves as the entry point for Render deployment
 * It simply requires the main server.js file
 */

// Change to the correct directory and start the server
process.chdir(__dirname);

// Load and start the main server
require('./server.js');
