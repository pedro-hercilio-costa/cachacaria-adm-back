const express = require('express');
const router = express.Router();
const estoqueController = require('../controllers/estoqueController'); 

router.get('/:IdProduct', estoqueController.getProductByID);
router.get('/saldo/:IdProduct', estoqueController.getSaldoProductByID);

module.exports = router;
