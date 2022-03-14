const modelUser = require('../model/user.model');

async function listarUsuario(q) {
    return await modelUser.find();
}

async function createUser(objectuser) {
    const newUser = new modelUser(objectuser);
    return await newUser.save();
}

async function userFindByID(id) {
    return await modelUser.findById(id);
}

async function userFind(name) {
    return await modelUser.findOne({ userName: { $regex: name, $options: 'i' } });
}

async function updateRol(id, rol) {
    return await modelUser.findByIdAndUpdate(id, { rol }, { new: true });
}

async function updateUser(id, body) {
    return await modelUser.findByIdAndUpdate(id, body, { new: true });
}

async function eliminarUser(id) {
    return await modelUser.findByIdAndDelete(id);
}

module.exports = {
    listarUsuario,
    createUser,
    userFind,
    updateRol,
    updateUser,
    eliminarUser,
    userFindByID,
};