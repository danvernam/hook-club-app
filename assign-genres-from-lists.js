const fs = require('fs');
const path = require('path');

// Script to assign genres to songs based on plain text lists
// Usage: node assign-genres-from-lists.js

const songsFilePath = path.join(__dirname, 'public', 'data', 'songs.json');

// Genre mapping - update this based on your genre structure
const genreMapping = {
  'pop': { client: '💯 Cream Of The Pop', band: 'pop' },
  'soul': { client: '🎷 Souled Out', band: 'soul' },
  'rock': { client: '🎸 Rock Of Ages', band: 'rock' },
  'hip hop': { client: '🎧 Can\'t Stop Hip Hop', band: 'hip hop' },
  'disco': { client: '🕺 Studio \'25', band: 'disco' },
  'punk': { client: '🤘 Instant Mosh', band: 'punk' },
  'country': { client: '🤠 Country For All', band: 'country' },
  'latin': { client: '🌮 The Latin Bible', band: 'latin' },
  'slow jams': { client: '💕 Slow Jams', band: 'slow jams' }
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
    
    // Word-based matching
    const targetWords = normalizedTarget.split(' ');
    const originalWords = normalizedOriginal.split(' ');
    const thcWords = normalizedThc.split(' ');
    
    let wordMatches = 0;
    for (const word of targetWords) {
      if (word.length > 2) { // Only match words longer than 2 characters
        if (originalWords.some(w => w.includes(word)) || thcWords.some(w => w.includes(word))) {
          wordMatches++;
        }
      }
    }
    
    if (wordMatches > 0) {
      const confidence = wordMatches / targetWords.length;
      if (confidence > 0.5) {
        matches.push({ song, confidence, matchType: 'word' });
      }
    }
  }
  
  return matches.sort((a, b) => b.confidence - a.confidence);
}

