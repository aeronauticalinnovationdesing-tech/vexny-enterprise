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
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check - debe ir antes de las rutas de API
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running', timestamp: new Date() });
});

// API root
app.get('/api', (req, res) => {
  res.status(200).json({ 
    message: 'Drone Pilot API',
    version: '1.0.0',
    endpoints: [
      '/api/pilots',
      '/api/drones',
      '/api/flights',
      '/api/weather',
      '/api/airspace'
    ]
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
    method: req.method
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Database connection test (solo si DB está configurada)
if (process.env.DB_HOST) {
  pool.query('SELECT NOW()', (err, result) => {
    if (err) {
      console.error('⚠️ Database connection error:', err.message);
    } else {
      console.log('✅ Database connected successfully');
    }
  });
}

// Start server (solo en desarrollo local)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api\n`);
  });
}

module.exports = app;
