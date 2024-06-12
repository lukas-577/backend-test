const express = require('express');
const multer = require('multer'); // Para manejar la carga de archivos
const path = require('path');
const { storage, auth, db } = require('./config'); // Importa tu configuración de Firebase
const app = express();

// Configuración de Multer para manejar la carga de archivos
const upload = multer();

// Ruta para servir el formulario HTML para subir imágenes
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Subir Imagen</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        form {
          max-width: 400px;
          margin: 0 auto;
        }
        label {
          display: block;
          margin-bottom: 10px;
        }
        input[type="file"] {
          margin-bottom: 10px;
        }
        button {
          padding: 10px 20px;
          background-color: #007bff;
          color: #fff;
          border: none;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <h1>Subir Imagen</h1>
      <form action="/upload" method="post" enctype="multipart/form-data">
        <label for="photo">Imagen:</label>
        <input type="file" id="photo" name="photo"><br><br>
        <label for="uid">UID:</label>
        <input type="text" id="uid" name="uid"><br><br>
        <button type="submit">Subir</button>
      </form>
    </body>
    </html>
  `);
});

// Ruta para subir la imagen y el UID
app.post('/upload', upload.single('photo'), async (req, res) => {
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


        // Subir la imagen al almacenamiento
        await storage.bucket().upload(file.buffer, {
            destination: filePath,
            contentType: file.mimetype,
        });

        console.log("Imagen subida exitosamente a Cloud Storage");

        // Obtener la URL de la imagen subida
        const imageUrl = `https://storage.googleapis.com/${storage.bucket().name}/${filePath}`;

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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
