const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

router.get('/todos', pedidosController.listarTodosPedidos); // nova rota
router.get('/:usuario_id', pedidosController.listarPedidosPorUsuario);

module.exports = router;
