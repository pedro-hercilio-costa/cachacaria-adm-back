require('dotenv').config();
console.log('DATABASE_URL carregada:', process.env.DATABASE_URL);
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // necessário para o Railway funcionar
  },
  max: 20,
  idleTimeoutMillis: 50000,
  connectionTimeoutMillis: 5000,
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on PostgreSQL client', err);
  process.exit(-1);
});

module.exports = pool;
