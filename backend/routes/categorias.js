const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');


router.post('/', categoriasController.criarCategoria);
router.get('/', categoriasController.listarCategorias);
router.put('/:id', categoriasController.atualizarCategoria);
router.delete('/:id', categoriasController.deletarCategoria);



module.exports = router;