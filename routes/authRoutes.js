// Path: routes/authRoutes.js
const express = require('express');
const registerUser = require('../controller/auth/registerUser.js');
const loginUser = require('../controller/auth/loginUser.js');
const validateToken = require('../controller/auth/validateToken.js');
const forgotPassword = require('../controller/auth/forgotPassword.js');

const router = express.Router();

/**
 * @swagger
 * /auth/register:
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
 * /auth/login:
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
 * /auth/validateToken:
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
 * /auth/forgotPassword:
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

module.exports = router;
