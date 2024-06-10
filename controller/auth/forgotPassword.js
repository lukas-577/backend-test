// Path: controller/auth/forgotPassword.js
const { getAuth, sendPasswordResetEmail } = require('firebase/auth');

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Enviar el correo de restablecimiento de contraseña
        await sendPasswordResetEmail(getAuth(), email);
        console.log(`Correo de restablecimiento de contraseña enviado a: ${email}`);

        res.status(200).send({
            message: 'Correo de restablecimiento de contraseña enviado',
            email: email
        });
    } catch (error) {
        console.error('Error al enviar el correo de restablecimiento de contraseña:', error);
        res.status(500).send('Error al enviar el correo de restablecimiento de contraseña');
    }
}

module.exports = forgotPassword;
