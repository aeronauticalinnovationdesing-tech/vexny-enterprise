require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('../src/config/database');

// Import routes
const pilotRoutes = require('../src/routes/pilots');
const droneRoutes = require('../src/routes/drones');
const flightRoutes = require('../src/routes/flights');
const weatherRoutes = require('../src/routes/weather');
const airspaceRoutes = require('../src/routes/airspace');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'Server is running', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV 
  });
});

// API root
app.get('/api', (req, res) => {
  res.status(200).json({ 
    message: 'Drone Pilot API',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    endpoints: {
      auth: '/api/pilots',
      drones: '/api/drones',
      flights: '/api/flights',
      weather: '/api/weather',
      airspace: '/api/airspace'
    }
  });
});

// Routes
app.use('/api/pilots', pilotRoutes);
app.use('/api/drones', droneRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/airspace', airspaceRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method,
    availableEndpoints: [
      '/api',
      '/health',
      '/api/pilots',
      '/api/drones',
      '/api/flights',
      '/api/weather',
      '/api/airspace'
    ]
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// Database connection test (solo si DB está configurada)
if (process.env.DB_HOST) {
  pool.query('SELECT NOW()', (err, result) => {
    if (err) {
      console.warn('⚠️ Database not connected:', err.message);
    } else {
      console.log('✅ Database connected');
    }
  });
} else {
  console.log('⚠️ Database not configured - using mock data only');
}

module.exports = app;
