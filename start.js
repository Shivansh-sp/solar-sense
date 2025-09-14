#!/usr/bin/env node

/**
 * Start script for SolarSense Backend
 * This script ensures the server starts from the correct directory
 */

const path = require('path');
const { spawn } = require('child_process');

// Change to backend directory
process.chdir(path.join(__dirname, 'backend'));

// Start the server
const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: path.join(__dirname, 'backend')
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  server.kill('SIGINT');
});
