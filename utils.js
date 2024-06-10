// Path: utils.js

const { auth } = require('./config.js');

// Función para asignarle un rol en específico a un usuario
const assignRole = async (uid, role) => {
    try {
        await auth.setCustomUserClaims(uid, { role });
        return 'OK';
    } catch (error) {
        return error;
    }
}

module.exports = { assignRole };