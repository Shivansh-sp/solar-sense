const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Security headers middleware
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
      connectSrc: ["'self'", "https://api.stripe.com", "wss:"],
      frameSrc: ["'self'", "https://js.stripe.com", "https://hooks.stripe.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Rate limiting
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: message || 'Too many requests from this IP, please try again later.',
        retryAfter: Math.round(windowMs / 1000)
      });
    }
  });
};

// General rate limiting
const generalLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again later.'
);

// Strict rate limiting for auth endpoints
const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  'Too many authentication attempts, please try again later.'
);

// Payment rate limiting
const paymentLimiter = createRateLimit(
  60 * 1000, // 1 minute
  10, // limit each IP to 10 payment requests per minute
  'Too many payment requests, please try again later.'
);

// API rate limiting
const apiLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  200, // limit each IP to 200 requests per windowMs
  'API rate limit exceeded, please try again later.'
);

// Data sanitization middleware
const sanitizeData = mongoSanitize({
  onSanitize: ({ req, key }) => {
    console.warn(`This request[${key}] is sanitized`, req.url);
  },
});

// XSS protection
const xssProtection = xss();

// HTTP Parameter Pollution protection
const hppProtection = hpp();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://solar-sense-frontend.vercel.app',
      'https://solarsense.vercel.app',
      'https://solarsense-frontend.vercel.app',
      process.env.CORS_ORIGIN
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key',
    'X-Request-ID'
  ]
};

// Input validation middleware
const validateInput = (req, res, next) => {
  // Remove any keys that start with '$' or contain '.'
  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$') || key.includes('.')) {
        console.warn(`Potentially malicious key detected: ${key}`);
        continue;
      }
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  };
  
  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);
  
  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };
    
    // Log suspicious activities
    if (res.statusCode >= 400) {
      console.warn('Suspicious request detected:', logData);
    }
    
    console.log('Request processed:', logData);
  });
  
  next();
};

// Error handling for security middleware
const securityErrorHandler = (err, req, res, next) => {
  if (err.name === 'CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      error: 'Access denied'
    });
  }
  
  if (err.name === 'RateLimitError') {
    return res.status(429).json({
      success: false,
      message: 'Rate limit exceeded',
      error: 'Too many requests'
    });
  }
  
  next(err);
};

module.exports = {
  securityHeaders,
  generalLimiter,
  authLimiter,
  paymentLimiter,
  apiLimiter,
  sanitizeData,
  xssProtection,
  hppProtection,
  corsOptions,
  validateInput,
  requestLogger,
  securityErrorHandler
};
