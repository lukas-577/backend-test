// Path: controller/auth/index.js

const loginUser = require('./loginUser.js');
const registerUser = require('./registerUser.js');
const forgotPassword = require('./forgotPassword.js');

module.exports = {
    loginUser,
    registerUser,
    forgotPassword
};