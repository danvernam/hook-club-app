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
const sectionName = 'Cocktail Hour';

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

const sharedTrackSongs = [
  buildSongEntry("Let's Stay Together", 'Al Green'),
  buildSongEntry('My Head & My Heart', 'Ava Max'),
  buildSongEntry('Lovely Day [Studio Rio Version]', 'Bill Withers, Studio Rio'),
  buildSongEntry('Havana', 'Camila Cabello'),
  buildSongEntry('Cut To The Feeling', 'Carly Rae Jepsen'),
  buildSongEntry("Ain't Nobody", 'Chaka Khan'),
  buildSongEntry('Believe', 'Cher'),
  buildSongEntry('Rather Be', 'Clean Bandit, Jess Glynne'),
  buildSongEntry('Feel Like Makin\' Love', 'D\'Angelo'),
  buildSongEntry('Titanium', 'David Guetta, Sia'),
  buildSongEntry('Passionfruit', 'Drake'),
  buildSongEntry("Don't Start Now", 'Dua Lipa'),
  buildSongEntry('Levitating', 'Dua Lipa'),
  buildSongEntry('Dreams', 'Fleetwood Mac'),
  buildSongEntry('Crazy', 'Gnarls Barkley'),
  buildSongEntry('As It Was', 'Harry Styles'),
  buildSongEntry('Head & Heart', 'Joel Corry, MNEK'),
  buildSongEntry('Dancing In The Moonlight', 'Jubel, NEIMY'),
  buildSongEntry('Sorry', 'Justin Bieber'),
  buildSongEntry('This Girl', "Kungs, Cookin' On 3 Burners"),
  buildSongEntry('Body', 'Loud Luxury, Brando'),
  buildSongEntry('Peru', 'Fireboy DML, Ed Sheeran'),
  buildSongEntry('Latch', 'Sam Smith'),
  buildSongEntry('Señorita', 'Shawn Mendes, Camila Cabello'),
  buildSongEntry('Unstoppable', 'Sia'),
  buildSongEntry('I Wish', 'Stevie Wonder'),
  buildSongEntry("Isn't She Lovely", 'Stevie Wonder'),
  buildSongEntry('How Deep Is Your Love', 'Bee Gees'),
  buildSongEntry('Dance Monkey', 'Tones And I'),
  buildSongEntry('Water', 'Tyla')
];

