const express = require('express');
const { auth } = require('../middleware/auth');
const MarketEngine = require('../services/MarketEngine');
const WeatherService = require('../services/WeatherService');
const SimulationService = require('../services/SimulationService');
const MLService = require('../services/MLService');

const router = express.Router();

// @route   GET /api/dashboard/overview
// @desc    Get dashboard overview data
// @access  Private
router.get('/overview', auth, (req, res) => {
  try {
    const marketData = MarketEngine.getMarketData();
    const tradingStats = MarketEngine.getTradingStats();
    const deviceStats = getDeviceStatistics();
    const weatherData = WeatherService.getAllWeatherData();
    
    const overview = {
      grid: {
        status: marketData.gridStatus,
        pricing: marketData.pricing,
        stability: marketData.gridStatus.stability
      },
      trading: {
        activeTrades: marketData.activeTrades.length,
        totalTrades: tradingStats.totalTrades,
        totalEnergyTraded: tradingStats.totalEnergyTraded,
        averagePrice: tradingStats.averagePrice
      },
      households: {
        total: marketData.households.length,
        online: marketData.households.filter(h => h.isOnline).length,
        totalGeneration: marketData.households.reduce((sum, h) => sum + h.currentGeneration, 0),
        totalLoad: marketData.households.reduce((sum, h) => sum + h.currentLoad, 0),
        totalStorage: marketData.households.reduce((sum, h) => sum + h.energyStored, 0)
      },
      devices: deviceStats,
      weather: {
        locations: Object.keys(weatherData).length,
        alerts: WeatherService.getWeatherAlerts()
      },
      timestamp: new Date()
    };
    
    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    console.error('Error getting dashboard overview:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving dashboard overview'
    });
  }
});

// @route   GET /api/dashboard/household/:id
// @desc    Get household dashboard data
// @access  Private
router.get('/household/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const household = MarketEngine.getHouseholdData(id);
    
    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      });
    }
    
    // Get weather data for solar forecasting
    const weatherData = WeatherService.getCurrentWeather('location-1');
    const solarForecast = await MLService.forecastSolarGeneration(
      weatherData || { temperature: 20, cloudCover: 0.3, humidity: 50 },
      new Date().getHours(),
      'summer'
    );
    
    // Get load forecast
    const historicalData = Array.from({ length: 24 }, (_, i) => ({
      load: 3.0 + Math.random() * 2.0,
      timestamp: new Date(Date.now() - (24 - i) * 60 * 60 * 1000)
    }));
    
    const loadForecast = await MLService.forecastLoad(
      id,
      historicalData,
      new Date().getHours(),
      new Date().getDay()
    );
    
    // Get recent trades for this household
    const marketData = MarketEngine.getMarketData();
    const recentTrades = marketData.tradeHistory
      .filter(trade => trade.buyerId === id || trade.sellerId === id)
      .slice(-10);
    
    const householdDashboard = {
      household,
      forecasts: {
        solar: solarForecast,
        load: loadForecast
      },
      recentTrades,
      energyBalance: {
        current: household.currentGeneration - household.currentLoad,
        stored: household.energyStored,
        capacity: household.batteryCapacity
      },
      recommendations: getHouseholdRecommendations(household, solarForecast, loadForecast),
      timestamp: new Date()
    };
    
    res.json({
      success: true,
      data: householdDashboard
    });
  } catch (error) {
    console.error('Error getting household dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving household dashboard'
    });
  }
});