// Function to process a genre list
function processGenreList(genreName, songList, songs) {
  console.log(`\n🎵 Processing ${genreName} genre...`);
  console.log(`📝 Found ${songList.length} songs in list`);
  
  const genreTag = genreMapping[genreName.toLowerCase()];
  if (!genreTag) {
    console.log(`❌ Unknown genre: ${genreName}`);
    return { assigned: 0, skipped: 0 };
  }
  
  let assigned = 0;
  let skipped = 0;
  
  for (const songTitle of songList) {
    const matches = findMatchingSongs(songTitle, songs);
    
    if (matches.length === 0) {
      console.log(`❓ No match found for: "${songTitle}"`);
      skipped++;
      continue;
    }
    
    const bestMatch = matches[0];
    const song = bestMatch.song;
    
    // Check if genre is already assigned
    const hasGenre = song.genres && song.genres.some(g => g.band === genreTag.band);
    
    if (hasGenre) {
      console.log(`✅ Already tagged: "${songTitle}" → ${song.thcTitle || song.originalTitle}`);
      skipped++;
      continue;
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
    assigned++;
  }
  
  return { assigned, skipped };
}

// Main function
async function assignGenres() {
  try {
    console.log('🚀 Starting genre assignment from song lists...');
    
    // Load songs data
    const songsData = JSON.parse(fs.readFileSync(songsFilePath, 'utf8'));
    const songs = songsData.songs || [];
    console.log(`📚 Loaded ${songs.length} songs from database`);
    
    // Song lists
    const popSongs = [
      'Wake Me Up',
      'Everybody (Backstreets Back)',
      'I Want It That Way',
      'Crazy in Love',
      '... Baby One More Time',
      'Everytime We Touch',
      'Pink Pony Club',
      'Rather Be',
      'Girls Just Wanna Have Fun',
      'One More Time',
      'Titanium',
      'Don\'t Start Now',
      'Good Feeling',
      'As It Was',
      'I Love It',
      'Bang Bang',
      'Can\'t Stop The Feeling',
      'Valerie',
      'Flowers',
      'Party In The USA',
      'I Will Wait',
      'Unwritten',
      'Hey Ya!',
      'Timber',
      'Give Me Everything',
      'We Found Love',
      'Dancing On My Own',
      'Espresso',
      'All Star',
      'Murder On The Dancefloor',
      'Wannabe',
      'I Knew You Were Trouble',
      'Shake It Off',
      'Love Story',
      'Yeah!',
      'Shut Up And Dance',
      'Clarity'
    ];
    
    const soulSongs = [
      'Boogie Oogie Oogie',
      'Respect',
      'Poison',
      'Uptown Funk',
      'Ain\'t Nobody',
      'Got To Be Real',
      'Brick House',
      'I\'m Coming Out',
      'September',
      'Let\'s Groove',
      'December, 1963 (Oh What A Night)',
      'Pony',
      'Shout',
      '(Your Love Keeps Lifting Me) Higher & Higher',
      'Get Up Offa That Thing',
      'Celebration',
      'All Night Long',
      'Never Too Much',
      'Dancing In The Street',
      'Ain\'t No Mountain High Enough',
      'I Wanna Be Your Lover',
      'Kiss',
      'You Are The Best Thing',
      'Give It To Me Baby',
      'We Are Family',
      'Superstition',
      'Signed, Sealed, Delivered (I\'m Yours)',
      'Best Of My Love',
      'Build Me Up Buttercup',
      'I Want You Back',
      'Love Train',
      'My Girl',
      'Ain\'t Too Proud To Beg',
      'Proud Mary',
      'The Best',
      'How Will I Know',
      'I Wanna Dance With Somebody'
    ];
    
    const rockSongs = [
      'You Shook Me All Night Long',
      'Only The Good Die Young',
      'Livin\' On A Prayer',
      'Born To Run',
      'Let\'s Dance',
      'Come On Eileen',
      'Take It Easy',
      'You Make Loving Fun',
      'Shakedown Street',
      'Sweet Child O\' Mine',
      'The Middle',
      'You\'re The One That I Want',
      'Don\'t Stop Believin\'',
      'Footloose',
      'Dancing In The Moonlight',
      'Sex On Fire',
      'Paradise By the Dashboard Light',
      'Sweet Caroline',
      'Don\'t Speak',
      'Wonderwall',
      'You Can Call Me Al',
      'Crazy Little Thing Called Love',
      'Don\'t Stop Me Now',
      'Jessie\'s Girl',
      'All For You',
      'Peg',
      'Life During Wartime',
      'I Saw Her Standing There',
      'Twist And Shout',
      'Day Tripper',
      'I Believe In A Thing Called Love',
      'Long Train Runnin\'',
      '(I Can\'t Get No) Satisfaction',
      'American Girl',
      'Africa',
      'Brown Eyed Girl',
      'Say It Ain\'t So'
    ];
    
    const hipHopSongs = [
      'No Diggity',
      'All I Do Is Win',
      'Low',
      'Empire State Of Mind',
      'Get Low',
      'Work It',
      'This Is How We Do It',
      'Doo Wop (That Thing)',
      'Mo Money Mo Problems'
    ];
    
    const discoSongs = [
      'Dancing Queen',
      'Gimme! Gimme! Gimme! (A Man After Midnight)',
      'Mamma Mia',
      '(I\'ve Had) The Time Of My Life',
      'Believe',
      'Get Lucky',
      'I Will Survive',
      'Like A Prayer',
      'Rasputin'
    ];
    
    const punkSongs = [
      'Complicated',
      'All The Small Things',
      'First Date',
      'Sugar, We\'re Going Down',
      'Everywhere',
      'Still Into You',
      'Zombie',
      'Mr. Brightside',
      'Semi-Charmed Life'
    ];
    
    const countrySongs = [
      'TEXAS HOLD \'EM',
      'Wagon Wheel',
      'Islands In The Stream',
      'Sweet Home Alabama',
      'Life Is A Highway',
      'Man! I Feel Like A Woman',
      'You Belong With Me',
      'Chicken Fried'
    ];
    
    const latinSongs = [
      'Tití Me Preguntó',
      'I Like It',
      'Danza Kuduro',
      'Suavemente',
      'Pepas',
      'Despacito',
      'Vivir Mi Vida',
      'Fireball'
    ];
    
    const slowJamsSongs = [
      'If I Ain\'t Got You',
      'How Deep Is Your Love',
      'Tennessee Whiskey',
      'At Last',
      'L-O-V-E',
      'You Are The Best Thing',
      'Lover',
      'Oh! Darling'
    ];
    
    // Process each genre
    const results = {};
    
    // Process Pop
    results.pop = processGenreList('pop', popSongs, songs);
    
    // Process Soul
    results.soul = processGenreList('soul', soulSongs, songs);
    
    // Process Rock
    results.rock = processGenreList('rock', rockSongs, songs);
    
    // Process Hip Hop
    results.hipHop = processGenreList('hip hop', hipHopSongs, songs);
    
    // Process Disco
    results.disco = processGenreList('disco', discoSongs, songs);
    
    // Process Punk
    results.punk = processGenreList('punk', punkSongs, songs);
    
    // Process Country
    results.country = processGenreList('country', countrySongs, songs);
    
    // Process Latin
    results.latin = processGenreList('latin', latinSongs, songs);
    
    // Process Slow Jams
    results.slowJams = processGenreList('slow jams', slowJamsSongs, songs);
    
    // Save updated songs data
    fs.writeFileSync(songsFilePath, JSON.stringify(songsData, null, 2));
    
    // Summary
    console.log('\n📊 SUMMARY:');
    let totalAssigned = 0;
    let totalSkipped = 0;
    
    for (const [genre, result] of Object.entries(results)) {
      console.log(`${genre}: ${result.assigned} assigned, ${result.skipped} skipped`);
      totalAssigned += result.assigned;
      totalSkipped += result.skipped;
    }
    
    console.log(`\n✅ Total: ${totalAssigned} songs assigned to genres, ${totalSkipped} skipped`);
    console.log('💾 Songs database updated successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Instructions for usage
console.log(`
🎵 GENRE ASSIGNMENT SCRIPT
========================

This script will assign genres to songs based on plain text lists.

TO USE:
1. Replace the example song lists below with your actual song lists
2. Add more genre lists as needed
3. Run: node assign-genres-from-lists.js

FORMAT:
- Each genre should have its own array of song titles
- Song titles can be in any format (the script will normalize them)
- The script will try to match songs using fuzzy matching

EXAMPLE:
const popSongs = [
  'Baby One More Time',
  'As It Was',
  'Watermelon Sugar'
];

const rockSongs = [
  'Satisfaction', 
  'Time Of My Life'
];
`);

// Run the script
assignGenres();