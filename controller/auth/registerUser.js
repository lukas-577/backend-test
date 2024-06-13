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
            html: `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Correo de Verificación</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #2B3139; /* Cambiado a fondo más oscuro */
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #242424;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        border-radius: 10px;
                        overflow: hidden;
                    }
                    .header {
                        background-color: #2B3139; 
                        padding: 15px 0;
                        text-align: center;
                    }
                    .header img {
                        max-width: 150px;
                    }
                    .content {
                        padding: 20px;
                        color: #ffffff; /* Cambiado color del texto principal */
                    }
                    .content h1 {
                        color: #ffed4a; /* Resaltar color del título */
                        margin-top: 0;
                    }
                    .content p {
                        color: #ffffff;
                        margin-bottom: 15px;
                    }
                    .content a {
                        color: #ffed4a; /* Resaltar color del enlace */
                        text-decoration: none;
                        font-weight: bold;
                    }
                    .footer {
                        background-color: #2B3139; /* Cambiado color del pie de página */
                        padding: 10px;
                        text-align: center;
                        font-size: 12px;
                        color: #999999;
                    }
                    .footer p {
                        margin: 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://firebasestorage.googleapis.com/v0/b/lumotareas.appspot.com/o/logo192.png?alt=media&token=b8fd3fb6-a44e-4479-a188-0bb73a8051f9" alt="Utem TX">
                    </div>
                    <div class="content">
                        <h1>Hola,</h1>
                        <p>Este correo lo envía Utem TX, se solicitó verificar su cuenta.</p>
                        <p>Tu código de verificación es: <strong style="color: #ffed4a;">${verificationCode}</strong>. Es válido por 1 hora.</p>
                        <p>Puedes ingresar <a href="http://localhost:5173/verify/${email}/${uid}" style="color: #ffed4a;">aquí</a> para verificar tu cuenta.</p>
                        <p>Si no solicitaste esto, por favor ignora este mensaje.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Utem TX. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
            `
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
