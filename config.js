const admin = require('firebase-admin');
const firebase = require('firebase/app');
const dotenv = require('dotenv');
dotenv.config();

// Parsear las credenciales del servicio de Firebase desde las variables de entorno
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Inicializar la aplicación de Firebase Admin con las credenciales del servicio
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Parsear las credenciales del cliente de Firebase desde las variables de entorno
const firebaseClientConfig = JSON.parse(process.env.FIREBASE_CLIENT_KEY);

// Inicializar la aplicación de Firebase Client con las credenciales del cliente
firebase.initializeApp(firebaseClientConfig);

// Inicializar Firestore, Auth y Storage
const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = { db, auth, storage, firebase };
