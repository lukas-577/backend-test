// imageController.js

const path = require('path');
const { storage, auth, db } = require('../../config.js');

async function uploadImage(req, res) {
    try {
        const uid = req.body.uid;
        const file = req.file;

        // Verificar si se proporcionó un archivo en la solicitud
        if (!file) {
            console.log("No se proporcionó ningún archivo");
            return res.status(400).send('No se proporcionó ningún archivo');
        }

        const ext = path.extname(file.originalname).toLowerCase(); // Obtener la extensión de la imagen
        const fileName = `${uid}${ext}`; // Modificar el nombre con el uid y la extensión
        const filePath = `profiles/${fileName}`;

        console.log(filePath, fileName, ext, file.mimetype, file.buffer.byteLength);

        // Subir la imagen al almacenamiento de Firebase
        await storage.bucket().file(filePath).save(file.buffer, {
            metadata: {
                contentType: file.mimetype
            }
        });

        // Obtener la URL de la imagen subida
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.bucket().name}/o/${encodeURIComponent(filePath)}?alt=media`;

        // Actualizar la photoURL en Firebase Authentication
        await auth.updateUser(uid, { photoURL: imageUrl });

        console.log("photoURL actualizada en Firebase Authentication");

        // Actualizar el perfil del usuario en Firestore
        await db.collection('users').doc(uid).update({ photoUrl: imageUrl });

        console.log("Perfil de usuario actualizado en Firestore");

        res.send('Imagen subida exitosamente y perfil actualizado');
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(400).send(error.message);
    }
}

module.exports = uploadImage;