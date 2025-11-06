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
    ensembles: ["Piano Trio (Violin + Cello + Piano)"], // Add Piano Trio ensemble
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

// Function to parse CSV and extract Piano Trio songs
function parseCSV(filePath) {
  const csvContent = fs.readFileSync(filePath, 'utf8');
  const lines = csvContent.split('\n');
  
  // Find the Piano Trio column index
  // The header spans multiple lines, so we need to check the first line
  // and look for "Piano Trio" which might be split across cells
  let pianoTrioColumnIndex = -1;
  const headerLine = lines[0]; // First line has the ensemble headers
  
  // Handle multi-line cells by joining first two lines
  const combinedHeader = lines[0] + '\n' + (lines[1] || '');
  const headerColumns = combinedHeader.split(',');
  
  // Look for "Piano Trio" in the header
  // Since each ensemble has 2 columns (Song, Artist), we need to find the Song column
  for (let j = 0; j < headerColumns.length; j++) {
    const cell = headerColumns[j].trim();
    // Check if this cell or the next cell contains "Piano Trio"
    if (cell.includes('Piano Trio') || (j + 1 < headerColumns.length && headerColumns[j + 1].includes('Piano Trio'))) {
      // Piano Trio Song column is at index j, Artist column is at j+1
      pianoTrioColumnIndex = j;
      console.log(`Found Piano Trio column at index ${j}`);
      break;
    }
  }
  
  // Alternative: count columns based on ensemble order
  // Each ensemble takes 2 columns (Song, Artist)
  // Piano Trio is the 14th ensemble (after Solo Piano, Solo Guitar, Classic Duo, Lounge Duo, Café Duo, Solo Violin, Solo Cello, Violin/Cello w/ Tracks, String Duo, Violin Duo, Folk Duo, Elegant Duo, Guitar Trio)
  // Plus initial metadata columns (about 3-4 columns)
  if (pianoTrioColumnIndex === -1) {
    // Based on actual CSV inspection, Piano Trio column starts at index 65
    pianoTrioColumnIndex = 65;
    console.log(`Using column index ${pianoTrioColumnIndex} for Piano Trio (verified from CSV)`);
  }
  
  // Extract songs from the Piano Trio column
  const songs = [];
  const processedSongs = new Set(); // Track processed songs to avoid duplicates
  
  // Start from line 16 (where actual songs begin)
  for (let i = 15; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('Ceremony Details') || line.startsWith('Use the area')) {
      continue;
    }
    
    const columns = line.split(',');
    
    // Song title should be at pianoTrioColumnIndex, artist at pianoTrioColumnIndex + 1
    if (columns.length > pianoTrioColumnIndex + 1) {
      let songTitle = columns[pianoTrioColumnIndex] ? columns[pianoTrioColumnIndex].trim() : '';
      let artist = columns[pianoTrioColumnIndex + 1] ? columns[pianoTrioColumnIndex + 1].trim() : '';
      
      // Clean up titles that might have quotes or extra formatting
      songTitle = songTitle.replace(/^"|"$/g, '').trim();
      artist = artist.replace(/^"|"$/g, '').trim();
      
      // Remove newlines from artist (sometimes artist name is on next line)
      artist = artist.replace(/\n/g, '').trim();
      
      // Skip empty rows or instructional text
      if (!songTitle || songTitle === '') {
        // If song title is empty but artist is not, it might be misaligned - skip it
        continue;
      }
      
      if (songTitle.toLowerCase().includes('write your choice') ||
          songTitle.toLowerCase().includes('song') ||
          songTitle.toLowerCase().includes('artist') ||
          songTitle.toLowerCase().includes('processional') ||
          songTitle.toLowerCase().includes('recessional') ||
          songTitle.toLowerCase().includes('guest arrival') ||
          songTitle.toLowerCase().includes('ceremony details') ||
          songTitle.toLowerCase().includes('use the area')) {
        continue;
      }
      
      // Skip rows where song title looks like an artist name (common artist names)
      const commonArtistNames = [
        'taylor swift', 'coldplay', 'miley cyrus', 'mariah carey', 'the lumineers',
        'the turtles', 'paramore', 'penguin cafe orchestra', 'the chainsmokers',
        'the beatles', 'the police', 'the killers', 'the verve', 'the temper trap'
      ];
      
      const normalizedSongTitle = normalizeTitle(songTitle);
      if (commonArtistNames.includes(normalizedSongTitle)) {
        // This is likely an artist name in the song column - skip it
        continue;
      }
      
      // If artist is empty but song title exists, use "Unknown Artist"
      if (!artist || artist === '') {
        artist = 'Unknown Artist';
      }
      
      // Create unique key for this song
      const songKey = `${normalizeTitle(songTitle)}|${normalizeArtist(artist)}`;
      
      if (!processedSongs.has(songKey) && songTitle) {
        processedSongs.add(songKey);
        songs.push({
          title: songTitle,
          artist: artist || 'Unknown Artist'
        });
      }
    }
  }
  
  return songs;
}