// @route   GET /api/dashboard/operator
// @desc    Get operator dashboard data
// @access  Private
router.get('/operator', auth, (req, res) => {
  try {
    // Check if user has operator permissions
    if (!['admin', 'operator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    
    const marketData = MarketEngine.getMarketData();
    const tradingStats = MarketEngine.getTradingStats();
    const deviceStats = getDeviceStatistics();
    const weatherAlerts = WeatherService.getWeatherAlerts();
    const simulations = SimulationService.getAllSimulations();
    
    const operatorDashboard = {
      grid: {
        status: marketData.gridStatus,
        pricing: marketData.pricing,
        stability: marketData.gridStatus.stability,
        peakLoad: marketData.gridStatus.peakLoad,
        efficiency: calculateGridEfficiency(marketData.gridStatus)
      },
      trading: {
        stats: tradingStats,
        activeTrades: marketData.activeTrades,
        recentTrades: marketData.tradeHistory.slice(-20)
      },
      households: {
        summary: {
          total: marketData.households.length,
          online: marketData.households.filter(h => h.isOnline).length,
          critical: marketData.households.filter(h => h.priority === 'critical').length
        },
        details: marketData.households.map(h => ({
          id: h.id,
          name: h.name,
          status: h.isOnline ? 'online' : 'offline',
          priority: h.priority,
          generation: h.currentGeneration,
          load: h.currentLoad,
          storage: h.energyStored,
          efficiency: h.currentGeneration / Math.max(h.currentLoad, 0.1)
        }))
      },
      devices: deviceStats,
      weather: {
        alerts: weatherAlerts,
        locations: Object.keys(WeatherService.getAllWeatherData()).length
      },
      simulations: {
        active: simulations.filter(s => s.status === 'running').length,
        total: simulations.length,
        recent: simulations.slice(-5)
      },
      alerts: generateSystemAlerts(marketData, weatherAlerts, deviceStats),
      timestamp: new Date()
    };
    
    res.json({
      success: true,
      data: operatorDashboard
    });
  } catch (error) {
    console.error('Error getting operator dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving operator dashboard'
    });
  }
});

// @route   GET /api/dashboard/analytics
// @desc    Get analytics data
// @access  Private
router.get('/analytics', auth, (req, res) => {
  try {
    const { period = '24h' } = req.query;
    const marketData = MarketEngine.getMarketData();
    
    const analytics = {
      energyFlow: generateEnergyFlowData(period),
      tradingTrends: generateTradingTrends(period),
      gridPerformance: generateGridPerformanceData(period),
      householdEfficiency: generateHouseholdEfficiencyData(marketData.households),
      costSavings: generateCostSavingsData(period),
      environmentalImpact: generateEnvironmentalImpactData(period),
      period,
      generatedAt: new Date()
    };
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving analytics data'
    });
  }
});

// @route   GET /api/dashboard/alerts
// @desc    Get system alerts
// @access  Private
router.get('/alerts', auth, (req, res) => {
  try {
    const marketData = MarketEngine.getMarketData();
    const weatherAlerts = WeatherService.getWeatherAlerts();
    const deviceStats = getDeviceStatistics();
    
    const alerts = generateSystemAlerts(marketData, weatherAlerts, deviceStats);
    
    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Error getting alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving alerts'
    });
  }
});

// Helper functions
function getDeviceStatistics() {
  const allDevices = SimulationService.getAllDevices();
  
  return {
    total: allDevices.length,
    active: allDevices.filter(d => d.status === 'active').length,
    byType: allDevices.reduce((acc, device) => {
      acc[device.type] = (acc[device.type] || 0) + 1;
      return acc;
    }, {}),
    totalCapacity: allDevices.reduce((sum, d) => sum + d.capacity, 0),
    totalCurrentPower: allDevices.reduce((sum, d) => sum + d.currentPower, 0),
    averageEfficiency: allDevices.length > 0 
      ? allDevices.reduce((sum, d) => sum + d.efficiency, 0) / allDevices.length 
      : 0
  };
}

function calculateGridEfficiency(gridStatus) {
  const { totalLoad, totalSupply } = gridStatus;
  if (totalSupply === 0) return 0;
  return Math.min(1, totalLoad / totalSupply);
}

function getHouseholdRecommendations(household, solarForecast, loadForecast) {
  const recommendations = [];
  
  const netEnergy = household.currentGeneration - household.currentLoad;
  const storageUtilization = household.energyStored / household.batteryCapacity;
  
  if (netEnergy > 2.0 && storageUtilization < 0.8) {
    recommendations.push({
      type: 'storage',
      priority: 'high',
      message: 'High energy surplus - consider charging battery',
      action: 'Increase battery charging rate'
    });
  }
  
  if (netEnergy < -1.0 && storageUtilization > 0.2) {
    recommendations.push({
      type: 'discharge',
      priority: 'high',
      message: 'Energy deficit - consider discharging battery',
      action: 'Increase battery discharge rate'
    });
  }
  
  if (storageUtilization > 0.9) {
    recommendations.push({
      type: 'trading',
      priority: 'medium',
      message: 'Battery nearly full - consider selling excess energy',
      action: 'List energy for sale in marketplace'
    });
  }
  
  if (household.currentLoad > household.currentGeneration * 1.5) {
    recommendations.push({
      type: 'conservation',
      priority: 'medium',
      message: 'High energy consumption - consider load reduction',
      action: 'Reduce non-essential loads'
    });
  }
  
  return recommendations;
}

