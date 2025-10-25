const admin = require('firebase-admin');

// Initialize Firebase Admin with service account
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'hook-club-app-2025'
});

const db = admin.firestore();

async function testConnection() {
  try {
    console.log('🧪 Testing Google Cloud connection...');
    
    // Test Firestore connection
    await db.collection('_test').doc('connection').set({
      test: true,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('✅ Firestore connection successful!');
    
    // Clean up test document
    await db.collection('_test').doc('connection').delete();
    
    console.log('✅ All tests passed! Your setup is ready for deployment.');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure billing is enabled for your project');
    console.log('2. Check that Firestore API is enabled');
    console.log('3. Verify your service account has proper permissions');
    process.exit(1);
  }
}

testConnection();
