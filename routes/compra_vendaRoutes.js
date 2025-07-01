const express = require('express');
const router = express.Router();
const compravendaController = require('../controllers/compravendaController'); 

router.get('/venda', compravendaController.getAllDocVenda);
router.get('/compra', compravendaController.getAllDocCompra);
router.get('/:IdDocto', compravendaController.getDoctoByID);
router.get('/venda/cli', compravendaController.getAllCliente);
router.get('/compra/for', compravendaController.getAllFornecedor);
router.post('/new/venda', compravendaController.insertDoctoVenda);
router.post('/new/compra', compravendaController.insertDoctoCompra);
router.delete('/venda/:id', compravendaController.deleteDoctoVenda);
router.delete('/compra/:id', compravendaController.deleteDoctoCompra);

module.exports = router;
