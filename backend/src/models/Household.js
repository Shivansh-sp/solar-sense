const mongoose = require('mongoose');

const householdSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a household name'],
    trim: true,
    maxlength: [100, 'Household name cannot be more than 100 characters']
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'US' },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    }
  },
  energyProfile: {
    solarCapacity: {
      type: Number,
      required: true,
      min: [0, 'Solar capacity cannot be negative']
    },
    batteryCapacity: {
      type: Number,
      required: true,
      min: [0, 'Battery capacity cannot be negative']
    },
    maxLoad: {
      type: Number,
      required: true,
      min: [0, 'Max load cannot be negative']
    },
    efficiency: {
      type: Number,
      default: 0.85,
      min: [0, 'Efficiency cannot be negative'],
      max: [1, 'Efficiency cannot be more than 1']
    }
  },
  currentStatus: {
    generation: {
      type: Number,
      default: 0,
      min: [0, 'Generation cannot be negative']
    },
    consumption: {
      type: Number,
      default: 0,
      min: [0, 'Consumption cannot be negative']
    },
    storage: {
      type: Number,
      default: 0,
      min: [0, 'Storage cannot be negative']
    },
    isOnline: {
      type: Boolean,
      default: true
    },
    lastUpdate: {
      type: Date,
      default: Date.now
    }
  },
  priority: {
    type: String,
    enum: ['critical', 'high', 'normal', 'low'],
    default: 'normal'
  },
  tradingSettings: {
    autoTrading: {
      type: Boolean,
      default: false
    },
    minPrice: {
      type: Number,
      default: 0.05
    },
    maxPrice: {
      type: Number,
      default: 0.50
    },
    tradingHours: {
      start: { type: String, default: '06:00' },
      end: { type: String, default: '22:00' }
    }
  },
  devices: [{
    deviceId: { type: String, required: true },
    type: {
      type: String,
      enum: ['solar_panel', 'battery', 'inverter', 'smart_meter', 'load_controller'],
      required: true
    },
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    efficiency: { type: Number, default: 1.0 },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance', 'error'],
      default: 'active'
    },
    parameters: { type: mongoose.Schema.Types.Mixed, default: {} }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
householdSchema.index({ ownerId: 1 });
householdSchema.index({ 'address.coordinates': '2dsphere' });
householdSchema.index({ priority: 1, isActive: 1 });

// Virtual for net energy (generation - consumption)
householdSchema.virtual('netEnergy').get(function() {
  return this.currentStatus.generation - this.currentStatus.consumption;
});

// Virtual for storage utilization percentage
householdSchema.virtual('storageUtilization').get(function() {
  if (this.energyProfile.batteryCapacity === 0) return 0;
  return (this.currentStatus.storage / this.energyProfile.batteryCapacity) * 100;
});

// Method to update current status
householdSchema.methods.updateStatus = function(generation, consumption, storage) {
  this.currentStatus.generation = generation;
  this.currentStatus.consumption = consumption;
  this.currentStatus.storage = storage;
  this.currentStatus.lastUpdate = new Date();
  return this.save();
};

// Method to check if household can trade
householdSchema.methods.canTrade = function() {
  return this.isActive && 
         this.currentStatus.isOnline && 
         this.tradingSettings.autoTrading;
};

module.exports = mongoose.model('Household', householdSchema);
