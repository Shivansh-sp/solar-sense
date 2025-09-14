const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Stripe configuration
const STRIPE_CONFIG = {
  // Currency settings for Indian market
  currency: 'inr',
  country: 'IN',
  
  // Payment methods
  paymentMethods: [
    'card',
    'upi',
    'netbanking',
    'wallet'
  ],
  
  // Webhook events to handle
  webhookEvents: [
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'charge.succeeded',
    'charge.failed',
    'customer.created',
    'customer.updated'
  ]
};

// Helper functions
const createPaymentIntent = async (amount, currency = 'inr', metadata = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        ...metadata,
        platform: 'solarsense',
        version: '1.0.0'
      }
    });
    
    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('Stripe Payment Intent Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const createCustomer = async (email, name, metadata = {}) => {
  try {
    const customer = await stripe.customers.create({
      email: email,
      name: name,
      metadata: {
        ...metadata,
        platform: 'solarsense'
      }
    });
    
    return {
      success: true,
      customerId: customer.id,
      customer: customer
    };
  } catch (error) {
    console.error('Stripe Customer Creation Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const retrievePaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      success: true,
      paymentIntent: paymentIntent
    };
  } catch (error) {
    console.error('Stripe Payment Intent Retrieve Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const createRefund = async (paymentIntentId, amount = null, reason = 'requested_by_customer') => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Convert to paise
      reason: reason
    });
    
    return {
      success: true,
      refund: refund
    };
  } catch (error) {
    console.error('Stripe Refund Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const constructWebhookEvent = (payload, signature) => {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    return {
      success: true,
      event: event
    };
  } catch (error) {
    console.error('Stripe Webhook Verification Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  stripe,
  STRIPE_CONFIG,
  createPaymentIntent,
  createCustomer,
  retrievePaymentIntent,
  createRefund,
  constructWebhookEvent
};
