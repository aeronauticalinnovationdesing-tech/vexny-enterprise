const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Flight {
  static async create(flightData) {
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
      status = 'planned',
      scheduledDate,
    } = flightData;

    const id = uuidv4();
    const createdAt = new Date();

    const query = `
      INSERT INTO flights (
        id, pilot_id, drone_id, flight_name, launch_location,
        latitude, longitude, altitude, duration, distance,
        purpose, status, scheduled_date, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;
    `;

    const values = [
      id,
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
      status,
      scheduledDate,
      createdAt,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating flight: ${error.message}`);
    }
  }

  static async findByPilotId(pilotId, limit = 20, offset = 0) {
    const query = `
      SELECT * FROM flights
      WHERE pilot_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3;
    `;
    try {
      const result = await pool.query(query, [pilotId, limit, offset]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error finding flights: ${error.message}`);
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM flights WHERE id = $1;';
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error finding flight: ${error.message}`);
    }
  }

  static async updateStatus(id, status, telemetryData = null) {
    const query = `
      UPDATE flights
      SET status = $1, telemetry_data = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *;
    `;
    try {
      const result = await pool.query(query, [
        status,
        telemetryData ? JSON.stringify(telemetryData) : null,
        id,
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating flight status: ${error.message}`);
    }
  }

  static async getFlightStatistics(pilotId) {
    const query = `
      SELECT
        COUNT(*) as total_flights,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_flights,
        AVG(EXTRACT(EPOCH FROM duration)) as avg_duration,
        SUM(distance) as total_distance,
        MAX(altitude) as max_altitude
      FROM flights
      WHERE pilot_id = $1;
    `;
    try {
      const result = await pool.query(query, [pilotId]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error getting flight statistics: ${error.message}`);
    }
  }
}

module.exports = Flight;
