// Path: routes/authRoutes.js
const express = require('express');
const registerUser = require('../controller/auth/registerUser.js');
const loginUser = require('../controller/auth/loginUser.js');
const validateToken = require('../controller/auth/validateToken.js');
const forgotPassword = require('../controller/auth/forgotPassword.js');
const updateUser = require('../controller/auth/updateUser.js');
const uploadImage = require('../controller/auth/uploadImage.js');
const verifyCode = require('../controller/auth/verifyCode.js');

const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario registrado y correo de verificación enviado
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error en el servidor
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Inicia sesión un usuario existente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *       400:
 *         description: Error en la solicitud
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /validateToken:
 *   get:
 *     summary: Valida el token de autenticación
 *     tags: [Auth]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token de autenticación JWT en el formato 'Bearer <token>'
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token válido
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.get('/validateToken', validateToken);

/**
 * @swagger
 * /forgotPassword:
 *   post:
 *     summary: Envía un correo de restablecimiento de contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Correo de restablecimiento de contraseña enviado
 *       500:
 *         description: Error al enviar el correo de restablecimiento de contraseña
 */
router.post('/forgotPassword', forgotPassword);

/**
 * @swagger
 * /updateUser:
 *   post:
 *     summary: Actualiza el perfil de un usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *               displayName:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Perfil de usuario actualizado correctamente
 *       400:
 *         description: Error al actualizar el perfil del usuario
 */
router.post('/updateUser', updateUser);

/**
* @swagger
* /uploadImage:
*   post:
*     summary: Sube una imagen de perfil para un usuario
*     tags: 
*       - Auth
*     requestBody:
*       required: true
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             properties:
*               uid:
*                 type: string
*                 description: El ID del usuario para el que se está cargando la imagen.
*               file:
*                 type: string
*                 format: binary
*                 description: El archivo de imagen que se va a subir.
*     responses:
*       '200':
*         description: Imagen subida exitosamente y perfil actualizado.
*       '400':
*         description: Error al subir la imagen.
*/
const multer = require('multer');
const upload = multer();
router.post('/uploadImage', upload.single('photo'), uploadImage);

/**
 * @swagger
 * /verify:
 *   post:
 *     summary: Verifica el código de verificación de un usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *               verificationCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario verificado correctamente
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error en el servidor
 */

router.post('/verify', verifyCode);

module.exports = router;
