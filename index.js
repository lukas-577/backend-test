// Path: app.js o server.js
const express = require('express');
const cors = require('cors');
const { db, auth, storage, firebase } = require('./config.js');

const authRoutes = require('./routes/authRoutes.js');
const swaggerSetup = require('./swagger.js');
const app = express();


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

app.use(cors({ origin: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'] }));
app.use(express.json());

app.use(logger);
app.use('/auth', authRoutes);

swaggerSetup(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on host: http://localhost:${PORT}`);
});
