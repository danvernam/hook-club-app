const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

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

function normalizeArrayField(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value].filter(Boolean);
}

async function main() {
  try {
    console.log('🔍 Finding songs tagged for After Party but not in Reception repertoire...');

    const snapshot = await db.collection('songs').get();
    const outliers = [];

    snapshot.forEach(doc => {
      const song = { id: doc.id, ...doc.data() };
      const sections = normalizeArrayField(song.sections);

      if (!sections.includes('afterParty')) return;

      const danceGenres = normalizeArrayField(song.danceGenres);
      const lightGenres = normalizeArrayField(song.lightGenres);

      if (danceGenres.length === 0 && lightGenres.length === 0) {
        outliers.push(song);
      }
    });

    if (outliers.length === 0) {
      console.log('✅ All After Party songs are also in Reception repertoire.');
    } else {
      console.log(`⚠️ Found ${outliers.length} After Party songs without Reception genres:\n`);
      outliers.forEach(song => {
        console.log(`- ${song.originalTitle || song.id} — ${song.originalArtist || 'Unknown Artist'} (id: ${song.id})`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error while finding outliers:', error);
    process.exit(1);
  }
}

main();







