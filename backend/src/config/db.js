const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render-hosted PostgreSQL
  },
});

pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected Successfully!"))
  .catch(err => console.error("❌ PostgreSQL Connection Error:", err));

// Initialize database tables
const initializeDb = async () => {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, '../db/migrations/create_enrollment_tables.sql'),
      'utf8'
    );
    await pool.query(sql);
    console.log('Database tables initialized successfully');
  } catch (err) {
    console.error('Error initializing database tables:', err);
  }
};

initializeDb();

module.exports = pool;
