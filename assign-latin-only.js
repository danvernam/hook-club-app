const fs = require('fs');
const path = require('path');

// Quick script to assign just the Latin genre to "Vivir Mi Vida"
const songsFilePath = path.join(__dirname, 'public', 'data', 'songs.json');

// Genre mapping
const genreMapping = {
  'latin': { client: '🌮 The Latin Bible', band: 'latin' }
};

// Function to normalize song titles for matching
function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

// Function to find matching songs using fuzzy matching
function findMatchingSongs(songTitle, songs) {
  const normalizedTarget = normalizeTitle(songTitle);
  const matches = [];
  
  for (const song of songs) {
    const normalizedOriginal = normalizeTitle(song.originalTitle || '');
    const normalizedThc = normalizeTitle(song.thcTitle || '');
    
    // Exact match
    if (normalizedOriginal === normalizedTarget || normalizedThc === normalizedTarget) {
      matches.push({ song, confidence: 1.0, matchType: 'exact' });
      continue;
    }
    
    // Partial match (contains)
    if (normalizedOriginal.includes(normalizedTarget) || normalizedTarget.includes(normalizedOriginal) ||
        normalizedThc.includes(normalizedTarget) || normalizedTarget.includes(normalizedThc)) {
      matches.push({ song, confidence: 0.8, matchType: 'partial' });
      continue;
    }
  }
  
  return matches.sort((a, b) => b.confidence - a.confidence);
}

async function assignLatinGenre() {
  try {
    console.log('🚀 Assigning Latin genre to "Vivir Mi Vida"...');
    
    // Load songs data
    const songsData = JSON.parse(fs.readFileSync(songsFilePath, 'utf8'));
    const songs = songsData.songs || [];
    
    const genreTag = genreMapping['latin'];
    const songTitle = 'Vivir Mi Vida';
    
    const matches = findMatchingSongs(songTitle, songs);
    
    if (matches.length === 0) {
      console.log(`❓ No match found for: "${songTitle}"`);
      return;
    }
    
    const bestMatch = matches[0];
    const song = bestMatch.song;
    
    // Check if genre is already assigned
    const hasGenre = song.genres && song.genres.some(g => g.band === genreTag.band);
    
    if (hasGenre) {
      console.log(`✅ Already tagged: "${songTitle}" → ${song.thcTitle || song.originalTitle}`);
      return;
    }
    
    // Add genre to song
    if (!song.genres) {
      song.genres = [];
    }
    song.genres.push(genreTag);
    
    // Make song active if it was inactive
    if (!song.isLive) {
      song.isLive = true;
      console.log(`🔄 Activated: "${songTitle}" → ${song.thcTitle || song.originalTitle}`);
    }
    
    console.log(`🎯 Assigned: "${songTitle}" → ${song.thcTitle || song.originalTitle} (${bestMatch.matchType}, confidence: ${(bestMatch.confidence * 100).toFixed(1)}%)`);
    
    // Save updated songs data
    fs.writeFileSync(songsFilePath, JSON.stringify(songsData, null, 2));
    console.log('💾 Songs database updated successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

assignLatinGenre();
