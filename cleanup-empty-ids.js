const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: process.env.GOOGLE_CLOUD_PROJECT || 'hook-club-app-2025'
});

const db = admin.firestore();

async function cleanupEmptyIds() {
  try {
    console.log('🔍 Finding songs with empty IDs in Firestore...');
    
    const songsSnapshot = await db.collection('songs').get();
    const songsToDelete = [];
    
    songsSnapshot.forEach(doc => {
      const data = doc.data();
      // Check if the document has empty ID or if the song data has empty ID
      if (!doc.id || doc.id === '' || !data.id || data.id === '') {
        songsToDelete.push({
          docId: doc.id,
          thcTitle: data.thcTitle,
          originalArtist: data.originalArtist,
          isLive: data.isLive
        });
      }
    });
    
    console.log(`📊 Found ${songsToDelete.length} songs with empty IDs:`);
    songsToDelete.forEach((song, index) => {
      console.log(`${index + 1}. "${song.thcTitle}" by ${song.originalArtist} (Doc ID: ${song.docId}, isLive: ${song.isLive})`);
    });
    
    if (songsToDelete.length > 0) {
      console.log('\n🗑️  Deleting songs with empty IDs from Firestore...');
      
      // Delete songs with empty IDs in batches
      const batch = db.batch();
      let deleteCount = 0;
      
      for (const song of songsToDelete) {
        if (song.docId && song.docId !== '') {
          const docRef = db.collection('songs').doc(song.docId);
          batch.delete(docRef);
          deleteCount++;
          console.log(`✅ Marked for deletion: "${song.thcTitle}" by ${song.originalArtist}`);
        }
      }
      
      if (deleteCount > 0) {
        await batch.commit();
        console.log(`\n🎉 Successfully deleted ${deleteCount} songs with empty IDs from Firestore!`);
      } else {
        console.log('\n⚠️  No valid documents found to delete.');
      }
    } else {
      console.log('✅ No songs with empty IDs found in Firestore.');
    }
    
    // Get updated count
    const updatedSnapshot = await db.collection('songs').get();
    console.log(`\n📈 Updated song count: ${updatedSnapshot.size} songs in Firestore`);
    
  } catch (error) {
    console.error('❌ Error cleaning up empty IDs:', error);
  }
}

cleanupEmptyIds();
