const mongoose = require('mongoose');
require('dotenv').config({ path: './env' });

const testDatabaseConnection = async () => {
  try {
    console.log('🔍 Testing database connection...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 15000, // 15 seconds
      maxPoolSize: 5,
      minPoolSize: 1,
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log('✅ Database connection successful!');
    console.log(`📊 Connected to: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Test a simple query
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name));
    
    // Test User model
    const User = require('./src/models/User');
    const userCount = await User.countDocuments();
    console.log(`👥 Total users in database: ${userCount}`);
    
    await mongoose.connection.close();
    console.log('✅ Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    
    if (error.code === 'ENOTFOUND') {
      console.error('🔍 This usually means the MongoDB hostname cannot be resolved');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔍 This usually means the MongoDB server is not running or not accessible');
    } else if (error.code === 'EAUTH') {
      console.error('🔍 This usually means authentication failed - check username/password');
    }
    
    process.exit(1);
  }
};

testDatabaseConnection();
