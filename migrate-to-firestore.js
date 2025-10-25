const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: process.env.GOOGLE_CLOUD_PROJECT || 'hook-club-app-2025'
});

const db = admin.firestore();

async function migrateSongs() {
  try {
    console.log('Reading songs.json...');
    const songsPath = path.join(__dirname, 'public', 'data', 'songs.json');
    const songsData = JSON.parse(fs.readFileSync(songsPath, 'utf8'));
    
    console.log(`Found ${songsData.songs.length} songs to migrate`);
    
    const BATCH_SIZE = 500; // Firestore batch limit
    
    for (let i = 0; i < songsData.songs.length; i += BATCH_SIZE) {
      const batch = db.batch(); // Create new batch for each iteration
      const currentBatch = songsData.songs.slice(i, i + BATCH_SIZE);
      
      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(songsData.songs.length / BATCH_SIZE)} (${currentBatch.length} songs)...`);
      
      for (const song of currentBatch) {
        const songRef = db.collection('songs').doc(song.id);
        
        // Convert timestamps to Firestore format
        const songData = {
          ...song,
          createdAt: song.createdAt ? admin.firestore.Timestamp.fromDate(new Date(song.createdAt)) : admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: song.updatedAt ? admin.firestore.Timestamp.fromDate(new Date(song.updatedAt)) : admin.firestore.FieldValue.serverTimestamp()
        };
        
        batch.set(songRef, songData);
      }
      
      await batch.commit();
      console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1} committed successfully.`);
    }
    
    console.log(`✅ Successfully migrated ${songsData.songs.length} songs to Firestore`);
    
    // Update metadata
    await db.collection('metadata').doc('songs').set({
      totalSongs: songsData.songs.length,
      activeSongs: songsData.metadata.activeSongs,
      inactiveSongs: songsData.metadata.inactiveSongs,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateSongs();
