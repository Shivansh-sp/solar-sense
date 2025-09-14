const moment = require('moment');

class WeatherService {
  constructor() {
    this.weatherData = new Map();
    this.forecastData = new Map();
    this.isInitialized = false;
  }

  async initialize() {
    try {
      console.log('🌤️ Initializing Weather Service...');
      
      // Initialize with sample weather data
      this.initializeSampleWeatherData();
      
      // Start weather simulation
      this.startWeatherSimulation();
      
      this.isInitialized = true;
      console.log('✅ Weather Service initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Weather Service:', error);
      throw error;
    }
  }

  initializeSampleWeatherData() {
    const locations = [
      { id: 'location-1', name: 'Green Valley', lat: 37.7749, lon: -122.4194 },
      { id: 'location-2', name: 'Sunshine Hills', lat: 37.7849, lon: -122.4094 },
      { id: 'location-3', name: 'Eco District', lat: 37.7649, lon: -122.4294 }
    ];

    locations.forEach(location => {
      this.weatherData.set(location.id, {
        ...location,
        current: this.generateCurrentWeather(),
        forecast: this.generateForecast()
      });
    });
  }

  generateCurrentWeather() {
    const hour = new Date().getHours();
    const baseTemp = 20 + Math.sin((hour - 6) * Math.PI / 12) * 10; // Daily temperature cycle
    const cloudCover = Math.random() * 0.8 + 0.1; // 10-90% cloud cover
    const humidity = 40 + Math.random() * 40; // 40-80% humidity
    
    return {
      temperature: Math.round((baseTemp + (Math.random() - 0.5) * 4) * 10) / 10,
      cloudCover: Math.round(cloudCover * 100) / 100,
      humidity: Math.round(humidity * 10) / 10,
      windSpeed: Math.round((Math.random() * 15 + 2) * 10) / 10,
      pressure: Math.round((1013 + (Math.random() - 0.5) * 20) * 10) / 10,
      uvIndex: Math.round((10 - cloudCover * 8) * 10) / 10,
      visibility: Math.round((10 - cloudCover * 5) * 10) / 10,
      timestamp: new Date()
    };
  }

  generateForecast() {
    const forecast = [];
    const currentHour = new Date().getHours();
    
    for (let i = 0; i < 24; i++) {
      const hour = (currentHour + i) % 24;
      const baseTemp = 20 + Math.sin((hour - 6) * Math.PI / 12) * 10;
      const cloudCover = Math.random() * 0.8 + 0.1;
      
      forecast.push({
        hour: hour,
        temperature: Math.round((baseTemp + (Math.random() - 0.5) * 4) * 10) / 10,
        cloudCover: Math.round(cloudCover * 100) / 100,
        humidity: Math.round((40 + Math.random() * 40) * 10) / 10,
        windSpeed: Math.round((Math.random() * 15 + 2) * 10) / 10,
        precipitation: Math.random() < 0.2 ? Math.round(Math.random() * 5 * 10) / 10 : 0,
        timestamp: moment().add(i, 'hours').toDate()
      });
    }
    
    return forecast;
  }

  startWeatherSimulation() {
    // Update weather data every 5 minutes
    setInterval(() => {
      this.updateWeatherData();
    }, 300000);

    // Update forecast every hour
    setInterval(() => {
      this.updateForecast();
    }, 3600000);
  }

  updateWeatherData() {
    this.weatherData.forEach((location, locationId) => {
      location.current = this.generateCurrentWeather();
    });
  }

  updateForecast() {
    this.weatherData.forEach((location, locationId) => {
      location.forecast = this.generateForecast();
    });
  }

  // Get current weather for a location
  getCurrentWeather(locationId) {
    const location = this.weatherData.get(locationId);
    return location ? location.current : null;
  }

  // Get weather forecast for a location
  getWeatherForecast(locationId, hours = 24) {
    const location = this.weatherData.get(locationId);
    if (!location) return null;
    
    return location.forecast.slice(0, hours);
  }

  // Get all weather data
  getAllWeatherData() {
    const result = {};
    this.weatherData.forEach((location, locationId) => {
      result[locationId] = {
        name: location.name,
        coordinates: { lat: location.lat, lon: location.lon },
        current: location.current,
        forecast: location.forecast.slice(0, 12) // Next 12 hours
      };
    });
    return result;
  }

