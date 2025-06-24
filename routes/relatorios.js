const express = require('express');
const router = express.Router();
const relatoriosController = require('../controllers/relatoriosController');

router.get('/movimentacao', relatoriosController.movimentacao);
router.get('/ingredientes', relatoriosController.ingredientes);
router.get('/periodo', relatoriosController.porPeriodo);

module.exports = router;