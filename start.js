#!/usr/bin/env node

/**
 * SolarSense AI - Complete Application Startup Script
 * Handles both frontend and backend startup with process management
 */

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Console logging functions
const log = (message, color = colors.reset) => console.log(`${color}${message}${colors.reset}`);
const logSuccess = (message) => log(`✅ ${message}`, colors.green);
const logError = (message) => log(`❌ ${message}`, colors.red);
const logWarning = (message) => log(`⚠️  ${message}`, colors.yellow);
const logInfo = (message) => log(`ℹ️  ${message}`, colors.blue);
const logHeader = (message) => log(`\n🚀 ${message}`, colors.cyan + colors.bright);

// Process management
let frontendProcess = null;
let backendProcess = null;
let isShuttingDown = false;

// Environment validation
const validateEnvironment = () => {
  logHeader("Validating Environment...");
  
  // Check if we're in the right directory
  if (!fs.existsSync(path.join(__dirname, 'frontend')) || !fs.existsSync(path.join(__dirname, 'backend'))) {
    logError("Frontend or backend directory not found!");
    logError("Please run this script from the SolarSense project root directory.");
    process.exit(1);
  }

  // Check if package.json files exist
  if (!fs.existsSync(path.join(__dirname, 'frontend', 'package.json'))) {
    logError("Frontend package.json not found!");
    process.exit(1);
  }

  if (!fs.existsSync(path.join(__dirname, 'backend', 'package.json'))) {
    logError("Backend package.json not found!");
    process.exit(1);
  }

  logSuccess("Environment validation passed");
};

// Start backend process
const startBackend = () => {
  return new Promise((resolve, reject) => {
    logInfo("Starting Backend Server...");
    
    const backendPath = path.join(__dirname, 'backend');
    const backendCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    
    backendProcess = spawn(backendCommand, ['start'], {
      cwd: backendPath,
      stdio: 'pipe',
      shell: true
    });

    let backendReady = false;

    backendProcess.stdout.on('data', (data) => {
      const output = data.toString();
      process.stdout.write(`[BACKEND] ${output}`);
      
      // Check if backend is ready
      if (output.includes('SolarSense Backend running on port') && !backendReady) {
        backendReady = true;
        logSuccess("Backend server started successfully");
        resolve();
      }
    });

    backendProcess.stderr.on('data', (data) => {
      const output = data.toString();
      process.stderr.write(`[BACKEND ERROR] ${output}`);
    });

    backendProcess.on('error', (error) => {
      logError(`Failed to start backend: ${error.message}`);
      reject(error);
    });

    backendProcess.on('exit', (code) => {
      if (code !== 0 && !isShuttingDown) {
        logError(`Backend process exited with code ${code}`);
        reject(new Error(`Backend exited with code ${code}`));
      }
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!backendReady) {
        logError("Backend startup timeout");
        reject(new Error("Backend startup timeout"));
      }
    }, 30000);
  });
};

// Start frontend process
const startFrontend = () => {
  return new Promise((resolve, reject) => {
    logInfo("Starting Frontend Server...");
    
    const frontendPath = path.join(__dirname, 'frontend');
    const frontendCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    
    frontendProcess = spawn(frontendCommand, ['run', 'dev'], {
      cwd: frontendPath,
      stdio: 'pipe',
      shell: true
    });

    let frontendReady = false;

    frontendProcess.stdout.on('data', (data) => {
      const output = data.toString();
      process.stdout.write(`[FRONTEND] ${output}`);
      
      // Check if frontend is ready
      if (output.includes('Local:') && output.includes('http://localhost:3000') && !frontendReady) {
        frontendReady = true;
        logSuccess("Frontend server started successfully");
        resolve();
      }
    });

    frontendProcess.stderr.on('data', (data) => {
      const output = data.toString();
      process.stderr.write(`[FRONTEND ERROR] ${output}`);
    });

    frontendProcess.on('error', (error) => {
      logError(`Failed to start frontend: ${error.message}`);
      reject(error);
    });

    frontendProcess.on('exit', (code) => {
      if (code !== 0 && !isShuttingDown) {
        logError(`Frontend process exited with code ${code}`);
        reject(new Error(`Frontend exited with code ${code}`));
      }
    });

    // Timeout after 60 seconds
    setTimeout(() => {
      if (!frontendReady) {
        logError("Frontend startup timeout");
        reject(new Error("Frontend startup timeout"));
      }
    }, 60000);
  });
};

// Graceful shutdown
const gracefulShutdown = (signal) => {
  if (isShuttingDown) return;
  
  isShuttingDown = true;
  logWarning(`Received ${signal}, shutting down gracefully...`);

  const shutdownPromises = [];

  if (backendProcess) {
    logInfo("Stopping backend server...");
    shutdownPromises.push(new Promise((resolve) => {
      backendProcess.kill(signal);
      backendProcess.on('exit', () => {
        logSuccess("Backend server stopped");
        resolve();
      });
    }));
  }

  if (frontendProcess) {
    logInfo("Stopping frontend server...");
    shutdownPromises.push(new Promise((resolve) => {
      frontendProcess.kill(signal);
      frontendProcess.on('exit', () => {
        logSuccess("Frontend server stopped");
        resolve();
      });
    }));
  }

  Promise.all(shutdownPromises).then(() => {
    logSuccess("All servers stopped gracefully");
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    logError("Force exit after timeout");
    process.exit(1);
  }, 10000);
};

// Main startup function
const startApplication = async () => {
  try {
    logHeader("SolarSense AI - Complete Application Startup");
    logInfo("Starting both frontend and backend servers...\n");

    // Validate environment
    validateEnvironment();

    // Start backend first
    await startBackend();
    
    // Wait a moment for backend to fully initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Start frontend
    await startFrontend();

    // Application is ready
    logHeader("Application Ready!");
    logSuccess("Backend: http://localhost:5000");
    logSuccess("Frontend: http://localhost:3000");
    logInfo("Press Ctrl+C to stop both servers\n");

    // Keep the process alive
    process.stdin.resume();

  } catch (error) {
    logError(`Failed to start application: ${error.message}`);
    gracefulShutdown('SIGTERM');
  }
};

// Handle process signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGUSR1', () => gracefulShutdown('SIGUSR1'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logError(`Uncaught Exception: ${error.message}`);
  gracefulShutdown('SIGTERM');
});

process.on('unhandledRejection', (reason, promise) => {
  logError(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  gracefulShutdown('SIGTERM');
});

// Start the application
startApplication();
