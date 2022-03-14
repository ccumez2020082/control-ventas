const bcrypt = require('bcrypt-nodejs');
const { error, success } = require('../utils/responses');
const {
    createUser: create,
    userFind,
    listarUsuario: listar,
    updateRol,
    updateUser,
    eliminarUser,
    userFindByID,
} = require('../store/user.store');

/*Eto ya */

function listarUsuario(req, res) {
    listar()
        .then((usuariosEncontrados) => {
            if (usuariosEncontrados.length === 0) {
                return success(req, res, 'No hay usuarios todavia.', 200);
            } else {
                return success(req, res, { usuariosEncontrados }, 200);
            }
        })
        .catch((err) => {
            console.log(err);
            return error(req, res, 'Error Interno', 500);
        });
}

/* Crear usuarios solo administrador */
function crearUsuario(req, res) {
    if (req.user.rol === 'ROL_CLIENTE') return error(req, res, 'No tienes permisos para crear usuario', 401);

    const { userName, password, rol } = req.body;

    if (userName && password) {
        userFind(userName)
            .then((userEncontrado) => {
                if (userEncontrado) {
                    return error(req, res, 'Este usuario ya existe.', 404);
                } else {
                    const user = {
                        userName,
                        rol,
                    };
                    bcrypt.hash(password, null, null, (err, passEncript) => {
                        user.password = passEncript;
                        create(user).then((userCreado) => {
                            userCreado ? success(req, res, userCreado, 200) : error(req, res, 'No se puede crear usuario.');
                        });
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                return error(req, res, 'Error Interno', 500);
            });
    } else {
        return error(req, res, 'Hacen falta campos.', 404);
    }
}

/* Modificar a los usuarios por el ROL */
function modificarUsuarioROL(req, res) {
    if (req.user.rol === 'ROL_CLIENTE') return error(req, res, 'No tienes permisos para modificar usuario', 401);

    const { rol } = req.body;

    if (rol) {
        if (rol === 'ROL_ADMIN' || rol === 'ROL_CLIENTE') {
            const { idUser } = req.params;

            updateRol(idUser, rol)
                .then((rolModificado) => {
                    rolModificado ? success(req, res, rolModificado, 200) : error(req, res, 'No se puede modificar este rol.', 500);
                })
                .catch((err) => {
                    console.log(err);
                    return error(req, res, 'Error Interno', 500);
                });
        } else {
            return error(req, res, 'El rol que ingreso no existe.', 404);
        }
    } else {
        return error(req, res, 'No vienen los campos necesarios.', 404);
    }
}

/* Modificar USUARIO */
function modificarUsuario(req, res) {
    if (req.user.rol === 'ROL_CLIENTE') return error(req, res, 'No tienes permisos para modificar usuario', 401);

    const userBody = req.body;
    delete userBody.rol;
    delete userBody.password;

    if (userBody.userName) {
        const { idUser } = req.params;

        userFindByID(idUser)
            .then((usuarioEncontrado) => {
                if (usuarioEncontrado) {
                    if (usuarioEncontrado.rol === 'ROL_CLIENTE') {
                        updateUser(idUser, userBody)
                            .then((usuarioModificado) => {
                                usuarioModificado
                                    ?
                                    success(req, res, { usuarioModificado }, 200) :
                                    error(req, res, 'No se puede modificar el producto.', 500);
                            })
                            .catch((err) => {
                                console.log(err);
                                return error(req, res, 'Error Interno', 500);
                            });
                    } else {
                        return error(req, res, 'No puedes modificar a un administrador', 404);
                    }
                } else {
                    return error(req, res, 'El usuario aun no se ha agregado.', 404);
                }
            })
            .catch((err) => {
                console.log(err);
                return error(req, res, 'Ocuriio un error', 500);
            });
    } else {
        return error(req, res, 'Faltan rellenar campos.', 404);
    }
}

/*Eliminar usuarios solo administrador */
function eliminarUsuario(req, res) {
    if (req.user.rol === 'ROL_CLIENTE') return error(req, res, 'No tienes permisos para eliminar usuario', 401);
    const { idUser } = req.params;

    userFindByID(idUser).then((usuarioEncontrado) => {
        if (usuarioEncontrado) {
            if (usuarioEncontrado.rol === 'ROL_CLIENTE') {
                eliminarUser(idUser)
                    .then((usuarioEliminado) => {
                        if (usuarioEliminado) {
                            return success(req, res, 'El Usuario ha sifo eliminado con exito', 200);
                        } else {
                            return error(req, res, 'El usuario no es existente');
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        return error(req, res, 'Error interno', 500);
                    });
            } else {
                return error(req, res, 'Eres un cliente no puedes eliminar a un Administrador', 404);
            }
        } else {
            return error(req, res, 'Este usuario no existe.', 500);
        }
    });
}

module.exports = {
    crearUsuario,
    modificarUsuario,
    listarUsuario,
    modificarUsuarioROL,
    eliminarUsuario,
};