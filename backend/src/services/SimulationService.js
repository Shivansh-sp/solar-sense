const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

class SimulationService {
  constructor() {
    this.simulations = new Map();
    this.devices = new Map();
    this.scenarios = new Map();
    this.isInitialized = false;
  }

  async initialize() {
    try {
      console.log('🎮 Initializing Simulation Service...');
      
      // Initialize sample devices
      this.initializeSampleDevices();
      
      // Initialize simulation scenarios
      this.initializeScenarios();
      
      this.isInitialized = true;
      console.log('✅ Simulation Service initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Simulation Service:', error);
      throw error;
    }
  }

  initializeSampleDevices() {
    const deviceTypes = [
      {
        type: 'solar_panel',
        name: 'Solar Panel Array',
        capacity: 8.5,
        efficiency: 0.22,
        status: 'active'
      },
      {
        type: 'battery',
        name: 'Lithium-Ion Battery',
        capacity: 12.0,
        efficiency: 0.95,
        status: 'active'
      },
      {
        type: 'inverter',
        name: 'Smart Inverter',
        capacity: 10.0,
        efficiency: 0.97,
        status: 'active'
      },
      {
        type: 'smart_meter',
        name: 'Smart Energy Meter',
        capacity: 0,
        efficiency: 1.0,
        status: 'active'
      },
      {
        type: 'load_controller',
        name: 'Smart Load Controller',
        capacity: 0,
        efficiency: 1.0,
        status: 'active'
      }
    ];

    deviceTypes.forEach((device, index) => {
      const deviceId = `device-${index + 1}`;
      this.devices.set(deviceId, {
        id: deviceId,
        ...device,
        currentPower: 0,
        lastUpdate: new Date(),
        parameters: this.getDeviceParameters(device.type)
      });
    });
  }

  initializeScenarios() {
    this.scenarios.set('normal_day', {
      id: 'normal_day',
      name: 'Normal Day Operation',
      description: 'Standard energy trading and consumption patterns',
      duration: 24, // hours
      parameters: {
        weatherVariation: 0.1,
        loadVariation: 0.15,
        tradingActivity: 0.8
      }
    });

    this.scenarios.set('weather_change', {
      id: 'weather_change',
      name: 'Weather Change Impact',
      description: 'Simulates impact of changing weather conditions',
      duration: 12,
      parameters: {
        weatherVariation: 0.5,
        loadVariation: 0.2,
        tradingActivity: 0.9
      }
    });

    this.scenarios.set('grid_outage', {
      id: 'grid_outage',
      name: 'Grid Outage Simulation',
      description: 'Simulates microgrid operation during grid outage',
      duration: 6,
      parameters: {
        weatherVariation: 0.2,
        loadVariation: 0.3,
        tradingActivity: 1.0,
        gridAvailable: false
      }
    });

    this.scenarios.set('peak_demand', {
      id: 'peak_demand',
      name: 'Peak Demand Period',
      description: 'High energy demand and trading activity',
      duration: 4,
      parameters: {
        weatherVariation: 0.1,
        loadVariation: 0.4,
        tradingActivity: 1.0
      }
    });
  }

  getDeviceParameters(deviceType) {
    const parameters = {
      solar_panel: {
        tiltAngle: 30,
        azimuth: 180,
        temperatureCoeff: -0.004,
        irradianceThreshold: 200
      },
      battery: {
        chargeRate: 5.0,
        dischargeRate: 5.0,
        minSOC: 0.2,
        maxSOC: 0.95,
        cycleCount: 0
      },
      inverter: {
        inputVoltage: 48,
        outputVoltage: 240,
        frequency: 60,
        powerFactor: 0.95
      },
      smart_meter: {
        measurementInterval: 1,
        dataRetention: 30,
        communicationProtocol: 'Modbus'
      },
      load_controller: {
        priorityLevels: 3,
        maxLoadReduction: 0.3,
        responseTime: 0.1
      }
    };

    return parameters[deviceType] || {};
  }

