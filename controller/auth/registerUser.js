// Path: controller/auth/registerUser.js
const { auth, db } = require('../../config.js');
const { assignRole } = require('../../utils.js');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


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

        // Generar el código de verificación
        const verificationCode = generateVerificationCode();

        // Guardar el usuario y el código en Firestore con una marca de tiempo
        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() + 1); // Expira en 1 hora
        // Guardar en Firestore
        await db.collection('users').doc(uid).set({
            email,
            verificationCode,
            codeValidUntil: expirationTime,
            verified: false
        });

        console.log(`Código de verificación generado: ${verificationCode}`);
        // Configurar el correo de verificación
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Código de verificación',
            text: `Tu código de verificación es: ${verificationCode}. Es válido por 1 hora.`,
            html: `<p>Tu código de verificación es: <strong>${verificationCode}</strong>. Es válido por 1 hora.</p>`
        };

        // Enviar el correo de verificación
        await transporter.sendMail(mailOptions);
        console.log('Correo de verificación enviado a:', email);

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
