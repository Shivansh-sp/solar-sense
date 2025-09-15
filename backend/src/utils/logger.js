/**
 * Comprehensive Logging System for SolarSense Backend
 * Provides detailed logging for debugging and monitoring
 */

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

class Logger {
  constructor(module = 'APP') {
    this.module = module;
    this.startTime = Date.now();
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    const moduleStr = `[${this.module}]`;
    const levelStr = `[${level}]`;
    const timeStr = `[${timestamp}]`;
    const uptimeStr = `[+${uptime}s]`;
    
    let formattedMessage = `${timeStr} ${uptimeStr} ${moduleStr} ${levelStr} ${message}`;
    
    if (data) {
      formattedMessage += `\n${JSON.stringify(data, null, 2)}`;
    }
    
    return formattedMessage;
  }

  info(message, data = null) {
    const formatted = this.formatMessage('INFO', message, data);
    console.log(`${colors.blue}${formatted}${colors.reset}`);
  }

  success(message, data = null) {
    const formatted = this.formatMessage('SUCCESS', message, data);
    console.log(`${colors.green}${formatted}${colors.reset}`);
  }

  warning(message, data = null) {
    const formatted = this.formatMessage('WARNING', message, data);
    console.log(`${colors.yellow}${formatted}${colors.reset}`);
  }

  error(message, data = null) {
    const formatted = this.formatMessage('ERROR', message, data);
    console.log(`${colors.red}${formatted}${colors.reset}`);
  }

  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      const formatted = this.formatMessage('DEBUG', message, data);
      console.log(`${colors.magenta}${formatted}${colors.reset}`);
    }
  }

  request(req, res, next) {
    const start = Date.now();
    const originalSend = res.send;
    
    res.send = function(data) {
      const duration = Date.now() - start;
      const status = res.statusCode;
      const method = req.method;
      const url = req.url;
      const userAgent = req.get('User-Agent') || 'Unknown';
      const ip = req.ip || req.connection.remoteAddress;
      
      const logData = {
        method,
        url,
        status,
        duration: `${duration}ms`,
        ip,
        userAgent: userAgent.substring(0, 100)
      };
      
      if (status >= 400) {
        this.error(`${method} ${url} - ${status}`, logData);
      } else {
        this.info(`${method} ${url} - ${status}`, logData);
      }
      
      originalSend.call(this, data);
    }.bind(this);
    
    next();
  }

  database(operation, collection, data = null) {
    this.debug(`DB ${operation} on ${collection}`, data);
  }

  auth(action, user = null, success = true) {
    const message = `AUTH ${action}${user ? ` for ${user.email}` : ''}`;
    if (success) {
      this.success(message, user ? { id: user._id, email: user.email } : null);
    } else {
      this.error(message);
    }
  }

  api(endpoint, method, status, duration = null) {
    const message = `API ${method} ${endpoint} - ${status}`;
    const data = duration ? { duration: `${duration}ms` } : null;
    
    if (status >= 400) {
      this.error(message, data);
    } else {
      this.info(message, data);
    }
  }

  system(component, message, data = null) {
    this.info(`SYSTEM ${component}: ${message}`, data);
  }
}

// Create module-specific loggers
const createLogger = (module) => new Logger(module);

// Global logger instance
const logger = new Logger('GLOBAL');

module.exports = {
  Logger,
  createLogger,
  logger
};