  // Start a new simulation
  async startSimulation(scenarioId, householdIds = []) {
    try {
      const scenario = this.scenarios.get(scenarioId);
      if (!scenario) {
        throw new Error(`Scenario ${scenarioId} not found`);
      }

      const simulationId = uuidv4();
      const simulation = {
        id: simulationId,
        scenarioId,
        householdIds,
        status: 'running',
        startTime: new Date(),
        endTime: moment().add(scenario.duration, 'hours').toDate(),
        currentStep: 0,
        totalSteps: scenario.duration * 60, // 1 step per minute
        data: [],
        events: []
      };

      this.simulations.set(simulationId, simulation);

      // Start simulation loop
      this.runSimulation(simulationId);

      return {
        success: true,
        simulationId,
        message: `Simulation ${scenario.name} started successfully`
      };

    } catch (error) {
      console.error('Error starting simulation:', error);
      throw error;
    }
  }

  async runSimulation(simulationId) {
    const simulation = this.simulations.get(simulationId);
    if (!simulation) return;

    const interval = setInterval(() => {
      if (simulation.status !== 'running') {
        clearInterval(interval);
        return;
      }

      if (new Date() >= simulation.endTime) {
        simulation.status = 'completed';
        clearInterval(interval);
        return;
      }

      // Run simulation step
      this.runSimulationStep(simulationId);
    }, 60000); // Run every minute
  }

  runSimulationStep(simulationId) {
    const simulation = this.simulations.get(simulationId);
    if (!simulation) return;

    const scenario = this.scenarios.get(simulation.scenarioId);
    const stepData = {
      timestamp: new Date(),
      step: simulation.currentStep,
      devices: {},
      households: {},
      grid: {},
      events: []
    };

    // Simulate device behavior
    this.devices.forEach((device, deviceId) => {
      stepData.devices[deviceId] = this.simulateDevice(device, scenario.parameters);
    });

    // Simulate household behavior
    simulation.householdIds.forEach(householdId => {
      stepData.households[householdId] = this.simulateHousehold(householdId, scenario.parameters);
    });

    // Simulate grid behavior
    stepData.grid = this.simulateGrid(scenario.parameters);

    // Add step data to simulation
    simulation.data.push(stepData);
    simulation.currentStep++;

    // Check for events
    this.checkForEvents(simulationId, stepData);
  }

  simulateDevice(device, parameters) {
    const basePower = device.capacity * 0.5; // Base at 50% capacity
    const variation = (Math.random() - 0.5) * parameters.loadVariation;
    const currentPower = Math.max(0, basePower * (1 + variation));

    device.currentPower = currentPower;
    device.lastUpdate = new Date();

    return {
      power: Math.round(currentPower * 100) / 100,
      efficiency: device.efficiency,
      status: device.status,
      parameters: device.parameters
    };
  }

  simulateHousehold(householdId, parameters) {
    // This would integrate with the MarketEngine to get real household data
    const baseLoad = 3.0 + Math.random() * 2.0; // 3-5 kW base load
    const variation = (Math.random() - 0.5) * parameters.loadVariation;
    const currentLoad = Math.max(0, baseLoad * (1 + variation));

    return {
      load: Math.round(currentLoad * 100) / 100,
      generation: Math.round((5.0 + Math.random() * 3.0) * 100) / 100,
      storage: Math.round((8.0 + Math.random() * 4.0) * 100) / 100
    };
  }

  simulateGrid(parameters) {
    const baseLoad = 50.0; // 50 kW base grid load
    const variation = (Math.random() - 0.5) * parameters.loadVariation;
    const currentLoad = Math.max(0, baseLoad * (1 + variation));

    return {
      load: Math.round(currentLoad * 100) / 100,
      frequency: 60.0 + (Math.random() - 0.5) * 0.1,
      voltage: 240.0 + (Math.random() - 0.5) * 2.0,
      stability: currentLoad > 60 ? 'warning' : 'stable'
    };
  }

