const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  tradeId: {
    type: String,
    required: true,
    unique: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household',
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household',
    required: true
  },
  energyAmount: {
    type: Number,
    required: true,
    min: [0.1, 'Energy amount must be at least 0.1 kWh']
  },
  pricePerKWh: {
    type: Number,
    required: true,
    min: [0.01, 'Price must be at least $0.01/kWh']
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0.01, 'Total price must be at least $0.01']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'failed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['critical', 'high', 'normal', 'low'],
    default: 'normal'
  },
  tradingWindow: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  executionDetails: {
    startedAt: { type: Date },
    completedAt: { type: Date },
    actualEnergyDelivered: { type: Number },
    actualPricePaid: { type: Number },
    executionNotes: { type: String }
  },
  cancellationDetails: {
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: { type: Date },
    reason: { type: String }
  },
  metadata: {
    weatherConditions: {
      temperature: { type: Number },
      cloudCover: { type: Number },
      humidity: { type: Number }
    },
    gridConditions: {
      load: { type: Number },
      supply: { type: Number },
      stability: { type: String }
    },
    tradingAlgorithm: { type: String },
    confidence: { type: Number, min: 0, max: 1 }
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
tradeSchema.index({ buyerId: 1, status: 1 });
tradeSchema.index({ sellerId: 1, status: 1 });
tradeSchema.index({ status: 1, createdAt: -1 });
tradeSchema.index({ tradingWindow: 1 });
tradeSchema.index({ priority: 1, status: 1 });

// Pre-save middleware to calculate total price
tradeSchema.pre('save', function(next) {
  if (this.isModified('energyAmount') || this.isModified('pricePerKWh')) {
    this.totalPrice = this.energyAmount * this.pricePerKWh;
  }
  next();
});

// Method to check if trade is still valid
tradeSchema.methods.isValid = function() {
  const now = new Date();
  return this.status === 'pending' && 
         now >= this.tradingWindow.start && 
         now <= this.tradingWindow.end;
};

// Method to execute trade
tradeSchema.methods.execute = function(actualEnergy, actualPrice) {
  this.status = 'in_progress';
  this.executionDetails.startedAt = new Date();
  this.executionDetails.actualEnergyDelivered = actualEnergy;
  this.executionDetails.actualPricePaid = actualPrice;
  return this.save();
};

// Method to complete trade
tradeSchema.methods.complete = function() {
  this.status = 'completed';
  this.executionDetails.completedAt = new Date();
  return this.save();
};

// Method to cancel trade
tradeSchema.methods.cancel = function(userId, reason) {
  this.status = 'cancelled';
  this.cancellationDetails.cancelledBy = userId;
  this.cancellationDetails.cancelledAt = new Date();
  this.cancellationDetails.reason = reason;
  return this.save();
};

// Static method to get active trades
tradeSchema.statics.getActiveTrades = function() {
  return this.find({
    status: { $in: ['pending', 'confirmed', 'in_progress'] }
  }).populate('buyerId sellerId', 'name currentStatus');
};

// Static method to get trades by household
tradeSchema.statics.getTradesByHousehold = function(householdId) {
  return this.find({
    $or: [{ buyerId: householdId }, { sellerId: householdId }]
  }).populate('buyerId sellerId', 'name').sort({ createdAt: -1 });
};

module.exports = mongoose.model('Trade', tradeSchema);
