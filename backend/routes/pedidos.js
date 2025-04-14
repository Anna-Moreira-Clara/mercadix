const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

//rota para criar novo pedido
router.post('/', pedidosController.criarPedido);

module.exports = router;