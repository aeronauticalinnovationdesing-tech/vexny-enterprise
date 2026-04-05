const express = require('express');
const router = express.Router();
const Drone = require('../models/Drone');

// Create new drone
router.post('/', async (req, res) => {
  try {
    const {
      pilotId,
      manufacturer,
      model,
      serialNumber,
      maxAltitude,
      maxDistance,
      batteryLife,
      weight,
    } = req.body;

    if (!pilotId || !manufacturer || !model || !serialNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const drone = await Drone.create({
      pilotId,
      manufacturer,
      model,
      serialNumber,
      maxAltitude,
      maxDistance,
      batteryLife,
      weight,
    });

    res.status(201).json({
      message: 'Drone created successfully',
      drone,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all drones for a pilot
router.get('/pilot/:pilotId', async (req, res) => {
  try {
    const drones = await Drone.findByPilotId(req.params.pilotId);
    res.json(drones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single drone
router.get('/:id', async (req, res) => {
  try {
    const drone = await Drone.findById(req.params.id);
    if (!drone) {
      return res.status(404).json({ error: 'Drone not found' });
    }
    res.json(drone);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update drone status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const drone = await Drone.updateStatus(req.params.id, status);
    if (!drone) {
      return res.status(404).json({ error: 'Drone not found' });
    }

    res.json({
      message: 'Drone status updated',
      drone,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete drone
router.delete('/:id', async (req, res) => {
  try {
    const drone = await Drone.delete(req.params.id);
    if (!drone) {
      return res.status(404).json({ error: 'Drone not found' });
    }

    res.json({
      message: 'Drone deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
