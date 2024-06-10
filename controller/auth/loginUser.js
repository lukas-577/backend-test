// Path: controller/auth/loginUser.js

const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const loginUser = async (req, res) => {
const { email, password } = req.body;
    try {
        const user = await signInWithEmailAndPassword(getAuth(), email, password);
        res.send({ token: user._tokenResponse.idToken });
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = loginUser;