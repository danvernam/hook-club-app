const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, 'service-account-key.json');
let credential;

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = require(serviceAccountPath);
  credential = admin.credential.cert(serviceAccount);
} else {
  credential = admin.credential.applicationDefault();
}

admin.initializeApp({
  credential,
  projectId: process.env.GOOGLE_CLOUD_PROJECT || 'hook-club-app-2025'
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

function normalizeArrayField(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value].filter(Boolean);
}

async function fetchAllSongs() {
  const snapshot = await db.collection('songs').get();
  const songs = [];

  snapshot.forEach(doc => {
    songs.push({ id: doc.id, ...doc.data() });
  });

  return songs;
}

function isReceptionSong(song) {
  const danceGenres = normalizeArrayField(song.danceGenres);
  const lightGenres = normalizeArrayField(song.lightGenres);

  const hasReceptionGenres = danceGenres.length > 0 || lightGenres.length > 0;
  const isLive = song.isLive !== false;

  return isLive && hasReceptionGenres;
}

async function tagSongWithAfterParty(song) {
  const updates = { updatedAt: FieldValue.serverTimestamp() };
  const currentSections = normalizeArrayField(song.sections);

  if (!currentSections.includes('afterParty')) {
    if (currentSections.length === 0) {
      updates.sections = ['afterParty'];
    } else {
      updates.sections = FieldValue.arrayUnion('afterParty');
    }
  }

  if (!song.isLive) {
    updates.isLive = true;
  }

  if (Object.keys(updates).length > 1 || updates.sections) {
    await db.collection('songs').doc(song.id).update(updates);
  }
}

async function main() {
  try {
    console.log('🎉 Tagging Reception songs with After Party section...');

    const songs = await fetchAllSongs();
    console.log(`📚 Loaded ${songs.length} songs from Firestore`);

    let tagged = 0;
    let alreadyTagged = 0;
    let skipped = 0;
    let errors = 0;

    for (const song of songs) {
      if (!isReceptionSong(song)) {
        skipped++;
        continue;
      }

      const sections = normalizeArrayField(song.sections);

      if (sections.includes('afterParty') && song.isLive !== false) {
        alreadyTagged++;
        continue;
      }

      try {
        await tagSongWithAfterParty(song);
        tagged++;
        console.log(`  ↻ Tagged: "${song.originalTitle || song.id}" by ${song.originalArtist || 'Unknown Artist'}`);
      } catch (err) {
        errors++;
        console.error(`  ❌ Failed to update "${song.originalTitle || song.id}":`, err.message);
      }

      await new Promise(resolve => setTimeout(resolve, 25));
    }

    console.log('\n✅ Tagging complete!');
    console.log(`📊 Tagged: ${tagged}`);
    console.log(`📊 Already tagged: ${alreadyTagged}`);
    console.log(`📊 Skipped (not in Reception repertoire): ${skipped}`);
    console.log(`📊 Errors: ${errors}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

main();


