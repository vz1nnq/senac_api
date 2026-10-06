const express = require('express');
const router = express.Router();

const cursosController = require('../controllers/cursosController');

router.get('/', cursosController.listarCursos);
router.get('/:id', cursosController.listarCursoByID);
router.post('/', cursosController.criarCurso);
router.put('/:id', cursosController.atualizarCursos);
router.delete('/:id', cursosController.deletarCurso);

module.exports = router;