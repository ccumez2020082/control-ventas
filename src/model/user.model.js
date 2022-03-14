const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const usuarioSchema = Schema({
    userName: String,
    password: String,
    rol: String,

});

module.exports = mongoose.model('users', usuarioSchema);