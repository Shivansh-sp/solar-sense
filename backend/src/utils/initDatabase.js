const User = require('../models/User');
const Household = require('../models/Household');
const Trade = require('../models/Trade');
const EnergyData = require('../models/EnergyData');

const initializeDatabase = async () => {
  try {
    console.log('🗄️ Initializing database with sample data...');

    // Check if database is connected before proceeding
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ Database not connected, skipping initialization...');
      return;
    }

    // Clear existing data with timeout protection
    try {
      await Promise.race([
        User.deleteMany({}),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]);
      await Promise.race([
        Household.deleteMany({}),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]);
      await Promise.race([
        Trade.deleteMany({}),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]);
      await Promise.race([
        EnergyData.deleteMany({}),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]);
    } catch (error) {
      console.log('⚠️ Could not clear existing data, continuing with initialization...');
    }

    // Create sample users with timeout protection
    const users = await Promise.race([
      User.create([
      {
        email: 'admin@solarsense.com',
        password: 'password123',
        name: 'Admin User',
        role: 'admin'
      },
      {
        email: 'operator@solarsense.com',
        password: 'password123',
        name: 'Grid Operator',
        role: 'operator'
      },
      {
        email: 'resident1@solarsense.com',
        password: 'password123',
        name: 'John Smith',
        role: 'resident',
        householdId: 'household-1'
      },
      {
        email: 'resident2@solarsense.com',
        password: 'password123',
        name: 'Sarah Johnson',
        role: 'resident',
        householdId: 'household-2'
      },
      {
        email: 'resident3@solarsense.com',
        password: 'password123',
        name: 'Mike Wilson',
        role: 'resident',
        householdId: 'household-3'
      }
    ]),
      new Promise((_, reject) => setTimeout(() => reject(new Error('User creation timeout')), 10000))
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Create sample households
    const households = await Household.create([
      {
        name: 'Green Valley Home',
        ownerId: users[2]._id,
        address: {
          street: '123 Solar Street',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          country: 'US',
          coordinates: {
            type: 'Point',
            coordinates: [-122.4194, 37.7749] // [longitude, latitude]
          }
        },
        energyProfile: {
          solarCapacity: 8.5,
          batteryCapacity: 12.0,
          maxLoad: 10.0,
          efficiency: 0.85
        },
        currentStatus: {
          generation: 6.8,
          consumption: 5.2,
          storage: 8.5,
          isOnline: true
        },
        priority: 'normal',
        tradingSettings: {
          autoTrading: true,
          minPrice: 0.10,
          maxPrice: 0.25
        },
        devices: [
          {
            deviceId: 'solar-1',
            type: 'solar_panel',
            name: 'Solar Panel Array',
            capacity: 8.5,
            efficiency: 0.22,
            status: 'active'
          },
          {
            deviceId: 'battery-1',
            type: 'battery',
            name: 'Lithium-Ion Battery',
            capacity: 12.0,
            efficiency: 0.95,
            status: 'active'
          }
        ]
      },
      {
        name: 'Sunshine Residence',
        ownerId: users[3]._id,
        address: {
          street: '456 Renewable Road',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94103',
          country: 'US',
          coordinates: {
            type: 'Point',
            coordinates: [-122.4094, 37.7849] // [longitude, latitude]
          }
        },
        energyProfile: {
          solarCapacity: 12.0,
          batteryCapacity: 16.0,
          maxLoad: 15.0,
          efficiency: 0.92
        },
        currentStatus: {
          generation: 9.2,
          consumption: 7.8,
          storage: 12.3,
          isOnline: true
        },
        priority: 'normal',
        tradingSettings: {
          autoTrading: true,
          minPrice: 0.12,
          maxPrice: 0.30
        },
        devices: [
          {
            deviceId: 'solar-2',
            type: 'solar_panel',
            name: 'Solar Panel Array',
            capacity: 12.0,
            efficiency: 0.24,
            status: 'active'
          },
          {
            deviceId: 'battery-2',
            type: 'battery',
            name: 'Lithium-Ion Battery',
            capacity: 16.0,
            efficiency: 0.96,
            status: 'active'
          }
        ]
      },
      {
        name: 'Medical Facility',
        ownerId: users[4]._id,
        address: {
          street: '789 Health Drive',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94104',
          country: 'US',
          coordinates: {
            type: 'Point',
            coordinates: [-122.4294, 37.7649] // [longitude, latitude]
          }
        },
        energyProfile: {
          solarCapacity: 10.0,
          batteryCapacity: 20.0,
          maxLoad: 12.0,
          efficiency: 0.88
        },
        currentStatus: {
          generation: 7.8,
          consumption: 8.5,
          storage: 15.0,
          isOnline: true
        },
        priority: 'critical',
        tradingSettings: {
          autoTrading: false,
          minPrice: 0.15,
          maxPrice: 0.50
        },
        devices: [
          {
            deviceId: 'solar-3',
            type: 'solar_panel',
            name: 'Solar Panel Array',
            capacity: 10.0,
            efficiency: 0.20,
            status: 'active'
          },
          {
            deviceId: 'battery-3',
            type: 'battery',
            name: 'Lithium-Ion Battery',
            capacity: 20.0,
            efficiency: 0.94,
            status: 'active'
          }
        ]
      }
    ]);

    console.log(`✅ Created ${households.length} households`);

    // Create sample energy data for the last 24 hours
    const now = new Date();
    const energyDataEntries = [];

    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
      
      households.forEach((household, index) => {
        const hour = timestamp.getHours();
        const baseGeneration = household.energyProfile.solarCapacity * 0.6;
        const generation = Math.max(0, baseGeneration + Math.sin((hour - 6) * Math.PI / 12) * baseGeneration * 0.8 + (Math.random() - 0.5) * 2);
        const consumption = Math.max(0.1, household.energyProfile.maxLoad * (0.3 + Math.sin((hour - 6) * Math.PI / 12) * 0.4 + (Math.random() - 0.5) * 0.2));
        
        energyDataEntries.push({
          householdId: household._id,
          timestamp,
          generation: Math.round(generation * 100) / 100,
          consumption: Math.round(consumption * 100) / 100,
          storage: {
            current: Math.round((household.currentStatus.storage + (generation - consumption) * 0.1) * 100) / 100,
            capacity: household.energyProfile.batteryCapacity,
            charging: generation > consumption,
            discharging: generation < consumption
          },
          trading: {
            energySold: generation > consumption ? Math.round((generation - consumption) * 0.3 * 100) / 100 : 0,
            energyBought: generation < consumption ? Math.round((consumption - generation) * 0.2 * 100) / 100 : 0,
            revenue: generation > consumption ? Math.round((generation - consumption) * 0.3 * 0.15 * 100) / 100 : 0,
            cost: generation < consumption ? Math.round((consumption - generation) * 0.2 * 0.18 * 100) / 100 : 0
          },
          weather: {
            temperature: 20 + Math.sin((hour - 6) * Math.PI / 12) * 10 + (Math.random() - 0.5) * 5,
            cloudCover: 0.2 + Math.random() * 0.6,
            humidity: 0.4 + Math.random() * 0.4,
            windSpeed: 5 + Math.random() * 15,
            irradiance: Math.max(0, 800 + Math.sin((hour - 6) * Math.PI / 12) * 400 + (Math.random() - 0.5) * 200)
          },
          grid: {
            frequency: 60.0 + (Math.random() - 0.5) * 0.2,
            voltage: 240.0 + (Math.random() - 0.5) * 5,
            load: 50 + Math.sin((hour - 6) * Math.PI / 12) * 20 + (Math.random() - 0.5) * 10,
            supply: 60 + Math.sin((hour - 12) * Math.PI / 12) * 15 + (Math.random() - 0.5) * 8,
            stability: 'stable'
          }
        });
      });
    }

    await EnergyData.insertMany(energyDataEntries);
    console.log(`✅ Created ${energyDataEntries.length} energy data entries`);

    // Create sample trades
    const trades = await Trade.create([
      {
        tradeId: 'trade-001',
        buyerId: households[0]._id,
        sellerId: households[1]._id,
        energyAmount: 5.2,
        pricePerKWh: 0.15,
        totalPrice: 0.78,
        status: 'completed',
        priority: 'normal',
        tradingWindow: {
          start: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          end: new Date(now.getTime() - 1 * 60 * 60 * 1000)
        },
        executionDetails: {
          startedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          completedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
          actualEnergyDelivered: 5.2,
          actualPricePaid: 0.78
        }
      },
      {
        tradeId: 'trade-002',
        buyerId: households[2]._id,
        sellerId: households[1]._id,
        energyAmount: 3.1,
        pricePerKWh: 0.18,
        totalPrice: 0.56,
        status: 'pending',
        priority: 'high',
        tradingWindow: {
          start: new Date(now.getTime() - 30 * 60 * 1000),
          end: new Date(now.getTime() + 30 * 60 * 1000)
        }
      }
    ]);

    console.log(`✅ Created ${trades.length} trades`);

    console.log('🎉 Database initialization completed successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('Admin: admin@solarsense.com / password123');
    console.log('Operator: operator@solarsense.com / password123');
    console.log('Resident 1: resident1@solarsense.com / password123');
    console.log('Resident 2: resident2@solarsense.com / password123');
    console.log('Resident 3: resident3@solarsense.com / password123');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

module.exports = initializeDatabase;
