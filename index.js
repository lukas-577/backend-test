// Path: index.js o app.js o server.js
const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuración del servidor Express
const app = express();

// Configuración de CORS y JSON
app.use(cors({ origin: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'] }));
app.use(express.json());

// Logger para contar solicitudes
let requestCount = 0;
const logger = (req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
        const date = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
        console.log(`[${date}] [${req.method}] ${req.originalUrl} [${res.statusCode}] [Requests in the last hour: ${requestCount}]`);
        originalSend.call(this, body);
    };
    next();
};
app.use(logger);

// Configuración de Swagger
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Microservicio de Autenticación con Firebase",
            version: "1.0.0",
            description: "Este es un microservicio de autenticación con Firebase",
            contact: {
                name: "API Support",
                email: "mleiva@utem.cl",
            },
        },
        servers: [
            {
                url: "https://backend-test-sepia.vercel.app/",
                description: "Servidor de producción",
            },
            {
                url: "https://musical-disco-rxw6qqwqqvw2pvxv-4000.app.github.dev/",
                description: "Servidor local",
            },
        ],
    },
    apis: ["./routes/*.js"],
};
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { customCssUrl: CSS_URL }));

// Rutas de autenticación
const authRoutes = require('./routes/authRoutes.js');
app.use('/', authRoutes);

// Configuración del puerto y inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on host: http://localhost:${PORT}`);
});
