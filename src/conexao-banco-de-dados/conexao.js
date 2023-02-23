const { Pool } = require('pg');

//2º PASSO: criar o metodo pool
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'ed546813', // verificar a senha
    database: 'dindin'// preencher o nome do banco de dados
});

module.exports = pool;