/* Componentes con sub rutas */
const authen = require('./authen.network');
const products = require('./products.network');
const category = require('./category.network');
const user = require('./user.network');
const client = require('./client.network');

/* Funciones que podemos usar para realizar las acciones*/

const routers = (app) => {
    app.use('/authen', authen);
    app.use('/products', products);
    app.use('/category', category);
    app.use('/user', user);
    app.use('/client', client);

};

module.exports = routers;