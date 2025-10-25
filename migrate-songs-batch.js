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
    const data = JSON.parse(fs.readFileSync(songsPath, 'utf8'));
    
    const songs = data.songs;
    console.log(`Found ${songs.length} songs to migrate`);
    
    // Upload in batches of 100
    const BATCH_SIZE = 100;
    let uploaded = 0;
    
    for (let i = 0; i < songs.length; i += BATCH_SIZE) {
      const batch = db.batch();
      const songsChunk = songs.slice(i, Math.min(i + BATCH_SIZE, songs.length));
      
      for (const song of songsChunk) {
        const docRef = db.collection('songs').doc(song.id);
        batch.set(docRef, song, { merge: true });
      }
      
      await batch.commit();
      uploaded += songsChunk.length;
      console.log(`Uploaded ${uploaded}/${songs.length} songs (${Math.round(uploaded/songs.length*100)}%)`);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('✅ Migration complete!');
    console.log(`📊 Total songs migrated: ${uploaded}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateSongs();
