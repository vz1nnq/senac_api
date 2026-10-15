const pool = require('../config/db');

const buscarPorEmail = async (email) => {
  const sql = 'SELECT * FROM usuarios WHERE email = $1';
    const resultado = await pool.query(sql, [email]);
    return resultado.rows[0];
};

const buscarPorResetToken = async (token) => {
    const sql = `
    SELECT * FROM usuarios 
    WHERE reset_token = $1 
    AND reset_token_expires > NOW()
    `;
    const resultado = await pool.query(sql, [token]);
    return resultado.rows[0];
};

const salvarResetToken = async (id, token, expires) => {
    const sql = `
    UPDATE usuarios 
    SET reset_token = $1, reset_token_expires = $2 
    WHERE id = $3
    `;
    await pool.query(sql, [token, expires, id]);
};

const atualizarSenha = async (id, novaSenhaHash) => {
    const sql = `
    UPDATE usuarios 
    SET senha = $1, reset_token = NULL, reset_token_expires = NULL 
    WHERE id = $2
    `;
    await pool.query(sql, [novaSenhaHash, id]);
};

module.exports = {
    buscarPorEmail,
    buscarPorResetToken,
    salvarResetToken,
    atualizarSenha
};