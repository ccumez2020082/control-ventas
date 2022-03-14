const {
    findCarrito,
    findProduct,
    crearCarrito,
    addProductCart,
    sumadeSubtotal,
    editarMe,
    eliminarme,
    obtenerCarritoCompleto,
    buscarPorNombre,
    buscarPorNombreCategoria,
    findCategory,
    ordenarProductos,
} = require('../store/client.store');
const { success, error } = require('../utils/responses');

function BreakException(req, res, message) {
    this.message = message;
    this.name = 'Exception';
    return error(req, res, 'Este producto ya fue agregado al carrito.', 404);
}


function obtenerCarrito(req, res) {
    obtenerCarritoCompleto(req.user.sub)
        .then((allCarrito) => {
            allCarrito ? success(req, res, allCarrito, 200) : success(req, res, 'No se ha agregado nada por el momento.', 200);
        })
        .catch((err) => {
            console.log(err);
            error(req, res, 'Error interno.', 500);
        });
}

/* Agregamos los pruductos al carrito */
function agregarCarrito(req, res) {
    /*Como primera instruccion es verificar que rol tieen el usuario registrado */
    if (req.user.rol === 'ROL_ADMIN') return error(req, res, 'No tiene los permisos.', 401);
    const { product, cantidad } = req.body;

    findCarrito(req.user.sub).then((carritoEncontrado) => {
            if (carritoEncontrado) {
                carritoEncontrado.product.forEach((elemento) => {
                    if (elemento.productoID == product) {
                        throw new BreakException(req, res, 'Ya esta disponible.');
                    }
                });

                findProduct(product).then((producto) => {
                    if (producto.stock < cantidad) {
                        return error(req, res, 'No tenemos esa cantidad de productos en este momento', 500);
                    } else {
                        const products = producto._id;
                        let carrito = {
                            product: [{ productoID: products, cantidad, subtotal: cantidad * producto.price.bytes }],
                        };

                        addProductCart(req.user.sub, carrito.product)
                            .then((carritoActualizado) => {
                                if (carritoActualizado) {
                                    let total = 0;
                                    carritoActualizado.product.map((carritoSuma) => {
                                        total += parseFloat(carritoSuma.subtotal.bytes);
                                    });
                                    sumadeSubtotal(carritoActualizado._id, total)
                                        .then((carritoFinal) => {
                                            carritoFinal ? success(req, res, { carrito: carritoFinal }, 200) : error(req, res, 'No se puede actualizar.', 500);
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                            return error(req, res, 'Error interno', 404);
                                        });
                                } else {
                                    return error(req, res, 'No es posible actualizar el carrito', 500);
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                                return error(req, res, 'Error interno', 404);
                            });
                    }
                });
            } else {
                findProduct(product).then((producto) => {
                    if (producto.stock < cantidad) {
                        return error(req, res, 'No tenemos esa cantidad de productos en este momento', 500);
                    } else {
                        const user = req.user.sub;
                        const products = producto._id;
                        const carrito = {
                            user,
                            product: [{ productoID: products, cantidad, subtotal: cantidad * producto.price.bytes }],
                            total: 0,
                        };

                        carrito.product.map((elemento) => {
                            carrito.total = carrito.total + elemento.subtotal;
                        });

                        crearCarrito(carrito)
                            .then((carritoCreado) => {
                                carritoCreado ? success(req, res, { carritoCreado }, 200) : error(req, res, 'No se pudo crear el carrito.', 500);
                            })
                            .catch((err) => {
                                console.log(err);
                                return error(req, res, 'Error Interno', 404);
                            });
                    }
                });
            }
        })
        .catch((err) => {
            console.log(err);
            return error(req, res, 'Error Interno', 500);
        });
}

/* Editar Cuenta propia */
function editarCliente(req, res) {
    if (req.user.rol === 'ROL_ADMIN') return error(req, res, 'No tiene los permisos.', 401);

    const editBody = req.body;
    delete editBody.password;
    delete editBody.rol;
    if (editBody.userName) {
        editarMe(req.user.sub, editBody)
            .then((clienteModificado) => {
                clienteModificado ? success(req, res, clienteModificado, 200) : error(req, res, 'No se puede modificar el usuario.', 500);
            })
            .catch((err) => {
                console.log(err);
                return error(req, res, 'Error Interno', 500);
            });
    } else {
        return error(req, res, 'Faltan campos.', 404);
    }
}

/* Eliminar Cuenta Popia  */
function eliminarCliente(req, res) {
    if (req.user.rol === 'ROL_ADMIN') return error(req, res, 'No tiene los permisos.', 401);

    eliminarme(req.user.sub)
        .then((usuarioEliminar) => {
            usuarioEliminar ? success(req, res, 'Cuenta eliminada con exito.', 200) : error(req, res, 'No se puede eliminar el usuario.', 500);
        })
        .catch((err) => {
            console.log(err);
            return error(req, res, 'Error interno', 500);
        });
}

/* Busque de producto por nombre */
function obtenerUnProductoPorNombre(req, res) {
    let { name } = req.body;
    /* Para buscar por nombre */

    buscarPorNombre(name)
        .then((productFind) => {
            !productFind ? error(req, res, 'Error al obtener los PRODUCTOS.') : success(req, res, productFind, 200);
        })
        .catch((err) => {
            console.log(err);
            return error(req, res, 'Error interno', 500);
        });
}

/* Buscar categorias por nombre */
function obtenerUnaCategoriaPorNombre(req, res) {
    let { name } = req.body;

    findCategory(name).then((categoriaEncontrada) => {
            buscarPorNombreCategoria(String(categoriaEncontrada._id)).then((productFind) => {
                    if (productFind.length === 0) {
                        return error(req, res, 'No hay Coincidencia.', 404);
                    } else {
                        const viewProduct = {
                            Category: categoriaEncontrada.name,
                            Products: [],
                        };
                        productFind.forEach((elemento) => {
                            viewProduct.Products.push(elemento.name);
                        });

                        !productFind ? error(req, res, 'Error al obtener los productos') : success(req, res, viewProduct, 200);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    return error(req, res, 'Error interno', 500);
                });
        })
        .catch((err) => {
            console.log(err);
            return error(req, res, 'Error interno', 500);
        });
}

/* En esta parte se va mostrar lo mas vendido */
function masVendidos(req, res) {
    ordenarProductos()
        .then((vendidos) => {
            vendidos ? success(req, res, vendidos, 200) : error(req, res, 'No hay vendidos', 500);
        })
        .catch((err) => {
            console.log(err);
            return error(req, res, 'Error interno', 500);
        });
}

module.exports = {
    agregarCarrito,
    editarCliente,
    eliminarCliente,
    obtenerCarrito,
    obtenerUnProductoPorNombre,
    obtenerUnaCategoriaPorNombre,
    masVendidos,
};