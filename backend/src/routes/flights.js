const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');

// Create new flight plan
router.post('/', async (req, res) => {
  try {
    const {
      pilotId,
      droneId,
      flightName,
      launchLocation,
      latitude,
      longitude,
      altitude,
      duration,
      distance,
      purpose,
      scheduledDate,
    } = req.body;

    if (!pilotId || !droneId || !flightName || !latitude || !longitude) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const flight = await Flight.create({
      pilotId,
      droneId,
      flightName,
      launchLocation,
      latitude,
      longitude,
      altitude,
      duration,
      distance,
      purpose,
      scheduledDate,
    });

    res.status(201).json({
      message: 'Flight plan created successfully',
      flight,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all flights for a pilot
router.get('/pilot/:pilotId', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const flights = await Flight.findByPilotId(
      req.params.pilotId,
      parseInt(limit),
      parseInt(offset)
    );
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single flight
router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    res.json(flight);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update flight status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, telemetryData } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const flight = await Flight.updateStatus(req.params.id, status, telemetryData);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    res.json({
      message: 'Flight status updated',
      flight,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get flight statistics
router.get('/stats/:pilotId', async (req, res) => {
  try {
    const stats = await Flight.getFlightStatistics(req.params.pilotId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
