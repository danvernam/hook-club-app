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

function getJazzQuartetSongs() {
  // Jazz Quartet songs from the screenshot
  const songs = [
    { originalTitle: "Wave", originalArtist: "Antonio Carlos Jobim" },
    { originalTitle: "Someday My Prince Will Come", originalArtist: "Bill Evans Trio" },
    { originalTitle: "Just The Way You Are", originalArtist: "Billy Joel" },
    { originalTitle: "What You Won't Do For Love", originalArtist: "Bobby Caldwell" },
    { originalTitle: "All The Things You Are", originalArtist: "Chet Baker" },
    { originalTitle: "Body & Soul", originalArtist: "Coleman Hawkins" },
    { originalTitle: "Feel Like Makin' Love", originalArtist: "D'Angelo" },
    { originalTitle: "Blue Bossa", originalArtist: "Dexter Gordon" },
    { originalTitle: "Honeysuckle Rose", originalArtist: "Ella Fitzgerald, Count Basie" },
    { originalTitle: "Dream A Little Dream of Me", originalArtist: "Ella Fitzgerald, Louis Armstrong" },
    { originalTitle: "Fly Me To The Moon", originalArtist: "Frank Sinatra" },
    { originalTitle: "Red Clay", originalArtist: "Freddie Hubbard" },
    { originalTitle: "Killing Me Softly With His Song", originalArtist: "Fugees" },
    { originalTitle: "Careless Whisper", originalArtist: "George Michael" },
    { originalTitle: "Just The Two Of Us", originalArtist: "Grover Washington, Bill Withers" },
    { originalTitle: "Chameleon", originalArtist: "Herbie Hancock" },
    { originalTitle: "Cantaloupe Island", originalArtist: "Herbie Hancock" },
    { originalTitle: "I Hear a Rhapsody", originalArtist: "John Coltrane" },
    { originalTitle: "Love Yourself", originalArtist: "Justin Bieber" },
    { originalTitle: "Have You Met Miss Jones?", originalArtist: "Kenny Garrett" },
    { originalTitle: "So What", originalArtist: "Miles Davies Sextet" },
    { originalTitle: "Four", originalArtist: "Miles Davis Quintet" },
    { originalTitle: "Can't Take My Eyes Off Of You", originalArtist: "Ms. Lauryn Hill" },
    { originalTitle: "Don't Know Why", originalArtist: "Norah Jones" },
    { originalTitle: "Strasbourg/St. Denis", originalArtist: "Roy Hargrove" },
    { originalTitle: "Beatrice", originalArtist: "Sam Rivers" },
    { originalTitle: "Tenor Madness", originalArtist: "Sonny Rollins Quartet" },
    { originalTitle: "The Girl From Ipanema", originalArtist: "Stan Getz, Joao Gilberto" },
    { originalTitle: "You Are The Sunshine Of My Life", originalArtist: "Stevie Wonder" },
    { originalTitle: "Moondance", originalArtist: "Van Morrison" }
  ];
  
  console.log(`✅ Loaded ${songs.length} Jazz Quartet songs from screenshot`);
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
    ensembles: ["Jazz Quartet (Sax + Piano + Bass + Drums)"], // Add Jazz Quartet ensemble
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

async function updateSongForJazzQuartet(song) {
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
  
  // Add Jazz Quartet to ensembles if not present
  const jazzQuartetEnsemble = "Jazz Quartet (Sax + Piano + Bass + Drums)";
  if (!song.ensembles || !Array.isArray(song.ensembles) || !song.ensembles.includes(jazzQuartetEnsemble)) {
    if (!song.ensembles || !Array.isArray(song.ensembles)) {
      updates.ensembles = [jazzQuartetEnsemble];
    } else {
      updates.ensembles = admin.firestore.FieldValue.arrayUnion(jazzQuartetEnsemble);
    }
  }
  
  updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
  
  await db.collection('songs').doc(song.id).update(updates);
  console.log(`  ↻ Updated: "${song.originalTitle}" by ${song.originalArtist}`);
}

async function main() {
  try {
    console.log('🎷 Starting Jazz Quartet songs import...\n');
    
    // Get Jazz Quartet songs from screenshot
    const jazzQuartetSongs = getJazzQuartetSongs();
    
    if (jazzQuartetSongs.length === 0) {
      console.log('⚠️  No Jazz Quartet songs found');
      process.exit(0);
    }
    
    console.log(`\n📝 Processing ${jazzQuartetSongs.length} songs...\n`);
    
    let created = 0;
    let updated = 0;
    let alreadyConfigured = 0;
    let errors = 0;
    
    for (const songData of jazzQuartetSongs) {
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
          !song.ensembles || !Array.isArray(song.ensembles) || !song.ensembles.includes('Jazz Quartet (Sax + Piano + Bass + Drums)');
        
        if (needsUpdate) {
          await updateSongForJazzQuartet(song);
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

