const express = require('express');
const router = express.Router();
const manutencaoController = require('../controllers/manutencoesController');

router.get('/', manutencaoController.getManutencoes);
router.post('/', manutencaoController.createManutencao);
router.delete('/:id', manutencaoController.deleteManutencao);
router.put('/:id', manutencaoController.updateManutencao);
router.get('/:id', manutencaoController.getManutencaoById);

module.exports = router;
