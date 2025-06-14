const express = require('express');
const router = express.Router();
const unidadeController = require('../controllers/unidadeController');

router.get('/', unidadeController.getAllUnidades);

module.exports = router;
