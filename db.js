const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cachacaria_adm',
    password: '1234',
    port: 5432,
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
