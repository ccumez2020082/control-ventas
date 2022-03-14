const express = require('express');
const route = express.Router();
const {
    agregarCarrito,
    editarCliente,
    eliminarCliente,
    obtenerCarrito,
    obtenerUnProductoPorNombre,
    obtenerUnaCategoriaPorNombre,
    masVendidos,
} = require('../controllers/client.controller');
const { verifyAuthen } = require('../utils/verify-authen');

route.get('/carrito', verifyAuthen, obtenerCarrito);
route.get('/masVendidos', verifyAuthen, masVendidos);
route.post('/busqueda/producto', verifyAuthen, obtenerUnProductoPorNombre);
route.post('/busqueda/categoria', verifyAuthen, obtenerUnaCategoriaPorNombre);
route.post('/carrito/agregar', verifyAuthen, agregarCarrito);
route.put('/updateMe', verifyAuthen, editarCliente);
route.delete('/deleteMe', verifyAuthen, eliminarCliente);

module.exports = route;