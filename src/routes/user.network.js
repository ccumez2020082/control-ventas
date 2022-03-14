const express = require('express');
const router = express.Router();
const { verifyAuthen } = require('../utils/verify-authen');
const { crearUsuario, listarUsuario, modificarUsuarioROL, modificarUsuario, eliminarUsuario } = require('../controllers/user.controller');

router.get('/', verifyAuthen, listarUsuario);
router.post('/create', verifyAuthen, crearUsuario);
router.put('/update/rol/:idUser', verifyAuthen, modificarUsuarioROL);
router.put('/update/:idUser', verifyAuthen, modificarUsuario);
router.delete('/delete/:idUser', verifyAuthen, eliminarUsuario);

module.exports = router;