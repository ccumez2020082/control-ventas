const express = require('express');
const router = express.Router();

const { obtenerCategoria, modficicarCategoria, create, eliminarCategoria } = require('../controllers/category.controller');
const { verifyAuthen } = require('../utils/verify-authen');

router.get('/', verifyAuthen, obtenerCategoria);
router.post('/create', verifyAuthen, create);
router.put('/update/:idCategorias', verifyAuthen, modficicarCategoria);
router.delete('/delete/:idCategorias', verifyAuthen, eliminarCategoria);

module.exports = router;