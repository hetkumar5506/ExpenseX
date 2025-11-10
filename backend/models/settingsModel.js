// backend/models/settingsModel.js
const { pool } = require('../config/db');

// A smarter, safe function to handle JSON that might already be parsed.
const safeJsonParse = (data) => {
  // 1. If it's already an object/array, just return it.
  if (typeof data === 'object' && data !== null) {
    return data;
  }

  // 2. If it's a falsy value (null, undefined, ''), return an empty array.
  if (!data) {
    return [];
  }

  // 3. If it's a string, try to parse it.
  try {
    return JSON.parse(data);
  } catch (e) {
    // If parsing fails, return an empty array as a safe fallback.
    console.error('Failed to parse JSON string:', data, e);
    return [];
  }
};


const settingsModel = {
  // Get settings for a user
  async getSettings(userId) {
    const [rows] = await pool.query('SELECT * FROM settings WHERE user_id = ?', [userId]);
    
    if (rows[0]) {
      // Use our new and improved safe parsing function
      rows[0].upcoming_payments = safeJsonParse(rows[0].upcoming_payments);
      rows[0].dashboard_layout = safeJsonParse(rows[0].dashboard_layout);
    }
    return rows[0];
  },

  // Update the upcoming_payments JSON array
  async updateUpcomingPayments(userId, paymentsArray) {
    const paymentsJson = JSON.stringify(paymentsArray);
    const [result] = await pool.query(
      'UPDATE settings SET upcoming_payments = ? WHERE user_id = ?',
      [paymentsJson, userId]
    );
    return result.affectedRows;
  }
};

module.exports = settingsModel;