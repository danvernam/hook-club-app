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

function getFolkBandSongs() {
  // Folk Band songs from the screenshot
  const songs = [
    { originalTitle: "Oh! Susanna", originalArtist: "2nd South Carolina String Band" },
    { originalTitle: "Daddy Lessons", originalArtist: "Beyoncé & Dixie Chicks" },
    { originalTitle: "Run-Around", originalArtist: "Blues Traveler" },
    { originalTitle: "Mr. Tambourine Man", originalArtist: "Bob Dylan" },
    { originalTitle: "Millionaire", originalArtist: "Chris Stapleton" },
    { originalTitle: "Lookin' Out My Back Door", originalArtist: "Creedence Clearwater Revival" },
    { originalTitle: "Wagon Wheel", originalArtist: "Darius Rucker" },
    { originalTitle: "Minor Swing", originalArtist: "Django Reinhardt" },
    { originalTitle: "Jolene", originalArtist: "Dolly Parton" },
    { originalTitle: "Peaceful Easy Feeling", originalArtist: "Eagles" },
    { originalTitle: "Shape Of You", originalArtist: "Ed Sheeran" },
    { originalTitle: "Ripple", originalArtist: "Grateful Dead" },
    { originalTitle: "Just The Two Of Us", originalArtist: "Grover Washington Jr." },
    { originalTitle: "Only Wanna Be With You", originalArtist: "Hootie & The Blowfish" },
    { originalTitle: "Bad, Bad Leroy Brown", originalArtist: "Jim Croce" },
    { originalTitle: "Ring Of Fire", originalArtist: "Johnny Cash" },
    { originalTitle: "Sweet Georgia Brown", originalArtist: "Louis Armstrong" },
    { originalTitle: "Stick Season", originalArtist: "Noah Kahan" },
    { originalTitle: "Wish You Were Here", originalArtist: "Pink Floyd" },
    { originalTitle: "Cecilia", originalArtist: "Simon & Garfunkel" },
    { originalTitle: "All Of Me", originalArtist: "Standard" },
    { originalTitle: "The Weight", originalArtist: "The Band" },
    { originalTitle: "I've Just Seen A Face", originalArtist: "The Beatles" },
    { originalTitle: "Hotel California", originalArtist: "Eagles" },
    { originalTitle: "Friend Of The Devil", originalArtist: "The Grateful Dead" },
    { originalTitle: "Ho Hey", originalArtist: "The Lumineers" },
    { originalTitle: "Beast Of Burden", originalArtist: "The Rolling Stones" },
    { originalTitle: "I Won't Back Down", originalArtist: "Tom Petty" },
    { originalTitle: "Riptide", originalArtist: "Vance Joy" },
    { originalTitle: "California Stars", originalArtist: "Wilco" }
  ];
  
  console.log(`✅ Loaded ${songs.length} Folk Band songs from screenshot`);
  return songs;
}

async function findOrCreateSong(songTitle, artistName) {
  // Normalize for searching
  const normalizedTitle = normalizeText(songTitle);
  const normalizedArtist = normalizeText(artistName);
  
  // Search for existing song by title and artist
  // Get all songs and filter manually (more reliable than Firestore queries with special characters)
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
    isLive: true, // Set to active
    sections: ["Cocktail Hour"], // Add Cocktail Hour section
    ensembles: ["Folk Band (Violin + Guitar + Bass + Drums)"], // Add Folk Band ensemble
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

async function updateSongForFolkBand(song) {
  const updates = {};
  
  // Always set isLive to true
  updates.isLive = true;
  
  // Add Cocktail Hour to sections if not present
  if (!song.sections || !Array.isArray(song.sections) || !song.sections.includes('Cocktail Hour')) {
    if (!song.sections || !Array.isArray(song.sections)) {
      updates.sections = ['Cocktail Hour'];
    } else {
      updates.sections = admin.firestore.FieldValue.arrayUnion('Cocktail Hour');
    }
  }
  
  // Add Folk Band to ensembles if not present
  const folkBandEnsemble = "Folk Band (Violin + Guitar + Bass + Drums)";
  if (!song.ensembles || !Array.isArray(song.ensembles) || !song.ensembles.includes(folkBandEnsemble)) {
    if (!song.ensembles || !Array.isArray(song.ensembles)) {
      updates.ensembles = [folkBandEnsemble];
    } else {
      updates.ensembles = admin.firestore.FieldValue.arrayUnion(folkBandEnsemble);
    }
  }
  
  updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
  
  await db.collection('songs').doc(song.id).update(updates);
  console.log(`  ↻ Updated: "${song.originalTitle}" by ${song.originalArtist}`);
}

async function main() {
  try {
    console.log('🎸 Starting Folk Band songs import...\n');
    
    // Get Folk Band songs from screenshot
    const folkBandSongs = getFolkBandSongs();
    
    if (folkBandSongs.length === 0) {
      console.log('⚠️  No Folk Band songs found');
      process.exit(0);
    }
    
    console.log(`\n📝 Processing ${folkBandSongs.length} songs...\n`);
    
    let created = 0;
    let updated = 0;
    let alreadyConfigured = 0;
    let errors = 0;
    
    for (const songData of folkBandSongs) {
      try {
        // Find or create song
        const { song, isNew } = await findOrCreateSong(songData.originalTitle, songData.originalArtist);
        
        if (isNew) {
          created++;
          continue; // New songs are already configured correctly
        }
        
        if (!song || !song.id) {
          errors++;
          continue;
        }
        
        // Check if song needs updating
        const needsUpdate = 
          !song.isLive || 
          !song.sections || !Array.isArray(song.sections) || !song.sections.includes('Cocktail Hour') ||
          !song.ensembles || !Array.isArray(song.ensembles) || !song.ensembles.includes('Folk Band (Violin + Guitar + Bass + Drums)');
        
        if (needsUpdate) {
          await updateSongForFolkBand(song);
          updated++;
        } else {
          console.log(`  ✓ Already configured: "${song.originalTitle}" by ${song.originalArtist}`);
          alreadyConfigured++;
        }
        
        // Small delay to avoid rate limiting
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








