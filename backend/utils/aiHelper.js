// backend/utils/aiHelper.js
const { pool } = require('../config/db');

const aiHelper = {
  /**
   * Predicts the category for a given vendor based on the user's past expenses.
   * @param {number} userId The ID of the user.
   * @param {string} vendorName The name of the vendor from OCR.
   * @returns {number|null} The predicted category ID, or the 'Uncategorized' ID, or null.
   */
  async predictCategory(userId, vendorName) {
    if (!vendorName) {
      return await this.getUncategorizedId(userId);
    }
    
    // 1. Look for the most frequent category for this exact vendor
    try {
      const query = `
        SELECT category_id, COUNT(*) as count 
        FROM expenses 
        WHERE user_id = ? AND vendor LIKE ? 
        GROUP BY category_id 
        ORDER BY count DESC 
        LIMIT 1;
      `;
      // Use LIKE to catch variations, e.g., "Starbucks" vs "Starbucks #123"
      const [rows] = await pool.query(query, [userId, `%${vendorName}%`]);

      if (rows.length > 0) {
        console.log(`[AI] Predicted category ${rows[0].category_id} for vendor "${vendorName}"`);
        return rows[0].category_id;
      }

      // 2. If no history found, fall back to the "Uncategorized" category
      console.log(`[AI] No history for vendor "${vendorName}". Falling back to Uncategorized.`);
      return await this.getUncategorizedId(userId);

    } catch (error) {
      console.error('[AI Prediction Error]', error);
      return null;
    }
  },

  /**
   * Helper to find the ID of the 'Uncategorized' category for a user.
   */
  async getUncategorizedId(userId) {
    try {
        const [rows] = await pool.query(
            "SELECT id FROM categories WHERE user_id = ? AND name = 'Uncategorized' LIMIT 1",
            [userId]
        );
        return rows.length > 0 ? rows[0].id : null;
    } catch (error) {
        console.error('[AI] Could not find Uncategorized ID.', error);
        return null;
    }
  }
};

module.exports = aiHelper;