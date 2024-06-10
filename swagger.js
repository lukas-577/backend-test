// Path: swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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

module.exports = (app) => {
    app.use(
        '/'
        , swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            customCss:
                '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
            customCssUrl: CSS_URL,
        }),
    )
}
