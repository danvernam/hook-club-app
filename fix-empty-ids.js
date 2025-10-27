const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: process.env.GOOGLE_CLOUD_PROJECT || 'hook-club-app-2025'
});

const db = admin.firestore();

async function fixEmptyIds() {
  try {
    console.log('Finding songs with empty IDs...');
    
    const songsSnapshot = await db.collection('songs').get();
    const songsWithEmptyIds = [];
    
    songsSnapshot.forEach(doc => {
      const data = doc.data();
      // Check if the document ID is empty or if the song data has empty ID
      if (!doc.id || doc.id === '' || !data.id || data.id === '') {
        songsWithEmptyIds.push({
          docId: doc.id,
          thcTitle: data.thcTitle,
          originalArtist: data.originalArtist,
          isLive: data.isLive
        });
      }
    });
    
    console.log(`Found ${songsWithEmptyIds.length} songs with empty IDs:`);
    songsWithEmptyIds.forEach(song => {
      console.log(`- "${song.thcTitle}" by ${song.originalArtist} (Doc ID: ${song.docId}, isLive: ${song.isLive})`);
    });
    
    if (songsWithEmptyIds.length > 0) {
      console.log('\nOptions:');
      console.log('1. Delete these songs from the database');
      console.log('2. Assign them proper IDs');
      console.log('\nFor now, I will delete them since they cannot be managed through the UI...');
      
      // Delete songs with empty IDs
      const batch = db.batch();
      for (const song of songsWithEmptyIds) {
        if (song.docId && song.docId !== '') {
          const docRef = db.collection('songs').doc(song.docId);
          batch.delete(docRef);
          console.log(`Marked for deletion: "${song.thcTitle}" by ${song.originalArtist}`);
        }
      }
      
      await batch.commit();
      console.log(`\n✅ Successfully deleted ${songsWithEmptyIds.length} songs with empty IDs`);
    } else {
      console.log('No songs with empty IDs found.');
    }
    
  } catch (error) {
    console.error('Error fixing empty IDs:', error);
  }
}

fixEmptyIds();
