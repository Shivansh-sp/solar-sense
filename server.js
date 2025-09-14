#!/usr/bin/env node

/**
 * SolarSense Server Entry Point
 * This file serves as the main entry point for the application
 */

// Change to backend directory and start the server
process.chdir(__dirname + '/backend');

// Load and start the backend server
require('./backend/server.js');
