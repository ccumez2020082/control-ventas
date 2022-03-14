const mongoose = require('mongoose');
const schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

const productosSchema = new schema({
    name: String,
    stock: Number,
    sold: Number,
    price: { type: SchemaTypes.Decimal128, get: (v) => new mongoose.Types.Decimal128((+v.toString()).toFixed(2)) },
    Category: { type: schema.ObjectId, ref: 'categories' },
});

module.exports = mongoose.model('products', productosSchema);