// Main function
async function processPianoTrioSongs() {
  try {
    console.log('🎹 Processing Piano Trio Ceremony Songs...\n');
    
    // Parse CSV file
    // Try multiple possible paths
    const possiblePaths = [
      "/Users/dansmacbook1/Downloads/'25 Music Planning Worksheet - 💒 Ceremony.csv",
      path.join(process.env.HOME, "Downloads", "'25 Music Planning Worksheet - 💒 Ceremony.csv"),
      path.join(process.env.HOME, "Downloads", "25 Music Planning Worksheet - 💒 Ceremony.csv"),
      path.join(__dirname, "..", "Downloads", "'25 Music Planning Worksheet - 💒 Ceremony.csv"),
      path.join(__dirname, "..", "Downloads", "25 Music Planning Worksheet - 💒 Ceremony.csv"),
    ];
    
    let csvPath = null;
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        csvPath = possiblePath;
        break;
      }
    }
    
    if (!csvPath) {
      console.error('Could not find CSV file. Tried paths:');
      possiblePaths.forEach(p => console.error(`  - ${p}`));
      throw new Error('CSV file not found. Please check the file path.');
    }
    
    console.log(`Reading CSV from: ${csvPath}`);
    
    const csvSongs = parseCSV(csvPath);
    console.log(`Found ${csvSongs.length} songs in Piano Trio column\n`);
    
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
    
    for (const csvSong of csvSongs) {
      const matchingSong = findMatchingSong(csvSong.title, csvSong.artist, existingSongs);
      
      if (matchingSong) {
        // Song exists - check if it needs updating
        const needsUpdate = 
          !matchingSong.isLive ||
          !matchingSong.sections?.includes('Ceremony') ||
          !matchingSong.ensembles?.includes('Piano Trio (Violin + Cello + Piano)');
        
        if (needsUpdate) {
          songsToUpdate.push({
            existing: matchingSong,
            csv: csvSong
          });
        } else {
          console.log(`✓ ${csvSong.title} by ${csvSong.artist} - already configured correctly`);
        }
      } else {
        // Song doesn't exist - create it
        songsToCreate.push(csvSong);
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
      if (!existing.ensembles.includes('Piano Trio (Violin + Cello + Piano)')) {
        existing.ensembles.push('Piano Trio (Violin + Cello + Piano)');
      }
      existing.updatedAt = new Date().toISOString();
      updatedCount++;
      console.log(`✓ Updated: ${csv.title} by ${csv.artist}`);
    }
    
    // Create new songs in JSON
    for (const csvSong of songsToCreate) {
      const newSong = createNewSong(csvSong.title, csvSong.artist);
      songsData.songs.push(newSong);
      songsData.metadata.totalSongs = songsData.songs.length;
      songsData.metadata.activeSongs = songsData.songs.filter(s => s.isLive).length;
      songsData.metadata.inactiveSongs = songsData.songs.filter(s => !s.isLive).length;
      songsData.metadata.lastUpdated = new Date().toISOString();
      createdCount++;
      console.log(`✓ Created: ${csvSong.title} by ${csvSong.artist}`);
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
      await songRef.update({
        isLive: true,
        sections: admin.firestore.FieldValue.arrayUnion('Ceremony'),
        ensembles: admin.firestore.FieldValue.arrayUnion('Piano Trio (Violin + Cello + Piano)'),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    // Create new songs in Firestore
    const batch = db.batch();
    let batchCount = 0;
    
    for (const csvSong of songsToCreate) {
      const newSong = createNewSong(csvSong.title, csvSong.artist);
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
    
    console.log(`\n✅ Successfully processed Piano Trio songs!`);
    console.log(`   - Created: ${createdCount} songs`);
    console.log(`   - Updated: ${updatedCount} songs`);
    console.log(`   - Total processed: ${csvSongs.length} songs`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error processing Piano Trio songs:', error);
    process.exit(1);
  }
}

// Run the script
processPianoTrioSongs();

