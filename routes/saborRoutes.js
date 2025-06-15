const express = require('express');
const router = express.Router();
const saborController = require('../controllers/saborController');

router.get('/', saborController.getAllSabores);

module.exports = router;
