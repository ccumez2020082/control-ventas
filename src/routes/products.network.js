const express = require('express');
const router = express.Router();
const {
    obtenerProductos,
    crearProducto,
    modificarProdutos,
    obtenerProductoID,
    eliminarProductos,

} = require('../controllers/products.controller');
const { verifyAuthen } = require('../utils/verify-authen');


router.get('/', verifyAuthen, obtenerProductos);
router.post('/create', verifyAuthen, crearProducto);
router.put('/update/:idProducto', verifyAuthen, modificarProdutos);
router.get('/:idProducto', verifyAuthen, obtenerProductoID);
router.delete('/delete/:idProducto', verifyAuthen, eliminarProductos);
module.exports = router;