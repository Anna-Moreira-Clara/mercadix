const express = require('express');
const router = express.Router(); //cria um grupo de rotas para produtos.
const produtosController = require('../controllers/produtosController');
router.get('/pesquisar', produtosController.pesquisarProdutos);
router.post('/', produtosController.criarProduto);
router.get('/', produtosController.listarProdutos);
router.get('/:id', produtosController.buscarProdutoPorId);
router.get('/categoria/:categoriaId', produtosController.buscarProdutosPorCategoria); // Nova rota
router.put('/:id', produtosController.atualizarProduto);
router.delete('/:id', produtosController.deletarProduto);



module.exports = router;