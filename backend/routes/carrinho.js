const express = require('express');
const router = express.Router();
const carrinhoController = require('../controllers/carrinhoController');


router.post('/',carrinhoController.adicionarItem);
router.get('/:usuario_id', carrinhoController.listarCarrinho);
router.put('/:id',carrinhoController.atualizarQuantidade);
router.delete('/:id',carrinhoController.removerItem);
router.delete('/usuario/:usuario_id', carrinhoController.limparCarrinho);



module.exports = router;