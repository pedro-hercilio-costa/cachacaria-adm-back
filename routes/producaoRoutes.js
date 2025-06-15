const express = require('express');
const router = express.Router();
const producaoController = require('../controllers/producaoController'); 

router.get('/ordemproducao', producaoController.getOrdemProducaoList);
router.get('/view/:IdDocto', producaoController.getOrdemProducaoByID);
router.get('/composicao/:IdDocto', producaoController.getComposicaoByOrdemId);
router.post('/new', producaoController.insertDocto);


module.exports = router;