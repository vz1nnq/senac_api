const pool = require('../config/db');

const getAllCursos = async() => {
    const sql = 'SELECT * FROM cursos';
    const resultado = await pool.query(sql);

    return resultado.rows;
};

const getCursoByID = async(id) => {
    const sql = 'SELECT * FROM cursos WHERE id = $1';
    const valores = [id];

    const resultado = await pool.query(sql, valores);
    return resultado.rows[0];
};

const criarCurso = async(nome, vagas) => {
    const sql = `INSERT INTO cursos (nome, vagas) VALUES ($1, $2) RETURNING *`;
    const valores = [nome, vagas];

    const resultado = await pool.query(sql, valores);
    return resultado.rows[0];
};

const decrementarVaga = async(id) => {
    const sql = `UPDATE cursos SET vagas = - 1 WHERE id = $1 AND vagas > 0 RETURNING *`;
    const valores = [id];

    const resultado = await pool.query(sql, valores);
    return resultado;
};


module.exports = {getAllCursos, getCursoByID, criarCurso, decrementarVaga};