  // Calculate solar irradiance based on weather
  calculateSolarIrradiance(weatherData, timeOfDay, dayOfYear) {
    const { temperature, cloudCover, humidity, windSpeed } = weatherData;
    
    // Base irradiance (clear sky)
    const baseIrradiance = 1000; // W/m²
    
    // Solar angle factor (simplified)
    const solarAngle = Math.sin((timeOfDay - 6) * Math.PI / 12);
    const angleFactor = Math.max(0, solarAngle);
    
    // Cloud cover impact
    const cloudFactor = 1 - (cloudCover * 0.7);
    
    // Temperature impact (efficiency decreases with high temperature)
    const tempFactor = temperature > 25 ? 0.95 : 1.0;
    
    // Humidity impact (scattering)
    const humidityFactor = 1 - (humidity * 0.1);
    
    // Wind cooling effect (slight positive impact)
    const windFactor = 1 + (windSpeed * 0.01);
    
    const irradiance = baseIrradiance * angleFactor * cloudFactor * tempFactor * humidityFactor * windFactor;
    
    return {
      irradiance: Math.round(Math.max(0, irradiance) * 10) / 10,
      factors: {
        solarAngle: angleFactor,
        cloudCover: cloudFactor,
        temperature: tempFactor,
        humidity: humidityFactor,
        wind: windFactor
      }
    };
  }

  // Get weather impact on energy generation
  getEnergyImpact(weatherData) {
    const irradiance = this.calculateSolarIrradiance(weatherData, new Date().getHours(), moment().dayOfYear());
    
    return {
      solarEfficiency: Math.round(irradiance.irradiance / 10) / 100, // Convert to percentage
      factors: irradiance.factors,
      recommendation: this.getEnergyRecommendation(irradiance.irradiance, weatherData)
    };
  }

  getEnergyRecommendation(irradiance, weatherData) {
    if (irradiance > 800) {
      return {
        action: 'optimal',
        message: 'Excellent conditions for solar generation',
        priority: 'high'
      };
    } else if (irradiance > 600) {
      return {
        action: 'good',
        message: 'Good conditions for solar generation',
        priority: 'medium'
      };
    } else if (irradiance > 400) {
      return {
        action: 'moderate',
        message: 'Moderate solar generation expected',
        priority: 'medium'
      };
    } else {
      return {
        action: 'low',
        message: 'Low solar generation expected, consider battery usage',
        priority: 'low'
      };
    }
  }

  // Get weather alerts
  getWeatherAlerts() {
    const alerts = [];
    
    this.weatherData.forEach((location, locationId) => {
      const weather = location.current;
      
      // High wind alert
      if (weather.windSpeed > 25) {
        alerts.push({
          type: 'wind',
          severity: 'warning',
          message: `High winds detected in ${location.name}: ${weather.windSpeed} mph`,
          location: location.name,
          timestamp: new Date()
        });
      }
      
      // Low visibility alert
      if (weather.visibility < 3) {
        alerts.push({
          type: 'visibility',
          severity: 'warning',
          message: `Low visibility in ${location.name}: ${weather.visibility} miles`,
          location: location.name,
          timestamp: new Date()
        });
      }
      
      // Extreme temperature alert
      if (weather.temperature > 35 || weather.temperature < 0) {
        alerts.push({
          type: 'temperature',
          severity: 'warning',
          message: `Extreme temperature in ${location.name}: ${weather.temperature}°C`,
          location: location.name,
          timestamp: new Date()
        });
      }
    });
    
    return alerts;
  }

  // Get historical weather data (simulated)
  getHistoricalWeather(locationId, days = 7) {
    const historical = [];
    const now = moment();
    
    for (let i = days; i >= 0; i--) {
      const date = now.clone().subtract(i, 'days');
      const dayData = {
        date: date.format('YYYY-MM-DD'),
        high: Math.round((25 + Math.random() * 10) * 10) / 10,
        low: Math.round((15 + Math.random() * 5) * 10) / 10,
        averageCloudCover: Math.round((Math.random() * 0.6 + 0.2) * 100) / 100,
        averageHumidity: Math.round((50 + Math.random() * 30) * 10) / 10,
        precipitation: Math.random() < 0.3 ? Math.round(Math.random() * 10 * 10) / 10 : 0,
        windSpeed: Math.round((Math.random() * 10 + 5) * 10) / 10
      };
      historical.push(dayData);
    }
    
    return historical;
  }
}

module.exports = new WeatherService();
