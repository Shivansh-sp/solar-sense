#!/usr/bin/env node

/**
 * SolarSense Complete Application Startup with Comprehensive Logging
 * Sets up environment and starts both frontend and backend with detailed logging
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
const logDebug = (message) => log(`🔍 ${message}`, colors.magenta);

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

  // Check if environment setup script exists
  if (!fs.existsSync(path.join(__dirname, 'setup-environment.js'))) {
    logWarning("Environment setup script not found, creating basic environment...");
    createBasicEnvironment();
  }

  logSuccess("Environment validation passed");
};

// Create basic environment files
const createBasicEnvironment = () => {
  const backendEnv = `NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://shivanshpushkarna_db_user:CFM6tSoP5vd1mhBE@cluster0.x6fhvdz.mongodb.net/solarsense?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=solarsense_2024_secure_jwt_secret_key_8f7e6d5c4b3a2918
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000,https://solar-sense-final.onrender.com
API_VERSION=v1
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
WEATHER_API_KEY=demo-weather-api-key
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_TOPIC_PREFIX=solarsense
STRIPE_SECRET_KEY=sk_test_51Q8x9y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9
STRIPE_PUBLISHABLE_KEY=pk_test_51Q8x9y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef1234567890abcdef12345678`;

  const frontendEnv = `NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Q8x9y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback`;

  fs.writeFileSync(path.join(__dirname, 'backend', '.env'), backendEnv);
  fs.writeFileSync(path.join(__dirname, 'frontend', '.env.local'), frontendEnv);
  
  logSuccess("Basic environment files created");
};

// Start backend process
const startBackend = () => {
  return new Promise((resolve, reject) => {
    logInfo("Starting Backend Server...");
    logDebug("Backend command: npm start");
    logDebug("Backend directory: " + path.join(__dirname, 'backend'));
    
    const backendPath = path.join(__dirname, 'backend');
    const backendCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    
    backendProcess = spawn(backendCommand, ['start'], {
      cwd: backendPath,
      stdio: 'pipe',
      shell: true,
      env: {
        ...process.env,
        NODE_ENV: 'development'
      }
    });

    let backendReady = false;
    let errorOccurred = false;

    backendProcess.stdout.on('data', (data) => {
      const output = data.toString();
      process.stdout.write(`[BACKEND] ${output}`);
      
      // Check if backend is ready
      if (output.includes('SolarSense Backend running on port') && !backendReady) {
        backendReady = true;
        logSuccess("Backend server started successfully");
        resolve();
      }
      
      // Check for errors
      if (output.includes('Error:') || output.includes('error:')) {
        logError("Backend error detected in output");
        if (!errorOccurred) {
          errorOccurred = true;
          reject(new Error("Backend error detected"));
        }
      }
    });

    backendProcess.stderr.on('data', (data) => {
      const output = data.toString();
      process.stderr.write(`[BACKEND ERROR] ${output}`);
      logError("Backend stderr: " + output);
      
      if (!errorOccurred) {
        errorOccurred = true;
        reject(new Error("Backend stderr: " + output));
      }
    });

    backendProcess.on('error', (error) => {
      logError(`Failed to start backend: ${error.message}`);
      reject(error);
    });

    backendProcess.on('exit', (code) => {
      if (code !== 0 && !isShuttingDown) {
        logError(`Backend process exited with code ${code}`);
        if (!errorOccurred) {
          errorOccurred = true;
          reject(new Error(`Backend exited with code ${code}`));
        }
      }
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!backendReady && !errorOccurred) {
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
    logDebug("Frontend command: npm run dev");
    logDebug("Frontend directory: " + path.join(__dirname, 'frontend'));
    
    const frontendPath = path.join(__dirname, 'frontend');
    const frontendCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    
    frontendProcess = spawn(frontendCommand, ['run', 'dev'], {
      cwd: frontendPath,
      stdio: 'pipe',
      shell: true,
      env: {
        ...process.env,
        NODE_ENV: 'development'
      }
    });

    let frontendReady = false;
    let errorOccurred = false;

    frontendProcess.stdout.on('data', (data) => {
      const output = data.toString();
      process.stdout.write(`[FRONTEND] ${output}`);
      
      // Check if frontend is ready
      if (output.includes('Local:') && output.includes('http://localhost:3000') && !frontendReady) {
        frontendReady = true;
        logSuccess("Frontend server started successfully");
        resolve();
      }
      
      // Check for errors
      if (output.includes('Error:') || output.includes('error:')) {
        logError("Frontend error detected in output");
        if (!errorOccurred) {
          errorOccurred = true;
          reject(new Error("Frontend error detected"));
        }
      }
    });

    frontendProcess.stderr.on('data', (data) => {
      const output = data.toString();
      process.stderr.write(`[FRONTEND ERROR] ${output}`);
      logError("Frontend stderr: " + output);
      
      if (!errorOccurred) {
        errorOccurred = true;
        reject(new Error("Frontend stderr: " + output));
      }
    });

    frontendProcess.on('error', (error) => {
      logError(`Failed to start frontend: ${error.message}`);
      reject(error);
    });

    frontendProcess.on('exit', (code) => {
      if (code !== 0 && !isShuttingDown) {
        logError(`Frontend process exited with code ${code}`);
        if (!errorOccurred) {
          errorOccurred = true;
          reject(new Error(`Frontend exited with code ${code}`));
        }
      }
    });

    // Timeout after 60 seconds
    setTimeout(() => {
      if (!frontendReady && !errorOccurred) {
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
    logHeader("SolarSense AI - Complete Application Startup with Logging");
    logInfo("Starting both frontend and backend servers with comprehensive logging...\n");

    // Validate environment
    validateEnvironment();

    // Start backend first
    await startBackend();
    
    // Wait a moment for backend to fully initialize
    logInfo("Waiting for backend to fully initialize...");
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Start frontend
    await startFrontend();

    // Application is ready
    logHeader("Application Ready!");
    logSuccess("Backend: http://localhost:5000");
    logSuccess("Frontend: http://localhost:3000");
    logInfo("Press Ctrl+C to stop both servers");
    logInfo("Check console output for detailed logging and error information\n");

    // Keep the process alive
    process.stdin.resume();

  } catch (error) {
    logError(`Failed to start application: ${error.message}`);
    logError("Full error details:", error);
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
  logError("Stack trace:", error.stack);
  gracefulShutdown('SIGTERM');
});

process.on('unhandledRejection', (reason, promise) => {
  logError(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  gracefulShutdown('SIGTERM');
});

// Start the application
startApplication();