  checkForEvents(simulationId, stepData) {
    const simulation = this.simulations.get(simulationId);
    if (!simulation) return;

    // Check for grid instability
    if (stepData.grid.stability === 'warning') {
      simulation.events.push({
        type: 'grid_warning',
        message: 'Grid load approaching critical levels',
        timestamp: new Date(),
        severity: 'warning'
      });
    }

    // Check for device failures
    Object.entries(stepData.devices).forEach(([deviceId, device]) => {
      if (device.power < 0.1 && device.status === 'active') {
        simulation.events.push({
          type: 'device_failure',
          message: `Device ${deviceId} power output critically low`,
          timestamp: new Date(),
          severity: 'error',
          deviceId
        });
      }
    });
  }

  // Control device
  async controlDevice(controlData) {
    try {
      const { deviceId, action, parameters } = controlData;
      const device = this.devices.get(deviceId);

      if (!device) {
        throw new Error(`Device ${deviceId} not found`);
      }

      let result = { success: true, message: 'Device controlled successfully' };

      switch (action) {
        case 'start':
          device.status = 'active';
          result.message = `Device ${deviceId} started`;
          break;

        case 'stop':
          device.status = 'inactive';
          device.currentPower = 0;
          result.message = `Device ${deviceId} stopped`;
          break;

        case 'set_power':
          if (parameters && parameters.power !== undefined) {
            device.currentPower = Math.min(parameters.power, device.capacity);
            result.message = `Device ${deviceId} power set to ${device.currentPower} kW`;
          }
          break;

        case 'set_parameters':
          if (parameters) {
            Object.assign(device.parameters, parameters);
            result.message = `Device ${deviceId} parameters updated`;
          }
          break;

        default:
          throw new Error(`Unknown action: ${action}`);
      }

      device.lastUpdate = new Date();
      this.devices.set(deviceId, device);

      return result;

    } catch (error) {
      console.error('Error controlling device:', error);
      throw error;
    }
  }

  // Get simulation data
  getSimulationData(simulationId) {
    return this.simulations.get(simulationId);
  }

  // Get all simulations
  getAllSimulations() {
    return Array.from(this.simulations.values());
  }

  // Get device data
  getDeviceData(deviceId) {
    return this.devices.get(deviceId);
  }

  // Get all devices
  getAllDevices() {
    return Array.from(this.devices.values());
  }

  // Get scenarios
  getScenarios() {
    return Array.from(this.scenarios.values());
  }

  // Stop simulation
  async stopSimulation(simulationId) {
    const simulation = this.simulations.get(simulationId);
    if (simulation) {
      simulation.status = 'stopped';
      simulation.endTime = new Date();
      return { success: true, message: 'Simulation stopped' };
    }
    throw new Error('Simulation not found');
  }

  // Get simulation statistics
  getSimulationStats(simulationId) {
    const simulation = this.simulations.get(simulationId);
    if (!simulation) return null;

    const totalSteps = simulation.data.length;
    const totalEvents = simulation.events.length;
    const avgPower = simulation.data.reduce((sum, step) => {
      const devicePower = Object.values(step.devices).reduce((s, d) => s + d.power, 0);
      return sum + devicePower;
    }, 0) / totalSteps;

    return {
      simulationId,
      status: simulation.status,
      totalSteps,
      totalEvents,
      averagePower: Math.round(avgPower * 100) / 100,
      duration: moment(simulation.endTime).diff(moment(simulation.startTime), 'minutes'),
      eventsByType: this.getEventsByType(simulation.events)
    };
  }

  getEventsByType(events) {
    const eventTypes = {};
    events.forEach(event => {
      eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
    });
    return eventTypes;
  }
}

module.exports = new SimulationService();
