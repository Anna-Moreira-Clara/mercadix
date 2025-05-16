const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');


//rota para criar novo pedido
router.post('/', pedidosController.criarPedido);
router.get('/', pedidosController.listarTodosPedidos);
router.get('/:usuario_id', pedidosController.listarPedidosPorUsuario);





module.exports = router;


