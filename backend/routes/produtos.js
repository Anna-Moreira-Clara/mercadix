const express = require('express');
const router = express.Router();
const produtosController = require('../controllers/produtosController');

//Rotas CRUD de produtos
router.get('/', produtosController.getTodosProdutos);
router.get('/:id', produtosController.getProdutoPorId);
router.post('/', produtosController.criarProduto);
router.put('/:id', produtosController.atualizarProduto);
router.delete('/:id', produtosController.deletarProduto);

module.exports = router;