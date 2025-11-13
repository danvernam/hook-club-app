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
  credential: credential,
  projectId: process.env.GOOGLE_CLOUD_PROJECT || 'hook-club-app-2025'
});

const db = admin.firestore();

// Helper function to create ID from title
function createId(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper function to normalize title and artist for comparison
function normalizeText(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '');
}

// Helper function to get current timestamp
function getCurrentTimestamp() {
  return new Date().toISOString();
}

function getJazzyTrioSongs() {
  // Jazzy Trio Cocktail Hour songs
  const songs = [
    { originalTitle: "Let's Stay Together", originalArtist: "Al Green" },
    { originalTitle: "Valerie [Acoustic]", originalArtist: "Amy Winehouse" },
    { originalTitle: "Besame Mucho", originalArtist: "Andrea Bocelli" },
    { originalTitle: "Wave", originalArtist: "Antonio Carlos Jobim" },
    { originalTitle: "I Say A Little Prayer", originalArtist: "Aretha Franklin" },
    { originalTitle: "bad guy", originalArtist: "Billie Eilish" },
    { originalTitle: "What You Won't Do For Love", originalArtist: "Bobby Caldwell" },
    { originalTitle: "Body & Soul", originalArtist: "Coleman Hawkins" },
    { originalTitle: "Blue Bossa", originalArtist: "Dexter Gordon" },
    { originalTitle: "Dream A Little Dream of Me", originalArtist: "Ella Fitzgerald, Louis Armstrong" },
    { originalTitle: "Fly Me To The Moon", originalArtist: "Frank Sinatra" },
    { originalTitle: "Killing Me Softly With His Song", originalArtist: "Fugees" },
    { originalTitle: "Careless Whisper", originalArtist: "George Michael" },
    { originalTitle: "Just The Two Of Us", originalArtist: "Grover Washington, Jr.; Bill Withers" },
    { originalTitle: "Watermelon Sugar", originalArtist: "Harry Styles" },
    { originalTitle: "I Hear A Rhapsody", originalArtist: "John Coltrane" },
    { originalTitle: "Love Yourself", originalArtist: "Justin Bieber" },
    { originalTitle: "Willkommen [From \"Cabaret\"]", originalArtist: "Kander and Ebb" },
    { originalTitle: "Have You Met Miss Jones?", originalArtist: "Kenny Garrett" },
    { originalTitle: "Sunday Morning", originalArtist: "Maroon 5" },
    { originalTitle: "Four", originalArtist: "Miles Davis Quintet" },
    { originalTitle: "Can't Take My Eyes Off Of You", originalArtist: "Ms. Lauryn Hill" },
    { originalTitle: "Don't Know Why", originalArtist: "Norah Jones" },
    { originalTitle: "Tenor Madness", originalArtist: "Sonny Rollins Quartet" },
    { originalTitle: "The Girl From Ipanema", originalArtist: "Stan Getz, Joao Gilberto" },
    { originalTitle: "Isn't She Lovely", originalArtist: "Stevie Wonder" },
    { originalTitle: "Santería", originalArtist: "Sublime" },
    { originalTitle: "Free Fallin'", originalArtist: "Tom Petty" },
    { originalTitle: "I Won't Back Down", originalArtist: "Tom Petty" },
    { originalTitle: "Moondance", originalArtist: "Van Morrison" }
  ];
  
  console.log(`✅ Loaded ${songs.length} Jazzy Trio Cocktail Hour songs`);
  return songs;
}

