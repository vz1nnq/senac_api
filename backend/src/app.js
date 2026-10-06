const express = require('express');
const cors = require('cors');
const AlunosRoutes = require('./routes/alunosRoutes');
const CursosRoutes = require('./routes/cursosRoutes');
const TurmasRoutes = require('./routes/turmasRoutes');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/alunos', AlunosRoutes);
app.use('/cursos', CursosRoutes);
app.use('/turmas', TurmasRoutes);

module.exports = app;