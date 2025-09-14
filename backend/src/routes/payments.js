const express = require('express');
const router = express.Router();
const { 
  createPaymentIntent, 
  createCustomer, 
  retrievePaymentIntent,
  createRefund,
  constructWebhookEvent,
  STRIPE_CONFIG
} = require('../config/stripe');
const auth = require('../middleware/auth');

// Create payment intent for energy trading
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { amount, currency = 'inr', tradeId, description } = req.body;
    const userId = req.user.id;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    // Create payment intent
    const result = await createPaymentIntent(amount, currency, {
      userId: userId,
      tradeId: tradeId,
      description: description || 'Energy Trading Payment'
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create payment intent',
        error: result.error
      });
    }

    res.json({
      success: true,
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
      amount: amount,
      currency: currency
    });

  } catch (error) {
    console.error('Payment Intent Creation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create or retrieve customer
router.post('/customer', auth, async (req, res) => {
  try {
    const { email, name } = req.body;
    const userId = req.user.id;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email and name are required'
      });
    }

    // Create customer
    const result = await createCustomer(email, name, {
      userId: userId
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create customer',
        error: result.error
      });
    }

    res.json({
      success: true,
      customerId: result.customerId,
      customer: result.customer
    });

  } catch (error) {
    console.error('Customer Creation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get payment status
router.get('/payment/:paymentIntentId', auth, async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    const result = await retrievePaymentIntent(paymentIntentId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to retrieve payment',
        error: result.error
      });
    }

    res.json({
      success: true,
      paymentIntent: result.paymentIntent
    });

  } catch (error) {
    console.error('Payment Retrieve Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create refund
router.post('/refund', auth, async (req, res) => {
  try {
    const { paymentIntentId, amount, reason } = req.body;
    const userId = req.user.id;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required'
      });
    }

    const result = await createRefund(paymentIntentId, amount, reason);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create refund',
        error: result.error
      });
    }

    res.json({
      success: true,
      refund: result.refund
    });

  } catch (error) {
    console.error('Refund Creation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Stripe webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    const payload = req.body;

    // Verify webhook signature
    const result = constructWebhookEvent(payload, signature);

    if (!result.success) {
      console.error('Webhook verification failed:', result.error);
      return res.status(400).json({
        success: false,
        message: 'Webhook verification failed'
      });
    }

    const event = result.event;

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id);
        // Update trade status, send confirmation, etc.
        break;

      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        // Handle failed payment, notify user, etc.
        break;

      case 'charge.succeeded':
        console.log('Charge succeeded:', event.data.object.id);
        // Process successful charge
        break;

      case 'charge.failed':
        console.log('Charge failed:', event.data.object.id);
        // Handle failed charge
        break;

      case 'customer.created':
        console.log('Customer created:', event.data.object.id);
        // Update user with customer ID
        break;

      case 'customer.updated':
        console.log('Customer updated:', event.data.object.id);
        // Update customer information
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    });
  }
});

// Get payment methods for customer
router.get('/payment-methods', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // In a real implementation, you would store and retrieve customer ID
    // For now, we'll return the available payment methods
    res.json({
      success: true,
      paymentMethods: STRIPE_CONFIG.paymentMethods,
      currency: STRIPE_CONFIG.currency,
      country: STRIPE_CONFIG.country
    });

  } catch (error) {
    console.error('Payment Methods Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
