const fs = require('fs');
const csv = require('csv-parser');

// Function to create a URL-safe ID from song title
function createId(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Function to get current timestamp
function getCurrentTimestamp() {
  return new Date().toISOString();
}

// Function to clean and validate BPM
function cleanBpm(bpm) {
  if (!bpm || bpm === '' || bpm === '-') return 120; // Default BPM
  const num = parseInt(bpm);
  return isNaN(num) ? 120 : num;
}

// Function to clean and validate key
function cleanKey(key) {
  if (!key || key === '' || key === '-') return 'C'; // Default key
  return key;
}

// Function to clean percentage
function cleanPercentage(percent) {
  if (!percent || percent === '' || percent === '-') return '0%';
  return percent;
}

const songs = [];
let songCount = 0;

fs.createReadStream('THC Master Song List - App Import.csv')
  .pipe(csv({
    skipEmptyLines: true,
    skipLinesWithError: true
  }))
  .on('data', (row) => {
    // Debug: log first few rows
    if (songCount < 3) {
      console.log('Row data:', JSON.stringify(row, null, 2));
    }
    
    // Skip header rows and empty rows
    if (row['Master Song List'] && 
        row['Master Song List'] !== 'THC Song Title' && 
        row['Master Song List'] !== 'Master Song List' &&
        row['Master Song List'] !== '') {
      
      const originalBpm = cleanBpm(row['OG BPM']);
      const thcBpm = cleanBpm(row['THC BPM']) || originalBpm;
      const originalKey = cleanKey(row['OG Key']);
      const thcKey = cleanKey(row['THC Key']) || originalKey;
      const thcPercent = cleanPercentage(row['THC %']);
      
      const song = {
        id: createId(row['Master Song List']),
        originalTitle: row['Master Song List'],
        originalArtist: row['Artist'] || 'Unknown Artist',
        thcTitle: row['Master Song List'],
        thcArtist: "The Hook Club",
        videoUrl: "",
        spotifyUrl: "",
        originalBpm: originalBpm,
        thcBpm: thcBpm,
        isLive: false, // All songs inactive by default as requested
        sections: [],
        ensembles: [],
        genres: [],
        specialMomentTypes: [],
        thcPercent: thcPercent,
        notes: "",
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
        originalKey: originalKey,
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
            key: thcKey,
            isDefault: true,
            bpm: thcBpm,
            chordLyricChartUrl: "",
            leadSheetUrl: "",
            fullBandArrangementUrl: "",
            hornChartUrl: "",
            sheetMusicStandardUrl: "",
            chartLyricsSpecialUrl: "",
            hornChartSpecialUrl: ""
          }
        ]
      };
      
      songs.push(song);
      songCount++;
      
      if (songCount % 100 === 0) {
        console.log(`Processed ${songCount} songs...`);
      }
    }
  })
  .on('end', () => {
    console.log(`\nProcessed ${songCount} songs total.`);
    
    // Create the complete JSON structure
    const jsonData = {
      metadata: {
        version: "2.0",
        lastUpdated: getCurrentTimestamp(),
        totalSongs: songCount,
        activeSongs: 0, // All inactive by default
        inactiveSongs: songCount
      },
      songs: songs
    };
    
    // Write to songs.json
    fs.writeFileSync('public/data/songs.json', JSON.stringify(jsonData, null, 2));
    console.log(`\n✅ Successfully imported ${songCount} songs to public/data/songs.json`);
    console.log(`📊 All songs are set to inactive by default`);
    console.log(`🎵 Ready to activate songs as needed in the app!`);
  })
  .on('error', (error) => {
    console.error('Error processing CSV:', error);
  });
