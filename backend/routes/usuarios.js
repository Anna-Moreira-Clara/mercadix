const express = require('express'); 
const router = express.Router();// Cria um roteador para gerenciar todas as rotas relacionadas a usuários.

const usuariosController = require('../controllers/usuariosController');

router.post('/', usuariosController.criarUsuario);
router.get('/', usuariosController.listarUsuarios);
router.get('/:id', usuariosController.buscarUsuarioPorId);
router.put('/:id', usuariosController.atualizarUsuario);
router.delete('/:id', usuariosController.deletarUsuario);



module.exports = router;


