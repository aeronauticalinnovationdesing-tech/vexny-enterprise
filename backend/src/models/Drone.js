const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Drone {
  static async create(droneData) {
    const {
      pilotId,
      manufacturer,
      model,
      serialNumber,
      maxAltitude,
      maxDistance,
      batteryLife,
      weight,
      status = 'active',
    } = droneData;

    const id = uuidv4();
    const createdAt = new Date();

    const query = `
      INSERT INTO drones (
        id, pilot_id, manufacturer, model, serial_number,
        max_altitude, max_distance, battery_life, weight,
        status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;

    const values = [
      id,
      pilotId,
      manufacturer,
      model,
      serialNumber,
      maxAltitude,
      maxDistance,
      batteryLife,
      weight,
      status,
      createdAt,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating drone: ${error.message}`);
    }
  }

  static async findByPilotId(pilotId) {
    const query = 'SELECT * FROM drones WHERE pilot_id = $1 ORDER BY created_at DESC;';
    try {
      const result = await pool.query(query, [pilotId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error finding drones: ${error.message}`);
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM drones WHERE id = $1;';
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error finding drone: ${error.message}`);
    }
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE drones
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    try {
      const result = await pool.query(query, [status, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating drone status: ${error.message}`);
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM drones WHERE id = $1 RETURNING *;';
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting drone: ${error.message}`);
    }
  }
}

module.exports = Drone;
