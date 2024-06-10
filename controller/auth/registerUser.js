// Path: controller/auth/registerUser.js
const { getAuth, signInWithEmailAndPassword, sendEmailVerification } = require('firebase/auth');
const { auth } = require('../../config.js');
const { assignRole } = require('../../utils.js');

const registerUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Crear el usuario con el SDK de administrador
        const userRecord = await auth.createUser({ email, password });
        const uid = userRecord.uid;
        console.log(`Usuario creado con UID: ${uid}`);

        // Asignar el rol de 'guest' al usuario recién creado
        await assignRole(uid, 'guest');
        console.log(`Rol 'guest' asignado a UID: ${uid}`);

        // Iniciar sesión con el SDK de cliente para poder enviar el correo de verificación
        const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);
        const user = userCredential.user;

        // Enviar el correo de verificación
        await sendEmailVerification(user);
        console.log('Se ha enviado un correo de verificación');

        res.status(200).send({
            message: 'Usuario creado y correo de verificación enviado',
            uid: uid,
            email: email
        });
    } catch (error) {
        if (error.code === 'auth/email-already-exists') {
            console.error('El correo ya está en uso:', email);
            res.status(400).send('El correo ya está en uso');
        } else if (error.code === 'auth/invalid-password') {
            console.error('La contraseña es inválida:', password);
            res.status(400).send('La contraseña es inválida');
        } else {
            console.error("Error during registration:", error);
            res.status(500).send('Error durante el registro');
        }
    }
}

module.exports = registerUser;
