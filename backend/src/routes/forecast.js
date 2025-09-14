const express = require('express');
const { auth } = require('../middleware/auth');
const MLService = require('../services/MLService');
const WeatherService = require('../services/WeatherService');

const router = express.Router();

// @route   GET /api/forecast/weather
// @desc    Get weather forecast
// @access  Private
router.get('/weather', auth, (req, res) => {
  try {
    const { locationId = 'location-1', hours = 24 } = req.query;
    
    const weatherData = WeatherService.getAllWeatherData();
    const currentWeather = WeatherService.getCurrentWeather(locationId);
    const forecast = WeatherService.getWeatherForecast(locationId, parseInt(hours));
    
    if (!currentWeather || !forecast) {
      return res.status(404).json({
        success: false,
        message: 'Weather data not available for this location'
      });
    }
    
    res.json({
      success: true,
      data: {
        location: locationId,
        current: currentWeather,
        forecast,
        allLocations: weatherData,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error getting weather forecast:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving weather forecast'
    });
  }
});

// @route   GET /api/forecast/solar
// @desc    Get solar generation forecast
// @access  Private
router.get('/solar', auth, async (req, res) => {
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
    const currentHour = new Date().getHours();
    
    for (let i = 0; i < Math.min(forecast.length, parseInt(hours)); i++) {
      const hourData = forecast[i];
      const solarForecast = await MLService.forecastSolarGeneration(
        hourData,
        hourData.hour,
        'summer' // Simplified - would be calculated based on date
      );
      
      // Calculate solar irradiance
      const irradiance = WeatherService.calculateSolarIrradiance(
        hourData,
        hourData.hour,
        new Date().getDay()
      );
      
      solarForecasts.push({
        hour: hourData.hour,
        timestamp: hourData.timestamp,
        predictedGeneration: solarForecast.predictedGeneration,
        confidence: solarForecast.confidence,
        irradiance: irradiance.irradiance,
        weather: {
          temperature: hourData.temperature,
          cloudCover: hourData.cloudCover,
          humidity: hourData.humidity,
          windSpeed: hourData.windSpeed
        },
        factors: solarForecast.factors
      });
    }
    
    res.json({
      success: true,
      data: {
        location: locationId,
        forecasts: solarForecasts,
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

// @route   GET /api/forecast/load
// @desc    Get load forecast
// @access  Private
router.get('/load', auth, async (req, res) => {
  try {
    const { householdId, hours = 24 } = req.query;
    
    if (!householdId) {
      return res.status(400).json({
        success: false,
        message: 'Household ID is required'
      });
    }
    
    // Generate historical data for forecasting
    const historicalData = Array.from({ length: 168 }, (_, i) => ({
      load: 3.0 + Math.sin((i / 24) * Math.PI) * 1.5 + Math.random() * 0.5,
      timestamp: new Date(Date.now() - (168 - i) * 60 * 60 * 1000)
    }));
    
    const loadForecasts = [];
    const currentHour = new Date().getHours();
    const dayOfWeek = new Date().getDay();
    
    for (let i = 0; i < parseInt(hours); i++) {
      const hour = (currentHour + i) % 24;
      
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

// @route   GET /api/forecast/pricing
// @desc    Get energy pricing forecast
// @access  Private
router.get('/pricing', auth, async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    
    const pricingForecasts = [];
    const currentHour = new Date().getHours();
    
    // Simulate grid conditions
    const baseLoad = 50.0;
    const baseSupply = 60.0;
    
    for (let i = 0; i < parseInt(hours); i++) {
      const hour = (currentHour + i) % 24;
      
      // Simulate varying grid conditions
      const loadVariation = 1 + Math.sin((hour - 6) * Math.PI / 12) * 0.3;
      const supplyVariation = 1 + Math.sin((hour - 12) * Math.PI / 12) * 0.2;
      
      const gridLoad = baseLoad * loadVariation;
      const demand = gridLoad;
      const supply = baseSupply * supplyVariation;
      
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
        gridLoad: Math.round(gridLoad * 100) / 100,
        supply: Math.round(supply * 100) / 100,
        demand: Math.round(demand * 100) / 100,
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

// @route   GET /api/forecast/combined
// @desc    Get combined forecast (solar, load, pricing)
// @access  Private
router.get('/combined', auth, async (req, res) => {
  try {
    const { householdId, locationId = 'location-1', hours = 24 } = req.query;
    
    if (!householdId) {
      return res.status(400).json({
        success: false,
        message: 'Household ID is required'
      });
    }
    
    const weatherData = WeatherService.getCurrentWeather(locationId);
    const weatherForecast = WeatherService.getWeatherForecast(locationId, parseInt(hours));
    
    if (!weatherData || !weatherForecast) {
      return res.status(404).json({
        success: false,
        message: 'Weather data not available'
      });
    }
    
    const combinedForecasts = [];
    const currentHour = new Date().getHours();
    const dayOfWeek = new Date().getDay();
    
    // Generate historical data for load forecasting
    const historicalData = Array.from({ length: 168 }, (_, i) => ({
      load: 3.0 + Math.sin((i / 24) * Math.PI) * 1.5 + Math.random() * 0.5,
      timestamp: new Date(Date.now() - (168 - i) * 60 * 60 * 1000)
    }));
    
    for (let i = 0; i < Math.min(weatherForecast.length, parseInt(hours)); i++) {
      const hourData = weatherForecast[i];
      const hour = hourData.hour;
      
      // Solar forecast
      const solarForecast = await MLService.forecastSolarGeneration(
        hourData,
        hour,
        'summer'
      );
      
      // Load forecast
      const loadForecast = await MLService.forecastLoad(
        householdId,
        historicalData,
        hour,
        dayOfWeek
      );
      
      // Pricing forecast
      const gridLoad = 50.0 * (1 + Math.sin((hour - 6) * Math.PI / 12) * 0.3);
      const demand = gridLoad;
      const supply = 60.0 * (1 + Math.sin((hour - 12) * Math.PI / 12) * 0.2);
      
      const pricingForecast = await MLService.calculateDynamicPricing(
        gridLoad,
        demand,
        supply,
        hour
      );
      
      // Calculate net energy (generation - load)
      const netEnergy = solarForecast.predictedGeneration - loadForecast.predictedLoad;
      
      combinedForecasts.push({
        hour,
        timestamp: hourData.timestamp,
        solar: {
          predictedGeneration: solarForecast.predictedGeneration,
          confidence: solarForecast.confidence
        },
        load: {
          predictedLoad: loadForecast.predictedLoad,
          confidence: loadForecast.confidence
        },
        pricing: {
          pricePerKWh: pricingForecast.pricePerKWh
        },
        netEnergy: Math.round(netEnergy * 100) / 100,
        weather: {
          temperature: hourData.temperature,
          cloudCover: hourData.cloudCover,
          humidity: hourData.humidity,
          windSpeed: hourData.windSpeed
        },
        recommendation: this.getEnergyRecommendation(netEnergy, pricingForecast.pricePerKWh)
      });
    }
    
    res.json({
      success: true,
      data: {
        householdId,
        location: locationId,
        forecasts: combinedForecasts,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error getting combined forecast:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating combined forecast'
    });
  }
});

// @route   GET /api/forecast/anomalies
// @desc    Detect anomalies in energy data
// @access  Private
router.get('/anomalies', auth, async (req, res) => {
  try {
    const { householdId, hours = 24 } = req.query;
    
    // Generate sample data with some anomalies
    const sampleData = Array.from({ length: parseInt(hours) }, (_, i) => {
      const baseValue = 3.0 + Math.sin((i / 24) * Math.PI) * 1.5;
      const anomaly = Math.random() < 0.1 ? (Math.random() - 0.5) * 10 : 0; // 10% chance of anomaly
      
      return {
        value: baseValue + anomaly + Math.random() * 0.5,
        timestamp: new Date(Date.now() - (parseInt(hours) - i) * 60 * 60 * 1000)
      };
    });
    
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

// Helper function for energy recommendations
function getEnergyRecommendation(netEnergy, pricePerKWh) {
  if (netEnergy > 2.0) {
    return {
      action: 'sell',
      message: 'High surplus energy - consider selling to neighbors',
      priority: 'high',
      estimatedValue: Math.round(netEnergy * pricePerKWh * 100) / 100
    };
  } else if (netEnergy > 0.5) {
    return {
      action: 'store',
      message: 'Moderate surplus - store in battery for later use',
      priority: 'medium',
      estimatedValue: Math.round(netEnergy * pricePerKWh * 100) / 100
    };
  } else if (netEnergy < -2.0) {
    return {
      action: 'buy',
      message: 'High energy deficit - consider buying from neighbors',
      priority: 'high',
      estimatedCost: Math.round(Math.abs(netEnergy) * pricePerKWh * 100) / 100
    };
  } else if (netEnergy < -0.5) {
    return {
      action: 'conserve',
      message: 'Moderate deficit - consider reducing non-essential loads',
      priority: 'medium',
      estimatedCost: Math.round(Math.abs(netEnergy) * pricePerKWh * 100) / 100
    };
  } else {
    return {
      action: 'maintain',
      message: 'Energy balance is good - maintain current consumption',
      priority: 'low'
    };
  }
}

module.exports = router;
