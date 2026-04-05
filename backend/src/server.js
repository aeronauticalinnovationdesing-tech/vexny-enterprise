require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/database');

// Import routes
const pilotRoutes = require('./routes/pilots');
const droneRoutes = require('./routes/drones');
const flightRoutes = require('./routes/flights');
const weatherRoutes = require('./routes/weather');
const airspaceRoutes = require('./routes/airspace');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/pilots', pilotRoutes);
app.use('/api/drones', droneRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/airspace', airspaceRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Database connection test
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
