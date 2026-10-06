const pool = require('../config/db');

const getAllTurmas = async() => {
    const sql = `
        SELECT 
            turmas.id,
            alunos.nome AS aluno,
            cursos.nome As curso,
            turmas.data_matricula
        FROM turmas
        INNER JOIN alunos ON turmas.aluno_id = alunos.id
        INNER JOIN cursos ON turmas.curso_id = cursos.id
        ORDER BY turmas.id
    `;
    const resultado = await pool.query(sql);

    return resultado.rows;
};

const getTurmaByID = async(id) => {
    const sql = `
        SELECT 
            turmas.id,
            alunos.nome AS aluno,
            cursos.nome As curso,
            turmas.data_matricula
        FROM turmas
        INNER JOIN alunos ON turmas.aluno_id = alunos.id
        INNER JOIN cursos ON turmas.curso_id = cursos.id
        WHERE turmas.id = $1
    `;
    const valores = [id];

    const resultado = await pool.query(sql, valores);
    return resultado.rows[0];
};

const matricularAluno = async(aluno_id, curso_id) => {
    const sql = 'INSERT INTO turmas (aluno_id, curso_id) VALUES ($1, $2) RETURNING *';
    const valores = [aluno_id, curso_id];

    const resultado = await pool.query(sql, valores);
    return resultado.rows[0];
};

module.exports = {getAllTurmas, getTurmaByID, matricularAluno};