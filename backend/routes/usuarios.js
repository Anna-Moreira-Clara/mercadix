const express = require('express'); 
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Rotas de usuários usando o controller
router.post('/', usuariosController.criarUsuario);
router.get('/', usuariosController.listarUsuarios);
router.get('/', usuariosController.loginUsuario);
router.put('/:id', usuariosController.atualizarUsuario);
router.delete('/:id', usuariosController.deletarUsuario);

module.exports = router;