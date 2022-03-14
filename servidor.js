const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const app = require('./app');
const adminModel = require('./src/model/user.model');
const categoryModel = require('./src/model/category.model');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/ventas-online', { useNewUrlParser: true, useUnifiedTopology: true }).then((conected) => {
    const PORT = 3000;
    app.listen(PORT, () => console.log((`Listen http://localhost:${PORT}`)));

    adminModel.find({ userName: 'ADMIN' }, (err, findAdmin) => {
        if (err) return console.log('Error a la hora de encontrear el ADMIN.');

        if (findAdmin.length === 0) {
            const ADMIN = {
                userName: 'ADMIN',
                rol: 'ROL_ADMIN',
            };
            bcrypt.hash('123456', null, null, (err, passEncript) => {
                ADMIN.password = passEncript;

                const adminNew = new adminModel(ADMIN);
                adminNew.save((err, adminSaved) => {
                    if (err) return console.log('Error a la hora de guardar el ADMIN.');
                    if (!adminSaved) {
                        return console.log('No viene los datos de ADMIN');
                    } else {
                        console.log(('ADMINISTRADOR creado con exito.'));
                        CategoryDefault();
                    }
                });
            });
        } else {
            console.log(('Este ADMINISTRADOR ya existe.'));
            CategoryDefault();
        }
    });

    /* Creado de categoria por defecto */
    function CategoryDefault() {
        categoryModel.find({ name: 'DEFAULT' }, (err, categoryFind) => {
            if (err) return console.log('Error en la busqueda');

            if (categoryFind.length === 0) {
                const categoria = {
                    name: 'DEFAULT',
                };

                const newCategoria = new categoryModel(categoria);
                newCategoria.save((err, categoriaGuardada) => {
                    if (err) return console.log('Error a la hora de guardar la CATEGORIA.');
                    if (!categoriaGuardada) {
                        return console.log('No viene los datos de CATEGORIA.');
                    } else {
                        return console.log(('CATEGORIA creado con exito.'));
                    }
                });
            } else {
                return console.log(('Esta CATEGORIA creada ya existe.'));
            }
        });
    }
});