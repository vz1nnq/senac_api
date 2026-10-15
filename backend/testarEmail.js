require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function testar() {
  try {
    // Verifica se consegue autenticar
    await transporter.verify();
    console.log('✅ Autenticação OK!');

    // Tenta enviar um email de teste
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER, // manda para você mesmo
      subject: 'Teste de email - Painel SENAC',
      text: 'Se você recebeu este email, o Nodemailer está funcionando!'
    });

    console.log('✅ Email enviado com sucesso!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
  }
}

testar();