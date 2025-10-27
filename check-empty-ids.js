const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: process.env.GOOGLE_CLOUD_PROJECT || 'hook-club-app-2025'
});

const db = admin.firestore();

async function checkEmptyIds() {
  try {
    console.log('Checking for songs with empty IDs...');
    
    const songsSnapshot = await db.collection('songs').get();
    const songs = [];
    
    songsSnapshot.forEach(doc => {
      const data = doc.data();
      songs.push({ 
        id: doc.id, 
        thcTitle: data.thcTitle,
        originalArtist: data.originalArtist,
        isLive: data.isLive
      });
    });
    
    console.log(`Total songs: ${songs.length}`);
    
    // Check for empty IDs
    const emptyIdSongs = songs.filter(song => !song.id || song.id === '');
    console.log(`Songs with empty IDs: ${emptyIdSongs.length}`);
    
    if (emptyIdSongs.length > 0) {
      console.log('Empty ID songs:');
      emptyIdSongs.forEach(song => {
        console.log(`- "${song.thcTitle}" by ${song.originalArtist} (isLive: ${song.isLive})`);
      });
    }
    
    // Check for duplicate thcTitles
    const titleCounts = {};
    songs.forEach(song => {
      if (song.thcTitle) {
        titleCounts[song.thcTitle] = (titleCounts[song.thcTitle] || 0) + 1;
      }
    });
    
    const duplicates = Object.entries(titleCounts).filter(([title, count]) => count > 1);
    console.log(`Duplicate thcTitles: ${duplicates.length}`);
    
    if (duplicates.length > 0) {
      console.log('Duplicate titles:');
      duplicates.forEach(([title, count]) => {
        console.log(`- "${title}" appears ${count} times`);
        const songsWithTitle = songs.filter(s => s.thcTitle === title);
        songsWithTitle.forEach(song => {
          console.log(`  - ID: "${song.id}", Artist: ${song.originalArtist}, isLive: ${song.isLive}`);
        });
      });
    }
    
  } catch (error) {
    console.error('Error checking songs:', error);
  }
}

checkEmptyIds();
