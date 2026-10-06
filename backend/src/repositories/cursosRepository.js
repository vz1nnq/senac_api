const pool = require('../config/db');

const getAllCursos = async() => {
    const sql = 'SELECT * FROM cursos';
    const resultado = await pool.query(sql);

    return resultado.rows;
};

const getCursoByID = async(id) => {
    const sql = 'SELECT * FROM cursos WHERE id = $1';
    const resultado = await pool.query(sql, [id]);
    
    return resultado.rows[0];
};

const criarCurso = async(nome, vagas) => {
    const sql = `INSERT INTO cursos (nome, vagas) VALUES ($1, $2) RETURNING *`;
    const valores = [nome, vagas];

    const resultado = await pool.query(sql, valores);
    return resultado.rows[0];
};

const atualizarCursos = async(id, nome, vagas) => {
    const sql = `UPDATE cursos SET nome = $1, vagas = $2 WHERE id = $3 RETURNING *`;
    const valores = [nome, vagas, id];

    const resultado = await pool.query(sql, valores);
    return resultado.rows[0];
};

const deletarCurso = async(id) => {
    const sql = 'DELETE FROM cursos WHERE id = $1 RETURNING *'
    const resultado = await pool.query(sql, [id]);

    return resultado.rowCount;
};

const decrementarVaga = async(id) => {
    const sql = `UPDATE cursos SET vagas = vagas - 1 WHERE id = $1 AND vagas > 0 RETURNING *`;
    const valores = [id];

    const resultado = await pool.query(sql, valores);
    return resultado;
};


module.exports = {getAllCursos, getCursoByID, criarCurso, atualizarCursos, deletarCurso, decrementarVaga};