const express = require('express');
const router = express.Router();
const manutencaoController = require('../controllers/manutencoesController');

router.get('/', manutencaoController.getManutencoes);
router.post('/', manutencaoController.createManutencao);

module.exports = router;
