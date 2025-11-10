// backend/models/categoryModel.js
const { pool } = require('../config/db');

const categoryModel = {
  async create({ userId, name, color }) {
    const [result] = await pool.query(
      'INSERT INTO categories (user_id, name, color) VALUES (?, ?, ?)',
      [userId, name, color]
    );
    return { id: result.insertId, user_id: userId, name, color };
  },

  async findByUserId(userId) {
    const [rows] = await pool.query('SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC', [userId]);
    return rows;
  },

  async findByIdAndUserId(id, userId) {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ? AND user_id = ?', [id, userId]);
    return rows[0];
  },

  async update(id, userId, { name, color }) {
    const [result] = await pool.query(
      'UPDATE categories SET name = ?, color = ? WHERE id = ? AND user_id = ?',
      [name, color, id, userId]
    );
    return result.affectedRows;
  },

  async delete(id, userId) {
    // Note: The schema is set to ON DELETE SET NULL for expenses.
    // This means deleting a category will not delete the expenses, just un-link them.
    const [result] = await pool.query('DELETE FROM categories WHERE id = ? AND user_id = ?', [id, userId]);
    return result.affectedRows;
  }
};

module.exports = categoryModel;