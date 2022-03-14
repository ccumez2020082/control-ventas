const {
    productsFind,
    buscarProductoName,
    createProduct,
    findProductID,
    updateProduct,
    eliminarProduct,
    verificarElLaCaterogia,
} = require('../store/products.store');
const { error, success } = require('../utils/responses');

/* Obtener todos los productos */
function obtenerProductos(req, res) {
    productsFind().then((productsFind) => {
            if (productsFind) {
                productsFind.length === 0 ? success(req, res, 'Aun no se han agregado productos', 200) : success(req, res, { productsFind }, 200);
            } else {
                console.log('No viene datos');
                return error(req, res, 'ERROR INTERNO', 5000);
            }
        })
        .catch((err) => {
            console.log(err);
            return error(req, res, 'No se ha podido realizar la busqueda', 500);
        });
}

/* Obtener un solo producto por ID */
function obtenerProductoID(req, res) {
    const { idProducto } = req.params;
    findProductID(idProducto)
        .then((productoEncontrado) => {
            productoEncontrado ? success(req, res, { productoEncontrado }, 200) : error(req, res, 'El producto no se encuentre agregado', 404);
        })
        .catch((err) => {
            console.log(err);
            return error(req, res, 'Error interno', 500);
        });
}

//Creacion de productos 
function crearProducto(req, res) {
    if (req.user.rol === 'ROL_CLIENTE') {
        return error(req, res, 'No eres administrador.', 401);
    }
    const { name, stock, price, Category } = req.body;
    delete sold;

    verificarElLaCaterogia(Category).then((categoria) => {
        if (categoria) {
            buscarProductoName(name).then((productFind) => {
                if (productFind) {
                    return error(req, res, 'Este producto ya fue registrado', 404);
                } else {
                    const sold = 0;
                    const product = {
                        name,
                        stock,
                        sold,
                        price,
                        Category,
                    };

                    createProduct(product).then((savedUser) => {
                            if (savedUser) {
                                return success(req, res, { savedUser }, 200);
                            } else {
                                console.log(err);
                                return error(req, res, 'No fue posible guardar su producto', 404);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            return error(req, res, 'No es posible guardar este dato', 500);
                        });
                }
            });
        } else {
            return error(req, res, 'Esta categoria no esta disponible', 404);
        }
    });
}
/* Modificar los productos */
function modificarProdutos(req, res) {
    if (req.user.rol === 'ROL_CLIENTE') return error(req, res, 'No tienes permisos para modificar un productos.', 401);

    const { idProducto } = req.params;
    const bodyProductos = req.body;
    delete bodyProductos.sold;

    if (bodyProductos.Category) {
        verificarElLaCaterogia(bodyProductos.Category).then((categoria) => {
            if (categoria) {
                updateProduct(idProducto, bodyProductos)
                    .then((productoModificado) => {
                        productoModificado
                            ?
                            success(req, res, { productoModificado }, 200) :
                            error(req, res, 'No se a podido modificar el producto.', 500);
                    })
                    .catch((err) => {
                        console.log(err);
                        return error(req, res, 'Error Interno', 500);
                    });
            } else {
                return error(req, res, 'Categoria no existente', 404);
            }
        });
    } else {
        updateProduct(idProducto, bodyProductos)
            .then((productoModificado) => {
                productoModificado ? success(req, res, { productoModificado }, 200) : error(req, res, 'No se a podido modificar el producto.', 500);
            })
            .catch((err) => {
                console.log(err);
                return error(req, res, 'Error Interno', 500);
            });
    }
}

/* Eliminar los productos */
function eliminarProductos(req, res) {
    if (req.user.rol === 'ROL_CLIENTE') return error(req, res, 'No tiene los permisos.', 401);
    const { idProducto } = req.params;
    eliminarProduct(idProducto)
        .then((productoEliminar) => {
            productoEliminar ? success(req, res, 'Producto Elimado Con exito.', 200) : error(req, res, 'No existe este producto.', 404);
        })
        .catch((err) => {
            console.log(err);
            return error(req, res, 'Error Interno', 500);
        });
}

module.exports = {
    obtenerProductos,
    obtenerProductoID,
    crearProducto,
    modificarProdutos,
    eliminarProductos,
};