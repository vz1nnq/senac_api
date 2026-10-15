const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const UsuariosRepository = require('../repositories/usuariosRepository');

// Configuração do transporter (Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
    }
});

const login = async (req, res) => {
    try {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
    }

    const usuario = await UsuariosRepository.buscarPorEmail(email);

    if (!usuario) {
        return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
        return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );

    return res.status(200).json({
        token,
        usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome
        }
    });
    } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro interno' });
    }
};

const forgotPassword = async (req, res) => {
    try {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ mensagem: 'Email é obrigatório' });
    }

    const frontUrl = process.env.FRONT_URL?.trim().replace(/\/+$/, '');
    if (!frontUrl) {
        return res.status(500).json({ mensagem: 'URL do frontend não configurada. Defina FRONT_URL no arquivo .env.' });
    }

    let resetUrl;
    try {
        resetUrl = new URL('reset-password.html', `${frontUrl}/`);
        if (!['http:', 'https:'].includes(resetUrl.protocol)) {
            throw new Error('FRONT_URL deve usar HTTP ou HTTPS');
        }
    } catch {
        return res.status(500).json({ mensagem: 'FRONT_URL inválida. Use o endereço HTTP ou HTTPS do frontend.' });
    }

    const usuario = await UsuariosRepository.buscarPorEmail(email);

    // Por segurança, sempre respondemos a mesma mensagem
    // (não revelamos se o email existe ou não)
    if (!usuario) {
        return res.status(200).json({
        mensagem: 'Se o email existir, você receberá um link de recuperação'
        });
    }

    // Gera token aleatório
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await UsuariosRepository.salvarResetToken(usuario.id, resetToken, expires);

    resetUrl.searchParams.set('token', resetToken);
    const resetLink = resetUrl.toString();

    // Envia o email
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: usuario.email,
        subject: 'Recuperação de senha - Painel gestão escolar',
        html: `
        <h2>Recuperação de senha</h2>
        <p>Você solicitou a redefinição da sua senha.</p>
        <p>Clique no link abaixo para criar uma nova senha (válido por 1 hora):</p>
        <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;">
            Redefinir senha
        </a>
        <p>Ou copie e cole este link no navegador:</p>
        <p>${resetLink}</p>
        <p>Se você não solicitou isso, ignore este email.</p>
        `
    });

    return res.status(200).json({
        mensagem: 'Se o email existir, você receberá um link de recuperação'
    });
    } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro ao enviar email de recuperação' });
    }
};

const resetPassword = async (req, res) => {
    try {
    const { token, novaSenha } = req.body;

    if (!token || !novaSenha) {
        return res.status(400).json({ mensagem: 'Token e nova senha são obrigatórios' });
    }

    if (novaSenha.length < 6) {
        return res.status(400).json({ mensagem: 'A senha deve ter pelo menos 6 caracteres' });
    }

    const usuario = await UsuariosRepository.buscarPorResetToken(token);

    if (!usuario) {
        return res.status(400).json({ mensagem: 'Token inválido ou expirado' });
    }

    const hash = await bcrypt.hash(novaSenha, 10);
    await UsuariosRepository.atualizarSenha(usuario.id, hash);

    return res.status(200).json({ mensagem: 'Senha alterada com sucesso' });
    } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro interno' });
    }
};

module.exports = { login, forgotPassword, resetPassword };