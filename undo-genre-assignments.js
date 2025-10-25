const fs = require('fs');
const path = require('path');

const songsFilePath = path.join(__dirname, 'public', 'data', 'songs.json');

try {
  const data = fs.readFileSync(songsFilePath, 'utf8');
  const songsData = JSON.parse(data);

  // Reset all songs to inactive and clear genres
  const updatedSongs = songsData.songs.map(song => {
    song.isLive = false;
    song.genres = [];
    song.originalArtist = "Unknown Artist"; // Reset artist names
    return song;
  });

  songsData.songs = updatedSongs;
  songsData.metadata.lastUpdated = new Date().toISOString();
  songsData.metadata.activeSongs = 0;
  songsData.metadata.inactiveSongs = songsData.songs.length;

  fs.writeFileSync(songsFilePath, JSON.stringify(songsData, null, 2), 'utf8');
  console.log(`Successfully reset all songs to inactive state.`);
  console.log(`Total songs: ${songsData.songs.length}, Active: ${songsData.metadata.activeSongs}, Inactive: ${songsData.metadata.inactiveSongs}`);

} catch (error) {
  console.error('Error updating songs.json:', error);
}
