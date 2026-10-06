const pool = require('../config/db');

const getAllAlunos = async() => {
    const sql = 'SELECT * FROM  alunos';
    const resultado = await pool.query(sql);

    return resultado.rows;
};

const getAlunosByID = async(id) => {
    const sql = 'SELECT * FROM alunos WHERE id = $1';
    const resultado = await pool.query(sql, [id]);

    return resultado.rows[0];
};

const criarAlunos = async(nome, email) => {
    const sql = `INSERT INTO alunos (nome, email) VALUES ($1, $2) RETURNING *`;
    const valores = [nome, email];

    const resultado = await pool.query(sql, valores);
    return resultado.rows[0];
};

const atualizarAlunos = async(id, nome, email) => {
    const sql = 'UPDATE alunos SET nome = $1, email = $2 WHERE id = $3 RETURNING *';
    const valores = [nome, email, id]

    const resultado = await pool.query(sql, valores);
    return resultado.rows[0];
};

const deletarAluno = async(id) => {
    const sql = 'DELETE FROM alunos WHERE id = $1 RETURNING *';
    const resultado = await pool.query(sql, [id]);

    return resultado.rowCount;
};

module.exports = {getAllAlunos, getAlunosByID, criarAlunos, atualizarAlunos, deletarAluno};