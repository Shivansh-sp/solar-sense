const express = require('express');
const { auth } = require('../middleware/auth');
const SimulationService = require('../services/SimulationService');

const router = express.Router();

// @route   GET /api/device/all
// @desc    Get all devices
// @access  Private
router.get('/all', auth, (req, res) => {
  try {
    const devices = SimulationService.getAllDevices();
    
    res.json({
      success: true,
      data: devices
    });
  } catch (error) {
    console.error('Error getting devices:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving devices'
    });
  }
});

// @route   GET /api/device/:id
// @desc    Get specific device
// @access  Private
router.get('/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    const device = SimulationService.getDeviceData(id);
    
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }
    
    res.json({
      success: true,
      data: device
    });
  } catch (error) {
    console.error('Error getting device:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving device'
    });
  }
});

// @route   POST /api/device/:id/control
// @desc    Control device
// @access  Private
router.post('/:id/control', auth, (req, res) => {
  try {
    const { id } = req.params;
    const { action, parameters } = req.body;
    
    if (!action) {
      return res.status(400).json({
        success: false,
        message: 'Action is required'
      });
    }
    
    const controlData = {
      deviceId: id,
      action,
      parameters: parameters || {}
    };
    
    SimulationService.controlDevice(controlData)
      .then(result => {
        res.json({
          success: true,
          data: result
        });
      })
      .catch(error => {
        res.status(400).json({
          success: false,
          message: error.message
        });
      });
      
  } catch (error) {
    console.error('Error controlling device:', error);
    res.status(500).json({
      success: false,
      message: 'Error controlling device'
    });
  }
});

// @route   GET /api/device/type/:type
// @desc    Get devices by type
// @access  Private
router.get('/type/:type', auth, (req, res) => {
  try {
    const { type } = req.params;
    const allDevices = SimulationService.getAllDevices();
    
    const devicesByType = allDevices.filter(device => device.type === type);
    
    res.json({
      success: true,
      data: devicesByType
    });
  } catch (error) {
    console.error('Error getting devices by type:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving devices by type'
    });
  }
});

// @route   GET /api/device/status/active
// @desc    Get active devices
// @access  Private
router.get('/status/active', auth, (req, res) => {
  try {
    const allDevices = SimulationService.getAllDevices();
    const activeDevices = allDevices.filter(device => device.status === 'active');
    
    res.json({
      success: true,
      data: activeDevices
    });
  } catch (error) {
    console.error('Error getting active devices:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving active devices'
    });
  }
});

// @route   POST /api/device/batch-control
// @desc    Control multiple devices
// @access  Private
router.post('/batch-control', auth, (req, res) => {
  try {
    const { devices } = req.body;
    
    if (!Array.isArray(devices) || devices.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Devices array is required'
      });
    }
    
    const controlPromises = devices.map(deviceControl => {
      return SimulationService.controlDevice(deviceControl);
    });
    
    Promise.all(controlPromises)
      .then(results => {
        res.json({
          success: true,
          data: results
        });
      })
      .catch(error => {
        res.status(400).json({
          success: false,
          message: error.message
        });
      });
      
  } catch (error) {
    console.error('Error in batch control:', error);
    res.status(500).json({
      success: false,
      message: 'Error controlling devices'
    });
  }
});

// @route   GET /api/device/statistics
// @desc    Get device statistics
// @access  Private
router.get('/statistics', auth, (req, res) => {
  try {
    const allDevices = SimulationService.getAllDevices();
    
    const statistics = {
      totalDevices: allDevices.length,
      activeDevices: allDevices.filter(d => d.status === 'active').length,
      inactiveDevices: allDevices.filter(d => d.status === 'inactive').length,
      deviceTypes: {},
      totalCapacity: 0,
      totalCurrentPower: 0,
      averageEfficiency: 0
    };
    
    allDevices.forEach(device => {
      // Count by type
      statistics.deviceTypes[device.type] = (statistics.deviceTypes[device.type] || 0) + 1;
      
      // Sum capacities and power
      statistics.totalCapacity += device.capacity;
      statistics.totalCurrentPower += device.currentPower;
    });
    
    // Calculate average efficiency
    statistics.averageEfficiency = allDevices.length > 0 
      ? allDevices.reduce((sum, d) => sum + d.efficiency, 0) / allDevices.length 
      : 0;
    
    // Round values
    statistics.totalCapacity = Math.round(statistics.totalCapacity * 100) / 100;
    statistics.totalCurrentPower = Math.round(statistics.totalCurrentPower * 100) / 100;
    statistics.averageEfficiency = Math.round(statistics.averageEfficiency * 1000) / 1000;
    
    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Error getting device statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving device statistics'
    });
  }
});

// @route   POST /api/device/:id/parameters
// @desc    Update device parameters
// @access  Private
router.post('/:id/parameters', auth, (req, res) => {
  try {
    const { id } = req.params;
    const { parameters } = req.body;
    
    if (!parameters || typeof parameters !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Parameters object is required'
      });
    }
    
    const controlData = {
      deviceId: id,
      action: 'set_parameters',
      parameters
    };
    
    SimulationService.controlDevice(controlData)
      .then(result => {
        res.json({
          success: true,
          data: result
        });
      })
      .catch(error => {
        res.status(400).json({
          success: false,
          message: error.message
        });
      });
      
  } catch (error) {
    console.error('Error updating device parameters:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating device parameters'
    });
  }
});

// @route   GET /api/device/:id/history
// @desc    Get device operation history
// @access  Private
router.get('/:id/history', auth, (req, res) => {
  try {
    const { id } = req.params;
    const { hours = 24 } = req.query;
    
    const device = SimulationService.getDeviceData(id);
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }
    
    // Generate sample history data
    const history = Array.from({ length: parseInt(hours) }, (_, i) => {
      const timestamp = new Date(Date.now() - (parseInt(hours) - i) * 60 * 60 * 1000);
      const basePower = device.capacity * 0.5;
      const variation = (Math.random() - 0.5) * 0.3;
      const power = Math.max(0, basePower * (1 + variation));
      
      return {
        timestamp,
        power: Math.round(power * 100) / 100,
        efficiency: device.efficiency + (Math.random() - 0.5) * 0.05,
        status: device.status,
        temperature: 25 + Math.random() * 10, // Simulated temperature
        voltage: 240 + (Math.random() - 0.5) * 5 // Simulated voltage
      };
    });
    
    res.json({
      success: true,
      data: {
        deviceId: id,
        history,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error getting device history:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving device history'
    });
  }
});

module.exports = router;
