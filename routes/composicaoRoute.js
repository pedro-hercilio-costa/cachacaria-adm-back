const express = require('express');
const router = express.Router();
const composicaoController = require('../controllers/composicaoController'); 

router.get('/:IdProduct', composicaoController.getComposicaoProductByID);
router.get('/', composicaoController.getAllComposicoes);

module.exports = router;
