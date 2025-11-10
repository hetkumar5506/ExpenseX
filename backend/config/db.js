// backend/config/db.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const checkConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL Connected successfully.');
    connection.release();
  } catch (err) {
    console.error('Error connecting to MySQL:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = { pool, checkConnection };