const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

class MarketEngine {
  constructor() {
    this.activeTrades = new Map();
    this.tradeHistory = [];
    this.households = new Map();
    this.gridStatus = {
      totalLoad: 0,
      totalSupply: 0,
      peakLoad: 0,
      stability: 'stable'
    };
    this.pricing = {
      basePrice: 0.12,
      currentPrice: 0.12,
      peakPrice: 0.25,
      offPeakPrice: 0.08
    };
    this.isInitialized = false;
  }

  async initialize() {
    try {
      console.log('🏪 Initializing Market Engine...');
      
      // Initialize with sample households
      this.initializeSampleHouseholds();
      
      // Start market simulation
      this.startMarketSimulation();
      
      this.isInitialized = true;
      console.log('✅ Market Engine initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Market Engine:', error);
      throw error;
    }
  }

  initializeSampleHouseholds() {
    const sampleHouseholds = [
      {
        id: 'household-1',
        name: 'Green Valley Home',
        solarCapacity: 8.5,
        batteryCapacity: 12.0,
        currentLoad: 3.2,
        currentGeneration: 6.8,
        energyStored: 8.5,
        isOnline: true,
        priority: 'normal'
      },
      {
        id: 'household-2',
        name: 'Sunshine Residence',
        solarCapacity: 12.0,
        batteryCapacity: 16.0,
        currentLoad: 4.1,
        currentGeneration: 9.2,
        energyStored: 12.3,
        isOnline: true,
        priority: 'normal'
      },
      {
        id: 'household-3',
        name: 'Eco-Friendly House',
        solarCapacity: 6.0,
        batteryCapacity: 8.0,
        currentLoad: 2.8,
        currentGeneration: 4.5,
        energyStored: 5.2,
        isOnline: true,
        priority: 'normal'
      },
      {
        id: 'household-4',
        name: 'Medical Facility',
        solarCapacity: 10.0,
        batteryCapacity: 20.0,
        currentLoad: 5.5,
        currentGeneration: 7.8,
        energyStored: 15.0,
        isOnline: true,
        priority: 'critical'
      },
      {
        id: 'household-5',
        name: 'Smart Home Alpha',
        solarCapacity: 15.0,
        batteryCapacity: 24.0,
        currentLoad: 6.2,
        currentGeneration: 11.5,
        energyStored: 18.7,
        isOnline: true,
        priority: 'normal'
      },
      {
        id: 'household-6',
        name: 'Community Center',
        solarCapacity: 20.0,
        batteryCapacity: 30.0,
        currentLoad: 8.5,
        currentGeneration: 16.2,
        energyStored: 25.0,
        isOnline: true,
        priority: 'high'
      }
    ];

    sampleHouseholds.forEach(household => {
      this.households.set(household.id, household);
    });
  }

  startMarketSimulation() {
    // Update market every 30 seconds
    setInterval(() => {
      this.updateMarket();
    }, 30000);

    // Update pricing every 5 minutes
    setInterval(() => {
      this.updatePricing();
    }, 300000);
  }

  updateMarket() {
    // Calculate total grid load and supply
    let totalLoad = 0;
    let totalSupply = 0;
    let totalGeneration = 0;

    this.households.forEach(household => {
      if (household.isOnline) {
        totalLoad += household.currentLoad;
        totalGeneration += household.currentGeneration;
        
        // Calculate available supply (generation + stored energy)
        const availableSupply = household.currentGeneration + (household.energyStored * 0.1); // 10% of stored energy available per cycle
        totalSupply += availableSupply;
      }
    });

    this.gridStatus = {
      totalLoad,
      totalSupply,
      peakLoad: Math.max(this.gridStatus.peakLoad, totalLoad),
      stability: this.calculateGridStability(totalLoad, totalSupply),
      timestamp: new Date()
    };

    // Process pending trades
    this.processPendingTrades();
  }

  updatePricing() {
    const currentHour = new Date().getHours();
    const gridLoad = this.gridStatus.totalLoad;
    const supplyDemandRatio = this.gridStatus.totalSupply / Math.max(this.gridStatus.totalLoad, 1);

    // Time-based pricing
    let timeMultiplier = 1.0;
    if (currentHour >= 6 && currentHour <= 9) timeMultiplier = 1.3; // Morning peak
    if (currentHour >= 17 && currentHour <= 21) timeMultiplier = 1.5; // Evening peak
    if (currentHour >= 22 || currentHour <= 5) timeMultiplier = 0.7; // Off-peak

    // Load-based pricing
    const loadMultiplier = Math.min(2.0, 1 + (gridLoad / 100));

    // Supply-demand pricing
    const supplyMultiplier = Math.max(0.5, 2 - supplyDemandRatio);

    this.pricing.currentPrice = this.pricing.basePrice * timeMultiplier * loadMultiplier * supplyMultiplier;
  }

  calculateGridStability(load, supply) {
    const ratio = supply / Math.max(load, 1);
    
    if (ratio >= 1.2) return 'excellent';
    if (ratio >= 1.0) return 'stable';
    if (ratio >= 0.8) return 'warning';
    return 'critical';
  }

