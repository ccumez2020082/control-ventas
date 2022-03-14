const models = require('../model/user.model');

async function userFind(userName) {
    return await models.findOne({ userName });
}

async function userCreate(user) {
    const newUser = new models(user);
    return await newUser.save();
}

module.exports = {
    userFind,
    userCreate,
};