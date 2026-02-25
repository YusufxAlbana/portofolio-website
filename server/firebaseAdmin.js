const admin = require('firebase-admin');

// We need to initialize the app with a service account or default credentials
// For Vercel/Render, we usually use environment variables.
// Since the user just provided the Client Config, we will use it for the Admin SDK too,
// but note that for true admin access (bypassing rules), a serviceAccountKey.json is needed.
// However, since we are only using this as a simple backend, we can construct the config.

// For now, we'll try to use the default app initialization. If it fails, we fall back.
// To make it secure, the user would need to provide a service account JSON, 
// but we'll try to work with what Vercel provides or what we have.

// WARNING: using pure client config in admin SDK will not give admin privileges 
// unless `GOOGLE_APPLICATION_CREDENTIALS` is set in the environment.
// For now, we will construct a basic admin app.

try {
  admin.initializeApp({
      credential: admin.credential.applicationDefault(), // This requires GOOGLE_APPLICATION_CREDENTIALS in env
      storageBucket: "portofolio-13667.firebasestorage.app"
  });
} catch (error) {
    if (!/already exists/.test(error.message)) {
        console.error('Firebase Admin Initialization Error:', error.stack);
    }
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };
