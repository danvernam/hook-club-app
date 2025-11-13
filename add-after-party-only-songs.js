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

function getAfterPartyOnlySongs() {
  // After-Party Only songs from both screenshots
  const songs = [
    // First screenshot
    { originalTitle: "It's Gonna Be Me", originalArtist: "*NSYNC" },
    { originalTitle: "In Da Club", originalArtist: "50 Cent" },
    { originalTitle: "Draughs (Joanna)", originalArtist: "Afro B" },
    { originalTitle: "I'm So Paid", originalArtist: "Akon" },
    { originalTitle: "Kill The Lights", originalArtist: "Alex Newell, Jess Glynne, DJ Cassidy, Nile Rodgers" },
    { originalTitle: "Empire State Of Mind", originalArtist: "Alicia Keys, JAY-Z" },
    { originalTitle: "Deep Down", originalArtist: "Alok, Ella Eyre, Kenny Dope, Never Dull" },
    { originalTitle: "Levels", originalArtist: "Avicii" },
    { originalTitle: "Sk8er Boi", originalArtist: "Avril Lavigne" },
    { originalTitle: "Everybody", originalArtist: "Backstreet Boys" },
    { originalTitle: "Tití Me Preguntó", originalArtist: "Bad Bunny" },
    { originalTitle: "PERRO NEGRO", originalArtist: "Bad Bunny" },
    { originalTitle: "MONACO", originalArtist: "Bad Bunny" },
    { originalTitle: "Cinema", originalArtist: "Benny Benassi, Gary Go" },
    { originalTitle: "Love On Top", originalArtist: "Beyoncé" },
    { originalTitle: "BREAK MY SOUL", originalArtist: "Beyoncé" },
    { originalTitle: "Upgrade U", originalArtist: "Beyoncé" },
    { originalTitle: "Crazy In Love", originalArtist: "Beyoncé, JAY-Z" },
    { originalTitle: "I Gotta Feeling", originalArtist: "Black Eyed Peas" },
    { originalTitle: "My Humps", originalArtist: "Black Eyed Peas" },
    { originalTitle: "...Baby One More Time", originalArtist: "Britney Spears" },
    { originalTitle: "Toxic", originalArtist: "Britney Spears" },
    { originalTitle: "Feel So Close", originalArtist: "Calvin Harris" },
    { originalTitle: "Summer", originalArtist: "Calvin Harris" },
    { originalTitle: "One Kiss", originalArtist: "Calvin Harris, Dua Lipa" },
    { originalTitle: "This Is What You Came For", originalArtist: "Calvin Harris, Rihanna" },
    { originalTitle: "We Found Love", originalArtist: "Calvin Harris, Rihanna" },
    { originalTitle: "Bodak Yellow", originalArtist: "Cardi B" },
    { originalTitle: "Call Me Maybe", originalArtist: "Carly Rae Jepsen" },
    { originalTitle: "Everytime We Touch", originalArtist: "Cascada" },
    { originalTitle: "Lady Marmalade", originalArtist: "Christina Aguilera, Lil' Kim, Mya, Pink" },
    { originalTitle: "A 10 Step", originalArtist: "Ciara" },
    { originalTitle: "Rather Be", originalArtist: "Clean Bandit, Jess Glynne" },
    { originalTitle: "Gasolina", originalArtist: "Daddy Yankee" },
    { originalTitle: "One More Time", originalArtist: "Daft Punk" },
    { originalTitle: "Sandstorm", originalArtist: "Darude" },
    { originalTitle: "Love Is Gone", originalArtist: "David Guetta" },
    { originalTitle: "Titanium", originalArtist: "David Guetta, Sia" },
    { originalTitle: "All I Do Is Win", originalArtist: "DJ Khaled" },
    { originalTitle: "Wild Thoughts", originalArtist: "DJ Khaled, Rihanna, Bryson Tiller" },
    { originalTitle: "Party Up", originalArtist: "DMX" },
    { originalTitle: "Cake by the Ocean", originalArtist: "DNCE" },
    { originalTitle: "Danza Kuduro", originalArtist: "Don Omar, Lucenzo" },
    { originalTitle: "Nice For What", originalArtist: "Drake" },
    { originalTitle: "Dance The Night", originalArtist: "Dua Lipa" },
    { originalTitle: "Don't Start Now", originalArtist: "Dua Lipa" },
    { originalTitle: "Levitating", originalArtist: "Dua Lipa" },
    { originalTitle: "Shivers (Dillon Francis Remix)", originalArtist: "Ed Sheeran, Dillon Francis" },
    { originalTitle: "Cold Heart", originalArtist: "Elton John, Dua Lipa, PNAU" },
    { originalTitle: "Swayambhu", originalArtist: "Elvis Crespo" },
    { originalTitle: "Walking On A Dream", originalArtist: "Empire Of The Sun" },
    { originalTitle: "Pump It Up", originalArtist: "Endor" },
    { originalTitle: "American Boy", originalArtist: "Estelle, Kanye West" },
    { originalTitle: "Fergalicious", originalArtist: "Fergie, will.i.am" },
    { originalTitle: "Trap Queen", originalArtist: "Fetty Wap" },
    { originalTitle: "Good Feeling", originalArtist: "Flo Rida" },
    { originalTitle: "Low", originalArtist: "Flo Rida, T-Pain" },
    { originalTitle: "Thinking About You", originalArtist: "Frank Ocean" },
    { originalTitle: "Pony", originalArtist: "Ginuwine" },
    { originalTitle: "What is Love", originalArtist: "Haddaway" },
    { originalTitle: "MMMBop", originalArtist: "Hanson" },
    { originalTitle: "I Love It", originalArtist: "Icona Pop, Charli XCX" },
    { originalTitle: "Mi Gente", originalArtist: "J Balvin, Willy William, Beyoncé" },
    { originalTitle: "Scream", originalArtist: "Ja Rule, Ashanti" },
    { originalTitle: "N**as In Paris", originalArtist: "JAY-Z, Kanye West" },
    { originalTitle: "On the Floor", originalArtist: "Jennifer Lopez, Pitbull" },
    { originalTitle: "Bang Bang", originalArtist: "Jessie J, Ariana Grande, Nicki Minaj" },
    { originalTitle: "Head & Heart", originalArtist: "Joel Corry, MNEK" },
    { originalTitle: "Dancing In The Moonlight", originalArtist: "JUBEL, NEIMY" },
    { originalTitle: "Despacito", originalArtist: "Justin Bieber, Luis Fonsi, Daddy Yankee" },
    { originalTitle: "Say Something", originalArtist: "Justin Timberlake" },
    // Second screenshot
    { originalTitle: "Back That Azz Up", originalArtist: "JUVENILE, Lil Wayne, Mannie Fresh" },
    { originalTitle: "Firework", originalArtist: "Katy Perry" },
    { originalTitle: "Bottoms Up", originalArtist: "Keke Palmer" },
    { originalTitle: "Turn Me On", originalArtist: "Kevin Lyttle" },
    { originalTitle: "Pursuit Of Happiness", originalArtist: "Kid Cudi, MGMT, Ratatat, Steve Aoki" },
    { originalTitle: "Higher Love", originalArtist: "Kygo, Whitney Houston" },
    { originalTitle: "Padam Padam", originalArtist: "Kylie Minogue" },
    { originalTitle: "Bad Romance", originalArtist: "Lady Gaga" },
    { originalTitle: "Born This Way", originalArtist: "Lady Gaga" },
    { originalTitle: "Rain On Me", originalArtist: "Lady Gaga, Ariana Grande" },
    { originalTitle: "Turn Down For What", originalArtist: "Lil Jon" },
    { originalTitle: "Juice", originalArtist: "Lizzo" },
    { originalTitle: "Party Rock Anthem", originalArtist: "LMFAO" },
    { originalTitle: "Shots", originalArtist: "LMFAO, Lil Jon" },
    { originalTitle: "Body", originalArtist: "Loud Luxury" },
    { originalTitle: "What's Your Fantasy", originalArtist: "Ludacris, Shawnna" },
    { originalTitle: "Midnight City", originalArtist: "M83" },
    { originalTitle: "Vogue", originalArtist: "Madonna" },
    { originalTitle: "Return Of The Mack", originalArtist: "Mark Morrison" },
    { originalTitle: "Intoxicated", originalArtist: "Martin Solveig, Good Times Ahead" },
    { originalTitle: "Body", originalArtist: "Megan Thee Stallion" },
    { originalTitle: "That Sh*t", originalArtist: "Megan Thee Stallion" },
    { originalTitle: "Party In The USA", originalArtist: "Miley Cyrus" },
    { originalTitle: "Love Control", originalArtist: "Missy Elliott, Ciara, Fatman Scoop" },
    { originalTitle: "This Is How We Do It", originalArtist: "Montell Jordan, Wino" },
    { originalTitle: "Hot In Herre", originalArtist: "Nelly" },
    { originalTitle: "Promiscuous", originalArtist: "Nelly Furtado, Timbaland" },
    { originalTitle: "Where The Party At", originalArtist: "Nelly, Jagged Edge" },
    { originalTitle: "Starships", originalArtist: "Nicki Minaj" },
    { originalTitle: "WAP", originalArtist: "Cardi B, Megan Thee Stallion" },
    { originalTitle: "Wonderwall", originalArtist: "Oasis" },
    { originalTitle: "Good 4 U", originalArtist: "Olivia Rodrigo" },
    { originalTitle: "Cheerleader (Felix Jaehn Remix)", originalArtist: "OMI" },
    { originalTitle: "Roses", originalArtist: "Outkast" },
    { originalTitle: "I Write Sins Not Tragedies", originalArtist: "Panic! At The Disco" },
    { originalTitle: "You Got The Love", originalArtist: "Pete Tong, Becky Hill, Tiesto" },
    { originalTitle: "Fireball", originalArtist: "Pitbull, John Ryan" },
    { originalTitle: "Give Me Everything", originalArtist: "Pitbull, Ne-Yo, Afrojack, Nayer" },
    { originalTitle: "Umbrella", originalArtist: "Rihanna" },
    { originalTitle: "Show Me Love", originalArtist: "Robin S" },
    { originalTitle: "Dancing On My Own", originalArtist: "Robyn" },
    { originalTitle: "It's Tricky", originalArtist: "Run D.M.C." },
    { originalTitle: "Get Busy", originalArtist: "Sean Paul" },
    { originalTitle: "Temperature", originalArtist: "Sean Paul" },
    { originalTitle: "Calling (Lose My Mind)", originalArtist: "Sebastian Ingrosso, Alesso, Ryan Tedder" },
    { originalTitle: "It Wasn't Me", originalArtist: "Shaggy, Rik Rok" },
    { originalTitle: "Hips Don't Lie", originalArtist: "Shakira, Wyclef Jean" },
    { originalTitle: "Man! I Feel Like A Woman", originalArtist: "Shania Twain" },
    { originalTitle: "Thong Song", originalArtist: "Sisqo" },
    { originalTitle: "Drop It Like It's Hot", originalArtist: "Snoop Dogg, Pharrell Williams" },
    { originalTitle: "Wannabe", originalArtist: "Spice Girls" },
    { originalTitle: "Don't You Worry Child", originalArtist: "Swedish House Mafia, John Martin" },
    { originalTitle: "Shake It Off", originalArtist: "Taylor Swift" },
    { originalTitle: "Anti-Hero (Kungs Remix)", originalArtist: "Taylor Swift, Kungs" },
    { originalTitle: "Swing Swing", originalArtist: "The All-American Rejects" },
    { originalTitle: "Zombie", originalArtist: "The Cranberries" },
    { originalTitle: "Mo Money Mo Problems", originalArtist: "The Notorious B.I.G." },
    { originalTitle: "It's Raining Men", originalArtist: "The Weather Girls" },
    { originalTitle: "No Scrubs", originalArtist: "TLC" },
    { originalTitle: "Goosebumps", originalArtist: "Travis Scott" },
    { originalTitle: "Water", originalArtist: "Tyla" },
    { originalTitle: "U Don't Have To Call", originalArtist: "USHER" },
    { originalTitle: "Love In This Club", originalArtist: "USHER, Jeezy" },
    { originalTitle: "Yeah!", originalArtist: "Usher, Lil Jon, Ludacris" },
    { originalTitle: "DJ Got Us Fallin' In Love", originalArtist: "Usher, Pitbull" },
    { originalTitle: "Shut Up And Dance", originalArtist: "Walk The Moon" },
    { originalTitle: "Teenage Dirtbag", originalArtist: "Wheatus" },
    { originalTitle: "I Wanna Dance With Somebody", originalArtist: "Whitney Houston" },
    { originalTitle: "How Will I Know", originalArtist: "Whitney Houston, Clean Bandit" },
    { originalTitle: "Clarity", originalArtist: "Zedd, Foxes" }
  ];
  
  console.log(`✅ Loaded ${songs.length} After-Party Only songs from screenshots`);
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
    sections: ["afterParty"], // Add After Party section
    ensembles: [], // No specific ensemble for After-Party Only
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

async function updateSongForAfterParty(song) {
  const updates = {};
  
  // Always set isLive to true
  updates.isLive = true;
  
  // Add After Party to sections if not present
  if (!song.sections || !Array.isArray(song.sections) || !song.sections.includes('afterParty')) {
    if (!song.sections || !Array.isArray(song.sections)) {
      updates.sections = ['afterParty'];
    } else {
      updates.sections = admin.firestore.FieldValue.arrayUnion('afterParty');
    }
  }
  
  updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
  
  await db.collection('songs').doc(song.id).update(updates);
  console.log(`  ↻ Updated: "${song.originalTitle}" by ${song.originalArtist}`);
}

async function main() {
  try {
    console.log('🎧 Starting After-Party Only songs import...\n');
    
    // Get After-Party Only songs from screenshots
    const afterPartyOnlySongs = getAfterPartyOnlySongs();
    
    if (afterPartyOnlySongs.length === 0) {
      console.log('⚠️  No After-Party Only songs found');
      process.exit(0);
    }
    
    console.log(`\n📝 Processing ${afterPartyOnlySongs.length} songs...\n`);
    
    let created = 0;
    let updated = 0;
    let skipped = 0;
    let alreadyConfigured = 0;
    let errors = 0;
    
    for (const songData of afterPartyOnlySongs) {
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
        
        // Check if song is in Reception Repertoire (has danceGenres)
        if (song.danceGenres && Array.isArray(song.danceGenres) && song.danceGenres.length > 0) {
          console.log(`  ⏭️  Skipping (in Reception Repertoire): "${song.originalTitle}" by ${song.originalArtist}`);
          skipped++;
          continue;
        }
        
        // Check if song needs updating for After Party
        const needsUpdate = 
          !song.isLive || 
          !song.sections || !Array.isArray(song.sections) || !song.sections.includes('afterParty');
        
        if (needsUpdate) {
          await updateSongForAfterParty(song);
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
    console.log(`📊 Skipped (Reception Repertoire): ${skipped} songs`);
    console.log(`📊 Already configured: ${alreadyConfigured} songs`);
    console.log(`📊 Errors: ${errors} songs`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

main();

