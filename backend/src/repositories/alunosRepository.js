const pool = require('../config/db');

const getAllAlunos = async() => {
    const sql = 'SELECT * FROM  alunos';
    const resultado = await pool.query(sql);

    return resultado.rows;
};

const criarAlunos = async(nome, email) => {
    const sql = `INSERT INTO alunos (nome, email) VALUES ($1, $2) RETURNING *`;
    const valores = [nome, email];

    const resultado = await pool.query(sql, valores);
    return resultado.rows[0];
};

module.exports = {getAllAlunos, criarAlunos};