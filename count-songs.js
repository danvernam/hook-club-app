const fs = require('fs');
const path = require('path');

try {
  console.log('Reading songs.json...');
  const songsPath = path.join(__dirname, 'public', 'data', 'songs.json');
  const songsData = JSON.parse(fs.readFileSync(songsPath, 'utf8'));
  
  console.log(`Total songs in local file: ${songsData.songs.length}`);
  console.log(`Active songs: ${songsData.metadata.activeSongs}`);
  console.log(`Inactive songs: ${songsData.metadata.inactiveSongs}`);
  
  // Check for empty IDs
  const songsWithEmptyIds = songsData.songs.filter(song => !song.id || song.id === '');
  console.log(`\nSongs with empty IDs: ${songsWithEmptyIds.length}`);
  
  if (songsWithEmptyIds.length > 0) {
    console.log('\nSongs with empty IDs:');
    songsWithEmptyIds.forEach((song, index) => {
      console.log(`${index + 1}. "${song.thcTitle}" by ${song.originalArtist} (isLive: ${song.isLive})`);
    });
  }
  
  // Check for duplicate thcTitles
  const titleCounts = {};
  songsData.songs.forEach(song => {
    if (song.thcTitle) {
      titleCounts[song.thcTitle] = (titleCounts[song.thcTitle] || 0) + 1;
    }
  });
  
  const duplicates = Object.entries(titleCounts).filter(([title, count]) => count > 1);
  console.log(`\nDuplicate thcTitles: ${duplicates.length}`);
  
  if (duplicates.length > 0) {
    console.log('\nDuplicate titles:');
    duplicates.forEach(([title, count]) => {
      console.log(`- "${title}" appears ${count} times`);
      const songsWithTitle = songsData.songs.filter(s => s.thcTitle === title);
      songsWithTitle.forEach(song => {
        console.log(`  - ID: "${song.id || 'EMPTY'}", Artist: ${song.originalArtist}, isLive: ${song.isLive}`);
      });
    });
  }
  
} catch (error) {
  console.error('Error reading songs file:', error);
}
