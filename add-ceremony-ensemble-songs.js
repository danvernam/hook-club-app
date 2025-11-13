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
    .replace(/["'`’‘]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
}

function createId(title, artist) {
  return `${title} ${artist}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getCurrentTimestamp() {
  return new Date().toISOString();
}

function buildSongEntry(title, artist) {
  return { title, artist };
}

const violinOrCelloTracksSongs = [
  buildSongEntry('Easy On Me', 'Adele'),
  buildSongEntry('Moon River [From "Breakfast at Tiffany\'s"]', 'Andy Williams'),
  buildSongEntry('Halo', 'Beyoncé'),
  buildSongEntry('Yellow', 'Coldplay'),
  buildSongEntry('Because You Loved Me', 'Celine Dion'),
  buildSongEntry('Forever', 'Chris Brown'),
  buildSongEntry('Best Part', 'Daniel Caesar, H.E.R.'),
  buildSongEntry('Lover', 'Taylor Swift'),
  buildSongEntry('Thinking Out Loud', 'Ed Sheeran'),
  buildSongEntry('Love Me Like You Do', 'Ellie Goulding'),
  buildSongEntry('Your Song', 'Elton John'),
  buildSongEntry('Can You Feel The Love Tonight', 'Elton John'),
  buildSongEntry('Just The Two Of Us', 'Grover Washington Jr.; Bill Withers'),
  buildSongEntry('All Of Me', 'John Legend'),
  buildSongEntry('Shallow', 'Lady Gaga, Bradley Cooper'),
  buildSongEntry('Before You Go', 'Lewis Capaldi'),
  buildSongEntry('Always Be My Baby', 'Mariah Carey'),
  buildSongEntry('My Girl', 'The Temptations'),
  buildSongEntry('Circles', 'Post Malone'),
  buildSongEntry('Hallelujah', 'Rufus Wainwright'),
  buildSongEntry('Bridge Over Troubled Water', 'Simon & Garfunkel'),
  buildSongEntry('Wonderwall', 'Oasis')
];

const ensembleSongMap = [
  {
    ensemble: 'Chamber Quartet (Violin + Cello + Guitar + Piano)',
    songs: [
      buildSongEntry('Forever Young', 'Alphaville'),
      buildSongEntry('Moon River [From "Breakfast at Tiffany\'s"]', 'Andy Williams'),
      buildSongEntry('I Want It That Way', 'Backstreet Boys'),
      buildSongEntry('The Story', 'Brandi Carlile'),
      buildSongEntry('Viva La Vida', 'Coldplay'),
      buildSongEntry('Put Your Records On', 'Corinne Bailey Rae'),
      buildSongEntry('Can You Feel The Love Tonight', 'Elton John'),
      buildSongEntry('Sign Of The Times', 'Harry Styles'),
      buildSongEntry("I'm Yours", 'Jason Mraz'),
      buildSongEntry('Ashoken Farewell', 'Jay Ungar'),
      buildSongEntry('Everything', 'Michael Bublé'),
      buildSongEntry('Angels Like You', 'Miley Cyrus'),
      buildSongEntry('Wrecking Ball', 'Miley Cyrus'),
      buildSongEntry('The Only Exception', 'Paramore'),
      buildSongEntry("Maybe I'm Amazed", 'Paul McCartney'),
      buildSongEntry('Perpetuum Mobile', 'Penguin Cafe Orchestra'),
      buildSongEntry("You'll Be In My Heart", 'Phil Collins'),
      buildSongEntry('Home', 'Phillip Phillips'),
      buildSongEntry('Dancing On My Own', 'Robyn'),
      buildSongEntry('My Cherie Amour', 'Stevie Wonder'),
      buildSongEntry('You Are The Sunshine Of My Life', 'Stevie Wonder'),
      buildSongEntry('Wildest Dreams', 'Taylor Swift'),
      buildSongEntry('All You Need Is Love', 'The Beatles'),
      buildSongEntry('Here Comes The Sun', 'The Beatles'),
      buildSongEntry('The Book of Love', 'The Magnetic Fields'),
      buildSongEntry('Such Great Heights', 'The Postal Service'),
      buildSongEntry('Sweet Disposition', 'The Temper Trap'),
      buildSongEntry('Bitter Sweet Symphony', 'The Verve'),
      buildSongEntry('Drops Of Jupiter (Tell Me)', 'Train'),
      buildSongEntry('Jesus, Etc.', 'Wilco')
    ]
  },
  {
    ensemble: 'Guitar Trio (Violin + Cello + Guitar)',
    songs: [
      buildSongEntry('Easy On Me', 'Adele'),
      buildSongEntry("Don't Matter", 'Akon'),
      buildSongEntry('Forever Young', 'Alphaville'),
      buildSongEntry('Moon River [From "Breakfast at Tiffany\'s"]', 'Andy Williams'),
      buildSongEntry('Barbie Girl', 'Aqua'),
      buildSongEntry('Skinny Love', 'Bon Iver'),
      buildSongEntry('Tennessee Whiskey', 'Chris Stapleton'),
      buildSongEntry('Put Your Records On', 'Corinne Bailey Rae'),
      buildSongEntry('Best Part', 'Daniel Caesar, H.E.R.'),
      buildSongEntry('Never Going Back Again', 'Fleetwood Mac'),
      buildSongEntry('Come Fly With Me', 'Frank Sinatra'),
      buildSongEntry('Falling Slowly', 'Glen Hansard, Markéta Irglová'),
      buildSongEntry("Sweet Child O' Mine", "Guns N' Roses"),
      buildSongEntry('Sweet Creature', 'Harry Styles'),
      buildSongEntry('Such Great Heights', 'Iron & Wine'),
      buildSongEntry('Ashoken Farewell', 'Jay Ungar'),
      buildSongEntry('XO', 'John Mayer'),
      buildSongEntry('River', 'Leon Bridges'),
      buildSongEntry('Before You Go', 'Lewis Capaldi'),
      buildSongEntry('Sunday Morning', 'Maroon 5'),
      buildSongEntry('Angels Like You', 'Miley Cyrus'),
      buildSongEntry('Harvest Moon', 'Neil Young'),
      buildSongEntry("You'll Be In My Heart", 'Phil Collins'),
      buildSongEntry('The First Time Ever I Saw Your Face', 'Roberta Flack'),
      buildSongEntry('Kiss Me', 'Sixpence None The Richer'),
      buildSongEntry('Blackbird', 'The Beatles'),
      buildSongEntry('Here Comes The Sun', 'The Beatles'),
      buildSongEntry('The Book of Love', 'The Magnetic Fields'),
      buildSongEntry('Drops Of Jupiter (Tell Me)', 'Train'),
      buildSongEntry('Crazy Love', 'Van Morrison')
    ]
  },
  {
    ensemble: 'String Quartet (Violin I + Violin II + Viola + Cello)',
    songs: [
      buildSongEntry('Make You Feel My Love', 'Adele'),
      buildSongEntry('Easy On Me', 'Adele'),
      buildSongEntry("Jesu, Joy of Man's Desiring", 'Bach'),
      buildSongEntry('Air, "On The G String"', 'Bach'),
      buildSongEntry('I Want It That Way', 'Backstreet Boys'),
      buildSongEntry('How Deep Is Your Love', 'Calvin Harris, Disciples'),
      buildSongEntry('Yellow', 'Coldplay'),
      buildSongEntry('Kiss Me More', 'Doja Cat, SZA'),
      buildSongEntry('Can You Feel The Love Tonight', 'Elton John'),
      buildSongEntry("Can't Take My Eyes Off Of You", 'Frankie Valli'),
      buildSongEntry('Water Music, Air in F', 'Handel'),
      buildSongEntry('Water Music, Hornpipe', 'Handel'),
      buildSongEntry('As It Was', 'Harry Styles'),
      buildSongEntry('Take Me To Church', 'Hozier'),
      buildSongEntry('Somewhere Only We Know', 'Keane'),
      buildSongEntry('Shallow', 'Lady Gaga, Bradley Cooper'),
      buildSongEntry('Wrecking Ball', 'Miley Cyrus'),
      buildSongEntry('This Will Be (An Everlasting Love)', 'Natalie Cole'),
      buildSongEntry('What About Us', 'P!nk'),
      buildSongEntry('Purple Rain', 'Prince'),
      buildSongEntry('Trumpet Voluntary', 'Purcell'),
      buildSongEntry('Love On The Brain', 'Rihanna'),
      buildSongEntry('Dancing On My Own', 'Robyn'),
      buildSongEntry('Rhapsody on a Theme of Paganini', 'Sergei Rachmaninoff'),
      buildSongEntry('In My Blood', 'Shawn Mendes'),
      buildSongEntry('Enchanted', 'Taylor Swift'),
      buildSongEntry('Wildest Dreams', 'Taylor Swift'),
      buildSongEntry('Sweet Disposition', 'The Temper Trap'),
      buildSongEntry('Bitter Sweet Symphony', 'The Verve'),
      buildSongEntry('Four Seasons: Spring', 'Vivaldi')
    ]
  },
  {
    ensemble: 'Elegant Duo (Violin + Piano)',
    songs: [
      buildSongEntry('Easy On Me', 'Adele'),
      buildSongEntry('Forever Young', 'Alphaville'),
      buildSongEntry('POV', 'Ariana Grande'),
      buildSongEntry('Skinny Love', 'Bon Iver'),
      buildSongEntry('Because You Loved Me', 'Celine Dion'),
      buildSongEntry('Tennessee Whiskey', 'Chris Stapleton'),
      buildSongEntry('Yellow', 'Coldplay'),
      buildSongEntry('Put Your Records On', 'Corinne Bailey Rae'),
      buildSongEntry('Photograph', 'Ed Sheeran'),
      buildSongEntry('Thinking Out Loud', 'Ed Sheeran'),
      buildSongEntry('Love Me Like You Do', 'Ellie Goulding'),
      buildSongEntry('Everywhere', 'Fleetwood Mac'),
      buildSongEntry('Ave Maria', 'Franz Schubert'),
      buildSongEntry('Falling Slowly', 'Glen Hansard, Markéta Irglová'),
      buildSongEntry('Sweet Creature', 'Harry Styles'),
      buildSongEntry('Lucky', 'Jason Mraz, Colbie Caillat'),
      buildSongEntry('Before You Go', 'Lewis Capaldi'),
      buildSongEntry('Sunday Morning', 'Maroon 5'),
      buildSongEntry('The Only Exception', 'Paramore'),
      buildSongEntry('All The Wild Horses', 'Ray LaMontagne'),
      buildSongEntry('Treat You Better', 'RÜFÜS DU SOL'),
      buildSongEntry('Hallelujah', 'Rufus Wainwright'),
      buildSongEntry('Latch [Acoustic]', 'Sam Smith'),
      buildSongEntry('The Book of Love', 'The Magnetic Fields'),
      buildSongEntry('Crazy Love', 'Van Morrison')
    ]
  },
  {
    ensemble: 'Folk Duo (Violin + Guitar)',
    songs: [
      buildSongEntry('Moon River [From "Breakfast at Tiffany\'s"]', 'Andy Williams'),
      buildSongEntry('Skinny Love', 'Bon Iver'),
      buildSongEntry("Quelqu'un m'a dit", 'Carla Bruni'),
      buildSongEntry('Tennessee Whiskey', 'Chris Stapleton'),
      buildSongEntry('Life On Mars', 'David Bowie'),
      buildSongEntry('Hallelujah', 'Rufus Wainwright'),
      buildSongEntry('Thinking Out Loud', 'Ed Sheeran'),
      buildSongEntry('Strawberry Swing', 'Coldplay'),
      buildSongEntry('Falling Slowly', 'Glen Hansard, Markéta Irglová'),
      buildSongEntry('Sweet Creature', 'Harry Styles'),
      buildSongEntry('Lucky', 'Jason Mraz, Colbie Caillat'),
      buildSongEntry('XO', 'John Mayer'),
      buildSongEntry('Heartbeats', 'José González'),
      buildSongEntry('Kiss Me', 'Sixpence None The Richer'),
      buildSongEntry('River', 'Leon Bridges'),
      buildSongEntry('Always Be My Baby', 'Mariah Carey'),
      buildSongEntry('Harvest Moon', 'Neil Young'),
      buildSongEntry('Wonderwall', 'Oasis'),
      buildSongEntry('The Only Exception', 'Paramore'),
      buildSongEntry('All The Wild Horses', 'Ray LaMontagne'),
      buildSongEntry('Wildest Dreams', 'Taylor Swift'),
      buildSongEntry('Blackbird', 'The Beatles'),
      buildSongEntry('Here Comes The Sun', 'The Beatles'),
      buildSongEntry('The Book of Love', 'The Magnetic Fields'),
      buildSongEntry('Crazy Love', 'Van Morrison')
    ]
  },
  {
    ensemble: 'String Duo (Violin + Cello)',
    songs: [
      buildSongEntry('Easy On Me', 'Adele'),
      buildSongEntry('Forever Young', 'Alphaville'),
      buildSongEntry('Moon River [From "Breakfast at Tiffany\'s"]', 'Andy Williams'),
      buildSongEntry('Barbie Girl', 'Aqua'),
      buildSongEntry('Air, "On The G String"', 'Bach'),
      buildSongEntry('Holocene', 'Bon Iver'),
      buildSongEntry('Put Your Records On', 'Corinne Bailey Rae'),
      buildSongEntry('Wildest Dreams', 'Duomo'),
      buildSongEntry('Thinking Out Loud', 'Ed Sheeran'),
      buildSongEntry('La Vie En Rose', 'Edith Piaf'),
      buildSongEntry('Gabriel\'s Oboe [From "The Mission"]', 'Ennio Morricone'),
      buildSongEntry('At Last', 'Etta James'),
      buildSongEntry('Falling Slowly', 'Glen Hansard, Markéta Irglová'),
      buildSongEntry('Air from Water Music', 'Handel'),
      buildSongEntry('Lucky', 'Jason Mraz, Colbie Caillat'),
      buildSongEntry('Ashoken Farewell', 'Jay Ungar'),
      buildSongEntry('Somewhere [From "West Side Story"]', 'Leonard Bernstein'),
      buildSongEntry('Before You Go', 'Lewis Capaldi'),
      buildSongEntry('What A Wonderful World', 'Louis Armstrong'),
      buildSongEntry('Always Be My Baby', 'Mariah Carey'),
      buildSongEntry('Come Away With Me', 'Norah Jones'),
      buildSongEntry('The Only Exception', 'Paramore'),
      buildSongEntry('Perpetuum Mobile', 'Penguin Cafe Orchestra'),
      buildSongEntry('Hallelujah', 'Rufus Wainwright'),
      buildSongEntry('The Book of Love', 'The Magnetic Fields'),
      buildSongEntry('Crazy Love', 'Van Morrison')
    ]
  },
  {
    ensemble: 'Violin Duo (Violin I + Violin II)',
    songs: [
      buildSongEntry("Jesu Joy of Man's Desiring", 'Bach'),
      buildSongEntry('Allegro and Minuet', 'Beethoven'),
      buildSongEntry('Duet for Two Violins', 'Beethoven'),
      buildSongEntry('Moonlight Sonata', 'Beethoven'),
      buildSongEntry('Romance', 'Beethoven'),
      buildSongEntry('Theme from Six Variations Op. 76', 'Beethoven'),
      buildSongEntry('Symphony No. 3 - 3rd Movement', 'Brahms'),
      buildSongEntry('Waltz', 'Brahms'),
      buildSongEntry('Flower Duet', 'Delibes'),
      buildSongEntry('La Vie En Rose', 'Edith Piaf'),
      buildSongEntry("Salut d'Amour", 'Elgar'),
      buildSongEntry('Can You Feel The Love Tonight', 'Elton John'),
      buildSongEntry('The Way You Look Tonight', 'Frank Sinatra'),
      buildSongEntry('Rhapsody In Blue', 'George Gershwin'),
      buildSongEntry('Arrival of the Queen of Sheba', 'Handel'),
      buildSongEntry('Hornpipe in D', 'Handel'),
      buildSongEntry('La Rejouissance', 'Handel'),
      buildSongEntry('Moon River', 'Henry Mancini'),
      buildSongEntry('Trumpet Voluntary', 'Jeremiah Clarke'),
      buildSongEntry('The Girl From Ipanema', 'Antonio Carlos Jobim'),
      buildSongEntry('What A Wonderful World', 'Louis Armstrong'),
      buildSongEntry('4 Comic Ländler', 'Schubert'),
      buildSongEntry('Ave Maria', 'Schubert'),
      buildSongEntry('Serenade (from "Schwanengesang")', 'Schubert'),
      buildSongEntry('Four Seasons: Spring', 'Vivaldi')
    ]
  },
  {
    ensemble: 'Violin w/ Tracks (Violin + DJ)',
    songs: violinOrCelloTracksSongs
  },
  {
    ensemble: 'Cello w/ Tracks (Cello + DJ)',
    songs: violinOrCelloTracksSongs
  },
  {
    ensemble: 'Solo Cello',
    songs: [
      buildSongEntry('Easy On Me', 'Adele'),
      buildSongEntry('Pie Jesu', 'Andrew Lloyd Webber'),
      buildSongEntry('Moon River [From "Breakfast at Tiffany\'s"]', 'Andy Williams'),
      buildSongEntry('Air, "On The G String"', 'Bach'),
      buildSongEntry('Cello Suite No. 1 - Prelude', 'Bach'),
      buildSongEntry('Cello Suite No. 1 - Courante', 'Bach'),
      buildSongEntry('Cello Suite No. 1 - Allemande', 'Bach'),
      buildSongEntry('Cello Suite No. 1 - Gigue', 'Bach'),
      buildSongEntry('The Swan (From "Carnival of the Animals")', 'Camille Saint-Saëns'),
      buildSongEntry('La Vie En Rose', 'Edith Piaf'),
      buildSongEntry("Salut d'Amour", 'Edward Elgar'),
      buildSongEntry('Can You Feel The Love Tonight', 'Elton John'),
      buildSongEntry('1234', 'Feist'),
      buildSongEntry('Come Fly With Me', 'Frank Sinatra'),
      buildSongEntry('Fly Me To The Moon', 'Frank Sinatra'),
      buildSongEntry('When You Wish Upon A Star [From "Pinocchio"]', 'Cliff Edwards'),
      buildSongEntry('Elegy', 'Gabriel Fauré'),
      buildSongEntry('Air from Water Music', 'Handel'),
      buildSongEntry('I Vow To Thee, My Country - Jupiter', 'Holst'),
      buildSongEntry('Trumpet Voluntary', 'Jeremiah Clarke'),
      buildSongEntry("Can't Help Falling In Love", 'Kina Grannis'),
      buildSongEntry('Somewhere [From "West Side Story"]', 'Leonard Bernstein'),
      buildSongEntry('What A Wonderful World', 'Louis Armstrong')
    ]
  },
  {
    ensemble: 'Classic Duo (Guitar + Piano)',
    songs: [
      buildSongEntry('Make You Feel My Love', 'Adele'),
      buildSongEntry("If I Ain't Got You", 'Alicia Keys'),
      buildSongEntry('Grow As We Go', 'Ben Platt'),
      buildSongEntry('Ave Maria', 'Beyoncé'),
      buildSongEntry('Untitled (How Does It Feel)', "D'Angelo"),
      buildSongEntry('Best Part', 'Daniel Caesar, H.E.R.'),
      buildSongEntry('My Sweet Lord', 'George Harrison'),
      buildSongEntry('Falling Slowly', 'Glen Hansard, Markéta Irglová'),
      buildSongEntry('Naked As We Came', 'Iron & Wine'),
      buildSongEntry('Heartbeats', 'José González'),
      buildSongEntry('Golden Hour', 'Kacey Musgraves'),
      buildSongEntry('Shallow', 'Lady Gaga, Bradley Cooper'),
      buildSongEntry('River', 'Leon Bridges'),
      buildSongEntry('Always Be My Baby', 'Mariah Carey'),
      buildSongEntry('Sunday Morning', 'Maroon 5'),
      buildSongEntry('The Only Exception', 'Paramore'),
      buildSongEntry('Hallelujah', 'Rufus Wainwright'),
      buildSongEntry("I'm Gonna Be (500 Miles)", 'Sleeping At Last'),
      buildSongEntry('Overjoyed', 'Stevie Wonder'),
      buildSongEntry('My Cherie Amour', 'Stevie Wonder'),
      buildSongEntry('You Are The Sunshine Of My Life', 'Stevie Wonder'),
      buildSongEntry('Here Comes The Sun', 'The Beatles'),
      buildSongEntry('Something', 'The Beatles'),
      buildSongEntry('Jesus, Etc.', 'Wilco')
    ]
  },
  {
    ensemble: 'Solo Violin',
    songs: [
      buildSongEntry('Easy On Me', 'Adele'),
      buildSongEntry('Forever Young', 'Alphaville'),
      buildSongEntry('Pie Jesu', 'Andrew Lloyd Webber'),
      buildSongEntry('Moon River [From "Breakfast at Tiffany\'s"]', 'Andy Williams'),
      buildSongEntry('Air, "On The G String"', 'Bach'),
      buildSongEntry('Speechless', 'Dan + Shay'),
      buildSongEntry('La Vie En Rose', 'Edith Piaf'),
      buildSongEntry("Salut d'Amour", 'Edward Elgar'),
      buildSongEntry('Can You Feel The Love Tonight', 'Elton John'),
      buildSongEntry('Your Song', 'Elton John'),
      buildSongEntry('At Last', 'Etta James'),
      buildSongEntry('Fly Me to the Moon', 'Frank Sinatra'),
      buildSongEntry('Falling Slowly', 'Glen Hansard, Markéta Irglová'),
      buildSongEntry('Arrival of the Queen of Sheba', 'Handel'),
      buildSongEntry('Water Music, Hornpipe', 'Handel'),
      buildSongEntry('Theme from "Braveheart"', 'James Horner'),
      buildSongEntry('Trumpet Voluntary', 'Jeremiah Clarke'),
      buildSongEntry('Somewhere Only We Know', 'Keane'),
      buildSongEntry("Can't Help Falling In Love", 'Elvis Presley'),
      buildSongEntry('Somewhere [From "West Side Story"]', 'Leonard Bernstein'),
      buildSongEntry('What A Wonderful World', 'Louis Armstrong'),
      buildSongEntry('Golden Lady', 'Stevie Wonder'),
      buildSongEntry('Four Seasons: Spring', 'Vivaldi')
    ]
  },
  {
    ensemble: 'Café Duo (Vocalist + Guitar)',
    songs: [
      buildSongEntry('At Your Best (You Are Love)', 'Aaliyah'),
      buildSongEntry('Easy On Me', 'Adele'),
      buildSongEntry('Sweet Pea', 'Amos Lee'),
      buildSongEntry('Grow As We Go', 'Ben Platt'),
      buildSongEntry('Lovely Day', 'Bill Withers'),
      buildSongEntry('Just The Way You Are', 'Billy Joel'),
      buildSongEntry('Because You Loved Me', 'Celine Dion'),
      buildSongEntry('Viva La Vida', 'Coldplay'),
      buildSongEntry('So In Love', 'Curtis Mayfield'),
      buildSongEntry("Somethin' Stupid", 'Frank Sinatra'),
      buildSongEntry('Lucky', 'Jason Mraz, Colbie Caillat'),
      buildSongEntry('My Stunning Mystery Companion', 'Jackson Browne'),
      buildSongEntry('All Of Me', 'John Legend'),
      buildSongEntry('XO', 'John Mayer'),
      buildSongEntry('The Circle Game', 'Joni Mitchell'),
      buildSongEntry('River', 'Leon Bridges'),
      buildSongEntry('Stay With Me', 'Sam Smith'),
      buildSongEntry('Something', 'The Beatles'),
      buildSongEntry('I Only Have Eyes For You', 'The Flamingos'),
      buildSongEntry('Fast Car', 'Tracy Chapman'),
      buildSongEntry('Into The Mystic', 'Van Morrison')
    ]
  },
  {
    ensemble: 'Solo Piano',
    songs: [
      buildSongEntry('Make You Feel My Love', 'Adele'),
      buildSongEntry('No One', 'Alicia Keys'),
      buildSongEntry('Sonata "Pathetique", Mvt. II, Adagio Cantabile', 'Beethoven'),
      buildSongEntry('Just The Way You Are', 'Billy Joel'),
      buildSongEntry('Pour le Piano, Mvt. II, Sarabande', 'Claude Debussy'),
      buildSongEntry('Yellow', 'Coldplay'),
      buildSongEntry('The Scientist', 'Coldplay'),
      buildSongEntry('Your Song', 'Elton John'),
      buildSongEntry('Prelude in C Major', 'J.S. Bach'),
      buildSongEntry('Lucky', 'Jason Mraz'),
      buildSongEntry('All Of Me', 'John Legend'),
      buildSongEntry('Purpose', 'Justin Bieber'),
      buildSongEntry('Sonata "Pathetique", Mvt. I, Adagio Cantabile', 'Ludwig van Beethoven'),
      buildSongEntry('Harvest Moon', 'Neil Young'),
      buildSongEntry('Maybe I\'m Amazed', 'Paul McCartney'),
      buildSongEntry('Bridge Over Troubled Water', 'Simon & Garfunkel'),
      buildSongEntry('Golden Lady', 'Stevie Wonder'),
      buildSongEntry('My Cherie Amour', 'Stevie Wonder'),
      buildSongEntry('Ribbon In The Sky', 'Stevie Wonder'),
      buildSongEntry('This Must Be The Place', 'Talking Heads'),
      buildSongEntry('God Only Knows', 'The Beach Boys'),
      buildSongEntry('In My Life', 'The Beatles'),
      buildSongEntry('Yesterday', 'The Beatles'),
      buildSongEntry('Crazy Love', 'Van Morrison')
    ]
  },
  {
    ensemble: 'Solo Guitar',
    songs: [
      buildSongEntry('Forever Young', 'Alphaville'),
      buildSongEntry('The Longest Time', 'Billy Joel'),
      buildSongEntry('Millionaire', 'Chris Stapleton'),
      buildSongEntry('Perfect', 'Ed Sheeran'),
      buildSongEntry('Photograph', 'Ed Sheeran'),
      buildSongEntry('Falling Slowly', 'Glen Hansard, Markéta Irglová'),
      buildSongEntry('Sweet Creature', 'Harry Styles'),
      buildSongEntry('Over The Rainbow', 'Israel Kamakawiwo\'ole'),
      buildSongEntry('Imagine', 'John Lennon'),
      buildSongEntry('Come Away With Me', 'Norah Jones'),
      buildSongEntry('The Only Exception', 'Paramore'),
      buildSongEntry('Maybe I\'m Amazed', 'Paul McCartney'),
      buildSongEntry('Home', 'Phillip Phillips'),
      buildSongEntry('All The Wild Horses', 'Ray LaMontagne'),
      buildSongEntry('Hallelujah', 'Rufus Wainwright'),
      buildSongEntry('Kiss Me', 'Sixpence None The Richer'),
      buildSongEntry('Norwegian Wood', 'The Beatles'),
      buildSongEntry('In My Life', 'The Beatles'),
      buildSongEntry('Blackbird', 'The Beatles'),
      buildSongEntry('Here Comes The Sun', 'The Beatles'),
      buildSongEntry('Dreams', 'The Cranberries'),
      buildSongEntry('The Book of Love', 'The Magnetic Fields'),
      buildSongEntry('Every Little Thing She Does Is Magic', 'The Police'),
      buildSongEntry('Crazy Love', 'Van Morrison')
    ]
  }
];

async function loadExistingSongs() {
  const songsSnapshot = await db.collection('songs').get();
  const songsMap = new Map();

  songsSnapshot.forEach(doc => {
    const data = doc.data();
    const key = `${normalizeText(data.originalTitle)}::${normalizeText(data.originalArtist)}`;
    songsMap.set(key, { id: doc.id, ...data });
  });

  return songsMap;
}

async function createSong(title, artist, ensemble) {
  const songId = createId(title, artist);
  const newSong = {
    id: songId,
    originalTitle: title,
    originalArtist: artist,
    thcTitle: title,
    thcArtist: 'The Hook Club',
    videoUrl: '',
    spotifyUrl: '',
    originalBpm: null,
    thcBpm: null,
    isLive: true,
    sections: ['Ceremony'],
    ensembles: [ensemble],
    genres: [],
    specialMomentTypes: [],
    thcPercent: null,
    notes: '',
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
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
        hornChartUrl: '',
        sheetMusicStandardUrl: '',
        chartLyricsSpecialUrl: '',
        hornChartSpecialUrl: ''
      }
    ],
    danceGenres: [],
    lightGenres: []
  };

  await db.collection('songs').doc(songId).set(newSong);
  return { id: songId, ...newSong };
}

async function updateSong(song, ensemble) {
  const updates = { isLive: true, updatedAt: FieldValue.serverTimestamp() };

  song.isLive = true;

  if (!song.sections || !Array.isArray(song.sections)) {
    updates.sections = ['Ceremony'];
    song.sections = ['Ceremony'];
  } else if (!song.sections.includes('Ceremony')) {
    updates.sections = FieldValue.arrayUnion('Ceremony');
    song.sections.push('Ceremony');
  }

  if (!song.ensembles || !Array.isArray(song.ensembles)) {
    updates.ensembles = [ensemble];
    song.ensembles = [ensemble];
  } else if (!song.ensembles.includes(ensemble)) {
    updates.ensembles = FieldValue.arrayUnion(ensemble);
    song.ensembles.push(ensemble);
  }

  await db.collection('songs').doc(song.id).update(updates);
}

async function main() {
  try {
    console.log('🎻 Starting ceremony ensemble import from screenshots...');

    const songsMap = await loadExistingSongs();
    console.log(`📚 Loaded ${songsMap.size} existing songs from Firestore.`);

    let created = 0;
    let updated = 0;
    let alreadyConfigured = 0;
    let errors = 0;

    for (const entry of ensembleSongMap) {
      console.log(`\n🎶 Processing ensemble: ${entry.ensemble} (${entry.songs.length} songs)`);

      for (const songInfo of entry.songs) {
        const key = `${normalizeText(songInfo.title)}::${normalizeText(songInfo.artist)}`;

        try {
          let song = songsMap.get(key);
          if (!song) {
            song = await createSong(songInfo.title, songInfo.artist, entry.ensemble);
            songsMap.set(key, song);
            created++;
            console.log(`  + Created: "${songInfo.title}" by ${songInfo.artist}`);
            continue;
          }

          const hasCeremony = Array.isArray(song.sections) && song.sections.includes('Ceremony');
          const hasEnsemble = Array.isArray(song.ensembles) && song.ensembles.includes(entry.ensemble);
          const isLive = song.isLive;

          if (hasCeremony && hasEnsemble && isLive) {
            alreadyConfigured++;
            console.log(`  ✓ Already configured: "${song.originalTitle}" by ${song.originalArtist}`);
            continue;
          }

          await updateSong(song, entry.ensemble);
          updated++;
          console.log(`  ↻ Updated: "${song.originalTitle}" by ${song.originalArtist}`);
        } catch (error) {
          errors++;
          console.error(`  ❌ Error processing "${songInfo.title}" by ${songInfo.artist}:`, error.message);
        }

        await new Promise(resolve => setTimeout(resolve, 25));
      }
    }

    console.log('\n✅ Import complete!');
    console.log(`📊 Created: ${created}`);
    console.log(`📊 Updated: ${updated}`);
    console.log(`📊 Already configured: ${alreadyConfigured}`);
    console.log(`📊 Errors: ${errors}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

main();


