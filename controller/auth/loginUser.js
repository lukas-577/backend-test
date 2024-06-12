// Path: controller/auth/loginUser.js

const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const loginUser = async (req, res) => {
const { email, password } = req.body;
    try {
        const user = await signInWithEmailAndPassword(getAuth(), email, password);

        res.send({ token: user._tokenResponse.idToken });
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            return res.status(404).send('Usuario no encontrado');
        } else if (error.code === 'auth/wrong-password') {
            return res.status(401).send('Contraseña incorrecta');
        } else if (error.code === 'auth/invalid-email') {
            return res.status(400).send('Correo electrónico no válido');
        } else if (error.code === 'auth/too-many-requests') {
            return res.status(429).send('Demasiadas solicitudes. Intente nuevamente más tarde');
        } else if (error.code === 'auth/invalid-credential') {
            return res.status(400).send('Credenciales no válidas');
        }
        console.error('Error al iniciar sesión:', error);
    }
}

module.exports = loginUser;