import { loadStripe } from '@stripe/stripe-js';

// Stripe configuration
export const STRIPE_CONFIG = {
  // Publishable key from environment
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key_here',
  
  // Currency settings for Indian market
  currency: 'inr',
  country: 'IN',
  
  // Payment methods available in India
  paymentMethods: [
    'card',
    'upi',
    'netbanking',
    'wallet'
  ],
  
  // Appearance settings
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#10B981', // Green theme for solar energy
      colorBackground: '#ffffff',
      colorText: '#1F2937',
      colorDanger: '#EF4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px'
    }
  }
};

// Initialize Stripe
export const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

// Payment intent creation
export const createPaymentIntent = async (amount: number, currency: string = 'inr', metadata: Record<string, string> = {}) => {
  try {
    const response = await fetch('/api/payments/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        amount,
        currency,
        ...metadata
      })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create payment intent');
    }

    return data;
  } catch (error) {
    console.error('Payment Intent Creation Error:', error);
    throw error;
  }
};

// Create customer
export const createCustomer = async (email: string, name: string) => {
  try {
    const response = await fetch('/api/payments/customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        email,
        name
      })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create customer');
    }

    return data;
  } catch (error) {
    console.error('Customer Creation Error:', error);
    throw error;
  }
};

// Get payment status
export const getPaymentStatus = async (paymentIntentId: string) => {
  try {
    const response = await fetch(`/api/payments/payment/${paymentIntentId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to get payment status');
    }

    return data;
  } catch (error) {
    console.error('Payment Status Error:', error);
    throw error;
  }
};

// Create refund
export const createRefund = async (paymentIntentId: string, amount?: number, reason?: string) => {
  try {
    const response = await fetch('/api/payments/refund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        paymentIntentId,
        amount,
        reason
      })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create refund');
    }

    return data;
  } catch (error) {
    console.error('Refund Creation Error:', error);
    throw error;
  }
};

// Format amount for display (convert paise to rupees)
export const formatAmount = (amount: number): string => {
  return `₹${(amount / 100).toFixed(2)}`;
};

// Format amount for Stripe (convert rupees to paise)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

const stripeConfig = {
  STRIPE_CONFIG,
  stripePromise,
  createPaymentIntent,
  createCustomer,
  getPaymentStatus,
  createRefund,
  formatAmount,
  formatAmountForStripe
};

export default stripeConfig
