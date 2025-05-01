const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Initialize PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render-hosted PostgreSQL
  },
});

// Define database initializer
const initializeDb = async () => {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, '../db/migrations/create_enrollment_tables.sql'),
      'utf8'
    );
    await pool.query(sql);
    console.log('✅ Database tables initialized successfully');
  } catch (err) {
    console.error('❌ Error initializing database tables:', err);
  }
};

// Only connect and initialize if NOT in test mode
if (process.env.NODE_ENV !== 'test') {
  pool.connect()
    .then(() => {
      console.log('✅ PostgreSQL Connected Successfully!');
      return initializeDb();
    })
    .catch(err => console.error('❌ PostgreSQL Connection Error:', err));
}

module.exports = pool;
