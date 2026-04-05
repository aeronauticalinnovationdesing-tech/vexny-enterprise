require('dotenv').config();
const express = require('express');
const cors = require('cors');

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
    message: 'Drone Pilot API is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// API root
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Drone Pilot API',
    version: '1.0.0',
    status: 'running',
    environment: process.env.NODE_ENV || 'production',
    endpoints: {
      health: '/health',
      pilots: '/api/pilots',
      drones: '/api/drones',
      flights: '/api/flights',
      weather: '/api/weather',
      airspace: '/api/airspace'
    }
  });
});

// Mock endpoints - comentados hasta que BD esté configurada
app.get('/api/pilots', (req, res) => {
  res.json({
    message: 'Pilots endpoint',
    note: 'Database configuration required',
    setupGuide: 'https://github.com/aeronauticalinnovationdesing-tech/vexny-enterprise/blob/main/backend/DEPLOY_VERCEL.md'
  });
});

app.get('/api/drones', (req, res) => {
  res.json({ message: 'Drones endpoint' });
});

app.get('/api/flights', (req, res) => {
  res.json({ message: 'Flights endpoint' });
});

app.get('/api/weather/:lat/:lon', (req, res) => {
  res.json({ message: 'Weather endpoint' });
});

app.get('/api/airspace/restrictions/:lat/:lon', (req, res) => {
  res.json({ message: 'Airspace endpoint' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
    availableEndpoints: [
      '/health',
      '/api',
      '/api/pilots',
      '/api/drones',
      '/api/flights',
      '/api/weather/:lat/:lon',
      '/api/airspace/restrictions/:lat/:lon'
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

// Export for Vercel serverless functions
module.exports = app;
