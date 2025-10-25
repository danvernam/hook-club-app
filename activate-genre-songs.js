const fs = require('fs');
const path = require('path');

const songsFilePath = path.join(__dirname, 'public', 'data', 'songs.json');

const genreMappings = {
  "💯 Cream Of The Pop": { client: "💯 Cream Of The Pop", band: "pop", songs: [
    { title: "Wake Me Up", artist: "Avicii" },
    { title: "Everybody (Backstreets Back)", artist: "Backstreet Boys" },
    { title: "I Want It That Way", artist: "Backstreet Boys" },
    { title: "Crazy in Love", artist: "Beyoncé, JAY-Z" },
    { title: "... Baby One More Time", artist: "Britney Spears" },
    { title: "Everytime We Touch", artist: "Cascada" },
    { title: "Pink Pony Club", artist: "Chappell Roan" },
    { title: "Rather Be", artist: "Clean Bandit, Jess Glynne" },
    { title: "Girls Just Wanna Have Fun", artist: "Cyndi Lauper" },
    { title: "One More Time", artist: "Daft Punk" },
    { title: "Titanium", artist: "David Guetta, Sia" },
    { title: "Don't Start Now", artist: "Dua Lipa" },
    { title: "Good Feeling", artist: "Flo Rida" },
    { title: "As It Was", artist: "Harry Styles" },
    { title: "I Love It", artist: "Icona Pop/Charli XCX" },
    { title: "Bang Bang", artist: "Jessie J, Ariana Grande, Nicki Minaj" },
    { title: "Can't Stop The Feeling", artist: "Justin Timberlake" },
    { title: "Valerie", artist: "Mark Ronson, Amy Winehouse" },
    { title: "Flowers", artist: "Miley Cyrus" },
    { title: "Party In The USA", artist: "Miley Cyrus" },
    { title: "I Will Wait", artist: "Mumford & Sons" },
    { title: "Unwritten", artist: "Natasha Bedingfield" },
    { title: "Hey Ya!", artist: "Outkast" },
    { title: "Timber", artist: "Pitbull, Kesha" },
    { title: "Give Me Everything", artist: "Pitbull, Ne-Yo, AFROJACK, Nayer" },
    { title: "We Found Love", artist: "Rihanna, Calvin Harris" },
    { title: "Dancing On My Own", artist: "Robyn" },
    { title: "Espresso", artist: "Sabrina Carpenter" },
    { title: "All Star", artist: "Smash Mouth" },
    { title: "Murder On The Dancefloor", artist: "Sophie Ellis-Bextor" },
    { title: "Wannabe", artist: "Spice Girls" },
    { title: "I Knew You Were Trouble", artist: "Taylor Swift" },
    { title: "Shake It Off", artist: "Taylor Swift" },
    { title: "Love Story", artist: "Taylor Swift" },
    { title: "Yeah!", artist: "USHER, Lil Jon, Ludacris" },
    { title: "Shut Up And Dance", artist: "Walk The Moon" },
    { title: "Clarity", artist: "Zedd, Foxes" },
  ]},
  "🎷 Souled Out": { client: "🎷 Souled Out", band: "soul", songs: [
    { title: "Boogie Oogie Oogle", artist: "A Taste Of Honey" },
    { title: "Respect", artist: "Aretha Franklin" },
    { title: "Poison", artist: "Bel Div Devoe" },
    { title: "Uptown Funk", artist: "Bruno Mars" },
    { title: "Ain't Nobody", artist: "Chaka Khan" },
    { title: "Got To Be Real", artist: "Cheryl Lynn" },
    { title: "Brick House", artist: "Commodores" },
    { title: "I'm Coming Out", artist: "Diana Ross" },
    { title: "September", artist: "Earth, Wind & Fire" },
    { title: "Let's Groove", artist: "Earth, Wind & Fire" },
    { title: "December, 1963 (Oh What A Night)", artist: "Frankie Valli" },
    { title: "Pony", artist: "Ginuwine" },
    { title: "Shout", artist: "Isley Brothers" },
    { title: "(Your Love Keeps Lifting Me) Higher & Higher", artist: "Jackie Wilson" },
    { title: "Get Up Offa That Thing", artist: "James Brown" },
    { title: "Celebration", artist: "Kool & The Gang" },
    { title: "All Night Long", artist: "Lionel Richie" },
    { title: "Never Too Much", artist: "Luther Vandross" },
    { title: "Dancing In The Street", artist: "Martha Reeves & The Vandellas" },
    { title: "Ain't No Mountain High Enough", artist: "Marvin Gaye, Tammi Terrell" },
    { title: "I Wanna Be Your Lover", artist: "Prince" },
    { title: "Kiss", artist: "Prince" },
    { title: "You Are The Best Thing", artist: "Ray LaMontagne" },
    { title: "Give It To Me Baby", artist: "Rick James" },
    { title: "We Are Family", artist: "Sister Sledge" },
    { title: "Superstition", artist: "Stevie Wonder" },
    { title: "Signed, Sealed, Delivered (I'm Yours)", artist: "Stevie Wonder" },
    { title: "Best Of My Love", artist: "The Emotions" },
    { title: "Build Me Up Buttercup", artist: "The Foundations" },
    { title: "I Want You Back", artist: "The Jackson 5" },
    { title: "Love Train", artist: "The O'Jays" },
    { title: "My Girl", artist: "The Temptations" },
    { title: "Ain't Too Proud To Beg", artist: "The Temptations" },
    { title: "Proud Mary", artist: "Tina Turner" },
    { title: "The Best", artist: "Tina Turner" },
    { title: "How Will I Know", artist: "Whitney Houston" },
    { title: "I Wanna Dance With Somebody", artist: "Whitney Houston" },
  ]},
  "🎸 Rock Of Ages": { client: "🎸 Rock Of Ages", band: "rock", songs: [
    { title: "You Shook Me All Night Long", artist: "AC/DC" },
    { title: "Only The Good Young", artist: "Billy Joel" },
    { title: "Livin' On A Prayer", artist: "Bon Jovi" },
    { title: "Born To Run", artist: "Bruce Springsteen" },
    { title: "Let's Dance", artist: "David Bowie" },
    { title: "Come On Eileen", artist: "Dexy's Midnight Runners" },
    { title: "Take It Easy", artist: "Eagles" },
    { title: "You Make Loving Fun", artist: "Fleetwood Mac" },
    { title: "Shakedown Street", artist: "Grateful Dead" },
    { title: "Sweet Child O' Mine", artist: "Guns N' Roses" },
    { title: "The Middle", artist: "Jimmy Eat World" },
    { title: "You're The One I Want", artist: "John Travolta, Olivia Newton-John" },
    { title: "Don't Stop Believin'", artist: "Journey" },
    { title: "Footloose", artist: "Kenny Loggins" },
    { title: "Dancing In The Moonlight", artist: "King Harvest" },
    { title: "Sex On Fire", artist: "Kings Of Leon" },
    { title: "Paradise By the Dashboard Light", artist: "Meat Loaf" },
    { title: "Sweet Caroline", artist: "Neil Diamond" },
    { title: "Don't Speak", artist: "No Doubt" },
    { title: "Wonderwall", artist: "Oasis" },
    { title: "You Can Call Me Al", artist: "Paul Simon" },
    { title: "Crazy Little Thing Called Love", artist: "Queen" },
    { title: "Don't Stop Me Now", artist: "Queen" },
    { title: "Jessie's Girl", artist: "Rick Springfield" },
    { title: "All For You", artist: "Sister Hazel" },
    { title: "Peg", artist: "Steely Dan" },
    { title: "Life During Wartime", artist: "Talking Heads" },
    { title: "I Saw Her Standing There", artist: "The Beatles" },
    { title: "Twist And Shout", artist: "The Beatles" },
    { title: "Day Tripper", artist: "The Beatles" },
    { title: "I Believe In A Thing Called Love", artist: "The Darkness" },
    { title: "Long Train Runnin'", artist: "The Doobie Brothers" },
    { title: "(I Can't Get No) Satisfaction", artist: "The Rolling Stones" },
    { title: "American Girl", artist: "Tom Petty" },
    { title: "Africa", artist: "Toto" },
    { title: "Brown Eyed Girl", artist: "Van Morrison" },
    { title: "Say It Ain't So", artist: "Weezer" },
  ]},
  "🎤 Can't Stop Hip Hop": { client: "🎤 Can't Stop Hip Hop", band: "hip hop", songs: [
    { title: "No Diggity", artist: "Blackstreet" },
    { title: "All I Do Is Win", artist: "DJ Khaled" },
    { title: "Low", artist: "Flo Rida" },
    { title: "Empire State Of Mind", artist: "JAY-Z, Alicia Keys" },
    { title: "Get Low", artist: "Lil Jon & The Eastside Boys" },
    { title: "Work It", artist: "Missy Elliot" },
    { title: "This Is How We Do It", artist: "Montell Jordan, Wino" },
    { title: "Doo Wop (That Thing)", artist: "Ms. Lauryn Hill" },
    { title: "Mo Money Mo Problems", artist: "Notorious B.I.G., Mase, Diddy" },
  ]},
  "🕺 Studio '25": { client: "🕺 Studio '25", band: "disco", songs: [
    { title: "Dancing Queen", artist: "ABBA" },
    { title: "Gimme! Gimme! Gimme! (A Man After Midnight)", artist: "ABBA" },
    { title: "Mamma Mia", artist: "ABBA" },
    { title: "(I've Had) The Time Of My Life", artist: "Bill Medley, Jennifer Warnes" },
    { title: "Believe", artist: "Cher" },
    { title: "Get Lucky", artist: "Daft Punk, Pharrell Williams, Nile Rodgers" },
    { title: "I Will Survive", artist: "Gloria Gaynor" },
    { title: "Like A Prayer", artist: "Madonna" },
    { title: "Rasputin", artist: "Majestic, Boney M." },
  ]},
  "🤘 Instant Mosh": { client: "🤘 Instant Mosh", band: "punk", songs: [
    { title: "Complicated", artist: "Avril Lavigne" },
    { title: "All The Small Things", artist: "Blink-182" },
    { title: "First Date", artist: "Blink-182" },
    { title: "Sugar, We're Going Down", artist: "Fall Out Boy" },
    { title: "Everywhere", artist: "Michelle Branch" },
    { title: "Still Into You", artist: "Paramore" },
    { title: "Zombie", artist: "The Cranberries" },
    { title: "Mr. Brightside", artist: "The Killers" },
    { title: "Semi-Charmed Life", artist: "Third Eye Blind" },
  ]},
  "🤠 Country For All": { client: "🤠 Country For All", band: "country", songs: [
    { title: "TEXAS HOLD 'EM", artist: "Beyoncé" },
    { title: "Wagon Wheel", artist: "Darius Rucker" },
    { title: "Islands In The Stream", artist: "Dolly Parton, Kenny Rogers" },
    { title: "Sweet Home Alabama", artist: "Lynyrd Skynyrd" },
    { title: "Life Is A Highway", artist: "Rascal Flatts" },
    { title: "Man! I Feel Like A Woman", artist: "Shania Twain" },
    { title: "You Belong With Me", artist: "Taylor Swift" },
    { title: "Chicken Fried", artist: "Zac Brown Band" },
  ]},
  "💃 The Latin Bible": { client: "💃 The Latin Bible", band: "latin", songs: [
    { title: "Titi Me Preguntó", artist: "Bad Bunny" },
    { title: "I Like It", artist: "Cardi B, J Balvin, Bad Bunny" },
    { title: "Danza Kuduro", artist: "Don Omar, Lucenzo" },
    { title: "Suavemente", artist: "Elvis Crespo" },
    { title: "Pepas", artist: "Farruko" },
    { title: "Despacito", artist: "Justin Bieber, Luis Fonsi, Daddy Yankee" },
    { title: "Vivr Mi Vida", artist: "Marc Anthony" },
    { title: "Fireball", artist: "Pitbull, John Ryan" },
  ]},
  "💙 Slow Jams": { client: "💙 Slow Jams", band: "slow jams", songs: [
    { title: "If I Ain't Got You", artist: "Alicia Keys" },
    { title: "How Deep Is Your Love", artist: "Bee Gees" },
    { title: "Tennessee Whiskey", artist: "Chris Stapleton" },
    { title: "At Last", artist: "Etta James" },
    { title: "L-O-V-E", artist: "Nat King Cole" },
    { title: "You Are The Best Thing", artist: "Ray LaMontagne" },
    { title: "Lover", artist: "Taylor Swift" },
    { title: "Oh! Darling", artist: "The Beatles" },
  ]},
};

