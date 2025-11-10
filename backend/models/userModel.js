// backend/models/userModel.js
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

const userModel = {
  // Find a user by their email address
  async findUserByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  // Find a user by their ID
  async findUserById(id) {
    const [rows] = await pool.query('SELECT id, name, email, profile_photo, theme, storage_used, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  // Create a new user
  async createUser(name, email, password) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const [userResult] = await connection.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );
      const newUserId = userResult.insertId;

      await connection.query(
        'INSERT INTO settings (user_id, upcoming_payments, dashboard_layout) VALUES (?, ?, ?)',
        [newUserId, '[]', '[]']
      );

      const defaultCategories = [
        { name: 'Food', color: '#FF6384' },
        { name: 'Transport', color: '#36A2EB' },
        { name: 'Shopping', color: '#FFCE56' },
        { name: 'Utilities', color: '#4BC0C0' },
        { name: 'Entertainment', color: '#9966FF' },
        { name: 'Uncategorized', color: '#C9CBCF' },
      ];
      const categoryQuery = 'INSERT INTO categories (user_id, name, color) VALUES ?';
      const categoryValues = defaultCategories.map(cat => [newUserId, cat.name, cat.color]);
      await connection.query(categoryQuery, [categoryValues]);
      
      await connection.commit();
      return { id: newUserId, name, email };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Update user's storage usage
  async updateUserStorage(userId, sizeChange) {
    const query = 'UPDATE users SET storage_used = storage_used + ? WHERE id = ?';
    await pool.query(query, [sizeChange, userId]);
  },

  // NEW: Update a user's name or theme
  async updateUser(userId, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    if (fields.length === 0) return 0;

    const query = `UPDATE users SET ${setClause} WHERE id = ?`;
    const [result] = await pool.query(query, [...values, userId]);
    return result.affectedRows;
  },

  // NEW: Update a user's password
  async updatePassword(userId, newPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const [result] = await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );
    return result.affectedRows;
  },
};

module.exports = userModel;