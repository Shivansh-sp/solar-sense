const express = require('express');
const { auth } = require('../middleware/auth');
const MarketEngine = require('../services/MarketEngine');

const router = express.Router();

// @route   GET /api/market/status
// @desc    Get market status and trading data
// @access  Private
router.get('/status', auth, (req, res) => {
  try {
    const marketData = MarketEngine.getMarketData();
    
    res.json({
      success: true,
      data: marketData
    });
  } catch (error) {
    console.error('Error getting market status:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving market status'
    });
  }
});

// @route   POST /api/market/trade-request
// @desc    Submit a trade request
// @access  Private
router.post('/trade-request', auth, (req, res) => {
  try {
    const tradeRequest = {
      ...req.body,
      buyerId: req.body.buyerId || req.user.householdId,
      timestamp: new Date()
    };
    
    // Validate required fields
    if (!tradeRequest.sellerId || !tradeRequest.energyAmount || !tradeRequest.maxPrice) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: sellerId, energyAmount, maxPrice'
      });
    }
    
    // Process trade request
    MarketEngine.processTradeRequest(tradeRequest)
      .then(result => {
        res.json({
          success: true,
          data: result
        });
      })
      .catch(error => {
        res.status(400).json({
          success: false,
          message: error.message
        });
      });
      
  } catch (error) {
    console.error('Error processing trade request:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing trade request'
    });
  }
});

// @route   GET /api/market/trades/active
// @desc    Get active trades
// @access  Private
router.get('/trades/active', auth, (req, res) => {
  try {
    const marketData = MarketEngine.getMarketData();
    
    res.json({
      success: true,
      data: marketData.activeTrades
    });
  } catch (error) {
    console.error('Error getting active trades:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving active trades'
    });
  }
});

// @route   GET /api/market/trades/history
// @desc    Get trade history
// @access  Private
router.get('/trades/history', auth, (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const marketData = MarketEngine.getMarketData();
    
    const trades = marketData.tradeHistory
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    res.json({
      success: true,
      data: {
        trades,
        total: marketData.tradeHistory.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error getting trade history:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving trade history'
    });
  }
});

// @route   GET /api/market/trades/:id
// @desc    Get specific trade details
// @access  Private
router.get('/trades/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    const marketData = MarketEngine.getMarketData();
    
    // Check active trades first
    const activeTrade = marketData.activeTrades.find(trade => trade.id === id);
    if (activeTrade) {
      return res.json({
        success: true,
        data: activeTrade
      });
    }
    
    // Check trade history
    const historicalTrade = marketData.tradeHistory.find(trade => trade.id === id);
    if (historicalTrade) {
      return res.json({
        success: true,
        data: historicalTrade
      });
    }
    
    res.status(404).json({
      success: false,
      message: 'Trade not found'
    });
  } catch (error) {
    console.error('Error getting trade details:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving trade details'
    });
  }
});

// @route   GET /api/market/statistics
// @desc    Get market statistics
// @access  Private
router.get('/statistics', auth, (req, res) => {
  try {
    const stats = MarketEngine.getTradingStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting market statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving market statistics'
    });
  }
});

// @route   GET /api/market/available-sellers
// @desc    Get available energy sellers
// @access  Private
router.get('/available-sellers', auth, (req, res) => {
  try {
    const { minEnergy = 0, maxPrice = 1.0 } = req.query;
    const marketData = MarketEngine.getMarketData();
    
    const availableSellers = marketData.households
      .filter(household => {
        const availableEnergy = household.currentGeneration + (household.energyStored * 0.1);
        return household.isOnline && 
               availableEnergy >= parseFloat(minEnergy) &&
               household.id !== req.user.householdId; // Can't sell to self
      })
      .map(household => ({
        id: household.id,
        name: household.name,
        availableEnergy: Math.round((household.currentGeneration + (household.energyStored * 0.1)) * 100) / 100,
        currentGeneration: household.currentGeneration,
        energyStored: household.energyStored,
        priority: household.priority,
        lastUpdate: household.lastUpdate || new Date()
      }))
      .sort((a, b) => a.availableEnergy - b.availableEnergy); // Sort by available energy
    
    res.json({
      success: true,
      data: availableSellers
    });
  } catch (error) {
    console.error('Error getting available sellers:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving available sellers'
    });
  }
});

// @route   GET /api/market/available-buyers
// @desc    Get available energy buyers
// @access  Private
router.get('/available-buyers', auth, (req, res) => {
  try {
    const { maxEnergy = 10.0, maxPrice = 1.0 } = req.query;
    const marketData = MarketEngine.getMarketData();
    
    const availableBuyers = marketData.households
      .filter(household => {
        const energyNeeded = household.currentLoad - household.currentGeneration;
        return household.isOnline && 
               energyNeeded > 0 &&
               energyNeeded <= parseFloat(maxEnergy) &&
               household.id !== req.user.householdId; // Can't buy from self
      })
      .map(household => {
        const energyNeeded = household.currentLoad - household.currentGeneration;
        return {
          id: household.id,
          name: household.name,
          energyNeeded: Math.round(energyNeeded * 100) / 100,
          currentLoad: household.currentLoad,
          currentGeneration: household.currentGeneration,
          priority: household.priority,
          lastUpdate: household.lastUpdate || new Date()
        };
      })
      .sort((a, b) => b.energyNeeded - a.energyNeeded); // Sort by energy needed (descending)
    
    res.json({
      success: true,
      data: availableBuyers
    });
  } catch (error) {
    console.error('Error getting available buyers:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving available buyers'
    });
  }
});

// @route   POST /api/market/cancel-trade/:id
// @desc    Cancel a pending trade
// @access  Private
router.post('/cancel-trade/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    const marketData = MarketEngine.getMarketData();
    
    const trade = marketData.activeTrades.find(t => t.id === id);
    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trade not found or not active'
      });
    }
    
    // Check if user has permission to cancel this trade
    if (trade.buyerId !== req.user.householdId && trade.sellerId !== req.user.householdId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this trade'
      });
    }
    
    // Cancel trade (simplified - in real implementation, this would update the trade status)
    trade.status = 'cancelled';
    trade.cancelledAt = new Date();
    trade.cancelledBy = req.user.householdId;
    
    res.json({
      success: true,
      message: 'Trade cancelled successfully',
      data: trade
    });
  } catch (error) {
    console.error('Error cancelling trade:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling trade'
    });
  }
});

// @route   GET /api/market/pricing-history
// @desc    Get historical pricing data
// @access  Private
router.get('/pricing-history', auth, (req, res) => {
  try {
    const { hours = 24 } = req.query;
    
    // Generate sample pricing history
    const pricingHistory = [];
    const currentHour = new Date().getHours();
    
    for (let i = parseInt(hours) - 1; i >= 0; i--) {
      const hour = (currentHour - i + 24) % 24;
      const basePrice = 0.12;
      let price = basePrice;
      
      // Time-based pricing
      if (hour >= 6 && hour <= 9) price *= 1.3; // Morning peak
      if (hour >= 17 && hour <= 21) price *= 1.5; // Evening peak
      if (hour >= 22 || hour <= 5) price *= 0.7; // Off-peak
      
      // Add some randomness
      price *= (0.9 + Math.random() * 0.2);
      
      pricingHistory.push({
        hour,
        timestamp: new Date(Date.now() - i * 60 * 60 * 1000),
        pricePerKWh: Math.round(price * 1000) / 1000
      });
    }
    
    res.json({
      success: true,
      data: {
        pricingHistory,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error getting pricing history:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving pricing history'
    });
  }
});

module.exports = router;
