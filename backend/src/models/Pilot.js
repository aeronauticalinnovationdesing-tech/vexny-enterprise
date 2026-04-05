const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Pilot {
  static async create(pilotData) {
    const {
      email,
      password,
      firstName,
      lastName,
      licenseNumber,
      licenseExpiry,
      phoneNumber,
      country,
    } = pilotData;

    const id = uuidv4();
    const createdAt = new Date();

    const query = `
      INSERT INTO pilots (
        id, email, password, first_name, last_name,
        license_number, license_expiry, phone_number,
        country, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const values = [
      id,
      email,
      password,
      firstName,
      lastName,
      licenseNumber,
      licenseExpiry,
      phoneNumber,
      country,
      createdAt,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating pilot: ${error.message}`);
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM pilots WHERE id = $1;';
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error finding pilot: ${error.message}`);
    }
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM pilots WHERE email = $1;';
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error finding pilot by email: ${error.message}`);
    }
  }

  static async update(id, updates) {
    const allowedFields = [
      'first_name',
      'last_name',
      'phone_number',
      'license_expiry',
    ];
    const setFields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        setFields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (setFields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE pilots
      SET ${setFields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING *;
    `;

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating pilot: ${error.message}`);
    }
  }

  static async getAllPilots(limit = 10, offset = 0) {
    const query = `
      SELECT id, email, first_name, last_name, license_number,
             license_expiry, country, created_at
      FROM pilots
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2;
    `;
    try {
      const result = await pool.query(query, [limit, offset]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching pilots: ${error.message}`);
    }
  }
}

module.exports = Pilot;
