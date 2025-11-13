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
    ensembles: ["Lounge Duo (Vocalist + Piano)"], // Add Lounge Duo ensemble
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

// Lounge Duo songs from the Guest Arrival Selections
const loungeDuoSongs = [
  { title: "At Your Best (You Are Love)", artist: "Aaliyah" },
  { title: "Easy On Me", artist: "Adele" },
  { title: "Sweet Pea", artist: "Amos Lee" },
  { title: "Just The Way You Are", artist: "Billy Joel" },
  { title: "Because You Loved Me", artist: "Celine Dion" },
  { title: "Viva La Vida", artist: "Coldplay" },
  { title: "So In Love", artist: "Curtis Mayfield" },
  { title: "Somethin' Stupid", artist: "Frank Sinatra, Nancy Sinatra" },
  { title: "Lucky", artist: "Jason Mraz" },
  { title: "My Stunning Mystery Companion", artist: "Jackson Browne" },
  { title: "All Of Me", artist: "John Legend" },
  { title: "XO", artist: "John Mayer" },
  { title: "The Circle Game", artist: "Joni Mitchell" },
  { title: "River", artist: "Leon Bridges" },
  { title: "Stay With Me", artist: "Sam Smith" },
  { title: "Something", artist: "The Beatles" },
  { title: "I Only Have Eyes For You", artist: "The Flamingoes" },
  { title: "Fast Car", artist: "Tracey Chapman" },
  { title: "Into The Mystic", artist: "Van Morrison" },
  { title: "A Thousand Miles", artist: "Vanessa Carlton" },
  { title: "Lovely Day", artist: "Bill Withers" },
  { title: "Can't Stop The Feeling", artist: "Justin Timberlake" },
  { title: "I Got You", artist: "Jack Johnson" },
  { title: "You Are The Best Thing", artist: "Ray LaMontagne" },
  { title: "Kiss Me", artist: "Sixpence None The Richer" }
];

// Main function
async function processLoungeDuoSongs() {
  try {
    console.log('🎤 Processing Lounge Duo Ceremony Songs...\n');
    
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
    
    for (const loungeDuoSong of loungeDuoSongs) {
      const matchingSong = findMatchingSong(loungeDuoSong.title, loungeDuoSong.artist, existingSongs);
      
      if (matchingSong) {
        // Song exists - check if it needs updating
        const needsUpdate = 
          !matchingSong.isLive ||
          !matchingSong.sections?.includes('Ceremony') ||
          !matchingSong.ensembles?.includes('Lounge Duo (Vocalist + Piano)');
        
        if (needsUpdate) {
          songsToUpdate.push({
            existing: matchingSong,
            csv: loungeDuoSong
          });
        } else {
          console.log(`✓ ${loungeDuoSong.title} by ${loungeDuoSong.artist} - already configured correctly`);
        }
      } else {
        // Song doesn't exist - create it
        songsToCreate.push(loungeDuoSong);
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
      if (!existing.ensembles.includes('Lounge Duo (Vocalist + Piano)')) {
        existing.ensembles.push('Lounge Duo (Vocalist + Piano)');
      }
      existing.updatedAt = new Date().toISOString();
      updatedCount++;
      console.log(`✓ Updated: ${csv.title} by ${csv.artist}`);
    }
    
    // Create new songs in JSON
    for (const loungeDuoSong of songsToCreate) {
      const newSong = createNewSong(loungeDuoSong.title, loungeDuoSong.artist);
      songsData.songs.push(newSong);
      songsData.metadata.totalSongs = songsData.songs.length;
      songsData.metadata.activeSongs = songsData.songs.filter(s => s.isLive).length;
      songsData.metadata.inactiveSongs = songsData.songs.filter(s => !s.isLive).length;
      songsData.metadata.lastUpdated = new Date().toISOString();
      createdCount++;
      console.log(`✓ Created: ${loungeDuoSong.title} by ${loungeDuoSong.artist}`);
    }
    
    // Save updated JSON file
    console.log(`\n💾 Saving updated songs.json...`);
    fs.writeFileSync(songsJsonPath, JSON.stringify(songsData, null, 2));
    console.log(`✅ Saved to JSON file`);
    
    // Now update/create in Firestore
    console.log(`\n🔥 Updating Firestore...`);
    
    // Force update ALL Lounge Duo songs in Firestore (not just ones that need updating in JSON)
    const allLoungeDuoSongs = [...songsToUpdate.map(({ existing }) => existing), ...songsToCreate.map(createNewSong)];
    
    // Also include songs that are already configured correctly
    for (const loungeDuoSong of loungeDuoSongs) {
      const matchingSong = findMatchingSong(loungeDuoSong.title, loungeDuoSong.artist, existingSongs);
      if (matchingSong && !allLoungeDuoSongs.find(s => s.id === matchingSong.id)) {
        allLoungeDuoSongs.push(matchingSong);
      }
    }
    
    // Update existing songs in Firestore - force update to ensure tags are correct
    for (const existing of allLoungeDuoSongs) {
      const songRef = db.collection('songs').doc(existing.id);
      const songDoc = await songRef.get();
      
      if (songDoc.exists) {
        // Force update to ensure tags are correct in Firestore
        const currentData = songDoc.data();
        const currentSections = Array.isArray(currentData.sections) ? currentData.sections : [];
        const currentEnsembles = Array.isArray(currentData.ensembles) ? currentData.ensembles : [];
        
        const updates = {
          isLive: true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        
        // Add Ceremony section if not present
        if (!currentSections.includes('Ceremony')) {
          updates.sections = admin.firestore.FieldValue.arrayUnion('Ceremony');
        }
        
        // Add Lounge Duo ensemble if not present
        if (!currentEnsembles.includes('Lounge Duo (Vocalist + Piano)')) {
          updates.ensembles = admin.firestore.FieldValue.arrayUnion('Lounge Duo (Vocalist + Piano)');
        }
        
        // Only update if there are changes
        if (Object.keys(updates).length > 2) {
          await songRef.update(updates);
          console.log(`  ↻ Updated Firestore: "${existing.originalTitle}" by ${existing.originalArtist}`);
        } else {
          console.log(`  ✓ Already correct in Firestore: "${existing.originalTitle}" by ${existing.originalArtist}`);
        }
      } else {
        // Document doesn't exist in Firestore, create it
        await songRef.set({
          ...existing,
          isLive: true,
          sections: existing.sections || ['Ceremony'],
          ensembles: existing.ensembles || ['Lounge Duo (Vocalist + Piano)'],
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        console.log(`  + Created in Firestore: "${existing.originalTitle}" by ${existing.originalArtist}`);
      }
    }
    
    // Create new songs in Firestore
    const batch = db.batch();
    let batchCount = 0;
    
    for (const loungeDuoSong of songsToCreate) {
      const newSong = createNewSong(loungeDuoSong.title, loungeDuoSong.artist);
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
    
    console.log(`\n✅ Successfully processed Lounge Duo songs!`);
    console.log(`   - Created: ${createdCount} songs`);
    console.log(`   - Updated: ${updatedCount} songs`);
    console.log(`   - Total processed: ${loungeDuoSongs.length} songs`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error processing Lounge Duo songs:', error);
    process.exit(1);
  }
}

// Run the script
processLoungeDuoSongs();

