const express = require('express');
const router = express.Router();

const turmasController = require('../controllers/turmasController');

router.get('/', turmasController.listaTurmas);
router.get('/:id', turmasController.listarTurmasByID);
router.post('/', turmasController.mastricularAluno);

module.exports = router;