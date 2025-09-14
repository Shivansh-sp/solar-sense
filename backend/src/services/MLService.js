const { Matrix } = require('ml-matrix');
const { SimpleLinearRegression, PolynomialRegression } = require('ml-regression');
const moment = require('moment');

class MLService {
  constructor() {
    this.solarModel = null;
    this.loadModel = null;
    this.weatherModel = null;
    this.pricingModel = null;
    this.isInitialized = false;
    this.trainingData = {
      solar: [],
      load: [],
      weather: [],
      pricing: []
    };
  }

  async initialize() {
    try {
      console.log('🤖 Initializing ML Service...');
      
      // Initialize models with dummy data to prevent errors
      const dummyX = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const dummyY = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

      // Solar generation forecasting model
      this.solarModel = new SimpleLinearRegression(dummyX, dummyY);
      
      // Load forecasting model
      this.loadModel = new SimpleLinearRegression(dummyX, dummyY);
      
      // Weather impact model
      this.weatherModel = new SimpleLinearRegression(dummyX, dummyY);
      
      // Dynamic pricing model
      this.pricingModel = new SimpleLinearRegression(dummyX, dummyY);

      this.isInitialized = true;
      console.log('✅ ML Service initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing ML Service:', error);
      throw error;
    }
  }

  // Solar generation forecasting
  async forecastSolarGeneration(weatherData, timeOfDay, season) {
    if (!this.isInitialized) {
      throw new Error('ML Service not initialized');
    }

    try {
      // Extract features
      const features = [
        weatherData.temperature || 20,
        weatherData.cloudCover || 0.3,
        weatherData.humidity || 50,
        timeOfDay / 24, // Normalized time of day
        this.getSeasonFactor(season)
      ];

      // Use the model to predict (simplified for demo)
      const prediction = this.solarModel.predict(features[0]);
      
      // Apply weather impact
      const weatherFactor = this.calculateWeatherImpact(weatherData);
      const finalPrediction = Math.max(0, prediction * weatherFactor);

      return {
        predictedGeneration: Math.round(finalPrediction * 100) / 100, // kW
        confidence: this.calculateConfidence(weatherData),
        factors: {
          weather: weatherFactor,
          timeOfDay: timeOfDay / 24,
          season: season
        }
      };
    } catch (error) {
      console.error('Error in solar forecasting:', error);
      throw error;
    }
  }

  // Load forecasting
  async forecastLoad(householdId, historicalData, timeOfDay, dayOfWeek) {
    if (!this.isInitialized) {
      throw new Error('ML Service not initialized');
    }

    try {
      // Extract features from historical data
      const avgLoad = historicalData.reduce((sum, data) => sum + data.load, 0) / historicalData.length;
      const timeFactor = this.getTimeFactor(timeOfDay);
      const dayFactor = this.getDayFactor(dayOfWeek);
      
      // Use the model to predict
      const prediction = this.loadModel.predict(avgLoad);
      
      // Apply time and day factors
      const finalPrediction = prediction * timeFactor * dayFactor;

      return {
        predictedLoad: Math.round(finalPrediction * 100) / 100, // kW
        confidence: 0.85,
        factors: {
          historicalAverage: avgLoad,
          timeOfDay: timeFactor,
          dayOfWeek: dayFactor
        }
      };
    } catch (error) {
      console.error('Error in load forecasting:', error);
      throw error;
    }
  }

  // Dynamic pricing calculation
  async calculateDynamicPricing(gridLoad, demand, supply, timeOfDay) {
    if (!this.isInitialized) {
      throw new Error('ML Service not initialized');
    }

    try {
      const basePrice = 0.12; // $0.12/kWh base price
      const loadFactor = gridLoad / 100; // Normalized grid load
      const supplyDemandRatio = supply / Math.max(demand, 1);
      
      // Calculate price multiplier
      const priceMultiplier = this.pricingModel.predict(loadFactor);
      const finalPrice = basePrice * priceMultiplier * (2 - supplyDemandRatio);

      return {
        pricePerKWh: Math.round(finalPrice * 1000) / 1000, // $/kWh
        factors: {
          gridLoad: loadFactor,
          supplyDemandRatio: supplyDemandRatio,
          timeOfDay: timeOfDay / 24
        }
      };
    } catch (error) {
      console.error('Error in pricing calculation:', error);
      throw error;
    }
  }

