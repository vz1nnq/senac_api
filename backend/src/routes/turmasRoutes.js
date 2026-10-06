const express = require('express');
const router = express.Router();

const turmasController = require('../controllers/turmasController');

router.get('/', turmasController.listaTurmas);
router.get('/:id', turmasController.listarTurmasByID);
router.post('/', turmasController.mastricularAluno);
router.put('/:id', turmasController.atualizarTurmas);
router.delete('/:id', turmasController.deletarTurmas);

module.exports = router;