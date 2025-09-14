const mongoose = require('mongoose');

const energyDataSchema = new mongoose.Schema({
  householdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household',
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  generation: {
    type: Number,
    required: true,
    min: [0, 'Generation cannot be negative']
  },
  consumption: {
    type: Number,
    required: true,
    min: [0, 'Consumption cannot be negative']
  },
  storage: {
    current: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 0 },
    charging: { type: Boolean, default: false },
    discharging: { type: Boolean, default: false }
  },
  trading: {
    energySold: { type: Number, default: 0, min: 0 },
    energyBought: { type: Number, default: 0, min: 0 },
    revenue: { type: Number, default: 0 },
    cost: { type: Number, default: 0 }
  },
  weather: {
    temperature: { type: Number },
    cloudCover: { type: Number, min: 0, max: 1 },
    humidity: { type: Number, min: 0, max: 1 },
    windSpeed: { type: Number, min: 0 },
    irradiance: { type: Number, min: 0 }
  },
  grid: {
    frequency: { type: Number },
    voltage: { type: Number },
    load: { type: Number },
    supply: { type: Number },
    stability: { 
      type: String, 
      enum: ['excellent', 'stable', 'warning', 'critical'],
      default: 'stable'
    }
  },
  forecasts: {
    solar: {
      predicted: { type: Number },
      confidence: { type: Number, min: 0, max: 1 }
    },
    load: {
      predicted: { type: Number },
      confidence: { type: Number, min: 0, max: 1 }
    },
    pricing: {
      predicted: { type: Number },
      confidence: { type: Number, min: 0, max: 1 }
    }
  },
  anomalies: [{
    type: { type: String, required: true },
    severity: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'critical'],
      required: true 
    },
    description: { type: String, required: true },
    detectedAt: { type: Date, default: Date.now },
    resolved: { type: Boolean, default: false }
  }],
  metadata: {
    dataSource: { type: String, default: 'sensor' },
    quality: { type: Number, min: 0, max: 1, default: 1.0 },
    processingTime: { type: Number },
    algorithm: { type: String }
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
energyDataSchema.index({ householdId: 1, timestamp: -1 });
energyDataSchema.index({ timestamp: -1 });
energyDataSchema.index({ 'anomalies.severity': 1, 'anomalies.resolved': 1 });

// TTL index to automatically delete old data after 1 year
energyDataSchema.index({ timestamp: 1 }, { expireAfterSeconds: 31536000 });

// Virtual for net energy
energyDataSchema.virtual('netEnergy').get(function() {
  return this.generation - this.consumption;
});

// Virtual for storage utilization percentage
energyDataSchema.virtual('storageUtilization').get(function() {
  if (this.storage.capacity === 0) return 0;
  return (this.storage.current / this.storage.capacity) * 100;
});

// Virtual for trading profit/loss
energyDataSchema.virtual('tradingProfit').get(function() {
  return this.trading.revenue - this.trading.cost;
});

// Method to add anomaly
energyDataSchema.methods.addAnomaly = function(type, severity, description) {
  this.anomalies.push({
    type,
    severity,
    description,
    detectedAt: new Date()
  });
  return this.save();
};

// Method to resolve anomaly
energyDataSchema.methods.resolveAnomaly = function(anomalyIndex) {
  if (this.anomalies[anomalyIndex]) {
    this.anomalies[anomalyIndex].resolved = true;
  }
  return this.save();
};

// Static method to get recent data for household
energyDataSchema.statics.getRecentData = function(householdId, hours = 24) {
  const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
  return this.find({
    householdId,
    timestamp: { $gte: startTime }
  }).sort({ timestamp: 1 });
};

// Static method to get aggregated data
energyDataSchema.statics.getAggregatedData = function(householdId, startDate, endDate, interval = 'hour') {
  const matchStage = {
    householdId: new mongoose.Types.ObjectId(householdId),
    timestamp: { $gte: startDate, $lte: endDate }
  };

  const groupStage = {
    _id: {
      $dateTrunc: {
        date: '$timestamp',
        unit: interval
      }
    },
    avgGeneration: { $avg: '$generation' },
    avgConsumption: { $avg: '$consumption' },
    avgStorage: { $avg: '$storage.current' },
    totalTradingRevenue: { $sum: '$trading.revenue' },
    totalTradingCost: { $sum: '$trading.cost' },
    count: { $sum: 1 }
  };

  return this.aggregate([
    { $match: matchStage },
    { $group: groupStage },
    { $sort: { _id: 1 } }
  ]);
};

module.exports = mongoose.model('EnergyData', energyDataSchema);
