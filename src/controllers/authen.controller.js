const bcrypt = require('bcrypt-nodejs');
const { userCreate, userFind } = require('../store/authen.store');
const RESPONSE = require('../utils/responses');
const jwt = require('../utils/jwt');

async function login(req, res) {
    const { userName, password } = req.body;

    await userFind(userName)
        .then((Encontrado) => {
            if (Encontrado) {
                responderToken(req, res, password, Encontrado.password, Encontrado);
            } else {
                return RESPONSE.error(req, res, 'No se encontro.', 404);
            }
        })
        .catch((err) => console.log('err', err));
}

function responderToken(req, res, password, passwordEncontrado, dataEncontrada) {
    bcrypt.compare(password, passwordEncontrado, (err, passDesincriptado) => {
        if (err) return RESPONSE.error(req, res, err, 500);
        !passDesincriptado
            ?
            RESPONSE.error(req, res, 'La contraseña es incorrecta.') :
            RESPONSE.success(req, res, jwt.createToken(dataEncontrada), 200);
    });
}

async function registrar(req, res, roles) {
    const { userName, password } = req.body;
    const rol = 'ROL_CLIENTE';

    if (userName && password) {
        userFind(userName).then((usuarioEncontrado) => {
                if (usuarioEncontrado) {
                    return RESPONSE.error(req, res, 'Usuario ya existente.', 404);
                } else {
                    bcrypt.hash(password, null, null, (err, passEncriptado) => {
                        const people = {
                            userName,
                            password: passEncriptado,
                            rol,
                        };
                        userCreate(people)
                            .then((userCreate) => {
                                userCreate ? RESPONSE.success(req, res, userCreate, 201) : RESPONSE.error(req, res, 'No se puede crear el usuario.', 500);
                            })
                            .catch((err) => console.log(err));
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                return RESPONSE.error(req, res, 'Error interno', 500);
            });
    }
}

module.exports = {
    login,
    registrar,
};