// backend/models/expenseModel.js
const { pool } = require('../config/db');

const expenseModel = {
  async create({ userId, category_id, amount, date, vendor, description, status = 'confirmed' }) {
    const [result] = await pool.query(
      'INSERT INTO expenses (user_id, category_id, amount, date, vendor, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, category_id, amount, date, vendor, description, status]
    );
    return { id: result.insertId, user_id: userId, category_id, amount, date, vendor, description, status };
  },

  // --- THIS IS THE UPDATED FUNCTION ---
  async findByUserId(userId, { startDate, endDate, categoryIds, limit }, status = 'confirmed') {
    let query = `
      SELECT e.*, c.name as category_name, c.color as category_color 
      FROM expenses e
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.user_id = ? AND e.status = ?
    `;
    const params = [userId, status];
    
    if (startDate && endDate) {
      query += ' AND e.date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    if (categoryIds && categoryIds.length > 0) {
      const placeholders = categoryIds.map(() => '?').join(',');
      query += ` AND e.category_id IN (${placeholders})`;
      params.push(...categoryIds);
    }

    query += ' ORDER BY e.date DESC, e.id DESC';
    
    // Add the LIMIT clause if provided
    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit, 10)); // Ensure it's an integer
    }
    // --- END OF UPDATE ---

    const [rows] = await pool.query(query, params);
    return rows;
  },

  async findByIdAndUserId(id, userId) {
    const [rows] = await pool.query(`
      SELECT e.*, c.name as category_name, c.color as category_color 
      FROM expenses e
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.id = ? AND e.user_id = ?
    `, [id, userId]);
    return rows[0];
  },

  async update(id, userId, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    if (fields.length === 0) return 0;

    const query = `UPDATE expenses SET ${setClause} WHERE id = ? AND user_id = ?`;
    const [result] = await pool.query(query, [...values, id, userId]);
    return result.affectedRows;
  },

  async delete(id, userId) {
    const [result] = await pool.query('DELETE FROM expenses WHERE id = ? AND user_id = ?', [id, userId]);
    return result.affectedRows;
  }
};

module.exports = expenseModel;