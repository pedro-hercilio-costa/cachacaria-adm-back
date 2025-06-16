const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController'); 

router.get('/', productController.getAllProducts);
router.get('/:IdProduct', productController.getProductByID);
router.delete('/:IdProduct', productController.deleteProduct); 
router.put('/edit/:IdProduct', productController.updateProduct);
router.post('/new', productController.insertProduct);
router.get('/produto/preco', productController.getProdPreco);

module.exports = router;
