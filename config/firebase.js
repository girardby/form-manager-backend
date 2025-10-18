const admin = require('firebase-admin');

let firebaseApp = null;

function initializeFirebase() {
    if (firebaseApp) {
        return firebaseApp;
    }

    try {
        const serviceAccount = {
            type: 'service_account',
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key: process.env.FIREBASE_PRIVATE_KEY ? 
                process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
        };

        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        console.log('Firebase initialized successfully');
        return firebaseApp;
    } catch (error) {
        console.error('Firebase initialization error:', error.message);
        return null;
    }
}

function sendPushNotification(token, title, body, data = {}) {
    const firebase = initializeFirebase();
    
    if (!firebase) {
        throw new Error('Firebase not initialized');
    }

    const message = {
        notification: {
            title: title,
            body: body
        },
        data: data,
        token: token
    };

    return admin.messaging().send(message);
}

function sendMulticastNotification(tokens, title, body, data = {}) {
    const firebase = initializeFirebase();
    
    if (!firebase) {
        throw new Error('Firebase not initialized');
    }

    const message = {
        notification: {
            title: title,
            body: body
        },
        data: data,
        tokens: tokens
    };

    return admin.messaging().sendMulticast(message);
}

module.exports = {
    initializeFirebase,
    sendPushNotification,
    sendMulticastNotification
};
