const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Pilot = require('../models/Pilot');

// Register new pilot
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, licenseNumber, licenseExpiry } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if pilot exists
    const existingPilot = await Pilot.findByEmail(email);
    if (existingPilot) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create pilot
    const pilot = await Pilot.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      licenseNumber,
      licenseExpiry,
    });

    // Generate token
    const token = jwt.sign(
      { id: pilot.id, email: pilot.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      message: 'Pilot registered successfully',
      token,
      pilot: {
        id: pilot.id,
        email: pilot.email,
        firstName: pilot.first_name,
        lastName: pilot.last_name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login pilot
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const pilot = await Pilot.findByEmail(email);
    if (!pilot) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, pilot.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: pilot.id, email: pilot.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: 'Login successful',
      token,
      pilot: {
        id: pilot.id,
        email: pilot.email,
        firstName: pilot.first_name,
        lastName: pilot.last_name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pilot profile
router.get('/profile/:id', async (req, res) => {
  try {
    const pilot = await Pilot.findById(req.params.id);
    if (!pilot) {
      return res.status(404).json({ error: 'Pilot not found' });
    }

    res.json({
      id: pilot.id,
      email: pilot.email,
      firstName: pilot.first_name,
      lastName: pilot.last_name,
      licenseNumber: pilot.license_number,
      licenseExpiry: pilot.license_expiry,
      phoneNumber: pilot.phone_number,
      country: pilot.country,
      createdAt: pilot.created_at,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update pilot profile
router.put('/profile/:id', async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, licenseExpiry } = req.body;

    const updates = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      license_expiry: licenseExpiry,
    };

    const updatedPilot = await Pilot.update(req.params.id, updates);
    if (!updatedPilot) {
      return res.status(404).json({ error: 'Pilot not found' });
    }

    res.json({
      message: 'Pilot profile updated',
      pilot: updatedPilot,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
