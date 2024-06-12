// Path: controller/auth/validateToken.js
const { auth } = require('../../config.js');

const validateToken = async (req, res) => {
    try {
        // Verificar si el encabezado Authorization existe y contiene el token
        if (!req.headers.authorization) {
            return res.status(401).send('No token provided');
        }

        // Obtener el token de Authorization
        const token = req.headers.authorization.split(' ')[1];

        // Verificar el token
        const decodedToken = await auth.verifyIdToken(token);

        // Construir el objeto de usuario desde el token decodificado
        const user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            role: decodedToken.role || null,
            emailVerified: decodedToken.email_verified,
            displayName: decodedToken.name,
            photoURL: decodedToken.picture,
        };

        // Enviar la respuesta con el usuario válido
        res.status(200).send({ user });
    } catch (error) {
        // Manejar el error en caso de un token inválido o cualquier otro error de verificación
        console.error('Error validating token:', error);
        res.status(401).send('Invalid token');
    }
}

module.exports = validateToken;
