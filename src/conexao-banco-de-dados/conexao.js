const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASS, 
    database: process.env.NAME,
});

module.exports = pool;