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

// Ceremony ensemble recommendations data from the images
const ceremonyRecommendations = {
  "Solo Piano": {
    processional: [
      { title: "God Only Knows", artist: "The Beach Boys" },
      { title: "All You Need Is Love", artist: "The Beatles" },
      { title: "A Thousand Years", artist: "Christina Perri" },
      { title: "Can't Help Falling In Love", artist: "Kina Grannis" },
      { title: "Clair de Lune", artist: "Debussy" },
      { title: "Prelude in C Major", artist: "J.S. Bach" },
      { title: "Lohengrin, Act 3: Bridal Chorus", artist: "Wagner" },
      { title: "May Be", artist: "Yiruma" }
    ],
    recessional: [
      { title: "Viva La Vida", artist: "Coldplay" },
      { title: "Mr. Blue Sky", artist: "Electric Light Orchestra" },
      { title: "Everything", artist: "Michael Bublé" },
      { title: "Starlight", artist: "Muse" },
      { title: "You're My Best Friend", artist: "Queen" },
      { title: "Signed, Sealed, Delivered (I'm Yours)", artist: "Stevie Wonder" },
      { title: "Every Little Thing She Does Is Magic", artist: "The Police" },
      { title: "She's A Rainbow", artist: "The Rolling Stones" }
    ]
  },
  "Solo Guitar": {
    processional: [
      { title: "Make You Feel My Love", artist: "Adele" },
      { title: "First Day Of My Life", artist: "Bright Eyes" },
      { title: "Over The Rainbow", artist: "Israel Kamakawiwo'ole" },
      { title: "Can't Help Falling In Love", artist: "Kina Grannis" },
      { title: "Simply The Best [From \"Schitt's Creek\"]", artist: "Noah Reid" },
      { title: "Canon In D", artist: "Pachebel" },
      { title: "Blackbird", artist: "The Beatles" },
      { title: "Crazy Love", artist: "Van Morrison" }
    ],
    recessional: [
      { title: "I Do", artist: "Colbie Caillat" },
      { title: "Everything", artist: "Michael Buble" },
      { title: "Here Comes Your Man", artist: "Pixies" },
      { title: "I'm A Believer", artist: "Smash Mouth" },
      { title: "Signed, Sealed, Delivered (I'm Yours)", artist: "Stevie Wonder" },
      { title: "Dreams", artist: "The Cranberries" },
      { title: "Every Little Thing She Does Is Magic", artist: "The Police" },
      { title: "I'm Always In Love", artist: "Wilco" }
    ]
  },
  "Classic Duo (Piano + Guitar)": {
    processional: [
      { title: "Thank You For Being A Friend", artist: "Cynthia Fee" },
      { title: "First Day Of My Life", artist: "Bright Eyes" },
      { title: "Latch [Acoustic]", artist: "Sam Smith" },
      { title: "Perfect", artist: "Ed Sheeran" },
      { title: "Wonderful Tonight", artist: "Eric Clapton" },
      { title: "You and Me", artist: "Lifehouse" },
      { title: "Wonderwall", artist: "Oasis" },
      { title: "Crazy Love", artist: "Van Morrison" }
    ],
    recessional: [
      { title: "Lovely Day", artist: "Bill Withers" },
      { title: "Paper Rings", artist: "Taylor Swift" },
      { title: "You Make My Dreams", artist: "Daryl Hall & John Oates" },
      { title: "I Got You (I Feel Good)", artist: "James Brown" },
      { title: "You Are The Best Thing", artist: "Ray LaMontagne" },
      { title: "Signed, Sealed, Delivered (I'm Yours)", artist: "Stevie Wonder" },
      { title: "Grow Old With Me", artist: "Tom Odell" },
      { title: "Beautiful Day", artist: "U2" }
    ]
  },
  "Lounge Duo (Vocalist + Piano)": {
    processional: [
      { title: "Make You Feel My Love", artist: "Adele" },
      { title: "Speechless", artist: "Dan + Shay" },
      { title: "Can You Feel The Love Tonight", artist: "Elton John" },
      { title: "Anyone", artist: "Justin Bieber" },
      { title: "Lifetime", artist: "Justin Bieber" },
      { title: "Can't Help Falling In Love", artist: "Kina Grannis" },
      { title: "Simply The Best", artist: "Noah Reid" },
      { title: "Bridge Over Troubled Water", artist: "Simon & Garfunkel" }
    ],
    recessional: [
      { title: "No One", artist: "Alicia Keyes" },
      { title: "Never In My Wildest Dreams", artist: "Dan Auerbach" },
      { title: "I Will Wait", artist: "Mumford & Sons" },
      { title: "Always Be My Baby", artist: "Mariah Carey" },
      { title: "Come And Get Your Love", artist: "Redbone" },
      { title: "Paper Rings", artist: "Taylor Swift" },
      { title: "Best Of My Love", artist: "The Emotions" },
      { title: "Everything", artist: "Michael Bublé" }
    ]
  },
  "Café Duo (Vocalist + Guitar)": {
    processional: [
      { title: "Make You Feel My Love", artist: "Adele" },
      { title: "Speechless", artist: "Dan + Shay" },
      { title: "Can You Feel The Love Tonight", artist: "Elton John" },
      { title: "Can't Help Falling In Love", artist: "Kina Grannis" },
      { title: "Simply The Best", artist: "Noah Reid" },
      { title: "Anyone", artist: "Justin Bieber" },
      { title: "Bridge Over Troubled Water", artist: "Simon & Garfunkel" },
      { title: "Enchanted", artist: "Taylor Swift" }
    ],
    recessional: [
      { title: "No One", artist: "Alicia Keyes" },
      { title: "Never In My Wildest Dreams", artist: "Dan Auerbach" },
      { title: "Always Be My Baby", artist: "Mariah Carey" },
      { title: "Everything", artist: "Michael Bublé" },
      { title: "I Will Wait", artist: "Mumford & Sons" },
      { title: "Come And Get Your Love", artist: "Redbone" },
      { title: "Paper Rings", artist: "Taylor Swift" },
      { title: "Best of My Love", artist: "The Emotions" }
    ]
  },
  "Solo Violin": {
    processional: [
      { title: "Make You Feel My Love", artist: "Adele" },
      { title: "Jesu, Joy of Man's Desiring", artist: "Bach" },
      { title: "Gabriel's Oboe [From \"The Mission\"]", artist: "Ennio Morricone" },
      { title: "Meditation from Thais", artist: "Massenet" },
      { title: "Canon in D", artist: "Pachelbel" },
      { title: "Ave Maria", artist: "Schubert" },
      { title: "In My Life", artist: "The Beatles" },
      { title: "Lohengrin, Act 3: Bridal Chorus", artist: "Wagner" }
    ],
    recessional: [
      { title: "Ode to Joy", artist: "Beethoven" },
      { title: "I Do", artist: "Colbie Caillat" },
      { title: "Viva La Vida", artist: "Coldplay" },
      { title: "Arrival of the Queen of Sheba", artist: "Handel" },
      { title: "Don't Stop Believin'", artist: "Journey" },
      { title: "Wedding March", artist: "Mendelssohn" },
      { title: "Higher Love", artist: "Steve Winwood" },
      { title: "Siman Tov Mazel Tov", artist: "Traditional Jewish" }
    ]
  },
  "Solo Cello": {
    processional: [
      { title: "Make You Feel My Love", artist: "Adele" },
      { title: "Cello Suite No. 1", artist: "Bach" },
      { title: "Jesu, Joy of Man's Desiring", artist: "Bach" },
      { title: "Over the Rainbow", artist: "Israel Kamakawiwo'ole" },
      { title: "Canon in D", artist: "Pachelbel" },
      { title: "Ave Maria", artist: "Schubert" },
      { title: "Lohengrin, Act 3: Bridal Chorus", artist: "Wagner" },
      { title: "Wedding March", artist: "Wagner" }
    ],
    recessional: [
      { title: "Ode to Joy", artist: "Beethoven" },
      { title: "Arrival of the Queen of Sheba", artist: "Handel" },
      { title: "Water Music, Hornpipe", artist: "Handel" },
      { title: "Mesmerize", artist: "Ja Rule, Ashanti" },
      { title: "Always Be My Baby", artist: "Mariah Carey" },
      { title: "I Choose You", artist: "Sara Bareilles" },
      { title: "Golden Lady", artist: "Stevie Wonder" },
      { title: "Four Seasons: Spring", artist: "Vivaldi" }
    ]
  },
  "Violin w/ Tracks (Violin + DJ)": {
    processional: [
      { title: "No One", artist: "Alicia Keys" },
      { title: "Viva La Vida", artist: "Coldplay" },
      { title: "Perfect", artist: "Ed Sheeran" },
      { title: "Can't Help Falling In Love", artist: "Kina Grannis" },
      { title: "I Choose You", artist: "Sara Bareilles" },
      { title: "Nothing Compares 2 U", artist: "Sinead O'Connor" },
      { title: "Lover", artist: "Taylor Swift" },
      { title: "I Will Always Love You", artist: "Whitney Houston" }
    ],
    recessional: [
      { title: "Love on Top", artist: "Beyoncé" },
      { title: "December, 1963 (Oh What a Night)", artist: "Frankie Valli" },
      { title: "Always Be My Baby", artist: "Mariah Carey" },
      { title: "Signed, Sealed, Delivered (I'm Yours)", artist: "Stevie Wonder" },
      { title: "Love Story", artist: "Taylor Swift" },
      { title: "Something Just Like this", artist: "The Chainsmokers, Coldplay" },
      { title: "I'm A Believer", artist: "The Monkees" },
      { title: "Beautiful Day", artist: "U2" }
    ]
  },
  "Cello w/ Tracks (Cello + DJ)": {
    processional: [
      { title: "No One", artist: "Alicia Keys" },
      { title: "Viva La Vida", artist: "Coldplay" },
      { title: "Perfect", artist: "Ed Sheeran" },
      { title: "Can't Help Falling In Love", artist: "Kina Grannis" },
      { title: "I Choose You", artist: "Sara Bareilles" },
      { title: "Nothing Compares 2 U", artist: "Sinead O'Connor" },
      { title: "Lover", artist: "Taylor Swift" },
      { title: "I Will Always Love You", artist: "Whitney Houston" }
    ],
    recessional: [
      { title: "Love on Top", artist: "Beyoncé" },
      { title: "December, 1963 (Oh What a Night)", artist: "Frankie Valli" },
      { title: "Always Be My Baby", artist: "Mariah Carey" },
      { title: "Signed, Sealed, Delivered (I'm Yours)", artist: "Stevie Wonder" },
      { title: "Love Story", artist: "Taylor Swift" },
      { title: "Something Just Like this", artist: "The Chainsmokers, Coldplay" },
      { title: "I'm A Believer", artist: "The Monkees" },
      { title: "Beautiful Day", artist: "U2" }
    ]
  },
  "String Duo (Violin + Cello)": {
    processional: [
      { title: "First Day Of My Life", artist: "Bright Eyes" },
      { title: "Speechless", artist: "Dan and Shay" },
      { title: "Flower Duet from \"Lakme\"", artist: "Delibes" },
      { title: "Perfect", artist: "Ed Sheeran" },
      { title: "Ave Maria", artist: "Franz Schubert" },
      { title: "Over The Rainbow", artist: "Israel Kamakawiwo'ole" },
      { title: "Simply the Best [From \"Schitt's Creek\"]", artist: "Noah Reid" },
      { title: "Canon in D", artist: "Pachelbel" }
    ],
    recessional: [
      { title: "Love on Top", artist: "Beyoncé" },
      { title: "I Do", artist: "Colbie Caillat" },
      { title: "Accidentally In Love", artist: "Counting Crows" },
      { title: "Mesmerize", artist: "Ja Rule, Ashanti" },
      { title: "Everything", artist: "Michael Buble" },
      { title: "Let My Love Open The Door", artist: "Pete Townshend" },
      { title: "Don't Stop Me Now", artist: "Queen" },
      { title: "Signed, Sealed, Delivered [I'm Yours]", artist: "Stevie Wonder" }
    ]
  },
  "Violin Duo (Violin I + Violin II)": {
    processional: [
      { title: "All Of Me", artist: "John Legend" },
      { title: "Can't Help Fallling In Love", artist: "Kina Grannis" },
      { title: "High Tide Or Low Tide", artist: "Bob Marley" },
      { title: "Perfect", artist: "Ed Sheeran" },
      { title: "Ave Maria", artist: "Franz Schubert" },
      { title: "Over The Rainbow", artist: "Israel Kamakawiwo'ole" },
      { title: "Simply the Best [From \"Schitt's Creek\"]", artist: "Noah Reid" },
      { title: "Canon in D", artist: "Pachelbel" }
    ],
    recessional: [
      { title: "Love On Top", artist: "Beyoncé" },
      { title: "I Do", artist: "Colbie Caillat" },
      { title: "Accidentally In Love", artist: "Counting Crows" },
      { title: "Mesmerize", artist: "Ja Rule, Ashanti" },
      { title: "Everything", artist: "Michael Buble" },
      { title: "Let My Love Open The Door", artist: "Pete Townshend" },
      { title: "Don't Stop Me Now", artist: "Queen" },
      { title: "Signed, Sealed, Delivered (I'm Yours)", artist: "Stevie Wonder" }
    ]
  },
  "Folk Duo (Violin + Guitar)": {
    processional: [
      { title: "Make You Feel My Love", artist: "Adele" },
      { title: "First Day Of My Life", artist: "Bright Eyes" },
      { title: "Millionaire", artist: "Chris Stapleton" },
      { title: "Perfect", artist: "Ed Sheeran" },
      { title: "Over The Rainbow", artist: "Israel Kamakawiwo'ole" },
      { title: "What A Wonderful World", artist: "Louis Armstrong" },
      { title: "Simply the Best [From \"Schitt's Creek\"]", artist: "Noah Reid" },
      { title: "Marry Me", artist: "Train" }
    ],
    recessional: [
      { title: "I Do", artist: "Colbie Caillat" },
      { title: "Accidentally In Love", artist: "Counting Crows" },
      { title: "Mesmerize", artist: "Ja Rule, Ashanti" },
      { title: "Everything", artist: "Michael Buble" },
      { title: "Let My Love Open The Door", artist: "Pete Townshend" },
      { title: "Here Comes Your Man", artist: "Pixies" },
      { title: "Signed, Sealed, Delivered (I'm Yours)", artist: "Stevie Wonder" },
      { title: "I'm Always In Love", artist: "Wilco" }
    ]
  },
  "Elegant Duo (Violin + Piano)": {
    processional: [
      { title: "Moon River [From \"Breakfast at Tiffany's\"]", artist: "Andy Williams" },
      { title: "The Scientist", artist: "Coldplay" },
      { title: "Can't Help Fallling In Love", artist: "Kina Grannis" },
      { title: "Salut d'Amour", artist: "Edward Elgar" },
      { title: "Somewhere [From \"West Side Story\"]", artist: "Leonard Bernstein" },
      { title: "Meditation from Thais", artist: "Massenet" },
      { title: "Canon in D", artist: "Pachelbel" },
      { title: "River Flows In You", artist: "Yiruma" }
    ],
    recessional: [
      { title: "Ode to Joy", artist: "Beethoven" },
      { title: "Love on Top", artist: "Beyoncé" },
      { title: "You Make My Dreams (Come True)", artist: "Hall & Oates" },
      { title: "Mesmerize", artist: "Ja Rule, Ashanti" },
      { title: "Don't Stop Me Now", artist: "Queen" },
      { title: "Signed, Sealed, Delivered (I'm Yours)", artist: "Stevie Wonder" },
      { title: "Every Little Thing She Does Is Magic", artist: "The Police" },
      { title: "Wedding March", artist: "Wagner" }
    ]
  },
  "Guitar Trio (Violin + Cello + Guitar)": {
    processional: [
      { title: "Moon River [From \"Breakfast at Tiffany's\"]", artist: "Andy Williams" },
      { title: "Millionaire", artist: "Chris Stapleton" },
      { title: "Speechless", artist: "Dan + Shay" },
      { title: "Thinking Out Loud", artist: "Ed Sheeran" },
      { title: "If Not For You", artist: "George Harrison" },
      { title: "Over The Rainbow", artist: "Israel Kamakawiwo'ole" },
      { title: "Here Comes The Sun", artist: "The Beatles" },
      { title: "Bitter Sweet Symphony", artist: "The Verve" }
    ],
    recessional: [
      { title: "You Make My Dreams (Come True)", artist: "Daryl Hall & John Oates" },
      { title: "Don't Stop Believin'", artist: "Journey" },
      { title: "Always Be My Baby", artist: "Mariah Carey" },
      { title: "Don't Stop Me Now", artist: "Queen" },
      { title: "Theme From New York, New York", artist: "Frank Sinatra" },
      { title: "Every Little Thing She Does Is Magic", artist: "The Police" },
      { title: "Happy Together", artist: "The Turtles" },
      { title: "Paper Rings", artist: "Taylor Swift" }
    ]
  },
  "Piano Trio (Violin + Cello + Piano)": {
    processional: [
      { title: "Make You Feel My Love", artist: "Adele" },
      { title: "If I Ain't Got You", artist: "Alicia Keys" },
      { title: "A Thousand Years", artist: "Christina Perri" },
      { title: "All Of Me", artist: "John Legend" },
      { title: "You Raise Me Up", artist: "Josh Groban" },
      { title: "Can't Help Falling in Love", artist: "Kina Grannis" },
      { title: "Stay With Me", artist: "Sam Smith" },
      { title: "River Flows In You", artist: "Yiruma" }
    ],
    recessional: [
      { title: "I Do", artist: "Colbie Caillat" },
      { title: "You Make My Dreams (Come True)", artist: "Daryl Hall & John Oates" },
      { title: "Theme From \"New York, New York\"", artist: "Frank Sinatra" },
      { title: "Don't Stop Believin'", artist: "Journey" },
      { title: "Still Into You", artist: "Paramore" },
      { title: "Paper Rings", artist: "Taylor Swift" },
      { title: "Something Just Like this", artist: "The Chainsmokers, Coldplay" },
      { title: "I'm A Believer", artist: "The Monkees" }
    ]
  },
  "Chamber Quartet (Violin + Cello + Guitar + Piano)": {
    processional: [
      { title: "Make You Feel My Love", artist: "Adele" },
      { title: "Millionaire", artist: "Chris Stapleton" },
      { title: "A Thousand Years", artist: "Christina Perri" },
      { title: "You Raise Me Up", artist: "Josh Groban" },
      { title: "Somewhere Only We Know", artist: "Keane" },
      { title: "Canon in D", artist: "Pachelbel" },
      { title: "Stay With Me", artist: "Sam Smith" },
      { title: "River Flows In You", artist: "Yiruma" }
    ],
    recessional: [
      { title: "You Make My Dreams (Come True)", artist: "Daryl Hall & John Oates" },
      { title: "Don't Stop Believin'", artist: "Journey" },
      { title: "Always Be My Baby", artist: "Mariah Carey" },
      { title: "Love Story", artist: "Taylor Swift" },
      { title: "Ho Hey", artist: "The Lumineers" },
      { title: "Every Little Thing She Does Is Magic", artist: "The Police" },
      { title: "Happy Together", artist: "The Turtles" },
      { title: "Paper Rings", artist: "Taylor Swift" }
    ]
  },
  "String Quartet (Violin I + Violin II + Viola + Cello)": {
    processional: [
      { title: "Somewhere Only We Know", artist: "Keane" },
      { title: "Can't Help Falling In Love", artist: "Kina Grannis" },
      { title: "Canon in D", artist: "Pachelbel" },
      { title: "Hallelujah", artist: "Rufus Wainwright" },
      { title: "Stay With Me", artist: "Sam Smith" },
      { title: "Love Story", artist: "Taylor Swift" },
      { title: "All You Need Is Love", artist: "The Beatles" },
      { title: "Lohengrin, Act 3: Bridal Chorus", artist: "Wagner" }
    ],
    recessional: [
      { title: "Ode To Joy", artist: "Beethoven" },
      { title: "This Will Be (An Everlasting Love)", artist: "Natalie Cole" },
      { title: "The Firebird Suite - Finale", artist: "Igor Stravinsky" },
      { title: "Empire State of Mind", artist: "JAY-Z, Alicia Keys" },
      { title: "Wedding March", artist: "Mendelssohn" },
      { title: "Happy", artist: "Pharrell Williams" },
      { title: "Paper Rings", artist: "Taylor Swift" },
      { title: "Something Just Like This", artist: "The Chainsmokers, Coldplay" }
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

async function createNewSong(title, artist, ensemble, processional, recessional) {
  const songId = createId(title, artist) || `song-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = getCurrentTimestamp();
  
  const ceremonyEnsembleRecommendations = {};
  ceremonyEnsembleRecommendations[ensemble] = {
    processional: processional,
    recessional: recessional
  };
  
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
    sections: ['ceremony'],
    ensembles: [],
    genres: [],
    danceGenres: [],
    lightGenres: [],
    specialMomentTypes: [],
    specialMomentRecommendations: [],
    ceremonyEnsembleRecommendations: ceremonyEnsembleRecommendations,
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

async function updateSongRecommendations(songId, ensemble, processional, recessional) {
  const songRef = db.collection('songs').doc(songId);
  const currentDoc = await songRef.get();
  const currentData = currentDoc.data() || {};
  
  const currentRecs = currentData.ceremonyEnsembleRecommendations || {};
  const updatedRecs = {
    ...currentRecs,
    [ensemble]: {
      processional: processional,
      recessional: recessional
    }
  };

  await songRef.update({
    ceremonyEnsembleRecommendations: updatedRecs,
    updatedAt: FieldValue.serverTimestamp()
  });
}

async function main() {
  try {
    console.log('🎻 Starting ceremony ensemble recommendations import...\n');

    const songsMap = await loadExistingSongs();
    console.log(`📚 Loaded ${songsMap.size} existing songs from Firestore.\n`);

    let totalProcessed = 0;
    let found = 0;
    let created = 0;
    let errors = 0;

    for (const [ensemble, recommendations] of Object.entries(ceremonyRecommendations)) {
      console.log(`🎶 Processing ensemble: ${ensemble}`);
      
      // Process processional recommendations
      for (const song of recommendations.processional) {
        try {
          let foundSong = findSong(song.title, song.artist, songsMap);
          if (foundSong) {
            await updateSongRecommendations(foundSong.id, ensemble, true, false);
            found++;
            console.log(`  ✓ Processional: "${song.title}" by ${song.artist}`);
          } else {
            // Create new song
            const newSong = await createNewSong(song.title, song.artist, ensemble, true, false);
            songsMap.set(`${normalizeText(song.title)}::${normalizeText(song.artist)}`, newSong);
            created++;
            console.log(`  + Created (Processional): "${song.title}" by ${song.artist}`);
          }
          totalProcessed++;
          await new Promise(resolve => setTimeout(resolve, 25));
        } catch (error) {
          errors++;
          console.error(`  ❌ Error with "${song.title}" by ${song.artist}:`, error.message);
        }
      }

      // Process recessional recommendations
      for (const song of recommendations.recessional) {
        try {
          let foundSong = findSong(song.title, song.artist, songsMap);
          if (foundSong) {
            // Check if song already has processional recommendation for this ensemble
            const currentRecs = foundSong.ceremonyEnsembleRecommendations?.[ensemble] || {};
            const hasProcessional = currentRecs.processional === true;
            
            await updateSongRecommendations(foundSong.id, ensemble, hasProcessional, true);
            found++;
            console.log(`  ✓ Recessional: "${song.title}" by ${song.artist}`);
          } else {
            // Create new song
            const newSong = await createNewSong(song.title, song.artist, ensemble, false, true);
            songsMap.set(`${normalizeText(song.title)}::${normalizeText(song.artist)}`, newSong);
            created++;
            console.log(`  + Created (Recessional): "${song.title}" by ${song.artist}`);
          }
          totalProcessed++;
          await new Promise(resolve => setTimeout(resolve, 25));
        } catch (error) {
          errors++;
          console.error(`  ❌ Error with "${song.title}" by ${song.artist}:`, error.message);
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