function generateSystemAlerts(marketData, weatherAlerts, deviceStats) {
  const alerts = [...weatherAlerts];
  
  // Grid stability alerts
  if (marketData.gridStatus.stability === 'critical') {
    alerts.push({
      type: 'grid',
      severity: 'critical',
      message: 'Grid stability critical - immediate action required',
      timestamp: new Date()
    });
  } else if (marketData.gridStatus.stability === 'warning') {
    alerts.push({
      type: 'grid',
      severity: 'warning',
      message: 'Grid stability warning - monitor closely',
      timestamp: new Date()
    });
  }
  
  // Device alerts
  if (deviceStats.active / deviceStats.total < 0.8) {
    alerts.push({
      type: 'device',
      severity: 'warning',
      message: `${deviceStats.total - deviceStats.active} devices offline`,
      timestamp: new Date()
    });
  }
  
  // Trading alerts
  if (marketData.activeTrades.length > 20) {
    alerts.push({
      type: 'trading',
      severity: 'info',
      message: 'High trading activity - system performing well',
      timestamp: new Date()
    });
  }
  
  return alerts.sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

function generateEnergyFlowData(period) {
  // Generate sample energy flow data
  const hours = period === '24h' ? 24 : period === '7d' ? 168 : 24;
  const data = [];
  
  for (let i = 0; i < hours; i++) {
    data.push({
      timestamp: new Date(Date.now() - (hours - i) * 60 * 60 * 1000),
      generation: 50 + Math.random() * 20,
      consumption: 40 + Math.random() * 15,
      trading: Math.random() * 10,
      storage: 5 + Math.random() * 5
    });
  }
  
  return data;
}

function generateTradingTrends(period) {
  // Generate sample trading trends
  const hours = period === '24h' ? 24 : period === '7d' ? 168 : 24;
  const data = [];
  
  for (let i = 0; i < hours; i++) {
    data.push({
      timestamp: new Date(Date.now() - (hours - i) * 60 * 60 * 1000),
      trades: Math.floor(Math.random() * 20),
      volume: Math.random() * 100,
      averagePrice: 0.12 + Math.random() * 0.08
    });
  }
  
  return data;
}

function generateGridPerformanceData(period) {
  // Generate sample grid performance data
  const hours = period === '24h' ? 24 : period === '7d' ? 168 : 24;
  const data = [];
  
  for (let i = 0; i < hours; i++) {
    data.push({
      timestamp: new Date(Date.now() - (hours - i) * 60 * 60 * 1000),
      load: 50 + Math.random() * 20,
      supply: 60 + Math.random() * 15,
      efficiency: 0.8 + Math.random() * 0.15,
      stability: Math.random() > 0.1 ? 'stable' : 'warning'
    });
  }
  
  return data;
}

function generateHouseholdEfficiencyData(households) {
  return households.map(household => ({
    id: household.id,
    name: household.name,
    efficiency: household.currentGeneration / Math.max(household.currentLoad, 0.1),
    generation: household.currentGeneration,
    load: household.currentLoad,
    storage: household.energyStored
  }));
}

function generateCostSavingsData(period) {
  // Generate sample cost savings data
  const hours = period === '24h' ? 24 : period === '7d' ? 168 : 24;
  let totalSavings = 0;
  const data = [];
  
  for (let i = 0; i < hours; i++) {
    const hourlySavings = Math.random() * 10;
    totalSavings += hourlySavings;
    
    data.push({
      timestamp: new Date(Date.now() - (hours - i) * 60 * 60 * 1000),
      savings: hourlySavings,
      cumulative: totalSavings
    });
  }
  
  return {
    data,
    total: Math.round(totalSavings * 100) / 100
  };
}

function generateEnvironmentalImpactData(period) {
  // Generate sample environmental impact data
  const hours = period === '24h' ? 24 : period === '7d' ? 168 : 24;
  let totalCO2Saved = 0;
  const data = [];
  
  for (let i = 0; i < hours; i++) {
    const hourlyCO2 = Math.random() * 5;
    totalCO2Saved += hourlyCO2;
    
    data.push({
      timestamp: new Date(Date.now() - (hours - i) * 60 * 60 * 1000),
      co2Saved: hourlyCO2,
      cumulative: totalCO2Saved
    });
  }
  
  return {
    data,
    total: Math.round(totalCO2Saved * 100) / 100
  };
}

module.exports = router;
