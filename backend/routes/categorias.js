const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController'); // importa o controller

// Rotas conectadas ao controller
router.post('/', categoriasController.criarCategoria);
router.get('/', categoriasController.listarCategorias);
router.get('/:id', categoriasController.buscarCategoriaPorId);
router.put('/:id', categoriasController.atualizarCategoria);
router.delete('/:id', categoriasController.deletarCategoria);

module.exports = router;
