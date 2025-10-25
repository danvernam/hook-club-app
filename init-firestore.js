const admin = require('firebase-admin');

// Initialize Firebase Admin with service account
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'hook-club-app-2025'
});

const db = admin.firestore();

async function initFirestore() {
  try {
    console.log('Initializing Firestore database...');
    
    // Create a test document to initialize the database
    await db.collection('_init').doc('setup').set({
      initialized: true,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('✅ Firestore database initialized successfully!');
    console.log('📁 Database is ready for your songs data');
    
  } catch (error) {
    console.error('❌ Error initializing Firestore:', error);
    process.exit(1);
  }
}

initFirestore();
