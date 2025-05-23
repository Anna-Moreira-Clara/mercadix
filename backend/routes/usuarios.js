const express = require('express'); 
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Rotas de usuários usando o controller
router.post('/', usuariosController.criarUsuario);
router.get('/', usuariosController.listarUsuarios);
router.post('/login', usuariosController.loginUsuario); // Alterado de GET para POST
router.post('/redefinir-senha', usuariosController.redefinirSenha);
router.put('/:id', usuariosController.atualizarUsuario);
router.delete('/:id', usuariosController.deletarUsuario);

module.exports = router;