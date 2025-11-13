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

function getViolinSaxWTracksSongs() {
  // Violin + Sax w/ Tracks Cocktail Hour songs
  const songs = [
    { originalTitle: "Let's Stay Together", originalArtist: "Al Green" },
    { originalTitle: "My Head & My Heart", originalArtist: "Ava Max" },
    { originalTitle: "Lovely Day [Studio Rio Version]", originalArtist: "Bill Withers, Studio Rio" },
    { originalTitle: "Havana", originalArtist: "Camila Cabello" },
    { originalTitle: "Cut To The Feeling", originalArtist: "Carly Rae Jepson" },
    { originalTitle: "Ain't Nobody", originalArtist: "Chaka Khan" },
    { originalTitle: "Believe", originalArtist: "Cher" },
    { originalTitle: "Rather Be", originalArtist: "Clean Bandit, Jess Glynne" },
    { originalTitle: "Feel Like Makin' Love", originalArtist: "D'Angelo" },
    { originalTitle: "Titanium", originalArtist: "David Guetta, Sia" },
    { originalTitle: "Passionfruit", originalArtist: "Drake" },
    { originalTitle: "Don't Start Now", originalArtist: "Dua Lipa" },
    { originalTitle: "Levitating", originalArtist: "Dua Lipa" },
    { originalTitle: "Dreams", originalArtist: "Fleetwood Mac" },
    { originalTitle: "Crazy", originalArtist: "Gnarls Barkley" },
    { originalTitle: "As It Was", originalArtist: "Harry Styles" },
    { originalTitle: "Head & Heart", originalArtist: "Joel Corry, MNEK" },
    { originalTitle: "Dancing In The Moonlight", originalArtist: "Jubël, NEIMY" },
    { originalTitle: "Sorry", originalArtist: "Justin Bieber" },
    { originalTitle: "This Girl", originalArtist: "Kungs, Cookin' On 3 Burners" },
    { originalTitle: "Body", originalArtist: "Loud Luxury, Brando" },
    { originalTitle: "Peru", originalArtist: "Fireboy DML, Ed Sheeran" },
    { originalTitle: "Latch", originalArtist: "Sam Smith" },
    { originalTitle: "Señorita", originalArtist: "Shawn Mendes, Camila Cabello" },
    { originalTitle: "Unstoppable", originalArtist: "Sia" },
    { originalTitle: "I Wish", originalArtist: "Stevie Wonder" },
    { originalTitle: "Isn't She Lovely", originalArtist: "Stevie Wonder" },
    { originalTitle: "How Deep Is Your Love", originalArtist: "Bee Gees" },
    { originalTitle: "Dance Monkey", originalArtist: "Tones And I" },
    { originalTitle: "Water", originalArtist: "Tyla" }
  ];
  
  console.log(`✅ Loaded ${songs.length} Violin + Sax w/ Tracks Cocktail Hour songs`);
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
    ensembles: ["Violin + Sax w/ Tracks (Violin + Sax + DJ)"],
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

async function updateSongForViolinSaxWTracks(song) {
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
  
  const ensemble = "Violin + Sax w/ Tracks (Violin + Sax + DJ)";
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
    console.log('🎻🎷 Starting Violin + Sax w/ Tracks Cocktail Hour songs import...\n');
    
    const violinSaxWTracksSongs = getViolinSaxWTracksSongs();
    
    if (violinSaxWTracksSongs.length === 0) {
      console.log('⚠️  No songs found');
      process.exit(0);
    }
    
    console.log(`\n📝 Processing ${violinSaxWTracksSongs.length} songs...\n`);
    
    let created = 0;
    let updated = 0;
    let alreadyConfigured = 0;
    let errors = 0;
    
    for (const songData of violinSaxWTracksSongs) {
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
          !song.ensembles || !Array.isArray(song.ensembles) || !song.ensembles.includes('Violin + Sax w/ Tracks (Violin + Sax + DJ)');
        
        if (needsUpdate) {
          await updateSongForViolinSaxWTracks(song);
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