  // Anomaly detection
  async detectAnomalies(data) {
    if (!this.isInitialized) {
      throw new Error('ML Service not initialized');
    }

    try {
      const anomalies = [];
      const threshold = 2.5; // Standard deviations

      // Simple statistical anomaly detection
      const values = data.map(d => d.value);
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);

      data.forEach((point, index) => {
        const zScore = Math.abs((point.value - mean) / stdDev);
        if (zScore > threshold) {
          anomalies.push({
            index,
            value: point.value,
            zScore,
            timestamp: point.timestamp
          });
        }
      });

      return {
        anomalies,
        anomalyCount: anomalies.length,
        severity: anomalies.length > 5 ? 'high' : anomalies.length > 2 ? 'medium' : 'low'
      };
    } catch (error) {
      console.error('Error in anomaly detection:', error);
      throw error;
    }
  }

  // Helper methods
  getSeasonFactor(season) {
    const factors = {
      'spring': 0.8,
      'summer': 1.2,
      'autumn': 0.7,
      'winter': 0.5
    };
    return factors[season] || 1.0;
  }

  getTimeFactor(timeOfDay) {
    // Peak hours have higher load
    if (timeOfDay >= 6 && timeOfDay <= 9) return 1.3; // Morning peak
    if (timeOfDay >= 17 && timeOfDay <= 21) return 1.4; // Evening peak
    if (timeOfDay >= 22 || timeOfDay <= 5) return 0.6; // Night
    return 1.0; // Daytime
  }

  getDayFactor(dayOfWeek) {
    // Weekends typically have different load patterns
    return dayOfWeek === 0 || dayOfWeek === 6 ? 0.9 : 1.1;
  }

  calculateWeatherImpact(weatherData) {
    const cloudCover = weatherData.cloudCover || 0.3;
    const temperature = weatherData.temperature || 20;
    const humidity = weatherData.humidity || 50;
    
    // Solar generation decreases with cloud cover
    const cloudFactor = 1 - (cloudCover * 0.6);
    
    // Temperature affects efficiency
    const tempFactor = temperature > 25 ? 0.95 : 1.0;
    
    // Humidity affects air clarity
    const humidityFactor = 1 - (humidity * 0.1);
    
    return Math.max(0.1, cloudFactor * tempFactor * humidityFactor);
  }

  calculateConfidence(weatherData) {
    // Confidence based on weather data completeness and consistency
    const dataCompleteness = Object.keys(weatherData).length / 3; // Assuming 3 key weather factors
    const baseConfidence = 0.7;
    return Math.min(0.95, baseConfidence + (dataCompleteness * 0.2));
  }

  // Training methods (for future enhancement)
  async trainSolarModel(trainingData) {
    try {
      const X = trainingData.map(d => [d.temperature, d.cloudCover, d.humidity, d.timeOfDay]);
      const y = trainingData.map(d => d.solarGeneration);
      
      this.solarModel = new SimpleLinearRegression(X, y);
      console.log('Solar model retrained successfully');
    } catch (error) {
      console.error('Error training solar model:', error);
      throw error;
    }
  }

  async trainLoadModel(trainingData) {
    try {
      const X = trainingData.map(d => [d.historicalLoad, d.timeOfDay, d.dayOfWeek]);
      const y = trainingData.map(d => d.actualLoad);
      
      this.loadModel = new SimpleLinearRegression(X, y);
      console.log('Load model retrained successfully');
    } catch (error) {
      console.error('Error training load model:', error);
      throw error;
    }
  }
}

module.exports = new MLService();
