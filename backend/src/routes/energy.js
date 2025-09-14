const express = require('express');
const { auth } = require('../middleware/auth');
const MarketEngine = require('../services/MarketEngine');
const MLService = require('../services/MLService');
const WeatherService = require('../services/WeatherService');

const router = express.Router();

// @route   GET /api/energy/grid-status
// @desc    Get current grid status
// @access  Private
router.get('/grid-status', auth, (req, res) => {
  try {
    const marketData = MarketEngine.getMarketData();
    
    res.json({
      success: true,
      data: {
        gridStatus: marketData.gridStatus,
        pricing: marketData.pricing,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error getting grid status:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving grid status'
    });
  }
});

// @route   GET /api/energy/households
// @desc    Get all households data
// @access  Private
router.get('/households', auth, (req, res) => {
  try {
    const marketData = MarketEngine.getMarketData();
    
    res.json({
      success: true,
      data: marketData.households
    });
  } catch (error) {
    console.error('Error getting households:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving households data'
    });
  }
});

// @route   GET /api/energy/household/:id
// @desc    Get specific household data
// @access  Private
router.get('/household/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    const household = MarketEngine.getHouseholdData(id);
    
    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      });
    }
    
    res.json({
      success: true,
      data: household
    });
  } catch (error) {
    console.error('Error getting household:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving household data'
    });
  }
});

// @route   PUT /api/energy/household/:id
// @desc    Update household data
// @access  Private
router.put('/household/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedHousehold = MarketEngine.updateHouseholdData(id, updates);
    
    if (!updatedHousehold) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedHousehold,
      message: 'Household updated successfully'
    });
  } catch (error) {
    console.error('Error updating household:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating household data'
    });
  }
});

// @route   GET /api/energy/forecast/solar
// @desc    Get solar generation forecast
// @access  Private
router.get('/forecast/solar', auth, async (req, res) => {
  try {
    const { locationId = 'location-1', hours = 24 } = req.query;
    
    const weatherData = WeatherService.getCurrentWeather(locationId);
    const forecast = WeatherService.getWeatherForecast(locationId, parseInt(hours));
    
    if (!weatherData || !forecast) {
      return res.status(404).json({
        success: false,
        message: 'Weather data not available'
      });
    }
    
    const solarForecasts = [];
    
    for (let i = 0; i < Math.min(forecast.length, 24); i++) {
      const hourData = forecast[i];
      const solarForecast = await MLService.forecastSolarGeneration(
        hourData,
        hourData.hour,
        'summer' // Simplified - would be calculated based on date
      );
      
      solarForecasts.push({
        hour: hourData.hour,
        timestamp: hourData.timestamp,
        predictedGeneration: solarForecast.predictedGeneration,
        confidence: solarForecast.confidence,
        weather: hourData
      });
    }
    
    res.json({
      success: true,
      data: {
        forecasts: solarForecasts,
        location: locationId,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error getting solar forecast:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating solar forecast'
    });
  }
});

// @route   GET /api/energy/forecast/load
// @desc    Get load forecast for household
// @access  Private
router.get('/forecast/load/:householdId', auth, async (req, res) => {
  try {
    const { householdId } = req.params;
    const { hours = 24 } = req.query;
    
    // Get historical data (simulated)
    const historicalData = Array.from({ length: 24 }, (_, i) => ({
      load: 3.0 + Math.random() * 2.0,
      timestamp: new Date(Date.now() - (24 - i) * 60 * 60 * 1000)
    }));
    
    const loadForecasts = [];
    const currentHour = new Date().getHours();
    
    for (let i = 0; i < parseInt(hours); i++) {
      const hour = (currentHour + i) % 24;
      const dayOfWeek = new Date().getDay();
      
      const loadForecast = await MLService.forecastLoad(
        householdId,
        historicalData,
        hour,
        dayOfWeek
      );
      
      loadForecasts.push({
        hour,
        timestamp: new Date(Date.now() + i * 60 * 60 * 1000),
        predictedLoad: loadForecast.predictedLoad,
        confidence: loadForecast.confidence,
        factors: loadForecast.factors
      });
    }
    
    res.json({
      success: true,
      data: {
        householdId,
        forecasts: loadForecasts,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error getting load forecast:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating load forecast'
    });
  }
});

// @route   GET /api/energy/pricing/current
// @desc    Get current energy pricing
// @access  Private
router.get('/pricing/current', auth, (req, res) => {
  try {
    const marketData = MarketEngine.getMarketData();
    
    res.json({
      success: true,
      data: marketData.pricing
    });
  } catch (error) {
    console.error('Error getting pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving pricing data'
    });
  }
});

// @route   GET /api/energy/pricing/forecast
// @desc    Get energy pricing forecast
// @access  Private
router.get('/pricing/forecast', auth, async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const marketData = MarketEngine.getMarketData();
    
    const pricingForecasts = [];
    const currentHour = new Date().getHours();
    
    for (let i = 0; i < parseInt(hours); i++) {
      const hour = (currentHour + i) % 24;
      const gridLoad = marketData.gridStatus.totalLoad;
      const demand = marketData.gridStatus.totalLoad;
      const supply = marketData.gridStatus.totalSupply;
      
      const pricingForecast = await MLService.calculateDynamicPricing(
        gridLoad,
        demand,
        supply,
        hour
      );
      
      pricingForecasts.push({
        hour,
        timestamp: new Date(Date.now() + i * 60 * 60 * 1000),
        pricePerKWh: pricingForecast.pricePerKWh,
        factors: pricingForecast.factors
      });
    }
    
    res.json({
      success: true,
      data: {
        forecasts: pricingForecasts,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error getting pricing forecast:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating pricing forecast'
    });
  }
});

// @route   GET /api/energy/anomalies
// @desc    Detect energy anomalies
// @access  Private
router.get('/anomalies', auth, async (req, res) => {
  try {
    const { householdId, hours = 24 } = req.query;
    
    // Generate sample data for anomaly detection
    const sampleData = Array.from({ length: parseInt(hours) }, (_, i) => ({
      value: 3.0 + Math.random() * 2.0 + (Math.random() < 0.1 ? 5.0 : 0), // 10% chance of anomaly
      timestamp: new Date(Date.now() - (parseInt(hours) - i) * 60 * 60 * 1000)
    }));
    
    const anomalyResult = await MLService.detectAnomalies(sampleData);
    
    res.json({
      success: true,
      data: {
        householdId: householdId || 'all',
        anomalies: anomalyResult.anomalies,
        anomalyCount: anomalyResult.anomalyCount,
        severity: anomalyResult.severity,
        analyzedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error detecting anomalies:', error);
    res.status(500).json({
      success: false,
      message: 'Error detecting anomalies'
    });
  }
});

// @route   POST /api/energy/emergency-shedding
// @desc    Trigger emergency load shedding
// @access  Private (Admin/Operator only)
router.post('/emergency-shedding', auth, async (req, res) => {
  try {
    // Check if user has permission
    if (!['admin', 'operator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    
    await MarketEngine.emergencyLoadShedding();
    
    res.json({
      success: true,
      message: 'Emergency load shedding initiated',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error triggering emergency shedding:', error);
    res.status(500).json({
      success: false,
      message: 'Error initiating emergency load shedding'
    });
  }
});

module.exports = router;
