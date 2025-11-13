'use client';

import { useState, useEffect } from 'react';
import apiService from '@/services/api';

interface Song {
  id: string;
  originalTitle: string;
  originalArtist: string;
  thcTitle: string;
  thcArtist: string;
  videoUrl: string;
  spotifyUrl: string;
  originalBpm: number | null;
  thcBpm: number | null;
  isLive: boolean;
  sections: string[];
  ensembles: string[];
  genres: Array<{ client: string; band: string }>;
  danceGenres: Array<{ client: string; band: string }>;
  lightGenres: Array<{ client: string; band: string }>;
  specialMomentTypes: string[];
  specialMomentRecommendations: string[];
  thcPercent: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  originalKey: string;
  requiresLeadVocalist: boolean;
  leadVocalistRole: string;
  leadVocalistPart: string;
  requiresBackgroundVocals: boolean;
  backgroundVocalCount: number;
  backgroundVocalRoles: string[];
  backgroundVocalParts: string[];
  backgroundVocalPartNames: string[];
  leadSheet: boolean;
  fullBandArrangement: boolean;
  hornChart: boolean;
  sheetMusicStandard: boolean;
  chartLyricsSpecial: boolean;
  hornChartSpecial: boolean;
  chordLyricChartUrl: string;
  ensembleSheetMusic: Record<string, boolean>;
  keyVersions: Array<{
    key: string;
    isDefault: boolean;
    bpm: number;
    chordLyricChartUrl: string;
    leadSheetUrl: string;
    fullBandArrangementUrl: string;
    hornChartUrl: string | null;
    sheetMusicStandardUrl: string;
    chartLyricsSpecialUrl: string | null;
    hornChartSpecialUrl: string | null;
  }>;
}

interface SongsData {
  metadata: {
    version: string;
    lastUpdated: string;
    totalSongs: number;
    activeSongs: number;
    inactiveSongs: number;
  };
  songs: Song[];
}

const lightGenreLabelOverrides: Record<string, string> = {
  'guest entrance': '🎈 Light Bops',
  'crooner corner': '🎺 Crooner Corner',
  'salad jazz': '🥗 Salad Jazz',
  'dinner entertainment': '🎻 Slow Jams'
};

const normalizeBandKey = (band?: string | null) => {
  if (!band) return '';
  return band.toLowerCase().trim();
};

const isSlowJamsBand = (band: string | undefined | null) => {
  const key = normalizeBandKey(band).replace(/\s+/g, '');
  return key === 'slowjams';
};

const normalizeLightGenre = (genre: { client: string; band: string }) => {
  if (!genre) return genre;
  const bandKey = normalizeBandKey(genre.band);
  const normalizedBand = isSlowJamsBand(genre.band) ? 'dinner entertainment' : bandKey;
  const updatedClient = lightGenreLabelOverrides[normalizedBand];
  const clientLabel = updatedClient || genre.client;
  return {
    ...genre,
    band: normalizedBand,
    client: clientLabel
  };
};

const normalizeSong = (song: Song): Song => ({
  ...song,
  danceGenres: (song.danceGenres || [])
    .filter(genre => !isSlowJamsBand(genre.band))
    .map(genre => ({
      ...genre,
      band: normalizeBandKey(genre.band)
    })),
  lightGenres: (() => {
    const normalizedLight = (song.lightGenres || [])
      .map(normalizeLightGenre)
      .reduce<Array<{ client: string; band: string }>>((acc, genre) => {
        if (!acc.some(existing => existing.band === genre.band)) {
          acc.push(genre);
        }
        return acc;
      }, []);

    const hasSlowJamsLight = normalizedLight.some(genre => genre.band === 'dinner entertainment');
    const migratedFromDance = (song.danceGenres || []).some(genre => isSlowJamsBand(genre.band));
    const migratedFromGenres = (song.genres || []).some(genre => isSlowJamsBand(genre.band));

    if (!hasSlowJamsLight && (migratedFromDance || migratedFromGenres)) {
      normalizedLight.push({
        client: lightGenreLabelOverrides['dinner entertainment'],
        band: 'dinner entertainment'
      });
    }

    return normalizedLight;
  })(),
  genres: (song.genres || []).filter(genre => !isSlowJamsBand(genre.band))
});

