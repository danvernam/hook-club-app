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

// Simple CSV parser
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result;
}

function getPianoTrioSongs() {
  // Piano Trio songs from the screenshot
  const songs = [
    { originalTitle: "Easy On Me", originalArtist: "Adele" },
    { originalTitle: "Don't Matter", originalArtist: "Akon" },
    { originalTitle: "Forever Young", originalArtist: "Alphaville" },
    { originalTitle: 'Moon River [From "Breakfast at Tiffany\'s"]', originalArtist: "Andy Williams" },
    { originalTitle: "POV", originalArtist: "Ariana Grande" },
    { originalTitle: "Air On A G String", originalArtist: "Bach" },
    { originalTitle: "Jesu, Joy of Man's Desiring", originalArtist: "Bach" },
    { originalTitle: "Halo", originalArtist: "Beyoncé" },
    { originalTitle: "Just The Way You Are", originalArtist: "Bruno Mars" },
    { originalTitle: "A Thousand Years", originalArtist: "Christina Perri" },
    { originalTitle: "Perfect", originalArtist: "Ed Sheeran" },
    { originalTitle: "Love Me Like You Do", originalArtist: "Ellie Goulding" },
    { originalTitle: "Can You Feel the Love Tonight", originalArtist: "Elton John" },
    { originalTitle: "Golden Hour", originalArtist: "JVKE" },
    { originalTitle: "Golden Hour", originalArtist: "Kacey Musgraves" },
    { originalTitle: "How Deep Is Your Love", originalArtist: "Calvin Harris, Disciples" },
    { originalTitle: "Wrecking Ball", originalArtist: "Miley Cyrus" },
    { originalTitle: 'Main Title Theme [From "Succession"]', originalArtist: "Nicholas Britell" },
    { originalTitle: "Perpetuum Mobile", originalArtist: "Penguin Cafe Orchestra" },
    { originalTitle: "Home", originalArtist: "Phillip Phillips" },
    { originalTitle: "Bridge Over Troubled Water", originalArtist: "Simon and Garfunkel" },
    { originalTitle: "I'm Gonna Be", originalArtist: "Sleeping At Last" },
    { originalTitle: "Love Story", originalArtist: "Taylor Swift" },
    { originalTitle: "Wildest Dreams", originalArtist: "Taylor Swift" },
    { originalTitle: "All You Need Is Love", originalArtist: "The Beatles" },
    { originalTitle: "Here Comes The Sun", originalArtist: "The Beatles" },
    { originalTitle: "Sweet Disposition", originalArtist: "The Temper Trap" },
    { originalTitle: "Bitter Sweet Symphony", originalArtist: "The Verve" },
    { originalTitle: "Drops Of Jupiter (Tell Me)", originalArtist: "Train" }
  ];
  
  console.log(`✅ Loaded ${songs.length} Piano Trio songs from screenshot`);
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
    sections: ["Ceremony"], // Add Ceremony section
    ensembles: ["Piano Trio (Violin + Cello + Piano)"], // Add Piano Trio ensemble
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

async function updateSongForPianoTrio(song) {
  const updates = {};
  
  // Always set isLive to true
  updates.isLive = true;
  
  // Add Ceremony to sections if not present
  if (!song.sections || !Array.isArray(song.sections) || !song.sections.includes('Ceremony')) {
    if (!song.sections || !Array.isArray(song.sections)) {
      updates.sections = ['Ceremony'];
    } else {
      updates.sections = admin.firestore.FieldValue.arrayUnion('Ceremony');
    }
  }
  
  // Add Piano Trio to ensembles if not present
  const pianoTrioEnsemble = "Piano Trio (Violin + Cello + Piano)";
  if (!song.ensembles || !Array.isArray(song.ensembles) || !song.ensembles.includes(pianoTrioEnsemble)) {
    if (!song.ensembles || !Array.isArray(song.ensembles)) {
      updates.ensembles = [pianoTrioEnsemble];
    } else {
      updates.ensembles = admin.firestore.FieldValue.arrayUnion(pianoTrioEnsemble);
    }
  }
  
  updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
  
  await db.collection('songs').doc(song.id).update(updates);
  console.log(`  ↻ Updated: "${song.originalTitle}" by ${song.originalArtist}`);
}

async function main() {
  try {
    console.log('🎹 Starting Piano Trio songs import...\n');
    
    // Get Piano Trio songs from screenshot
    const pianoTrioSongs = getPianoTrioSongs();
    
    if (pianoTrioSongs.length === 0) {
      console.log('⚠️  No Piano Trio songs found in CSV');
      process.exit(0);
    }
    
    console.log(`\n📝 Processing ${pianoTrioSongs.length} songs...\n`);
    
    let created = 0;
    let updated = 0;
    let alreadyConfigured = 0;
    let errors = 0;
    
    for (const songData of pianoTrioSongs) {
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
          !song.sections || !Array.isArray(song.sections) || !song.sections.includes('Ceremony') ||
          !song.ensembles || !Array.isArray(song.ensembles) || !song.ensembles.includes('Piano Trio (Violin + Cello + Piano)');
        
        if (needsUpdate) {
          await updateSongForPianoTrio(song);
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