const ensembleSongMap = [
  {
    ensemble: 'Folk Band (Violin + Guitar + Bass + Drums)',
    songs: [
      buildSongEntry('Oh! Susanna', '2nd South Carolina String Band'),
      buildSongEntry('Daddy Lessons', 'Beyoncé & Dixie Chicks'),
      buildSongEntry('Run-Around', 'Blues Traveler'),
      buildSongEntry('Mr. Tambourine Man', 'Bob Dylan'),
      buildSongEntry('Millionaire', 'Chris Stapleton'),
      buildSongEntry("Lookin' Out My Back Door", 'Creedence Clearwater Revival'),
      buildSongEntry('Wagon Wheel', 'Darius Rucker'),
      buildSongEntry('Minor Swing', 'Django Reinhardt'),
      buildSongEntry('Jolene', 'Dolly Parton'),
      buildSongEntry('Peaceful Easy Feeling', 'Eagles'),
      buildSongEntry('Shape Of You', 'Ed Sheeran'),
      buildSongEntry('Ripple', 'Grateful Dead'),
      buildSongEntry('Just The Two Of Us', 'Grover Washington Jr.'),
      buildSongEntry('Only Wanna Be With You', 'Hootie & The Blowfish'),
      buildSongEntry('Bad, Bad Leroy Brown', 'Jim Croce'),
      buildSongEntry('Ring Of Fire', 'Johnny Cash'),
      buildSongEntry('Sweet Georgia Brown', 'Louis Armstrong'),
      buildSongEntry('Stick Season', 'Noah Kahan'),
      buildSongEntry('Wish You Were Here', 'Pink Floyd'),
      buildSongEntry('Cecilia', 'Simon & Garfunkel'),
      buildSongEntry('All Of Me', 'Standard'),
      buildSongEntry('The Weight', 'The Band'),
      buildSongEntry("I've Just Seen A Face", 'The Beatles'),
      buildSongEntry('Hotel California', 'Eagles'),
      buildSongEntry('Friend Of The Devil', 'The Grateful Dead'),
      buildSongEntry('Ho Hey', 'The Lumineers'),
      buildSongEntry('Beast Of Burden', 'The Rolling Stones'),
      buildSongEntry("I Won't Back Down", 'Tom Petty'),
      buildSongEntry('Riptide', 'Vance Joy'),
      buildSongEntry('California Stars', 'Wilco')
    ]
  },
  {
    ensemble: 'Chamber Quartet (Violin + Cello + Guitar + Piano)',
    songs: [
      buildSongEntry("What's Up?", '4 Non Blondes'),
      buildSongEntry('Set Fire To The Rain', 'Adele'),
      buildSongEntry('I Say A Little Prayer', 'Aretha Franklin'),
      buildSongEntry('Sweet But Psycho', 'Ava Max'),
      buildSongEntry('Love On Top', 'Beyoncé'),
      buildSongEntry('California Stars', 'Wilco'),
      buildSongEntry('Uptown Girl', 'Billy Joel'),
      buildSongEntry('Run-Around', 'Blues Traveler'),
      buildSongEntry('Total Eclipse Of The Heart', 'Bonnie Tyler'),
      buildSongEntry('Rather Be', 'Clean Bandit'),
      buildSongEntry('Wagon Wheel', 'Darius Rucker'),
      buildSongEntry("That's Amore", 'Dean Martin'),
      buildSongEntry('Minor Swing', 'Django Reinhardt'),
      buildSongEntry('Que Sera Sera (Whatever Will Be, Will Be)', 'Doris Day'),
      buildSongEntry("Don't Start Now", 'Dua Lipa'),
      buildSongEntry("Stacy's Mom", 'Fountains Of Wayne'),
      buildSongEntry('Just The Two Of Us', 'Grover Washington, Jr.; Bill Withers'),
      buildSongEntry('Watermelon Sugar', 'Harry Styles'),
      buildSongEntry('The Girl From Ipanema', 'Jazz Standard'),
      buildSongEntry('Paparazzi', 'Lady Gaga'),
      buildSongEntry('Good Kisser', 'Lake Street Dive'),
      buildSongEntry('Material Girl', 'Madonna'),
      buildSongEntry('Solsbury Hill', 'Peter Gabriel'),
      buildSongEntry('Happy', 'Pharrell'),
      buildSongEntry('Galway Girl', 'Steve Earle'),
      buildSongEntry('I Want To Hold Your Hand', 'The Beatles'),
      buildSongEntry('Zombie', 'The Cranberries'),
      buildSongEntry('Free Fallin\'', 'Tom Petty'),
      buildSongEntry('Africa', 'Toto'),
      buildSongEntry('Moondance', 'Van Morrison')
    ]
  },
  {
    ensemble: 'Piano Trio (Violin + Cello + Piano)',
    songs: [
      buildSongEntry('Set Fire To The Rain', 'Adele'),
      buildSongEntry('I Say A Little Prayer', 'Aretha Franklin'),
      buildSongEntry('thank u, next', 'Ariana Grande'),
      buildSongEntry('I Want It That Way', 'Backstreet Boys'),
      buildSongEntry('Love On Top', 'Beyoncé'),
      buildSongEntry('bad guy', 'Billie Eilish'),
      buildSongEntry('Flowers', 'Brooklyn Duo'),
      buildSongEntry('Rather Be [Acoustic]', 'Clean Bandit, Alex Shaw'),
      buildSongEntry('Blue Bossa', 'Dexter Gordon'),
      buildSongEntry('Que Sera Sera (Whatever Will Be, Will Be)', 'Doris Day'),
      buildSongEntry('Shape Of You', 'Ed Sheeran'),
      buildSongEntry('La Vie En Rose', 'Edith Piaf'),
      buildSongEntry('All Of Me', 'Ella Fitzgerald'),
      buildSongEntry('Come Fly With Me', 'Frank Sinatra'),
      buildSongEntry('Killing Me Softly With His Song', 'Fugees'),
      buildSongEntry('As It Was', 'Ground Zero Academy Orchestra'),
      buildSongEntry("Sweet Child O' Mine", "Guns n' Roses"),
      buildSongEntry('You Make My Dreams', 'Hall & Oates'),
      buildSongEntry('The Girl From Ipanema', 'Jazz Standard'),
      buildSongEntry('Material Girl', 'Kris Bowers'),
      buildSongEntry('Paparazzi', 'Lady Gaga'),
      buildSongEntry('Good Kisser', 'Lake Street Dive'),
      buildSongEntry('Always Be My Baby', 'Mariah Carey'),
      buildSongEntry('Dancing On My Own', 'Robyn'),
      buildSongEntry('Unholy', 'Sam Smith, Kim Petras'),
      buildSongEntry('Oye Como Va', 'Santana'),
      buildSongEntry('This Must Be The Place', 'Talking Heads'),
      buildSongEntry('Lady Madonna', 'The Beatles'),
      buildSongEntry('Bitter Sweet Symphony', 'The Verve'),
      buildSongEntry('Blinding Lights', 'The Weeknd')
    ]
  },
  {
    ensemble: 'Guitar Trio (Violin + Cello + Guitar)',
    songs: [
      buildSongEntry("What's Up?", '4 Non Blondes'),
      buildSongEntry('Wake Me Up', 'Avicii'),
      buildSongEntry('I Want It That Way', 'Backstreet Boys'),
      buildSongEntry('Whiskey Before Breakfast', 'Traditional Bluegrass'),
      buildSongEntry('The Man In Me', 'Bob Dylan'),
      buildSongEntry('Rather Be [Acoustic]', 'Clean Bandit, Alex Shaw'),
      buildSongEntry("That's Amore", 'Dean Martin'),
      buildSongEntry('Blue Bossa', 'Dexter Gordon'),
      buildSongEntry('Minor Swing', 'Django Reinhardt'),
      buildSongEntry('Que Sera Sera (Whatever Will Be, Will Be)', 'Doris Day'),
      buildSongEntry('La Vie En Rose', 'Edith Piaf'),
      buildSongEntry('Sweet Dreams (Are Made Of This)', 'Eurythmics'),
      buildSongEntry('Go Your Own Way', 'Fleetwood Mac'),
      buildSongEntry("Stacy's Mom", 'Fountains Of Wayne'),
      buildSongEntry('Come Fly With Me', 'Frank Sinatra'),
      buildSongEntry('Killing Me Softly With His Song', 'Fugees'),
      buildSongEntry('Hotel California', 'Gipsy Kings'),
      buildSongEntry('Just The Two Of Us', 'Grover Washington, Jr.; Bill Withers'),
      buildSongEntry('You Make My Dreams', 'Hall & Oates'),
      buildSongEntry('The Girl From Ipanema', 'Jazz Standard'),
      buildSongEntry('Paparazzi', 'Lady Gaga'),
      buildSongEntry('Mary Mack', 'Makem & Clancy'),
      buildSongEntry('Wrecking Ball', 'Miley Cyrus'),
      buildSongEntry('Canzone Dalla Fine Del Mondo', 'Modern City Ramblers'),
      buildSongEntry('Harvest Moon', 'Neil Young'),
      buildSongEntry('Dancing On My Own', 'Robyn'),
      buildSongEntry('Oye Como Va', 'Santana'),
      buildSongEntry('Sweet Georgia Brown', 'Django Reinhardt, Stéphane Grappelli'),
      buildSongEntry('Galway Girl', 'Steve Earle'),
      buildSongEntry('Tarantella Napoletana', 'Traditional Italian')
    ]
  },
  {
    ensemble: 'Violin + Sax w/ Tracks',
    songs: sharedTrackSongs
  },
  {
    ensemble: 'Violin w/ Tracks',
    songs: sharedTrackSongs
  },
  {
    ensemble: 'Sax w/ Tracks',
    songs: sharedTrackSongs
  },
  {
    ensemble: 'Vocal Trio (Vocalist + Sax + Guitar)',
    songs: [
      buildSongEntry("Let's Stay Together", 'Al Green'),
      buildSongEntry('Valerie [Acoustic]', 'Amy Winehouse'),
      buildSongEntry('How Deep Is Your Love', 'Bee Gees'),
      buildSongEntry('Is This Love', 'Bob Marley'),
      buildSongEntry("What You Won't Do For Love", 'Bobby Caldwell'),
      buildSongEntry('Sweet Thing', 'Chaka Khan'),
      buildSongEntry('Feel Like Makin\' Love', 'D\'Angelo'),
      buildSongEntry("That's Amore", 'Dean Martin'),
      buildSongEntry("I've Got You Under My Skin", 'Ella Fitzgerald'),
      buildSongEntry('Honeysuckle Rose', 'Ella Fitzgerald, Count Basie'),
      buildSongEntry('Sweet Life', 'Frank Ocean'),
      buildSongEntry('Turn Your Love Around', 'George Benson'),
      buildSongEntry('Crazy', 'Gnarls Barkley'),
      buildSongEntry('As It Was', 'Harry Styles'),
      buildSongEntry('The Way', 'Jill Scott'),
      buildSongEntry('Ordinary People', 'John Legend'),
      buildSongEntry('Gravity', 'John Mayer'),
      buildSongEntry('I Try', 'Macy Gray'),
      buildSongEntry('Sunday Morning', 'Maroon 5'),
      buildSongEntry("Can't Take My Eyes Off Of You", 'Ms. Lauryn Hill'),
      buildSongEntry('Nothing Even Matters', 'Ms. Lauryn Hill'),
      buildSongEntry("Don't Know Why", 'Norah Jones'),
      buildSongEntry('Circles', 'Post Malone'),
      buildSongEntry('Raspberry Beret', 'Prince'),
      buildSongEntry('Show Me Love', 'Robyn'),
      buildSongEntry('Hold Me, Thrill Me, Kiss Me', 'She & Him'),
      buildSongEntry('The Girl From Ipanema', 'Stan Getz, Joao Gilberto'),
      buildSongEntry('You Are The Sunshine Of My Life', 'Stevie Wonder'),
      buildSongEntry('This Must Be The Place', 'Talking Heads'),
      buildSongEntry('My Love Is Your Love', 'Whitney Houston')
    ]
  },
  {
    ensemble: 'Organ Trio (Organ + Bass + Drums)',
    songs: [
      buildSongEntry('Chain Of Fools', 'Aretha Franklin'),
      buildSongEntry('Pick Up The Pieces', 'Average White Band'),
      buildSongEntry('Just The Way You Are', 'Billy Joel'),
      buildSongEntry('The Man In Me', 'Bob Dylan'),
      buildSongEntry("What You Won't Do For Love", 'Bobby Caldwell'),
      buildSongEntry('Green Onions', 'Booker T. & The M.G.\'s'),
      buildSongEntry('Redbone', 'Childish Gambino'),
      buildSongEntry('Brown Sugar', 'D\'Angelo'),
      buildSongEntry('Spanish Joint', 'D\'Angelo'),
      buildSongEntry('Son Of A Preacher Man', 'Dusty Springfield'),
      buildSongEntry("Can't Hide Love", 'Earth, Wind, & Fire'),
      buildSongEntry('Cantaloupe Island', 'Herbie Hancock'),
      buildSongEntry('Chameleon', 'Herbie Hancock'),
      buildSongEntry('Get Up And Get It', 'Jackie Mittoo'),
      buildSongEntry('Blame It On The Boogie', 'Jackson 5'),
      buildSongEntry('The Chicken', 'Jaco Pastorius'),
      buildSongEntry('Back At The Chicken Shack', 'Jimmy Smith'),
      buildSongEntry('The Sidewinder', 'Lee Morgan'),
      buildSongEntry('Everybody Wants To Rule The World', 'Lettuce'),
      buildSongEntry("I Keep Forgettin' (Every Time You're Near)", 'Michael McDonald'),
      buildSongEntry("L' Is Gone", 'Musiq Soulchild'),
      buildSongEntry('Big Chief', 'Professor Longhair'),
      buildSongEntry('Oye Como Va', 'Santana'),
      buildSongEntry('Foxy Lady', 'Booker T. & The M.G.\'s'),
      buildSongEntry('Josie', 'Steely Dan'),
      buildSongEntry('Overjoyed', 'Stevie Wonder'),
      buildSongEntry('Sir Duke', 'Stevie Wonder'),
      buildSongEntry('House Of The Rising Sun', 'The Animals'),
      buildSongEntry('The Weight', 'The Band'),
      buildSongEntry("I'll Take You There", 'The Staple Singers')
    ]
  },
  {
    ensemble: 'String Quartet (Violin I + Violin II + Viola + Cello)',
    songs: [
      buildSongEntry('Set Fire To The Rain', 'Adele'),
      buildSongEntry('Valerie', 'Amy Winehouse'),
      buildSongEntry('thank u, next', 'Ariana Grande'),
      buildSongEntry('Positions', 'Ariana Grande'),
      buildSongEntry('Sweet But Psycho', 'Ava Max'),
      buildSongEntry('Be Our Guest [From "Beauty & The Beast"]', 'Alan Menken, Howard Ashman'),
      buildSongEntry('Love On Top', 'Beyoncé'),
      buildSongEntry('bad guy (from "Bridgerton")', 'Billie Eilish'),
      buildSongEntry('Total Eclipse Of The Heart', 'Bonnie Tyler'),
      buildSongEntry('Safe and Sound', 'Capital Cities'),
      buildSongEntry('Get Lucky', 'Daft Punk, Pharrell Williams, Nile Rodgers'),
      buildSongEntry("Ain't Misbehavin'", 'Ella Fitzgerald, Count Basie'),
      buildSongEntry('Everlong', 'Foo Fighters'),
      buildSongEntry('Come Fly With Me', 'Frank Sinatra'),
      buildSongEntry('As It Was', 'Harry Styles'),
      buildSongEntry('Adore You', 'Harry Styles'),
      buildSongEntry('Watermelon Sugar', 'Harry Styles'),
      buildSongEntry('Running Up That Hill (A Deal With God)', 'Kate Bush'),
      buildSongEntry('Material Girl', 'Kris Bowers'),
      buildSongEntry('Rain On Me', 'Lady Gaga, Ariana Grande'),
      buildSongEntry('MONTERO (Call Me By Your Name)', 'Lil Nas X'),
      buildSongEntry('Royals', 'Lorde'),
      buildSongEntry('Uptown Funk', 'Mark Ronson, Bruno Mars'),
      buildSongEntry('Sugar', 'Maroon 5'),
      buildSongEntry('Sway', 'Michael Bublé'),
      buildSongEntry('Wrecking Ball', 'Miley Cyrus'),
      buildSongEntry('Happy', 'Pharrell'),
      buildSongEntry('Kiss', 'Prince'),
      buildSongEntry('Purple Rain', 'Prince'),
      buildSongEntry('Dancing On My Own', 'Robyn'),
      buildSongEntry('Unholy', 'Sam Smith, Kim Petras'),
      buildSongEntry('You Are The Sunshine Of My Life', 'Stevie Wonder'),
      buildSongEntry('Anti-Hero', 'Taylor Swift'),
      buildSongEntry('I Want To Hold Your Hand', 'The Beatles'),
      buildSongEntry('Stay', 'The Kid LAROI, Justin Bieber'),
      buildSongEntry('Mr. Brightside', 'The Killers'),
      buildSongEntry('Dream A Little Dream', 'The Mamas & The Papas'),
      buildSongEntry("Can't Feel My Face", 'The Weeknd'),
      buildSongEntry('Blinding Lights', 'The Weeknd'),
      buildSongEntry('Moondance', 'Van Morrison')
    ]
  },
  {
    ensemble: 'Funky Trio (Sax + Bass + Drums)',
    songs: [
      buildSongEntry('Can I Kick It?', 'A Tribe Called Quest'),
      buildSongEntry('Use Me', 'Bill Withers'),
      buildSongEntry('Is This Love', 'Bob Marley'),
      buildSongEntry("What You Won't Do For Love", 'Bobby Caldwell'),
      buildSongEntry('Always Be My Baby', 'Brasstracks'),
      buildSongEntry('Havana', 'Camila Cabello'),
      buildSongEntry('Feel Like Makin\' Love', 'D\'Angelo'),
      buildSongEntry('Shape Of You', 'Ed Sheeran'),
      buildSongEntry('Red Clay', 'Freddie Hubbard'),
      buildSongEntry('Crazy', 'Gnarls Barkley'),
      buildSongEntry('Just The Two Of Us', 'Grover Washington, Jr.; Bill Withers'),
      buildSongEntry('Chameleon', 'Herbie Hancock'),
      buildSongEntry('Iko Iko', 'Iko Iko'),
      buildSongEntry('The Chicken', 'Jaco Pastorius'),
      buildSongEntry('Sorry', 'Justin Bieber'),
      buildSongEntry('Everybody Wants To Rule The World', 'Lettuce'),
      buildSongEntry("I Can't Help It", 'Michael Jackson'),
      buildSongEntry("L' Is Gone", 'Musiq Soulchild'),
      buildSongEntry("Don't Know Why", 'Norah Jones'),
      buildSongEntry('How Deep Is Your Love', 'PJ Morton, Yebba'),
      buildSongEntry('Strasbourg/St. Denis', 'Roy Hargrove'),
      buildSongEntry('Oye Como Va', 'Santana'),
      buildSongEntry('St. Thomas', 'Sonny Rollins'),
      buildSongEntry('You Are The Sunshine Of My Life', 'Stevie Wonder'),
      buildSongEntry('I Wish', 'Stevie Wonder'),
      buildSongEntry('My Cherie Amour', 'Stevie Wonder'),
      buildSongEntry('Between The Sheets', 'The Isley Brothers'),
      buildSongEntry('Cissy Strut', 'The Meters'),
      buildSongEntry('I Feel It Coming', 'The Weeknd'),
      buildSongEntry('Them Changes', 'Thundercat')
    ]
  },
  {
    ensemble: 'Power Trio (Guitar + Bass + Drums)',
    songs: [
      buildSongEntry('Not Fade Away', 'Buddy Holly & The Crickets'),
      buildSongEntry('I Want You To Want Me', 'Cheap Trick'),
      buildSongEntry('Down On The Corner', 'Creedence Clearwater Revival'),
      buildSongEntry('Sound And Vision', 'David Bowie'),
      buildSongEntry('Take It Easy', 'Eagles'),
      buildSongEntry('A Little Less Conversation', 'Elvis'),
      buildSongEntry('Eyes Of The World', 'Grateful Dead'),
      buildSongEntry('The Chicken', 'Jaco Pastorius'),
      buildSongEntry('I Got A Woman', 'John Mayer Trio'),
      buildSongEntry('Whole Lotta Love', 'Led Zeppelin'),
      buildSongEntry('Heaven', 'Los Lonely Boys'),
      buildSongEntry("Can't Take My Eyes Off Of You", 'Ms. Lauryn Hill'),
      buildSongEntry('Graceland', 'Paul Simon'),
      buildSongEntry('Weird Fishes/Arpeggi', 'Radiohead'),
      buildSongEntry('Honky Tonk Woman', 'Rolling Stones'),
      buildSongEntry('Stuck In The Middle With You', 'Stealers Wheel'),
      buildSongEntry("Reelin' In The Years", 'Steely Dan'),
      buildSongEntry('The Less I Know The Better', 'Tame Impala'),
      buildSongEntry('Little Deuce Coupe', 'The Beach Boys'),
      buildSongEntry('Come Together', 'The Beatles'),
      buildSongEntry('Day Tripper', 'The Beatles'),
      buildSongEntry('Drive My Car', 'The Beatles'),
      buildSongEntry('You Really Got Me', 'The Kinks'),
      buildSongEntry('Cissy Strut', 'The Meters'),
      buildSongEntry("I'm A Believer", 'The Monkees'),
      buildSongEntry('500 Miles (I\'m Gonna Be)', 'The Proclaimers'),
      buildSongEntry('There Is A Light That Never Goes Out', 'The Smiths'),
      buildSongEntry('Free Fallin\'', 'Tom Petty'),
      buildSongEntry('A-Punk', 'Vampire Weekend'),
      buildSongEntry('Brown Eyed Girl', 'Van Morrison')
    ]
  },
  {
    ensemble: 'Timeless Duo (Sax + Piano)',
    songs: [
      buildSongEntry('Valerie [Acoustic]', 'Amy Winehouse'),
      buildSongEntry('Besame Mucho', 'Andrea Bocelli'),
      buildSongEntry('Wave', 'Antonio Carlos Jobim'),
      buildSongEntry('I Say A Little Prayer', 'Aretha Franklin'),
      buildSongEntry('Love On Top', 'Beyoncé'),
      buildSongEntry('Someday My Prince Will Come', 'Bill Evans Trio'),
      buildSongEntry('Just The Way You Are', 'Billy Joel'),
      buildSongEntry("What You Won't Do For Love", 'Bobby Caldwell'),
      buildSongEntry('Sweet Thing', 'Chaka Khan'),
      buildSongEntry('All The Things You Are', 'Chet Baker'),
      buildSongEntry('Feel Like Makin\' Love', 'D\'Angelo'),
      buildSongEntry('Blue Bossa', 'Dexter Gordon'),
      buildSongEntry('Honeysuckle Rose', 'Ella Fitzgerald, Louis Armstrong'),
      buildSongEntry('Dream A Little Dream of Me', 'Ella Fitzgerald, Louis Armstrong'),
      buildSongEntry('Fly Me To The Moon', 'Frank Sinatra'),
      buildSongEntry('The Way You Look Tonight', 'Frank Sinatra'),
      buildSongEntry('Just The Two Of Us', 'Grover Washington, Jr.; Bill Withers'),
      buildSongEntry('Cantaloupe Island', 'Herbie Hancock'),
      buildSongEntry('Chameleon', 'Herbie Hancock'),
      buildSongEntry('I Hear A Rhapsody', 'John Coltrane'),
      buildSongEntry('Have You Met Miss Jones?', 'Kenny Garrett'),
      buildSongEntry("You're Still The One", 'Lake Street Dive'),
      buildSongEntry('Four', 'Miles Davis Quintet'),
      buildSongEntry("Can't Take My Eyes Off Of You", 'Norah Jones'),
      buildSongEntry("Don't Know Why", 'Norah Jones'),
      buildSongEntry('Tenor Madness', 'Sonny Rollins Quartet'),
      buildSongEntry('The Girl From Ipanema', 'Stan Getz, Joao Gilberto'),
      buildSongEntry("Isn't She Lovely", 'Stevie Wonder'),
      buildSongEntry('Moondance', 'Van Morrison')
    ]
  },
  {
    ensemble: 'Power Duo (Guitar + Bass)',
    songs: [
      buildSongEntry('Not Fade Away', 'Buddy Holly & The Crickets'),
      buildSongEntry('I Want You To Want Me', 'Cheap Trick'),
      buildSongEntry('Down On The Corner', 'Creedence Clearwater Revival'),
      buildSongEntry('Sound And Vision', 'David Bowie'),
      buildSongEntry('Take It Easy', 'Eagles'),
      buildSongEntry('A Little Less Conversation', 'Elvis'),
      buildSongEntry('Eyes Of The World', 'Grateful Dead'),
      buildSongEntry('The Chicken', 'Jaco Pastorius'),
      buildSongEntry('I Got A Woman', 'John Mayer Trio'),
      buildSongEntry('Whole Lotta Love', 'Led Zeppelin'),
      buildSongEntry('Heaven', 'Los Lonely Boys'),
      buildSongEntry("Can't Take My Eyes Off Of You", 'Ms. Lauryn Hill'),
      buildSongEntry('Graceland', 'Paul Simon'),
      buildSongEntry('Honky Tonk Woman', 'Rolling Stones'),
      buildSongEntry('Stuck In The Middle With You', 'Stealers Wheel'),
      buildSongEntry("Reelin' In The Years", 'Steely Dan'),
      buildSongEntry('The Less I Know The Better', 'Tame Impala'),
      buildSongEntry('Come Together', 'The Beatles'),
      buildSongEntry('Day Tripper', 'The Beatles'),
      buildSongEntry('Drive My Car', 'The Beatles'),
      buildSongEntry('Louie Louie', 'The Kingsmen'),
      buildSongEntry('You Really Got Me', 'The Kinks'),
      buildSongEntry('Cissy Strut', 'The Meters'),
      buildSongEntry("I'm A Believer", 'The Monkees'),
      buildSongEntry('500 Miles (I\'m Gonna Be)', 'The Proclaimers'),
      buildSongEntry('There Is A Light That Never Goes Out', 'The Smiths'),
      buildSongEntry('Free Fallin\'', 'Tom Petty'),
      buildSongEntry('A-Punk', 'Vampire Weekend'),
      buildSongEntry('Brown Eyed Girl', 'Van Morrison')
    ]
  },
  {
    ensemble: 'Jazzy Duo (Sax + Guitar)',
    songs: [
      buildSongEntry("Let's Stay Together", 'Al Green'),
      buildSongEntry('Valerie [Acoustic]', 'Amy Winehouse'),
      buildSongEntry('Besame Mucho', 'Andrea Bocelli'),
      buildSongEntry('Wave', 'Antonio Carlos Jobim'),
      buildSongEntry('I Say A Little Prayer', 'Aretha Franklin'),
      buildSongEntry('bad guy', 'Billie Eilish'),
      buildSongEntry("What You Won't Do For Love", 'Bobby Caldwell'),
      buildSongEntry('Body & Soul', 'Coleman Hawkins'),
      buildSongEntry('Blue Bossa', 'Dexter Gordon'),
      buildSongEntry('Dream A Little Dream of Me', 'Ella Fitzgerald, Louis Armstrong'),
      buildSongEntry('Fly Me To The Moon', 'Frank Sinatra'),
      buildSongEntry('Killing Me Softly With His Song', 'Fugees'),
      buildSongEntry('Careless Whisper', 'George Michael'),
      buildSongEntry('Just The Two Of Us', 'Grover Washington, Jr.; Bill Withers'),
      buildSongEntry('Watermelon Sugar', 'Harry Styles'),
      buildSongEntry('I Hear A Rhapsody', 'John Coltrane'),
      buildSongEntry('Love Yourself', 'Justin Bieber'),
      buildSongEntry('Willkommen [From "Cabaret"]', 'Kander and Ebb'),
      buildSongEntry('Have You Met Miss Jones?', 'Kenny Garrett'),
      buildSongEntry('Sunday Morning', 'Maroon 5'),
      buildSongEntry('Four', 'Miles Davis Quintet'),
      buildSongEntry("Can't Take My Eyes Off Of You", 'Ms. Lauryn Hill'),
      buildSongEntry("Don't Know Why", 'Norah Jones'),
      buildSongEntry('Tenor Madness', 'Sonny Rollins Quartet'),
      buildSongEntry('The Girl From Ipanema', 'Stan Getz, Joao Gilberto'),
      buildSongEntry("Isn't She Lovely", 'Stevie Wonder'),
      buildSongEntry('Santeria', 'Sublime'),
      buildSongEntry('Free Fallin\'', 'Tom Petty'),
      buildSongEntry("I Won't Back Down", 'Tom Petty'),
      buildSongEntry('Moondance', 'Van Morrison')
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
    sections: [sectionName],
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
    updates.sections = [sectionName];
    song.sections = [sectionName];
  } else if (!song.sections.includes(sectionName)) {
    updates.sections = FieldValue.arrayUnion(sectionName);
    song.sections.push(sectionName);
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
    console.log('🍹 Starting cocktail hour ensemble import from screenshots...');

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

          const hasSection = Array.isArray(song.sections) && song.sections.includes(sectionName);
          const hasEnsemble = Array.isArray(song.ensembles) && song.ensembles.includes(entry.ensemble);
          const isLive = song.isLive;

          if (hasSection && hasEnsemble && isLive) {
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











