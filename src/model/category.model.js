const mongoose = require('mongoose');
const schema = mongoose.Schema;

const categoriaSchema = new schema({
    name: String,

})

module.exports = mongoose.model('categories', categoriaSchema);