const genreLookup = new Map();

// Populate genreLookup for efficient lookup
for (const genreName in genreMappings) {
  const genreData = genreMappings[genreName];
  const genreObject = { client: genreData.client, band: genreData.band };

  for (const song of genreData.songs) {
    const titleKey = song.title.toLowerCase(); // Match by title only
    if (!genreLookup.has(titleKey)) {
      genreLookup.set(titleKey, []);
    }
    genreLookup.get(titleKey).push({...genreObject, correctArtist: song.artist});
  }
}

try {
  const data = fs.readFileSync(songsFilePath, 'utf8');
  const songsData = JSON.parse(data);

  let activeSongsCount = 0;
  const updatedSongs = songsData.songs.map(song => {
    const titleKey = song.originalTitle.toLowerCase();
    const genreData = genreLookup.get(titleKey);

    if (genreData) {
      song.isLive = true;
      song.originalArtist = genreData[0].correctArtist; // Update artist name
      song.genres = genreData.map(g => ({ client: g.client, band: g.band })); // Extract genre info
      activeSongsCount++;
    } else {
      // Ensure songs not in the genre list remain inactive and have empty genres
      song.isLive = false;
      song.genres = [];
    }
    return song;
  });

  songsData.songs = updatedSongs;
  songsData.metadata.lastUpdated = new Date().toISOString();
  songsData.metadata.activeSongs = activeSongsCount;
  songsData.metadata.inactiveSongs = songsData.songs.length - activeSongsCount;

  fs.writeFileSync(songsFilePath, JSON.stringify(songsData, null, 2), 'utf8');
  console.log(`Successfully updated ${activeSongsCount} songs with genres and set them to active.`);
  console.log(`Total songs: ${songsData.songs.length}, Active: ${songsData.metadata.activeSongs}, Inactive: ${songsData.metadata.inactiveSongs}`);

} catch (error) {
  console.error('Error updating songs.json:', error);
}
