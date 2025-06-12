const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Listar todos os usuários
router.get('/', userController.getAllUsers);

// Criar um novo usuário
router.post('/', userController.createUser);

// Atualizar um usuário
router.put('/:id', userController.updateUser);

// Deletar um usuário
router.delete('/:id', userController.deleteUser);

module.exports = router;
