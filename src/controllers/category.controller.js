const {
    findCategory,
    createCategory,
    updateCategoria,
    findProductoPorCategoria,
    findOneCategoria,
    removeCategory,
    updateCategoryDefault,

} = require('../store/category.store');
const { success, error } = require('../utils/responses');

/* Obtener todas las categorias */
function obtenerCategoria(req, res) {
    findCategory()
        .then((productFind) => {
            if (productFind === 0) {
                return success(req, res, 'No hay productos disponibles', 200);
            } else {
                return success(req, res, { productFind }, 200);
            }
        })
        .catch((err) => {
            console.log(err);
            return error(req, res, 'Error Interno', 500);
        });
}


/* Crear categorias para los productos, si no tiene categoria no podras ser almacenada */

function crearCategoria(req, res) {
    if (req.user.rol === 'ROL_CLIENTE') return error(req, res, 'No eres administrador para realizar esta accion', 401);

    const { name } = req.body;
    const categoria = {
        name,
    };
    createCategory(categoria)
        .then((categoriaCreada) => {
            categoriaCreada ? success(req, res, { categoriaCreada }, 200) : error(req, res, 'No se pudo crear la categoria.', 404);
        })
        .catch((err) => {
            console.log(err);
            return error(req, res, 'Error interno', 500);
        });
}

/* Modificar una Categoria */

function modficicarCategoria(req, res) {
    if (req.user.rol === 'ROL_CLIENTE') return error(req, res, 'No eres administrador para realizar esta accion', 401);

    const body = req.body;
    const { idCategorias } = req.params;

    if (body) {
        updateCategoria(idCategorias, body)
            .then((productoModificado) => {
                productoModificado ? success(req, res, { productoModificado }, 200) : error(req, res, 'No se a podido modificar el producto', 404);
            })
            .catch((err) => {
                console.log(err);
                return error(req, res, 'Error interno', 500);
            });
    } else {
        return error(req, res, 'No vienen las variables.', 500);
    }
}


function eliminarCategoria(req, res) {
    if (req.user.rol === 'ROL_CLIENTE') return error(req, res, 'No eres administrador para realizar esta accion', 401);

    const { idCategorias } = req.params;
    findOneCategoria('DEFAULT').then((categoriaDefault) => {
        findProductoPorCategoria(idCategorias).then((productosEncontrados) => {
            if (productosEncontrados.length === 0) {
                return removeCategoria(req, res, idCategorias);
            } else {
                productosEncontrados.forEach((elemento) => {
                    updateCategoryDefault(elemento._id, categoriaDefault._id).then(() => {
                        removeCategoria(req, res, idCategorias);
                    });
                });
            }
        });
    });
}
/*Eliminar una categoria */

function removeCategoria(req, res, id) {
    removeCategory(id)
        .then((datoEliminado) => {
            !datoEliminado ? error(req, res, 'Esta categoria no esta disponible', 404) : success(req, res, 'Categoria elimiando con exito!!', 200);
        })
        .catch((err) => {
            console.log(err);
            return error(req, res, 'Error interno', 500);
        });
}

module.exports = {
    obtenerCategoria,
    create: crearCategoria,
    modficicarCategoria,
    eliminarCategoria,
};