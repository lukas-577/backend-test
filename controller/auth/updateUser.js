// Path: controller/auth/updateUser.js
const { auth, db } = require('../../config.js');

const updateUser = async (req, res) => {
    const { uid, displayName } = req.body;

    try {
        // Obtener el perfil del usuario desde Firebase Authentication
        const userRecord = await auth.getUser(uid);
        const { email } = userRecord;

        // Actualizar el perfil del usuario en Firebase Authentication
        await auth.updateUser(uid, { displayName });

        // Sino existe debe crearlo
        const userRef = db.collection('users').doc(uid);
        await userRef.set({ email, displayName }, { merge: true });

        res.send('User profile updated successfully');
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(400).send(error.message);
    }
}

module.exports = updateUser;
