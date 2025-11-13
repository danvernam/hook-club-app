const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, 'service-account-key.json');
let credential;

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = require(serviceAccountPath);
  credential = admin.credential.cert(serviceAccount);
} else {
  credential = admin.credential.applicationDefault();
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: credential,
    projectId: process.env.GOOGLE_CLOUD_PROJECT || 'hook-club-app-2025'
  });
}

const db = admin.firestore();

// Function to create a URL-safe ID from song title
function createId(title) {
  if (!title) return null;
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 100); // Limit length
}

// Function to normalize song title for matching
function normalizeTitle(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

// Function to normalize artist name for matching
function normalizeArtist(artist) {
  if (!artist) return '';
  return artist
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

// Function to find matching song in database
function findMatchingSong(songTitle, artistName, existingSongs) {
  const normalizedTitle = normalizeTitle(songTitle);
  const normalizedArtist = normalizeArtist(artistName);
  
  // First try exact match
  for (const song of existingSongs) {
    if (normalizeTitle(song.originalTitle) === normalizedTitle &&
        normalizeArtist(song.originalArtist) === normalizedArtist) {
      return song;
    }
  }
  
  // Then try title-only match (in case artist differs slightly)
  for (const song of existingSongs) {
    if (normalizeTitle(song.originalTitle) === normalizedTitle) {
      return song;
    }
  }
  
  // Finally try fuzzy match (contains)
  for (const song of existingSongs) {
    const songTitleNorm = normalizeTitle(song.originalTitle);
    if (songTitleNorm.includes(normalizedTitle) || normalizedTitle.includes(songTitleNorm)) {
      return song;
    }
  }
  
  return null;
}

// Function to create a new song object
function createNewSong(title, artist) {
  const songId = createId(title) || `song-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toISOString();
  
  return {
    id: songId,
    originalTitle: title,
    originalArtist: artist || 'Unknown Artist',
    thcTitle: title,
    thcArtist: "The Hook Club",
    videoUrl: "",
    spotifyUrl: "",
    originalBpm: null,
    thcBpm: null,
    isLive: true, // Make active
    sections: ["Ceremony"], // Add to Ceremony section
    ensembles: ["Classic Duo (Piano + Guitar)"], // Add Classic Duo ensemble
    genres: [],
    danceGenres: [],
    lightGenres: [],
    specialMomentTypes: [],
    specialMomentRecommendations: [],
    thcPercent: null,
    notes: "",
    createdAt: timestamp,
    updatedAt: timestamp,
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
        hornChartUrl: null,
        sheetMusicStandardUrl: "",
        chartLyricsSpecialUrl: null,
        hornChartSpecialUrl: null
      }
    ]
  };
}

// Classic Duo songs from the Guest Arrival Selections
const classicDuoSongs = [
  { title: "Make You Feel My Love", artist: "Adele" },
  { title: "If I Ain't Got You", artist: "Alicia Keys" },
  { title: "Grow As We Go", artist: "Ben Platt" },
  { title: "Ave Maria", artist: "Beyoncé" },
  { title: "Untitled (How Does It Feel)", artist: "D'Angelo" },
  { title: "Best Part", artist: "Daniel Caesar, H.E.R." },
  { title: "My Sweet Lord", artist: "George Harrison" },
  { title: "Falling Slowly", artist: "Glen Hansard, Markéta Irglová" },
  { title: "Naked As We Came", artist: "Iron & Wine" },
  { title: "Heartbeats", artist: "José González" },
  { title: "Golden Hour", artist: "Kacey Musgraves" },
  { title: "Shallow", artist: "Lady Gaga, Bradley Cooper" },
  { title: "River", artist: "Leon Bridges" },
  { title: "Always Be My Baby", artist: "Mariah Carey" },
  { title: "Sunday Morning", artist: "Maroon 5" },
  { title: "Come Away With Me", artist: "Norah Jones" },
  { title: "The Only Exception", artist: "Paramore" },
  { title: "Hallelujah", artist: "Rufus Wainwright" },
  { title: "I'm Gonna Be (500 Miles)", artist: "Sleeping At Last" },
  { title: "Overjoyed", artist: "Stevie Wonder" },
  { title: "My Cherie Amour", artist: "Stevie Wonder" },
  { title: "You Are The Sunshine Of My Life", artist: "Stevie Wonder" },
  { title: "Here Comes The Sun", artist: "The Beatles" },
  { title: "Something", artist: "The Beatles" },
  { title: "Jesus, Etc.", artist: "Wilco" }
];

// Main function
async function processClassicDuoSongs() {
  try {
    console.log('🎸 Processing Classic Duo Ceremony Songs...\n');
    
    // Load existing songs from JSON file
    const songsJsonPath = path.join(__dirname, 'public', 'data', 'songs.json');
    console.log(`Loading existing songs from: ${songsJsonPath}`);
    const songsData = JSON.parse(fs.readFileSync(songsJsonPath, 'utf8'));
    const existingSongs = songsData.songs || [];
    console.log(`Found ${existingSongs.length} existing songs in database\n`);
    
    // Process each song
    const songsToCreate = [];
    const songsToUpdate = [];
    const songsNotFound = [];
    
    for (const classicDuoSong of classicDuoSongs) {
      const matchingSong = findMatchingSong(classicDuoSong.title, classicDuoSong.artist, existingSongs);
      
      if (matchingSong) {
        // Song exists - check if it needs updating
        const needsUpdate = 
          !matchingSong.isLive ||
          !matchingSong.sections?.includes('Ceremony') ||
          !matchingSong.ensembles?.includes('Classic Duo (Piano + Guitar)');
        
        if (needsUpdate) {
          songsToUpdate.push({
            existing: matchingSong,
            csv: classicDuoSong
          });
        } else {
          console.log(`✓ ${classicDuoSong.title} by ${classicDuoSong.artist} - already configured correctly`);
        }
      } else {
        // Song doesn't exist - create it
        songsToCreate.push(classicDuoSong);
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`  - Songs to create: ${songsToCreate.length}`);
    console.log(`  - Songs to update: ${songsToUpdate.length}`);
    console.log(`\n`);
    
    // Update JSON file first
    let updatedCount = 0;
    let createdCount = 0;
    
    // Update existing songs in JSON
    for (const { existing, csv } of songsToUpdate) {
      if (!existing.isLive) existing.isLive = true;
      if (!existing.sections) existing.sections = [];
      if (!existing.sections.includes('Ceremony')) {
        existing.sections.push('Ceremony');
      }
      if (!existing.ensembles) existing.ensembles = [];
      if (!existing.ensembles.includes('Classic Duo (Piano + Guitar)')) {
        existing.ensembles.push('Classic Duo (Piano + Guitar)');
      }
      existing.updatedAt = new Date().toISOString();
      updatedCount++;
      console.log(`✓ Updated: ${csv.title} by ${csv.artist}`);
    }
    
    // Create new songs in JSON
    for (const classicDuoSong of songsToCreate) {
      const newSong = createNewSong(classicDuoSong.title, classicDuoSong.artist);
      songsData.songs.push(newSong);
      songsData.metadata.totalSongs = songsData.songs.length;
      songsData.metadata.activeSongs = songsData.songs.filter(s => s.isLive).length;
      songsData.metadata.inactiveSongs = songsData.songs.filter(s => !s.isLive).length;
      songsData.metadata.lastUpdated = new Date().toISOString();
      createdCount++;
      console.log(`✓ Created: ${classicDuoSong.title} by ${classicDuoSong.artist}`);
    }
    
    // Save updated JSON file
    console.log(`\n💾 Saving updated songs.json...`);
    fs.writeFileSync(songsJsonPath, JSON.stringify(songsData, null, 2));
    console.log(`✅ Saved to JSON file`);
    
    // Now update/create in Firestore
    console.log(`\n🔥 Updating Firestore...`);
    
    // Update existing songs in Firestore
    for (const { existing } of songsToUpdate) {
      const songRef = db.collection('songs').doc(existing.id);
      const songDoc = await songRef.get();
      
      if (songDoc.exists) {
        await songRef.update({
          isLive: true,
          sections: admin.firestore.FieldValue.arrayUnion('Ceremony'),
          ensembles: admin.firestore.FieldValue.arrayUnion('Classic Duo (Piano + Guitar)'),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } else {
        // Document doesn't exist in Firestore, create it
        await songRef.set({
          ...existing,
          isLive: true,
          sections: existing.sections || ['Ceremony'],
          ensembles: existing.ensembles || ['Classic Duo (Piano + Guitar)'],
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      }
    }
    
    // Create new songs in Firestore
    const batch = db.batch();
    let batchCount = 0;
    
    for (const classicDuoSong of songsToCreate) {
      const newSong = createNewSong(classicDuoSong.title, classicDuoSong.artist);
      const songRef = db.collection('songs').doc(newSong.id);
      
      batch.set(songRef, {
        ...newSong,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      batchCount++;
      
      // Firestore batch limit is 500
      if (batchCount >= 500) {
        await batch.commit();
        console.log(`  Committed batch of ${batchCount} songs`);
        batchCount = 0;
      }
    }
    
    if (batchCount > 0) {
      await batch.commit();
      console.log(`  Committed final batch of ${batchCount} songs`);
    }
    
    console.log(`\n✅ Successfully processed Classic Duo songs!`);
    console.log(`   - Created: ${createdCount} songs`);
    console.log(`   - Updated: ${updatedCount} songs`);
    console.log(`   - Total processed: ${classicDuoSongs.length} songs`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error processing Classic Duo songs:', error);
    process.exit(1);
  }
}

// Run the script
processClassicDuoSongs();

