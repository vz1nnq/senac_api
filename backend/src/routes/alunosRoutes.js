const express = require('express');
const router = express.Router();

const alunosController = require('../controllers/alunosController');

router.get('/', alunosController.listarAlunos);
router.get('/:id', alunosController.listarAlunosByID);
router.post('/', alunosController.criarAlunos);
router.put('/:id', alunosController.atualizarAlunos);
router.delete('/:id', alunosController.deletarAluno);

module.exports = router;