export default function SongsDatabase() {
  const [songsData, setSongsData] = useState<SongsData | null>(null);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [showInactive, setShowInactive] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState('');
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [vocalists, setVocalists] = useState([
    { id: 'vocalist1', name: 'Vocalist 1', role: 'Vocalist 1' },
    { id: 'vocalist2', name: 'Vocalist 2', role: 'Vocalist 2' },
    { id: 'vocalist3', name: 'Vocalist 3', role: 'Vocalist 3' },
    { id: 'vocalist4', name: 'Vocalist 4', role: 'Vocalist 4' },
    { id: 'guitar', name: 'Guitarist', role: 'Guitar' },
    { id: 'keyboard', name: 'Keyboardist', role: 'Keyboard' },
    { id: 'bass', name: 'Bassist', role: 'Bass' }
  ]);

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const data = await apiService.getSongs();
        const normalizedSongs = (data.songs || []).map(normalizeSong);
        setSongsData({ 
          songs: normalizedSongs, 
          metadata: { 
            version: "1.0.0",
            lastUpdated: new Date().toISOString(),
            totalSongs: normalizedSongs.length,
            activeSongs: normalizedSongs.filter((song: any) => song.isLive).length,
            inactiveSongs: normalizedSongs.filter((song: any) => !song.isLive).length
          } 
        });
        // Don't set filteredSongs here - let the useEffect handle filtering
      } catch (err) {
        console.error('Error loading songs from Firestore:', err);
        alert('Failed to load songs from database. Please check your connection and try again.');
      }
    };
    loadSongs();
  }, []);

  useEffect(() => {
    if (!songsData) return;

    let filtered = songsData.songs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(song => 
        song.thcTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.originalTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.originalArtist.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Section filter
    if (selectedSection) {
      filtered = filtered.filter(song => song.sections.includes(selectedSection));
    }

    // Genre filter
    if (selectedGenre) {
      filtered = filtered.filter(song => 
        song.genres.some(genre => genre.band === selectedGenre)
      );
    }

    // Active/Inactive filter - when showInactive is true (checkbox checked), show only active songs
    if (showInactive) {
      filtered = filtered.filter(song => song.isLive);
    }

    // Alphabet letter filter
    if (selectedLetter) {
      filtered = filtered.filter(song => {
        const title = (song.thcTitle || song.originalTitle || '').trim();
        if (!title) {
          return selectedLetter === '#';
        }
        const firstChar = title.charAt(0).toUpperCase();
        if (selectedLetter === '#') {
          return firstChar < 'A' || firstChar > 'Z';
        }
        return firstChar === selectedLetter;
      });
    }

    // Sort alphabetically by THC title
    filtered = filtered.sort((a, b) => a.thcTitle.localeCompare(b.thcTitle));

    setFilteredSongs(filtered);
  }, [songsData, searchTerm, selectedSection, selectedGenre, showInactive, selectedLetter]);

  if (!songsData) {
    return <div className="p-8">Loading songs database...</div>;
  }

  const sections = ['welcomeParty', 'afterParty', 'pianoTrio', 'guestArrival', 'cocktailHour'];
  const sectionLabels: Record<string, string> = {
    welcomeParty: 'Welcome Party',
    afterParty: 'After Party',
    pianoTrio: 'Piano Trio',
    guestArrival: 'Guest Arrival',
    cocktailHour: 'Cocktail Hour'
  };
  const sectionOptions = sections.map(section => ({
    value: section,
    label: sectionLabels[section] ?? section
  }));
  const uniqueSectionOptions = sectionOptions.filter((option, index, array) =>
    array.findIndex(compare => compare.label === option.label) === index
  );
  const danceGenres = [
    { client: '🎷 Souled Out', band: 'soul' },
    { client: '💯 Cream Of The Pop', band: 'pop' },
    { client: '🎸 Rock Of Ages', band: 'rock' },
    { client: '🎧 Can\'t Stop Hip Hop', band: 'hip hop' },
    { client: '🛑 Stop! In The Name Of Motown', band: 'motown' },
    { client: '🤘 Instant Mosh', band: 'punk' },
    { client: '📖 The Latin Bible', band: 'latin' },
    { client: '🕺 Studio \'25', band: 'disco' },
    { client: '🤠 Country For All', band: 'country' },
    { client: '🚀 Next Level Bops', band: 'popedm' },
    { client: '🌴 Top Of The Tropics', band: 'caribbean' },
    { client: '💃 Get In Formation', band: 'group-dances' },
    { client: '✨ Songs That Slay', band: 'lgbtq' },
    { client: '🔥 Because I Got Lit', band: 'club' },
    { client: '🌍 THC Worldwide', band: 'world' },
    { client: '🎉 All The Rave', band: 'rave' },
    { client: '🤔 What Do You Meme', band: 'meme' },
    { client: '⭐ The Stars of La La Land', band: 'showtunes' }
  ];
  
  const lightGenres = [
    { client: '🎈 Light Bops', band: 'guest entrance' },
    { client: '🎺 Crooner Corner', band: 'crooner corner' },
    { client: '🥗 Salad Jazz', band: 'salad jazz' },
    { client: '🎻 Slow Jams', band: 'dinner entertainment' }
  ];

        const handleEditSong = (song: Song) => {
          const normalizedSong = normalizeSong(song);
          setEditingSong({ 
            ...normalizedSong,
            danceGenres: normalizedSong.danceGenres || [],
            lightGenres: normalizedSong.lightGenres || []
          });
          setIsEditModalOpen(true);
          setActiveTab('basic');
        };

  const handleSaveSong = async () => {
    if (!editingSong || !songsData || isSaving) return;
    
    setIsSaving(true);
    try {
      console.log('=== SAVE SONG DEBUG ===');
      console.log('Editing song ID:', editingSong.id);
      console.log('Is new song (empty ID):', editingSong.id === '');
      console.log('Song data:', editingSong);
      console.log('Current songs count:', songsData.songs.length);
      let songsForUpdate = [...songsData.songs];
      
      // Check for duplicate thcTitle (exclude songs with empty IDs and current song)
      const duplicateSong = songsData.songs.find(song => 
        song.thcTitle === editingSong.thcTitle && 
        song.id !== editingSong.id && 
        song.id !== '' && 
        editingSong.id !== ''
      );
      
      if (duplicateSong) {
        const deleteExisting = confirm(
          `A song with the THC title "${editingSong.thcTitle}" already exists (by ${duplicateSong.originalArtist}).\n\n` +
          `Click OK to delete the existing song and keep the one you are editing.\n` +
          `Click Cancel to choose a different option.`
        );

        if (deleteExisting) {
          try {
            console.log('Deleting duplicate song in favor of current edit:', duplicateSong.id);
            await apiService.deleteSong(duplicateSong.id);
            songsForUpdate = songsForUpdate.filter(song => song.id !== duplicateSong.id);
            console.log('Duplicate song deleted successfully.');
          } catch (error) {
            console.error('Error deleting duplicate song:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Failed to delete the existing duplicate song: ${errorMessage}. Please try again.`);
            return;
          }
        } else {
          const shouldProceed = confirm(
            `Would you like to add the artist name to make it unique instead?\n\n` +
            `This will change the THC title to: "${editingSong.thcTitle} [${editingSong.originalArtist}]"`
          );
          
          if (shouldProceed) {
            editingSong.thcTitle = `${editingSong.thcTitle} [${editingSong.originalArtist}]`;
          } else {
            return; // User cancelled, don't save
          }
        }
      }
      
      let result;
      let updatedSongs;
      const normalizedEditingSong = normalizeSong(editingSong);
      
      if (editingSong.id === '') {
        // Creating a new song
        console.log('Creating new song via API...');
        result = await apiService.createSong(normalizedEditingSong);
        console.log('Create result:', result);
        console.log('New song ID from API:', result.id);
        
        // Add the new song to local state
        updatedSongs = [...songsForUpdate.map(normalizeSong), { ...normalizedEditingSong, id: result.id }];
        console.log('Updated songs count after create:', updatedSongs.length);
      } else {
        // Updating an existing song
        result = await apiService.updateSong(editingSong.id, normalizedEditingSong);
        console.log('Update result:', result);
        
        // Update the existing song in local state
        updatedSongs = songsForUpdate.map(song => 
          song.id === editingSong.id ? normalizedEditingSong : normalizeSong(song)
        );
      }
      
      setSongsData({
        ...songsData,
        songs: updatedSongs,
        metadata: {
          ...songsData.metadata,
          totalSongs: updatedSongs.length,
          activeSongs: updatedSongs.filter(song => song.isLive).length,
          inactiveSongs: updatedSongs.filter(song => !song.isLive).length,
          lastUpdated: new Date().toISOString()
        }
      });
      
      setIsEditModalOpen(false);
      setEditingSong(null);
    } catch (error) {
      console.error('Error saving song:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error details:', errorMessage);
      alert(`Failed to save song: ${errorMessage}. Please check the console for more details.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingSong(null);
  };

  const handleForceDeleteSong = (song: Song) => {
    if (!songsData) return;
    
    const confirmDelete = confirm(
      `Are you sure you want to FORCE DELETE "${song.thcTitle}" by ${song.originalArtist}?\n\n` +
      `This song has an invalid ID and will be removed from the local view only.\n\n` +
      `This action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    try {
      console.log('Force deleting song with invalid ID:', song);
      
      // Remove from local state only (no API call since it has invalid ID)
      const updatedSongs = songsData.songs.filter(s => s !== song);
      setSongsData({
        ...songsData,
        songs: updatedSongs,
        metadata: {
          ...songsData.metadata,
          totalSongs: updatedSongs.length,
          activeSongs: updatedSongs.filter(song => song.isLive).length,
          inactiveSongs: updatedSongs.filter(song => !song.isLive).length,
          lastUpdated: new Date().toISOString()
        }
      });
      
      console.log('Song force deleted successfully from local state');
      
    } catch (error) {
      console.error('Error force deleting song:', error);
      alert('Failed to force delete song. Please try again.');
    }
  };

  const handleDeleteSong = async (songId: string) => {
    if (!songsData) return;
    
    console.log('Delete song called with ID:', songId);
    console.log('Available songs:', songsData.songs.map(s => ({ id: s.id, title: s.thcTitle })));
    
    // Check for empty or invalid ID
    if (!songId || songId === '') {
      console.error('Cannot delete song with empty ID');
      alert('Cannot delete song: This song has an invalid ID and cannot be deleted through the UI. Please contact support to clean up this duplicate entry.');
      return;
    }
    
    const song = songsData.songs.find(s => s.id === songId);
    if (!song) {
      console.error('Song not found with ID:', songId);
      alert('Song not found!');
      return;
    }
    
    const confirmDelete = confirm(
      `Are you sure you want to delete "${song.thcTitle}" by ${song.originalArtist}?\n\nThis action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    try {
      console.log('Deleting song:', songId, 'Title:', song.thcTitle);
      
      // Delete from API using the service
      await apiService.deleteSong(songId);
      
      // Update local state
      const updatedSongs = songsData.songs.filter(s => s.id !== songId);
      setSongsData({
        ...songsData,
        songs: updatedSongs,
        metadata: {
          ...songsData.metadata,
          totalSongs: updatedSongs.length,
          activeSongs: updatedSongs.filter(song => song.isLive).length,
          inactiveSongs: updatedSongs.filter(song => !song.isLive).length,
          lastUpdated: new Date().toISOString()
        }
      });
      
      console.log('Song deleted successfully');
      
    } catch (error) {
      console.error('Error deleting song:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to delete song: ${errorMessage}. Please try again.`);
    }
  };

  const handleAddSong = () => {
    const newSong: Song = {
      id: '', // Will be generated by the API
      originalTitle: '',
      originalArtist: '',
      thcTitle: '',
      thcArtist: '',
      videoUrl: '',
      spotifyUrl: '',
      originalBpm: null,
      thcBpm: null,
      isLive: false,
      sections: [],
      ensembles: [],
      genres: [],
      danceGenres: [],
      lightGenres: [],
      specialMomentTypes: [],
      specialMomentRecommendations: [],
      thcPercent: '',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      originalKey: '',
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
      keyVersions: []
    };
    setEditingSong(newSong);
    setIsAddModalOpen(false);
    setIsEditModalOpen(true);
    setActiveTab('basic');
  };

  const handleCancelAdd = () => {
    setIsAddModalOpen(false);
  };

  const alphabetFilters = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  const handleLetterFilterClick = (letter: string) => {
    setSelectedLetter(prev => (prev === letter ? '' : letter));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Songs Database</h1>
        <div className="text-sm text-gray-700 mb-6">
          Total: {songsData.metadata.totalSongs} songs | 
          Active: {songsData.metadata.activeSongs} | 
          Inactive: {songsData.metadata.inactiveSongs}
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search songs..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">All Sections</option>
              {uniqueSectionOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">Genre</label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">All Genres</option>
              {[...danceGenres, ...lightGenres].map(genre => (
                <option key={genre.band} value={genre.band}>
                  {genre.client}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center text-gray-900">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="mr-2"
              />
              Show Active Songs Only
            </label>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Songs ({filteredSongs.length})
          </h2>
        </div>

        {/* Alphabet Filter */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            {alphabetFilters.map(letter => {
              const isActive = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  onClick={() => handleLetterFilterClick(letter)}
                  className={`px-2.5 py-1 text-sm font-medium rounded ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-transparent text-gray-700 hover:text-purple-600'
                  }`}
                  aria-pressed={isActive}
                >
                  {letter}
                </button>
              );
            })}
            {selectedLetter && (
              <button
                onClick={() => setSelectedLetter('')}
                className="ml-4 px-3 py-1 text-sm font-medium text-gray-600 hover:text-purple-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        
        {/* Add Song Button */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-end">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            + Add New Song
          </button>
        </div>
        
        {/* Table */}
        <div className="overflow-x-visible px-6 pb-6">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">THC Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Key</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSongs.map((song, index) => (
                <tr key={song.id || `song-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{song.thcTitle}</div>
                      {!song.isLive && (
                        <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                          Inactive
                        </span>
                      )}
                      {(!song.id || song.id === '') && (
                        <span className="px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          Invalid ID
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 truncate max-w-xs">
                      {song.originalArtist}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 truncate max-w-xs">
                      {song.danceGenres && song.danceGenres.length > 0
                        ? song.danceGenres.map(g => g.client).join(', ')
                        : song.lightGenres && song.lightGenres.length > 0
                          ? song.lightGenres.map(g => g.client).join(', ')
                          : song.genres && song.genres.length > 0
                            ? song.genres.map(g => g.client).join(', ')
                            : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{song.originalKey}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditSong(song)}
                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                        View
                      </button>
                      {!song.id || song.id === '' ? (
                        <button
                          onClick={() => handleForceDeleteSong(song)}
                          className="px-2 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700"
                          title="Force delete song with invalid ID"
                        >
                          Force Delete
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDeleteSong(song.id)}
                          className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                          title="Delete song"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredSongs.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No songs found matching your filters.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingSong && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingSong.id === '' ? 'Add New Song' : `Edit Song: ${editingSong.thcTitle}`}
              </h2>
              <button
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('basic')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'basic' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveTab('sections')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'sections' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sections & Genres
              </button>
              <button
                onClick={() => setActiveTab('ensembles')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'ensembles' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Ensembles
              </button>
              <button
                onClick={() => setActiveTab('vocals')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'vocals' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Musical Info
              </button>
              <button
                onClick={() => setActiveTab('versions')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'versions' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Key Versions
              </button>
              <button
                onClick={() => setActiveTab('special-moments')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'special-moments' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Special Moments
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">THC Title</label>
                  <input
                    type="text"
                    value={editingSong.thcTitle}
                    onChange={(e) => setEditingSong({...editingSong, thcTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Original Title</label>
                  <input
                    type="text"
                    value={editingSong.originalTitle}
                    onChange={(e) => setEditingSong({...editingSong, originalTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Artist</label>
                  <input
                    type="text"
                    value={editingSong.originalArtist}
                    onChange={(e) => setEditingSong({...editingSong, originalArtist: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Original BPM</label>
                  <input
                    type="number"
                    value={editingSong.originalBpm || ''}
                    onChange={(e) => setEditingSong({...editingSong, originalBpm: e.target.value ? parseInt(e.target.value) : null})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">THC BPM</label>
                  <input
                    type="number"
                    value={editingSong.thcBpm || ''}
                    onChange={(e) => setEditingSong({...editingSong, thcBpm: e.target.value ? parseInt(e.target.value) : null})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Original Key</label>
                  <select
                    value={editingSong.originalKey}
                    onChange={(e) => setEditingSong({...editingSong, originalKey: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="">Select Key</option>
                    <option value="C">C</option>
                    <option value="C#">C#</option>
                    <option value="Db">Db</option>
                    <option value="D">D</option>
                    <option value="D#">D#</option>
                    <option value="Eb">Eb</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="F#">F#</option>
                    <option value="Gb">Gb</option>
                    <option value="G">G</option>
                    <option value="G#">G#</option>
                    <option value="Ab">Ab</option>
                    <option value="A">A</option>
                    <option value="A#">A#</option>
                    <option value="Bb">Bb</option>
                    <option value="B">B</option>
                    <option value="Cm">Cm</option>
                    <option value="C#m">C#m</option>
                    <option value="Dbm">Dbm</option>
                    <option value="Dm">Dm</option>
                    <option value="D#m">D#m</option>
                    <option value="Ebm">Ebm</option>
                    <option value="Em">Em</option>
                    <option value="Fm">Fm</option>
                    <option value="F#m">F#m</option>
                    <option value="Gbm">Gbm</option>
                    <option value="Gm">Gm</option>
                    <option value="G#m">G#m</option>
                    <option value="Abm">Abm</option>
                    <option value="Am">Am</option>
                    <option value="A#m">A#m</option>
                    <option value="Bbm">Bbm</option>
                    <option value="Bm">Bm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">THC Percentage</label>
                  <select
                    value={editingSong.thcPercent}
                    onChange={(e) => setEditingSong({...editingSong, thcPercent: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="">Select Percentage</option>
                    <option value="25%">25%</option>
                    <option value="50%">50%</option>
                    <option value="75%">75%</option>
                    <option value="100%">100%</option>
                  </select>
                </div>


                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingSong.isLive}
                      onChange={(e) => setEditingSong({...editingSong, isLive: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-gray-900">Active Song</span>
                  </label>
                </div>

              </div>
            )}

            {activeTab === 'sections' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Sections & Genres</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Add-on Sections</label>
                  <div className="space-y-3">
                    {uniqueSectionOptions.map(({ value, label }) => (
                      <label key={value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingSong.sections.includes(value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditingSong({
                                ...editingSong,
                                sections: [...editingSong.sections, value]
                              });
                            } else {
                              setEditingSong({
                                ...editingSong,
                                sections: editingSong.sections.filter(s => s !== value)
                              });
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-gray-900">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Reception Genres</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
                    {[...danceGenres, ...lightGenres].map(genre => {
                      const isDanceGenre = danceGenres.some(dg => dg.band === genre.band);
                      const currentField = isDanceGenre ? (editingSong.danceGenres || []) : (editingSong.lightGenres || []);
                      const isChecked = currentField.some(g => g.band === genre.band);

                      return (
                        <label key={genre.band} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                if (isDanceGenre) {
                                  setEditingSong({
                                    ...editingSong,
                                    danceGenres: [...editingSong.danceGenres, genre]
                                  });
                                } else {
                                  setEditingSong({
                                    ...editingSong,
                                    lightGenres: [...editingSong.lightGenres, genre]
                                  });
                                }
                              } else {
                                if (isDanceGenre) {
                                  setEditingSong({
                                    ...editingSong,
                                    danceGenres: editingSong.danceGenres.filter(g => g.band !== genre.band)
                                  });
                                } else {
                                  setEditingSong({
                                    ...editingSong,
                                    lightGenres: editingSong.lightGenres.filter(g => g.band !== genre.band)
                                  });
                                }
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-gray-900">{genre.client}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'ensembles' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Ensembles</h3>
                
                {/* Ceremony Ensembles */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Ceremony Ensembles</label>
                  <div className="space-y-2 h-60 overflow-y-auto border border-gray-200 rounded-md p-3">
                    {[
                      "Solo Piano", "Solo Guitar", "Classic Duo (Piano + Guitar)", "Lounge Duo (Vocalist + Piano)", 
                      "Café Duo (Vocalist + Guitar)", "Solo Violin", "Solo Cello", "Violin w/ Tracks (Violin + DJ)", 
                      "Cello w/ Tracks (Cello + DJ)", "String Duo (Violin + Cello)", "Violin Duo (Violin I + Violin II)", 
                      "Folk Duo (Violin + Guitar)", "Elegant Duo (Violin + Piano)", "Guitar Trio (Violin + Cello + Guitar)", 
                      "Piano Trio (Violin + Cello + Piano)", "Chamber Quartet (Violin + Cello + Guitar + Piano)", 
                      "String Quartet (Violin I + Violin II + Viola + Cello)"
                    ].map(ensemble => (
                      <label key={ensemble} className="flex items-center py-1 hover:bg-gray-50 rounded px-2">
                        <input
                          type="checkbox"
                          checked={editingSong.ensembles.includes(ensemble)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditingSong({
                                ...editingSong,
                                ensembles: [...editingSong.ensembles, ensemble]
                              });
                            } else {
                              setEditingSong({
                                ...editingSong,
                                ensembles: editingSong.ensembles.filter(e => e !== ensemble)
                              });
                            }
                          }}
                          className="mr-3"
                        />
                        <span className="text-gray-900 text-sm flex-1">{ensemble}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cocktail Hour Ensembles */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Cocktail Hour Ensembles</label>
                  <div className="space-y-2 h-60 overflow-y-auto border border-gray-200 rounded-md p-3">
                    {[
                      "Jazzy Duo (Sax + Guitar)", "Timeless Duo (Sax + Piano)", "Power Duo (Guitar + Bass)", 
                      "Funky Trio (Sax + Bass + Drums)", "Organ Trio (Organ + Bass + Drums)", "Jazzy Trio (Sax + Guitar + Drums)", 
                      "Power Trio (Guitar + Bass + Drums)", "Vocal Trio (Vocalist + Sax + Guitar)", "Sax w/ Tracks (Sax + DJ)", 
                      "Violin w/ Tracks (Violin + DJ)", "Violin + Sax w/ Tracks (Violin + Sax + DJ)", 
                      "Guitar Trio (Violin + Cello + Guitar)", "Piano Trio (Violin + Cello + Piano)", 
                      "Jazz Quartet (Sax + Piano + Bass + Drums)", "Folk Band (Violin + Guitar + Bass + Drums)", 
                      "Chamber Quartet (Violin + Cello + Guitar + Piano)", "String Quartet (Violin I + Violin II + Viola + Cello)"
                    ].map(ensemble => (
                      <label key={ensemble} className="flex items-center py-1 hover:bg-gray-50 rounded px-2">
                        <input
                          type="checkbox"
                          checked={editingSong.ensembles.includes(ensemble)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditingSong({
                                ...editingSong,
                                ensembles: [...editingSong.ensembles, ensemble]
                              });
                            } else {
                              setEditingSong({
                                ...editingSong,
                                ensembles: editingSong.ensembles.filter(e => e !== ensemble)
                              });
                            }
                          }}
                          className="mr-3"
                        />
                        <span className="text-gray-900 text-sm flex-1">{ensemble}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSong}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'vocals' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Musical Info</h3>
                
                {/* Performance Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Performance Notes</label>
                  <textarea
                    value={editingSong.notes}
                    onChange={(e) => setEditingSong({...editingSong, notes: e.target.value})}
                    rows={2}
                    placeholder="Add any performance notes, special instructions, or musical details..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                
                {/* Vocal Assignments */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Vocal Assignments</label>
                  
                  {/* Lead Vocalist */}
                  <div className="mb-4">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id="lead-vocalist"
                        checked={editingSong.requiresLeadVocalist}
                        onChange={(e) => setEditingSong({...editingSong, requiresLeadVocalist: e.target.checked})}
                        className="mr-2"
                      />
                      <label htmlFor="lead-vocalist" className="text-gray-900 cursor-pointer">Lead Vocalist</label>
                    </div>
                    
                    {editingSong.requiresLeadVocalist && (
                      <div className="ml-6 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Vocalist Role</label>
                          <select
                            value={editingSong.leadVocalistRole}
                            onChange={(e) => setEditingSong({...editingSong, leadVocalistRole: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                          >
                            <option value="">Select Role</option>
                            {vocalists.map(vocalist => (
                              <option key={vocalist.id} value={vocalist.role}>
                                {vocalist.role}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Vocal Part</label>
                          <input
                            type="text"
                            value={editingSong.leadVocalistPart}
                            onChange={(e) => setEditingSong({...editingSong, leadVocalistPart: e.target.value})}
                            placeholder="e.g., Beyoncé part, main melody"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Background Vocals */}
                  <div>
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id="background-vocals"
                        checked={editingSong.requiresBackgroundVocals}
                        onChange={(e) => setEditingSong({...editingSong, requiresBackgroundVocals: e.target.checked})}
                        className="mr-2"
                      />
                      <label htmlFor="background-vocals" className="text-gray-900 cursor-pointer">Background Vocals</label>
                    </div>
                    
                    {editingSong.requiresBackgroundVocals && (
                      <div className="ml-6 space-y-3">
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() => {
                              const newCount = editingSong.backgroundVocalCount + 1;
                              setEditingSong({
                                ...editingSong,
                                backgroundVocalCount: newCount,
                                backgroundVocalRoles: [...editingSong.backgroundVocalRoles, ''],
                                backgroundVocalParts: [...editingSong.backgroundVocalParts, ''],
                                backgroundVocalPartNames: [...editingSong.backgroundVocalPartNames, '']
                              });
                            }}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            + Add Part
                          </button>
                        </div>
                        
                        {Array.from({length: editingSong.backgroundVocalCount}, (_, i) => (
                          <div key={`bg-vocal-${i}`} className="border border-gray-200 rounded-md p-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">Background Vocal Part {i + 1}</h4>
                              <button
                                type="button"
                                onClick={() => {
                                  const newRoles = editingSong.backgroundVocalRoles.filter((_, index) => index !== i);
                                  const newParts = editingSong.backgroundVocalParts.filter((_, index) => index !== i);
                                  const newPartNames = editingSong.backgroundVocalPartNames.filter((_, index) => index !== i);
                                  setEditingSong({
                                    ...editingSong,
                                    backgroundVocalCount: editingSong.backgroundVocalCount - 1,
                                    backgroundVocalRoles: newRoles,
                                    backgroundVocalParts: newParts,
                                    backgroundVocalPartNames: newPartNames
                                  });
                                }}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-900 mb-2">Vocalist Role</label>
                              <select
                                value={editingSong.backgroundVocalRoles[i] || ''}
                                onChange={(e) => {
                                  const newRoles = [...editingSong.backgroundVocalRoles];
                                  newRoles[i] = e.target.value;
                                  setEditingSong({...editingSong, backgroundVocalRoles: newRoles});
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                              >
                                <option value="">Select Role</option>
                                {vocalists.map(vocalist => (
                                  <option key={vocalist.id} value={vocalist.role}>
                                    {vocalist.role}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-900 mb-2">Vocal Range</label>
                              <select
                                value={editingSong.backgroundVocalParts[i] || ''}
                                onChange={(e) => {
                                  const newParts = [...editingSong.backgroundVocalParts];
                                  newParts[i] = e.target.value;
                                  setEditingSong({...editingSong, backgroundVocalParts: newParts});
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                              >
                                <option value="">Select Range</option>
                                <option value="Lowest">Lowest</option>
                                <option value="Low">Low</option>
                                <option value="Middle">Middle</option>
                                <option value="High">High</option>
                                <option value="Higher">Higher</option>
                                <option value="Rap">Rap</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-900 mb-2">Part Description</label>
                              <input
                                type="text"
                                value={editingSong.backgroundVocalPartNames[i] || ''}
                                onChange={(e) => {
                                  const newPartNames = [...editingSong.backgroundVocalPartNames];
                                  newPartNames[i] = e.target.value;
                                  setEditingSong({...editingSong, backgroundVocalPartNames: newPartNames});
                                }}
                                placeholder="e.g., Jay-Z part, harmony, ad-libs"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'versions' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Key Versions & Sheet Music</h3>
                
                {/* Add New Key Version Button */}
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium text-gray-900">Song Versions</h4>
                  <button
                    type="button"
                    onClick={() => {
                      // Determine default key based on original key's major/minor quality
                      const originalKey = editingSong.originalKey;
                      const isOriginalMajor = originalKey && !originalKey.includes('m');
                      const defaultKey = isOriginalMajor ? 'C' : 'Cm';
                      
                      const newVersion = {
                        key: defaultKey,
                        isDefault: editingSong.keyVersions.length === 0,
                        bpm: editingSong.thcBpm || 0,
                        chordLyricChartUrl: '',
                        leadSheetUrl: '',
                        fullBandArrangementUrl: '',
                        hornChartUrl: null,
                        sheetMusicStandardUrl: '',
                        chartLyricsSpecialUrl: null,
                        hornChartSpecialUrl: null
                      };
                      setEditingSong({
                        ...editingSong,
                        keyVersions: [...editingSong.keyVersions, newVersion]
                      });
                    }}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    + Add Key Version
                  </button>
                </div>

                {/* Key Versions List */}
                <div className="space-y-4">
                  {editingSong.keyVersions.map((version, index) => (
                    <div key={`version-${index}-${version.key}`} className="border border-gray-200 rounded-md p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900">
                          Version {index + 1} - {version.key} {version.isDefault && '(Default)'}
                        </h5>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={version.isDefault}
                              onChange={(e) => {
                                const newVersions = [...editingSong.keyVersions];
                                // If setting this as default, unset all others
                                if (e.target.checked) {
                                  newVersions.forEach(v => v.isDefault = false);
                                }
                                newVersions[index].isDefault = e.target.checked;
                                setEditingSong({...editingSong, keyVersions: newVersions});
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Default</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const newVersions = editingSong.keyVersions.filter((_, i) => i !== index);
                              setEditingSong({...editingSong, keyVersions: newVersions});
                            }}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Key</label>
                          <select
                            value={version.key}
                            onChange={(e) => {
                              const newVersions = [...editingSong.keyVersions];
                              newVersions[index].key = e.target.value;
                              setEditingSong({...editingSong, keyVersions: newVersions});
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 h-10"
                          >
                            {(() => {
                              // Determine if original key is major or minor
                              const originalKey = editingSong.originalKey;
                              const isOriginalMajor = originalKey && !originalKey.includes('m');
                              
                              if (isOriginalMajor) {
                                // Show only major keys
                                return (
                                  <>
                                    <option value="C">C</option>
                                    <option value="C#">C#</option>
                                    <option value="D">D</option>
                                    <option value="D#">D#</option>
                                    <option value="E">E</option>
                                    <option value="F">F</option>
                                    <option value="F#">F#</option>
                                    <option value="G">G</option>
                                    <option value="G#">G#</option>
                                    <option value="A">A</option>
                                    <option value="A#">A#</option>
                                    <option value="B">B</option>
                                  </>
                                );
                              } else {
                                // Show only minor keys
                                return (
                                  <>
                                    <option value="Cm">Cm</option>
                                    <option value="C#m">C#m</option>
                                    <option value="Dm">Dm</option>
                                    <option value="D#m">D#m</option>
                                    <option value="Em">Em</option>
                                    <option value="Fm">Fm</option>
                                    <option value="F#m">F#m</option>
                                    <option value="Gm">Gm</option>
                                    <option value="G#m">G#m</option>
                                    <option value="Am">Am</option>
                                    <option value="A#m">A#m</option>
                                    <option value="Bm">Bm</option>
                                  </>
                                );
                              }
                            })()}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">BPM</label>
                          <input
                            type="number"
                            value={version.bpm}
                            onChange={(e) => {
                              const newVersions = [...editingSong.keyVersions];
                              newVersions[index].bpm = parseInt(e.target.value) || 0;
                              setEditingSong({...editingSong, keyVersions: newVersions});
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 h-10"
                          />
                        </div>
                      </div>

                      {/* Sheet Music URLs */}
                      <div className="space-y-3">
                        <h6 className="font-medium text-gray-900">Sheet Music Links</h6>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Chord/Lyric Chart URL</label>
                          <input
                            type="url"
                            value={version.chordLyricChartUrl}
                            onChange={(e) => {
                              const newVersions = [...editingSong.keyVersions];
                              newVersions[index].chordLyricChartUrl = e.target.value;
                              setEditingSong({...editingSong, keyVersions: newVersions});
                            }}
                            placeholder="Google Docs URL"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Lead Sheet URL</label>
                            <input
                              type="url"
                              value={version.leadSheetUrl}
                              onChange={(e) => {
                                const newVersions = [...editingSong.keyVersions];
                                newVersions[index].leadSheetUrl = e.target.value;
                                setEditingSong({...editingSong, keyVersions: newVersions});
                              }}
                              placeholder="PDF URL"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Full Band Arrangement URL</label>
                            <input
                              type="url"
                              value={version.fullBandArrangementUrl}
                              onChange={(e) => {
                                const newVersions = [...editingSong.keyVersions];
                                newVersions[index].fullBandArrangementUrl = e.target.value;
                                setEditingSong({...editingSong, keyVersions: newVersions});
                              }}
                              placeholder="PDF URL"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Horn Chart URL</label>
                            <input
                              type="url"
                              value={version.hornChartUrl || ''}
                              onChange={(e) => {
                                const newVersions = [...editingSong.keyVersions];
                                newVersions[index].hornChartUrl = e.target.value || null;
                                setEditingSong({...editingSong, keyVersions: newVersions});
                              }}
                              placeholder="PDF URL (optional)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Standard Sheet Music URL</label>
                            <input
                              type="url"
                              value={version.sheetMusicStandardUrl}
                              onChange={(e) => {
                                const newVersions = [...editingSong.keyVersions];
                                newVersions[index].sheetMusicStandardUrl = e.target.value;
                                setEditingSong({...editingSong, keyVersions: newVersions});
                              }}
                              placeholder="PDF URL"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Special Chart/Lyrics URL</label>
                            <input
                              type="url"
                              value={version.chartLyricsSpecialUrl || ''}
                              onChange={(e) => {
                                const newVersions = [...editingSong.keyVersions];
                                newVersions[index].chartLyricsSpecialUrl = e.target.value || null;
                                setEditingSong({...editingSong, keyVersions: newVersions});
                              }}
                              placeholder="PDF URL (optional)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Special Horn Chart URL</label>
                            <input
                              type="url"
                              value={version.hornChartSpecialUrl || ''}
                              onChange={(e) => {
                                const newVersions = [...editingSong.keyVersions];
                                newVersions[index].hornChartSpecialUrl = e.target.value || null;
                                setEditingSong({...editingSong, keyVersions: newVersions});
                              }}
                              placeholder="PDF URL (optional)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSong}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'special-moments' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Special Moment Recommendations</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select which special moments this song should be recommended for:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Wedding Party Intro',
                    'Newlyweds Intro', 
                    'First Dance',
                    'Parent Dance',
                    'Cake Cutting',
                    'Anniversary Dance',
                    'Bouquet Toss',
                    'Mezinka Dance',
                    'Tea Ceremony',
                    'Tarantella',
                    'Goldun',
                    'Money Spray',
                    'Money Dance',
                    'Grand Finale',
                    'Fireworks Song',
                    'Fire/Belly Dancer Song',
                    'Sparkler Sendoff',
                    'Ceremony Processional',
                    'Ceremony Recessional',
                    'Toast'
                  ].map((moment) => (
                    <label key={moment} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingSong.specialMomentRecommendations?.includes(moment) || false}
                        onChange={(e) => {
                          const currentRecommendations = editingSong.specialMomentRecommendations || [];
                          if (e.target.checked) {
                            setEditingSong({
                              ...editingSong,
                              specialMomentRecommendations: [...currentRecommendations, moment]
                            });
                          } else {
                            setEditingSong({
                              ...editingSong,
                              specialMomentRecommendations: currentRecommendations.filter(rec => rec !== moment)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-900">{moment}</span>
                    </label>
                  ))}
                </div>
                
              </div>
            )}
            </div>

            {/* Fixed Footer with Save/Cancel Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 mt-4">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSong}
                disabled={isSaving}
                className={`px-4 py-2 text-white rounded ${
                  isSaving 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add Song Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Song</h2>
              <button
                onClick={handleCancelAdd}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600">
                This will open the song editor with a blank form where you can enter all the details for a new song.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelAdd}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSong}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Create New Song
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
