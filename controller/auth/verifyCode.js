// controller/auth/verifyCode.js

const { db, auth } = require('../../config.js');
const { assignRole } = require('../../utils.js');

const verifyCode = async (req, res) => {
    const { uid, verificationCode } = req.body;

    try {
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).send('Usuario no encontrado');
        }

        const userData = userDoc.data();
        if (userData.verified) {
            return res.status(400).send('El usuario ya está verificado');
        }

        const currentTime = new Date();

        if (currentTime > userData.codeValidUntil.toDate()) {
            return res.status(400).send('El código de verificación ha expirado');
        }

        if (verificationCode === userData.verificationCode) {
            await userRef.update({ verified: true });
            // Cambiar el role a miembro
            await assignRole(uid, 'member');
            // Verificar el correo del usuario desde el auth

            await auth.updateUser(uid, {
                emailVerified: true
            });

            return res.status(200).send('Usuario verificado correctamente');
        } else {
            return res.status(400).send('Código de verificación incorrecto');
        }
    } catch (error) {
        console.error('Error al verificar el código:', error);
        res.status(500).send('Error al verificar el código');
    }
};

module.exports = verifyCode;