async function findOrCreateSong(songTitle, artistName) {
  // Normalize for searching
  const normalizedTitle = normalizeText(songTitle);
  const normalizedArtist = normalizeText(artistName);
  
  // Search for existing song by title and artist
  const songsSnapshot = await db.collection('songs').get();
  
  let existingSong = null;
  songsSnapshot.forEach(doc => {
    const song = doc.data();
    if (normalizeText(song.originalTitle || '') === normalizedTitle && 
        normalizeText(song.originalArtist || '') === normalizedArtist) {
      existingSong = { id: doc.id, ...song };
    }
  });
  
  if (existingSong) {
    console.log(`  ✓ Found existing: "${songTitle}" by ${artistName}`);
    return { song: existingSong, isNew: false };
  }
  
  // Create new song
  const songId = createId(songTitle);
  const newSong = {
    id: songId,
    originalTitle: songTitle,
    originalArtist: artistName,
    thcTitle: songTitle,
    thcArtist: "The Hook Club",
    videoUrl: "",
    spotifyUrl: "",
    originalBpm: null,
    thcBpm: null,
    isLive: true,
    sections: ["Cocktail Hour"],
    ensembles: ["Jazzy Trio (Sax + Guitar + Drums)"],
    genres: [],
    specialMomentTypes: [],
    thcPercent: null,
    notes: "",
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
    originalKey: null,
    requiresLeadVocalist: false,
    leadVocalistRole: "",
    leadVocalistPart: "",
    requiresBackgroundVocals: false,
    backgroundVocalCount: 0,
    backgroundVocalRoles: [],
    backgroundVocalParts: [],
    backgroundVocalPartNames: [],
    leadSheet: false,
    fullBandArrangement: false,
    hornChart: false,
    sheetMusicStandard: false,
    chartLyricsSpecial: false,
    hornChartSpecial: false,
    chordLyricChartUrl: "",
    ensembleSheetMusic: {},
    keyVersions: [
      {
        key: "C",
        isDefault: true,
        bpm: null,
        chordLyricChartUrl: "",
        leadSheetUrl: "",
        fullBandArrangementUrl: "",
        hornChartUrl: "",
        sheetMusicStandardUrl: "",
        chartLyricsSpecialUrl: "",
        hornChartSpecialUrl: ""
      }
    ],
    danceGenres: [],
    lightGenres: []
  };
  
  console.log(`  + Creating new: "${songTitle}" by ${artistName}`);
  await db.collection('songs').doc(songId).set(newSong);
  
  return { song: { id: songId, ...newSong }, isNew: true };
}

async function updateSongForJazzyTrio(song) {
  const songRef = db.collection('songs').doc(song.id);
  const songDoc = await songRef.get();
  
  const updates = {};
  updates.isLive = true;
  
  if (!song.sections || !Array.isArray(song.sections) || !song.sections.includes('Cocktail Hour')) {
    if (!song.sections || !Array.isArray(song.sections)) {
      updates.sections = ['Cocktail Hour'];
    } else {
      updates.sections = admin.firestore.FieldValue.arrayUnion('Cocktail Hour');
    }
  }
  
  const ensemble = "Jazzy Trio (Sax + Guitar + Drums)";
  if (!song.ensembles || !Array.isArray(song.ensembles) || !song.ensembles.includes(ensemble)) {
    if (!song.ensembles || !Array.isArray(song.ensembles)) {
      updates.ensembles = [ensemble];
    } else {
      updates.ensembles = admin.firestore.FieldValue.arrayUnion(ensemble);
    }
  }
  
  updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
  
  if (songDoc.exists) {
    await songRef.update(updates);
    console.log(`  ↻ Updated: "${song.originalTitle}" by ${song.originalArtist}`);
  } else {
    // Document doesn't exist, create it
    await songRef.set({
      ...song,
      ...updates
    }, { merge: true });
    console.log(`  ↻ Created in Firestore: "${song.originalTitle}" by ${song.originalArtist}`);
  }
}

async function main() {
  try {
    console.log('🎷🎸🥁 Starting Jazzy Trio Cocktail Hour songs import...\n');
    
    const jazzyTrioSongs = getJazzyTrioSongs();
    
    if (jazzyTrioSongs.length === 0) {
      console.log('⚠️  No songs found');
      process.exit(0);
    }
    
    console.log(`\n📝 Processing ${jazzyTrioSongs.length} songs...\n`);
    
    let created = 0;
    let updated = 0;
    let alreadyConfigured = 0;
    let errors = 0;
    
    for (const songData of jazzyTrioSongs) {
      try {
        const { song, isNew } = await findOrCreateSong(songData.originalTitle, songData.originalArtist);
        
        if (isNew) {
          created++;
          continue;
        }
        
        if (!song || !song.id) {
          errors++;
          continue;
        }
        
        const needsUpdate = 
          !song.isLive || 
          !song.sections || !Array.isArray(song.sections) || !song.sections.includes('Cocktail Hour') ||
          !song.ensembles || !Array.isArray(song.ensembles) || !song.ensembles.includes('Jazzy Trio (Sax + Guitar + Drums)');
        
        if (needsUpdate) {
          await updateSongForJazzyTrio(song);
          updated++;
        } else {
          console.log(`  ✓ Already configured: "${song.originalTitle}" by ${song.originalArtist}`);
          alreadyConfigured++;
        }
        
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        console.error(`  ❌ Error processing "${songData.originalTitle}" by ${songData.originalArtist}:`, error.message);
        errors++;
      }
    }
    
    console.log('\n✅ Import complete!');
    console.log(`📊 Created: ${created} songs`);
    console.log(`📊 Updated: ${updated} songs`);
    console.log(`📊 Already configured: ${alreadyConfigured} songs`);
    console.log(`📊 Errors: ${errors} songs`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

main();

