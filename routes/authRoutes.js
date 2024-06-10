// Path: routes/authRoutes.js
const express = require('express');
const registerUser = require('../controller/auth/registerUser.js');
const loginUser = require('../controller/auth/loginUser.js');
const validateToken = require('../controller/auth/validateToken.js');
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
 *         description: OK
 *       400:
 *         description: Error durante el registro
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
 *         description: OK
 *       400:
 *         description: Error durante el inicio de sesión
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
 *         schema:
 *           type: string
 *         required: true 
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Token inválido
 *       404:
 *         description: No token provided
 */
router.get('/validateToken', validateToken);



module.exports = router;
