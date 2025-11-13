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
const FieldValue = admin.firestore.FieldValue;

function normalizeText(text) {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/["'`'']/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
}

// Reception ensemble special moment recommendations from screenshots
const receptionRecommendations = {
  "Classic Band": {
    "Wedding Party Intro": [
      { title: "Thunderstruck", artist: "AC/DC" },
      { title: "All I Do Is Win", artist: "DJ Khaled" },
      { title: "Happy", artist: "Pharrell" },
      { title: "We Are Family", artist: "Sister Sledge" },
      { title: "Bring Em Out", artist: "T.I." },
      { title: "Good Lovin'", artist: "The Young Rascals" }
    ],
    "Newlyweds Intro": [
      { title: "Crazy in Love", artist: "Beyonce/Jay-Z" },
      { title: "Lovely Day", artist: "Bill Withers" },
      { title: "Best I Ever Had", artist: "Drake" },
      { title: "You Make My Dreams Come True", artist: "Hall & Oates" },
      { title: "This Will Be (An Everlasting Love)", artist: "Natalie Cole" },
      { title: "Come and Get Your Love", artist: "Redbone" }
    ],
    "First Dance": [
      { title: "Make You Feel My Love", artist: "Adele" },
      { title: "If I Should Fall Behind", artist: "Bruce Springsteen" },
      { title: "Like A Star", artist: "Corinne Bailey Rae" },
      { title: "Can't Help Falling in Love", artist: "Elvis Presley" },
      { title: "Can You Feel The Love Tonight", artist: "Elton John" },
      { title: "At Last", artist: "Etta James" },
      { title: "You Are The Best Thing", artist: "Ray LaMontagne" },
      { title: "I Got You Babe", artist: "Sonny & Cher" },
      { title: "Weak", artist: "SWV" },
      { title: "Lover", artist: "Taylor Swift" }
    ],
    "Parent Dance": [
      { title: "Just the Way You Are", artist: "Billy Joel" },
      { title: "Landslide", artist: "Fleetwood Mac" },
      { title: "How Sweet It Is", artist: "James Taylor" },
      { title: "Your Smiling Face", artist: "James Taylor" },
      { title: "What A Wonderful World", artist: "Louis Armstrong" },
      { title: "Simple Man", artist: "Lynyrd Skynyrd" },
      { title: "L-O-V-E", artist: "Nat King Cole" },
      { title: "You'll Be In My Heart", artist: "Phil Collins" },
      { title: "Bridge Over Troubled Water", artist: "Simon & Garfunkel" },
      { title: "Days Like This", artist: "Van Morrison" }
    ],
    "Grand Finale": [
      { title: "Empire State of Mind", artist: "JAY-Z, Alicia Keys" },
      { title: "Don't Stop Believin'", artist: "Journey" },
      { title: "Bohemian Rhapsody", artist: "Queen" },
      { title: "Shut Up And Dance", artist: "Walk the Moon" },
      { title: "I Wanna Dance With Somebody", artist: "Whitney Houston" }
    ]
  },
  "DJ Band": {
    "Wedding Party Intro": [
      { title: "Let's Get It Started", artist: "Black Eyed Peas" },
      { title: "Club Can't Hold Us", artist: "Macklemore & Ryan Lewis" },
      { title: "This Is How We Do It", artist: "Montell Jordan" },
      { title: "Get The Party Started", artist: "Pink" },
      { title: "Don't Stop The Party", artist: "Pitbull" },
      { title: "We Are Family", artist: "Sister Sledge" }
    ],
    "Newlyweds Intro": [
      { title: "Crazy In Love", artist: "Beyonce, JAY-Z" },
      { title: "Let's Get Married", artist: "Bleachers" },
      { title: "Wo Yao Ni De Ai", artist: "Jasmine Chen" },
      { title: "Good Life", artist: "Kanye West" },
      { title: "About Damn Time", artist: "Lizzo" },
      { title: "Happy", artist: "Pharrell" }
    ],
    "First Dance": [
      { title: "Time After Time", artist: "Cyndi Lauper" },
      { title: "Best Part", artist: "Daniel Caesar, H.E.R." },
      { title: "I Love You Always Forever", artist: "Donna Lewis" },
      { title: "Your Song", artist: "Elton John" },
      { title: "Can't Help Falling in Love", artist: "Elvis Presley" },
      { title: "At Last", artist: "Etta James" },
      { title: "Can't Take My Eyes Off of You", artist: "Frank Valli" },
      { title: "Conversations In The Dark", artist: "John Legend" },
      { title: "Simply The Best (From \"Schitt's Creek\")", artist: "Noah Reid" },
      { title: "Lover", artist: "Taylor Swift" }
    ],
    "Parent Dance": [
      { title: "Because You Loved Me", artist: "Celine Dion" },
      { title: "True Colors", artist: "Cyndi Lauper" },
      { title: "You Raise Me Up", artist: "Josh Grobin" },
      { title: "Hey Mama", artist: "Kanye West" },
      { title: "What A Wonderful World", artist: "Louis Armstrong" },
      { title: "Father & Daughter", artist: "Paul Simon" },
      { title: "Forever Young", artist: "Rod Stewart" },
      { title: "Have I Told You Lately", artist: "Rod Stewart" },
      { title: "My Girl", artist: "The Temptations" },
      { title: "Then They Do", artist: "Trace Adkins" }
    ],
    "Grand Finale": [
      { title: "Piano Man", artist: "Billy Joel" },
      { title: "Rosalita", artist: "Bruce Springsteen" },
      { title: "Last Dance", artist: "Donna Summer" },
      { title: "Don't Stop Believin'", artist: "Journey" },
      { title: "I Wanna Dance With Somebody", artist: "Whitney Houston" }
    ]
  },
  "DJ + Musicians": {
    "Wedding Party Intro": [
      { title: "Let's Get It Started", artist: "Black Eyed Peas" },
      { title: "Club Can't Hold Us", artist: "Macklemore & Ryan Lewis" },
      { title: "This Is How We Do It", artist: "Montell Jordan" },
      { title: "Get The Party Started", artist: "Pink" },
      { title: "Don't Stop The Party", artist: "Pitbull" },
      { title: "We Are Family", artist: "Sister Sledge" }
    ],
    "Newlyweds Intro": [
      { title: "Crazy In Love", artist: "Beyonce, JAY-Z" },
      { title: "Let's Get Married", artist: "Bleachers" },
      { title: "Wo Yao Ni De Ai", artist: "Jasmine Chen" },
      { title: "Good Life", artist: "Kanye West" },
      { title: "About Damn Time", artist: "Lizzo" },
      { title: "Happy", artist: "Pharrell" }
    ],
    "First Dance": [
      { title: "Time After Time", artist: "Cyndi Lauper" },
      { title: "Best Part", artist: "Daniel Caesar, H.E.R." },
      { title: "I Love You Always Forever", artist: "Donna Lewis" },
      { title: "Your Song", artist: "Elton John" },
      { title: "Can't Help Falling in Love", artist: "Elvis Presley" },
      { title: "At Last", artist: "Etta James" },
      { title: "Can't Take My Eyes Off of You", artist: "Frank Valli" },
      { title: "Conversations In The Dark", artist: "John Legend" },
      { title: "Simply The Best (From \"Schitt's Creek\")", artist: "Noah Reid" },
      { title: "Lover", artist: "Taylor Swift" }
    ],
    "Parent Dance": [
      { title: "Because You Loved Me", artist: "Celine Dion" },
      { title: "True Colors", artist: "Cyndi Lauper" },
      { title: "You Raise Me Up", artist: "Josh Grobin" },
      { title: "Hey Mama", artist: "Kanye West" },
      { title: "What A Wonderful World", artist: "Louis Armstrong" },
      { title: "Father & Daughter", artist: "Paul Simon" },
      { title: "Forever Young", artist: "Rod Stewart" },
      { title: "Have I Told You Lately", artist: "Rod Stewart" },
      { title: "My Girl", artist: "The Temptations" },
      { title: "Then They Do", artist: "Trace Adkins" }
    ],
    "Grand Finale": [
      { title: "Piano Man", artist: "Billy Joel" },
      { title: "Rosalita", artist: "Bruce Springsteen" },
      { title: "Last Dance", artist: "Donna Summer" },
      { title: "Don't Stop Believin'", artist: "Journey" },
      { title: "I Wanna Dance With Somebody", artist: "Whitney Houston" }
    ]
  },
  "Solo DJ": {
    "Wedding Party Intro": [
      { title: "Let's Get It Started", artist: "Black Eyed Peas" },
      { title: "Club Can't Hold Us", artist: "Macklemore & Ryan Lewis" },
      { title: "This Is How We Do It", artist: "Montell Jordan" },
      { title: "Get The Party Started", artist: "Pink" },
      { title: "Don't Stop The Party", artist: "Pitbull" },
      { title: "We Are Family", artist: "Sister Sledge" }
    ],
    "Newlyweds Intro": [
      { title: "Crazy In Love", artist: "Beyonce, JAY-Z" },
      { title: "Let's Get Married", artist: "Bleachers" },
      { title: "Wo Yao Ni De Ai", artist: "Jasmine Chen" },
      { title: "Good Life", artist: "Kanye West" },
      { title: "About Damn Time", artist: "Lizzo" },
      { title: "Happy", artist: "Pharrell" }
    ],
    "First Dance": [
      { title: "Time After Time", artist: "Cyndi Lauper" },
      { title: "Best Part", artist: "Daniel Caesar, H.E.R." },
      { title: "I Love You Always Forever", artist: "Donna Lewis" },
      { title: "Your Song", artist: "Elton John" },
      { title: "Can't Help Falling in Love", artist: "Elvis Presley" },
      { title: "At Last", artist: "Etta James" },
      { title: "Can't Take My Eyes Off of You", artist: "Frank Valli" },
      { title: "Conversations In The Dark", artist: "John Legend" },
      { title: "Simply The Best (From \"Schitt's Creek\")", artist: "Noah Reid" },
      { title: "Lover", artist: "Taylor Swift" }
    ],
    "Parent Dance": [
      { title: "Because You Loved Me", artist: "Celine Dion" },
      { title: "True Colors", artist: "Cyndi Lauper" },
      { title: "You Raise Me Up", artist: "Josh Grobin" },
      { title: "Hey Mama", artist: "Kanye West" },
      { title: "What A Wonderful World", artist: "Louis Armstrong" },
      { title: "Father & Daughter", artist: "Paul Simon" },
      { title: "Forever Young", artist: "Rod Stewart" },
      { title: "Have I Told You Lately", artist: "Rod Stewart" },
      { title: "My Girl", artist: "The Temptations" },
      { title: "Then They Do", artist: "Trace Adkins" }
    ],
    "Grand Finale": [
      { title: "Piano Man", artist: "Billy Joel" },
      { title: "Rosalita", artist: "Bruce Springsteen" },
      { title: "Last Dance", artist: "Donna Summer" },
      { title: "Don't Stop Believin'", artist: "Journey" },
      { title: "I Wanna Dance With Somebody", artist: "Whitney Houston" }
    ]
  },
  "Full Band": {
    "Wedding Party Intro": [
      { title: "Run The World (Girls)", artist: "Beyonce" },
      { title: "You Make My Dreams Come True", artist: "Hall and Oates" },
      { title: "Happy", artist: "Pharrell" },
      { title: "Come and Get Your Love", artist: "Redbone" },
      { title: "We Are Family", artist: "Sister Sledge" },
      { title: "I Want You Back", artist: "The Jackson Five" }
    ],
    "Newlyweds Intro": [
      { title: "Crazy in Love", artist: "Beyonce/Jay-Z" },
      { title: "Lovely Day", artist: "Bill Withers" },
      { title: "All I Do Is Win", artist: "DJ Khaled" },
      { title: "Best I Ever Had", artist: "Drake" },
      { title: "Levitating", artist: "Dua Lipa" },
      { title: "Bring Em Out", artist: "T.I." }
    ],
    "First Dance": [
      { title: "Make You Feel My Love", artist: "Adele" },
      { title: "Millionaire", artist: "Chris Stapleton" },
      { title: "Can't Help Falling in Love", artist: "Elvis Presley" },
      { title: "At Last", artist: "Etta James" },
      { title: "Conversations In The Dark", artist: "John Legend" },
      { title: "Coming Home", artist: "Leon Bridges" },
      { title: "You Are The Best Thing", artist: "Ray LaMontagne" },
      { title: "I Got You Babe", artist: "Sonny & Cher" },
      { title: "For Once In My Life", artist: "Stevie Wonder" },
      { title: "Lover", artist: "Taylor Swift" }
    ],
    "Parent Dance": [
      { title: "Forever Young (Fast Version)", artist: "Bob Dylan" },
      { title: "You're The Inspiration", artist: "Chicago" },
      { title: "Landslide", artist: "Fleetwood Mac" },
      { title: "The Way You Look Tonight", artist: "Frank Sinatra" },
      { title: "I Loved Her First", artist: "Heartland" },
      { title: "Daughters", artist: "John Mayer" },
      { title: "Father and Daughter", artist: "Paul Simon" },
      { title: "Forever Young", artist: "Rod Stewart" },
      { title: "You Are The Sunshine Of My Life", artist: "Stevie Wonder" },
      { title: "The Man Who Loves You The Most", artist: "Zac Brown Band" }
    ],
    "Grand Finale": [
      { title: "Theme from New York, New York", artist: "Frank Sinatra" },
      { title: "Welcome to the Black Parade", artist: "My Chemical Romance" },
      { title: "Bohemian Rhapsody", artist: "Queen" },
      { title: "Superstition", artist: "Stevie Wonder" },
      { title: "I Wanna Dance With Somebody", artist: "Whitney Houston" }
    ]
  }
};

async function loadExistingSongs() {
  const songsSnapshot = await db.collection('songs').get();
  const songsMap = new Map();

  songsSnapshot.forEach(doc => {
    const data = doc.data();
    const key = `${normalizeText(data.originalTitle || '')}::${normalizeText(data.originalArtist || '')}`;
    songsMap.set(key, { id: doc.id, ...data });
  });

  return songsMap;
}

function findSong(title, artist, songsMap) {
  const key = `${normalizeText(title)}::${normalizeText(artist)}`;
  return songsMap.get(key);
}

function createId(title, artist) {
  return `${(title || '').toLowerCase()} ${(artist || '').toLowerCase()}`
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

function getCurrentTimestamp() {
  return new Date().toISOString();
}

async function createNewSong(title, artist, ensemble, momentTypes) {
  const songId = createId(title, artist) || `song-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = getCurrentTimestamp();
  
  const receptionEnsembleRecommendations = {};
  receptionEnsembleRecommendations[ensemble] = momentTypes;
  
  const newSong = {
    id: songId,
    originalTitle: title,
    originalArtist: artist || 'Unknown Artist',
    thcTitle: title,
    thcArtist: 'The Hook Club',
    videoUrl: '',
    spotifyUrl: '',
    originalBpm: null,
    thcBpm: null,
    isLive: true,
    sections: ['reception'],
    ensembles: [],
    genres: [],
    danceGenres: [],
    lightGenres: [],
    specialMomentTypes: [],
    specialMomentRecommendations: [],
    ceremonyEnsembleRecommendations: {},
    receptionEnsembleRecommendations: receptionEnsembleRecommendations,
    thcPercent: null,
    notes: '',
    createdAt: timestamp,
    updatedAt: timestamp,
    originalKey: null,
    requiresLeadVocalist: false,
    leadVocalistRole: '',
    leadVocalistPart: '',
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
    chordLyricChartUrl: '',
    ensembleSheetMusic: {},
    keyVersions: [
      {
        key: 'C',
        isDefault: true,
        bpm: null,
        chordLyricChartUrl: '',
        leadSheetUrl: '',
        fullBandArrangementUrl: '',
        hornChartUrl: null,
        sheetMusicStandardUrl: '',
        chartLyricsSpecialUrl: null,
        hornChartSpecialUrl: null
      }
    ]
  };

  await db.collection('songs').doc(songId).set({
    ...newSong,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });
  
  return { id: songId, ...newSong };
}

async function updateSongRecommendations(songId, ensemble, momentTypes) {
  const songRef = db.collection('songs').doc(songId);
  const currentDoc = await songRef.get();
  const currentData = currentDoc.data() || {};
  
  const currentRecs = currentData.receptionEnsembleRecommendations || {};
  const currentMomentTypes = currentRecs[ensemble] || [];
  
  // Merge moment types, avoiding duplicates
  const updatedMomentTypes = [...new Set([...currentMomentTypes, ...momentTypes])];

  const updatedRecs = {
    ...currentRecs,
    [ensemble]: updatedMomentTypes
  };

  await songRef.update({
    receptionEnsembleRecommendations: updatedRecs,
    updatedAt: FieldValue.serverTimestamp()
  });
}

async function main() {
  try {
    console.log('🎵 Starting reception ensemble recommendations import...\n');

    const songsMap = await loadExistingSongs();
    console.log(`📚 Loaded ${songsMap.size} existing songs from Firestore.\n`);

    let totalProcessed = 0;
    let found = 0;
    let created = 0;
    let errors = 0;

    for (const [ensemble, moments] of Object.entries(receptionRecommendations)) {
      console.log(`🎶 Processing ensemble: ${ensemble}`);
      
      for (const [momentType, songs] of Object.entries(moments)) {
        console.log(`  📋 ${momentType} (${songs.length} songs)`);
        
        for (const song of songs) {
          try {
            let foundSong = findSong(song.title, song.artist, songsMap);
            if (foundSong) {
              await updateSongRecommendations(foundSong.id, ensemble, [momentType]);
              found++;
              console.log(`    ✓ "${song.title}" by ${song.artist}`);
            } else {
              // Create new song
              const newSong = await createNewSong(song.title, song.artist, ensemble, [momentType]);
              songsMap.set(`${normalizeText(song.title)}::${normalizeText(song.artist)}`, newSong);
              created++;
              console.log(`    + Created: "${song.title}" by ${song.artist}`);
            }
            totalProcessed++;
            await new Promise(resolve => setTimeout(resolve, 25));
          } catch (error) {
            errors++;
            console.error(`    ❌ Error with "${song.title}" by ${song.artist}:`, error.message);
          }
        }
      }
      
      console.log('');
    }

    console.log('\n✅ Import complete!');
    console.log(`📊 Total processed: ${totalProcessed}`);
    console.log(`📊 Found and updated: ${found}`);
    console.log(`📊 Created new songs: ${created}`);
    console.log(`📊 Errors: ${errors}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

main();

