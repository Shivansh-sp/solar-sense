const Joi = require('joi');

// Common validation schemas
const commonSchemas = {
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required(),
  objectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  positiveNumber: Joi.number().positive().required(),
  nonNegativeNumber: Joi.number().min(0).required(),
  date: Joi.date().iso(),
  currency: Joi.string().valid('inr', 'usd', 'eur').default('inr'),
  status: Joi.string().valid('active', 'inactive', 'pending', 'completed', 'cancelled', 'failed')
};

// Validation middleware factory
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { 
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorDetails
      });
    }

    req[property] = value;
    next();
  };
};

// Auth validation schemas
const authSchemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: commonSchemas.email,
    password: commonSchemas.password,
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).optional(),
    address: Joi.string().max(200).optional()
  }),

  login: Joi.object({
    email: commonSchemas.email,
    password: Joi.string().required()
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: commonSchemas.password,
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
  }),

  forgotPassword: Joi.object({
    email: commonSchemas.email
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    newPassword: commonSchemas.password,
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
  })
};

// Energy validation schemas
const energySchemas = {
  createTrade: Joi.object({
    amount: commonSchemas.positiveNumber,
    price: commonSchemas.positiveNumber,
    description: Joi.string().max(500).optional(),
    energyType: Joi.string().valid('solar', 'wind', 'hydro', 'battery').default('solar'),
    duration: Joi.number().positive().max(24).optional(), // hours
    location: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
      address: Joi.string().max(200).optional()
    }).optional()
  }),

  updateTrade: Joi.object({
    amount: commonSchemas.positiveNumber.optional(),
    price: commonSchemas.positiveNumber.optional(),
    description: Joi.string().max(500).optional(),
    status: commonSchemas.status.optional()
  }),

  energyConsumption: Joi.object({
    deviceId: commonSchemas.objectId.required(),
    consumption: commonSchemas.positiveNumber.required(),
    timestamp: commonSchemas.date.optional(),
    location: Joi.object({
      latitude: Joi.number().min(-90).max(90).optional(),
      longitude: Joi.number().min(-180).max(180).optional()
    }).optional()
  })
};

// Payment validation schemas
const paymentSchemas = {
  createPaymentIntent: Joi.object({
    amount: commonSchemas.positiveNumber.max(999999.99),
    currency: commonSchemas.currency,
    tradeId: commonSchemas.objectId.optional(),
    description: Joi.string().max(200).optional()
  }),

  createCustomer: Joi.object({
    email: commonSchemas.email,
    name: Joi.string().min(2).max(100).required(),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).optional(),
    address: Joi.object({
      line1: Joi.string().max(100).required(),
      line2: Joi.string().max(100).optional(),
      city: Joi.string().max(50).required(),
      state: Joi.string().max(50).required(),
      postal_code: Joi.string().max(10).required(),
      country: Joi.string().length(2).default('IN')
    }).optional()
  }),

  createRefund: Joi.object({
    paymentIntentId: Joi.string().required(),
    amount: commonSchemas.positiveNumber.max(999999.99).optional(),
    reason: Joi.string().valid('duplicate', 'fraudulent', 'requested_by_customer').default('requested_by_customer')
  })
};

// Device validation schemas
const deviceSchemas = {
  createDevice: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    type: Joi.string().valid('solar_panel', 'battery', 'inverter', 'smart_meter', 'other').required(),
    model: Joi.string().max(100).optional(),
    manufacturer: Joi.string().max(100).optional(),
    capacity: commonSchemas.positiveNumber.optional(), // kW
    efficiency: Joi.number().min(0).max(100).optional(), // percentage
    location: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
      address: Joi.string().max(200).optional()
    }).required(),
    settings: Joi.object().optional()
  }),

  updateDevice: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    model: Joi.string().max(100).optional(),
    manufacturer: Joi.string().max(100).optional(),
    capacity: commonSchemas.positiveNumber.optional(),
    efficiency: Joi.number().min(0).max(100).optional(),
    location: Joi.object({
      latitude: Joi.number().min(-90).max(90).optional(),
      longitude: Joi.number().min(-180).max(180).optional(),
      address: Joi.string().max(200).optional()
    }).optional(),
    settings: Joi.object().optional(),
    status: Joi.string().valid('active', 'inactive', 'maintenance').optional()
  })
};

// Market validation schemas
const marketSchemas = {
  createOrder: Joi.object({
    type: Joi.string().valid('buy', 'sell').required(),
    amount: commonSchemas.positiveNumber,
    price: commonSchemas.positiveNumber,
    orderType: Joi.string().valid('market', 'limit').default('market'),
    duration: Joi.number().positive().max(24).optional(), // hours
    energyType: Joi.string().valid('solar', 'wind', 'hydro', 'battery').default('solar')
  }),

  updateOrder: Joi.object({
    amount: commonSchemas.positiveNumber.optional(),
    price: commonSchemas.positiveNumber.optional(),
    status: Joi.string().valid('active', 'cancelled', 'completed', 'expired').optional()
  })
};

// Query validation schemas
const querySchemas = {
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().optional(),
    order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  dateRange: Joi.object({
    startDate: commonSchemas.date.optional(),
    endDate: commonSchemas.date.optional()
  }),

  energyQuery: Joi.object({
    type: Joi.string().valid('consumption', 'production', 'trading').optional(),
    deviceId: commonSchemas.objectId.optional(),
    startDate: commonSchemas.date.optional(),
    endDate: commonSchemas.date.optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  })
};

module.exports = {
  validate,
  commonSchemas,
  authSchemas,
  energySchemas,
  paymentSchemas,
  deviceSchemas,
  marketSchemas,
  querySchemas
};
