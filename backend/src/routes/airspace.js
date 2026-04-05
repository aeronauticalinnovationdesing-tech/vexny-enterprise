const express = require('express');
const router = express.Router();

// Mock airspace restrictions data
const airspaceRestrictions = {
  noPlyZones: [
    {
      id: 1,
      name: 'Aeropuerto Internacional',
      latitude: 40.6895,
      longitude: -74.0342,
      radius: 5000, // meters
      maxAltitude: 0,
      type: 'airport',
    },
    {
      id: 2,
      name: 'Zona Militar Restringida',
      latitude: 40.5,
      longitude: -74.0,
      radius: 3000,
      maxAltitude: 0,
      type: 'military',
    },
  ],
  restrictedAirspaces: [
    {
      id: 1,
      name: 'Clase B - Centro de Control',
      latitude: 40.7128,
      longitude: -74.006,
      radius: 15000,
      maxAltitude: 7000,
      requiresPermission: true,
    },
  ],
};

// Get airspace restrictions for location
router.get('/restrictions/:latitude/:longitude', (req, res) => {
  try {
    const { latitude, longitude } = req.params;
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    // Check for no-fly zones
    const noPlyZones = airspaceRestrictions.noPlyZones.filter((zone) => {
      const distance = calculateDistance(userLat, userLon, zone.latitude, zone.longitude);
      return distance <= zone.radius;
    });

    // Check for restricted airspaces
    const restricteds = airspaceRestrictions.restrictedAirspaces.filter((zone) => {
      const distance = calculateDistance(userLat, userLon, zone.latitude, zone.longitude);
      return distance <= zone.radius;
    });

    res.json({
      location: {
        latitude: userLat,
        longitude: userLon,
      },
      noPlyZones,
      restrictedAirspaces: restricteds,
      canFly: noPlyZones.length === 0,
      restrictions: [...noPlyZones, ...restricteds],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get nearby regulations
router.get('/regulations/:latitude/:longitude/:radius', (req, res) => {
  try {
    const { latitude, longitude, radius } = req.params;
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);
    const searchRadius = parseInt(radius);

    const allRestrictions = [
      ...airspaceRestrictions.noPlyZones,
      ...airspaceRestrictions.restrictedAirspaces,
    ];

    const nearbyRestrictions = allRestrictions
      .map((zone) => ({
        ...zone,
        distance: calculateDistance(userLat, userLon, zone.latitude, zone.longitude),
      }))
      .filter((zone) => zone.distance <= searchRadius)
      .sort((a, b) => a.distance - b.distance);

    res.json({
      location: {
        latitude: userLat,
        longitude: userLon,
      },
      searchRadius,
      nearbyRestrictions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to calculate distance between coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = router;
