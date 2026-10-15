const express = require('express');
const cors = require('cors');
const AlunosRoutes = require('./routes/alunosRoutes');
const CursosRoutes = require('./routes/cursosRoutes');
const TurmasRoutes = require('./routes/turmasRoutes');
const AuthRoutes = require('./routes/authRoutes');
const autenticar = require('./middlewares/auth');

const app = express();

app.use(express.json());
app.use(cors());

// Rotas públicas
app.use('/auth', AuthRoutes);

// Rotas protegidas
app.use('/alunos', autenticar, AlunosRoutes);
app.use('/cursos', autenticar, CursosRoutes);
app.use('/turmas', autenticar, TurmasRoutes);

module.exports = app;