  // Process trade requests
  async processTradeRequest(tradeRequest) {
    try {
      const {
        buyerId,
        sellerId,
        energyAmount,
        maxPrice,
        priority = 'normal'
      } = tradeRequest;

      // Validate trade request
      const validation = this.validateTradeRequest(tradeRequest);
      if (!validation.valid) {
        throw new Error(validation.message);
      }

      // Check if seller has enough energy
      const seller = this.households.get(sellerId);
      if (!seller || !seller.isOnline) {
        throw new Error('Seller not available');
      }

      const availableEnergy = seller.currentGeneration + (seller.energyStored * 0.1);
      if (availableEnergy < energyAmount) {
        throw new Error('Insufficient energy available from seller');
      }

      // Calculate trade price
      const tradePrice = this.calculateTradePrice(energyAmount, priority, maxPrice);

      // Create trade
      const trade = {
        id: uuidv4(),
        buyerId,
        sellerId,
        energyAmount,
        pricePerKWh: tradePrice,
        totalPrice: energyAmount * tradePrice,
        status: 'pending',
        priority,
        timestamp: new Date(),
        expiresAt: moment().add(5, 'minutes').toDate()
      };

      // Add to active trades
      this.activeTrades.set(trade.id, trade);

      // Execute trade
      await this.executeTrade(trade);

      return {
        success: true,
        trade,
        message: 'Trade executed successfully'
      };

    } catch (error) {
      console.error('Error processing trade request:', error);
      throw error;
    }
  }

  validateTradeRequest(tradeRequest) {
    const { buyerId, sellerId, energyAmount, maxPrice } = tradeRequest;

    if (!buyerId || !sellerId) {
      return { valid: false, message: 'Buyer and seller IDs are required' };
    }

    if (buyerId === sellerId) {
      return { valid: false, message: 'Cannot trade with yourself' };
    }

    if (!energyAmount || energyAmount <= 0) {
      return { valid: false, message: 'Invalid energy amount' };
    }

    if (!maxPrice || maxPrice <= 0) {
      return { valid: false, message: 'Invalid maximum price' };
    }

    return { valid: true };
  }

  calculateTradePrice(energyAmount, priority, maxPrice) {
    let basePrice = this.pricing.currentPrice;

    // Priority pricing
    if (priority === 'critical') {
      basePrice *= 1.5; // 50% premium for critical loads
    } else if (priority === 'high') {
      basePrice *= 1.2; // 20% premium for high priority
    }

    // Volume discount
    if (energyAmount > 5) {
      basePrice *= 0.95; // 5% discount for large trades
    }

    // Ensure price doesn't exceed buyer's max price
    return Math.min(basePrice, maxPrice);
  }

  async executeTrade(trade) {
    try {
      const buyer = this.households.get(trade.buyerId);
      const seller = this.households.get(trade.sellerId);

      if (!buyer || !seller) {
        throw new Error('Invalid buyer or seller');
      }

      // Update seller's energy
      const energyFromGeneration = Math.min(trade.energyAmount, seller.currentGeneration);
      const energyFromStorage = trade.energyAmount - energyFromGeneration;

      seller.currentGeneration -= energyFromGeneration;
      seller.energyStored -= energyFromStorage * 10; // Convert to storage units

      // Update buyer's energy
      buyer.currentLoad -= trade.energyAmount;
      if (buyer.energyStored < buyer.batteryCapacity) {
        buyer.energyStored += trade.energyAmount * 10; // Convert to storage units
      }

      // Update trade status
      trade.status = 'completed';
      trade.completedAt = new Date();

      // Add to trade history
      this.tradeHistory.push(trade);

      // Remove from active trades
      this.activeTrades.delete(trade.id);

      console.log(`✅ Trade completed: ${trade.energyAmount} kWh from ${seller.name} to ${buyer.name} at $${trade.pricePerKWh}/kWh`);

      return trade;

    } catch (error) {
      console.error('Error executing trade:', error);
      trade.status = 'failed';
      trade.error = error.message;
      throw error;
    }
  }

  processPendingTrades() {
    const now = new Date();
    const expiredTrades = [];

    this.activeTrades.forEach((trade, tradeId) => {
      if (now > trade.expiresAt) {
        trade.status = 'expired';
        expiredTrades.push(tradeId);
      }
    });

    expiredTrades.forEach(tradeId => {
      this.activeTrades.delete(tradeId);
    });
  }

  // Get market data
  getMarketData() {
    return {
      gridStatus: this.gridStatus,
      pricing: this.pricing,
      activeTrades: Array.from(this.activeTrades.values()),
      tradeHistory: this.tradeHistory.slice(-50), // Last 50 trades
      households: Array.from(this.households.values()),
      timestamp: new Date()
    };
  }

  // Get household data
  getHouseholdData(householdId) {
    return this.households.get(householdId);
  }

  // Update household data
  updateHouseholdData(householdId, updates) {
    const household = this.households.get(householdId);
    if (household) {
      Object.assign(household, updates);
      this.households.set(householdId, household);
      return household;
    }
    return null;
  }

  // Emergency load shedding
  async emergencyLoadShedding() {
    console.log('🚨 Emergency load shedding initiated');
    
    const households = Array.from(this.households.values())
      .filter(h => h.isOnline && h.priority !== 'critical')
      .sort((a, b) => a.priority === 'high' ? 1 : -1);

    for (const household of households) {
      if (this.gridStatus.stability === 'critical') {
        // Reduce non-essential loads
        household.currentLoad *= 0.7;
        console.log(`Reduced load for ${household.name} to ${household.currentLoad} kW`);
      }
    }
  }

  // Get trading statistics
  getTradingStats() {
    const totalTrades = this.tradeHistory.length;
    const totalEnergyTraded = this.tradeHistory.reduce((sum, trade) => sum + trade.energyAmount, 0);
    const totalValue = this.tradeHistory.reduce((sum, trade) => sum + trade.totalPrice, 0);
    const avgPrice = totalValue / Math.max(totalEnergyTraded, 1);

    return {
      totalTrades,
      totalEnergyTraded: Math.round(totalEnergyTraded * 100) / 100,
      totalValue: Math.round(totalValue * 100) / 100,
      averagePrice: Math.round(avgPrice * 1000) / 1000,
      activeTrades: this.activeTrades.size
    };
  }
}

module.exports = new MarketEngine();
