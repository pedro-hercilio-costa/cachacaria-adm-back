const express = require('express');
const router = express.Router();
const tipoManutencaoController = require('../controllers/tiposManutencaoController');

router.get('/', tipoManutencaoController.getTiposManutencao);

module.exports = router;
