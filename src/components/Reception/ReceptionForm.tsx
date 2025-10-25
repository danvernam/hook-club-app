'use client';

import { useState, useEffect } from 'react';

// Song preference types
type SongPreference = 'definitely' | 'maybe' | 'avoid';

// Song preference state type
type SongPreferences = Record<string, SongPreference>;

// Special moment form component
function SpecialMomentForm({ moment, onUpdate, onRemove }: { moment: any; onUpdate: (moment: any) => void; onRemove: () => void }) {
  return (
    <div className="bg-white p-4 rounded border-2 border-gray-300">
      <div className="flex justify-between items-start mb-4">
        <h5 className="text-lg font-bold text-black">Special Moment</h5>
        <button
          onClick={onRemove}
          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-all"
        >
          Remove
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-black mb-2">Song Title</label>
          <input
            type="text"
            value={moment.title}
            onChange={(e) => onUpdate({ ...moment, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter song title"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-black mb-2">Artist</label>
          <input
            type="text"
            value={moment.artist}
            onChange={(e) => onUpdate({ ...moment, artist: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter artist name"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-black mb-2">YouTube Link (Optional)</label>
          <input
            type="url"
            value={moment.videoUrl}
            onChange={(e) => onUpdate({ ...moment, videoUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-black mb-2">Notes (Optional)</label>
          <input
            type="text"
            value={moment.notes}
            onChange={(e) => onUpdate({ ...moment, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Any special notes or requests"
          />
        </div>
      </div>
    </div>
  );
}

// Song row component
function SongRow({ song, artist, videoUrl, prefKey, preferences, setPreferences }: { 
  song: string;
  artist: string;
  videoUrl: string;
  prefKey: string;
  preferences: SongPreferences;
  setPreferences: (prefs: SongPreferences) => void;
}) {
  const preference = preferences[prefKey] || null;

  const handlePreferenceChange = (pref: SongPreference) => {
    setPreferences({ ...preferences, [prefKey]: pref });
  };

  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50">
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 text-sm">{song}</div>
        <div className="text-xs text-gray-500">{artist}</div>
      </div>
      <div className="flex gap-2 ml-4">
        <button
          onClick={() => handlePreferenceChange('definitely')}
          className={`px-3 py-1 text-xs rounded transition-all ${
            preference === 'definitely'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
          }`}
        >
          Definitely Play!
        </button>
        <button
          onClick={() => handlePreferenceChange('maybe')}
          className={`px-3 py-1 text-xs rounded transition-all ${
            preference === 'maybe'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-yellow-700'
          }`}
        >
          If The Mood Is Right..
        </button>
        <button
          onClick={() => handlePreferenceChange('avoid')}
          className={`px-3 py-1 text-xs rounded transition-all ${
            preference === 'avoid'
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700'
          }`}
        >
          Avoid Playing
        </button>
      </div>
    </div>
  );
}

export default function ReceptionForm() {
  // Main navigation state
  const [mainTab, setMainTab] = useState<'general' | 'eventinfo' | 'contacts' | 'gettingtoknow' | 'ceremony' | 'cocktail' | 'reception' | 'afterparty' | 'welcome' | 'vendor-recommendations' | 'band-prep' | 'summary'>('general');
  
  // Band prep state
  const [showBandPrep, setShowBandPrep] = useState(false);
  const [bandPrepTab, setBandPrepTab] = useState<'dashboard' | 'database' | 'genres'>('dashboard');
  const [databaseTab, setDatabaseTab] = useState<'dashboard' | 'database'>('dashboard');
  
  // Event information state
  const [eventInfo, setEventInfo] = useState({
    guestAttire: '',
    thcDress: '',
    vendorMealLocation: '',
    guestCount: '',
    weddingDate: 'Saturday, April 20th, 1961',
    venue: 'The Plaza Hotel, New York',
    musicDeadline: 'February 20, 1961'
  });

  // Song data state
  const [songsData, setSongsData] = useState<any>(null);
  const [fullSongsData, setFullSongsData] = useState<any>(null);
  const [preferences, setPreferences] = useState<SongPreferences>({});
  
  // Ceremony state
  const [ceremonyTab, setCeremonyTab] = useState<'guest-arrival' | 'ceremony-music'>('guest-arrival');
  const [processionalSongs, setProcessionalSongs] = useState<any[]>([]);
  const [recessionalSong, setRecessionalSong] = useState<any>(null);
  const [guestArrivalRequests, setGuestArrivalRequests] = useState<any[]>([]);
  
  // Reception state
  const [receptionTab, setReceptionTab] = useState<'requests' | 'repertoire' | 'special-moments'>('requests');
  const [receptionRequests, setReceptionRequests] = useState<any[]>([]);
  const [receptionSpecialMoments, setReceptionSpecialMoments] = useState<any[]>([]);
  const [dinnerPlaylist, setDinnerPlaylist] = useState('');
  const [dinnerPlaylistNotes, setDinnerPlaylistNotes] = useState('');
  const [playlistLinks, setPlaylistLinks] = useState<any[]>([]);
  
  // Cocktail hour state
  const [cocktailRequests, setCocktailRequests] = useState<any[]>([]);
  const [cocktailSpecialMoments, setCocktailSpecialMoments] = useState<any[]>([]);
  const [cocktailPlaylists, setCocktailPlaylists] = useState<any[]>([]);
  
  // After-party state
  const [afterpartyRequests, setAfterpartyRequests] = useState<any[]>([]);
  const [afterpartyPlaylist, setAfterpartyPlaylist] = useState('');
  
  // Welcome party state
  const [welcomeRequests, setWelcomeRequests] = useState<any[]>([]);
  const [welcomePlaylist, setWelcomePlaylist] = useState('');
  
  // Ceremony special moments
  const [ceremonySpecialMoments, setCeremonySpecialMoments] = useState<any[]>([]);
  
  // Database state
  const [activeGenre, setActiveGenre] = useState<string>('pop');
  const [editingSong, setEditingSong] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [songFilter, setSongFilter] = useState<'all' | 'live' | 'inactive'>('all');
  const [genreStatus, setGenreStatus] = useState<Record<string, boolean>>({});
  const [songSort, setSongSort] = useState<'title' | 'artist'>('title');
  const [songSearch, setSongSearch] = useState('');

  // Song counts calculation
  const songCounts = {
    definitely: Object.values(preferences).filter(pref => pref === 'definitely').length,
    maybe: Object.values(preferences).filter(pref => pref === 'maybe').length,
    avoid: Object.values(preferences).filter(pref => pref === 'avoid').length
  };

  // Load songs data
  useEffect(() => {
    fetch('/data/songs.json')
      .then(response => response.json())
      .then(data => {
        setFullSongsData(data);
        
        // Transform data for client use
        const transformedData: any = {};
        if (data.genres) {
          Object.entries(data.genres).forEach(([key, genre]: [string, any]) => {
            if (genre.isActive) {
              transformedData[key] = data.songs.filter((song: any) => 
                song.genre === key && song.isLive
              ).map((song: any) => ({
                song: song.thcTitle || song.originalTitle,
                artist: song.thcArtist || song.originalArtist,
                videoUrl: song.videoUrl
              }));
            }
          });
        }
        setSongsData(transformedData);
      })
      .catch(error => console.error('Error loading songs:', error));
  }, []);

  // Helper functions
  const addReceptionRequest = () => {
    setReceptionRequests([...receptionRequests, { title: '', artist: '', notes: '' }]);
  };

  const updateReceptionRequest = (index: number, field: string, value: string) => {
    const updated = [...receptionRequests];
    updated[index] = { ...updated[index], [field]: value };
    setReceptionRequests(updated);
  };

  const removeReceptionRequest = (index: number) => {
    setReceptionRequests(receptionRequests.filter((_, i) => i !== index));
  };

  // Band Prep helper functions
  const toggleGenre = (genreId: string, isActive: boolean) => {
    setGenreStatus({ ...genreStatus, [genreId]: isActive });
  };

  const saveSong = () => {
    if (editingSong && fullSongsData) {
      // Update the song in the fullSongsData
      const updatedSongs = fullSongsData.songs.map((song: any) => 
        song.id === editingSong.id ? editingSong : song
      );
      setFullSongsData({ ...fullSongsData, songs: updatedSongs });
      setShowEditModal(false);
      setEditingSong(null);
    }
  };

  const addReceptionSpecialMoment = () => {
    setReceptionSpecialMoments([...receptionSpecialMoments, { title: '', artist: '', videoUrl: '', notes: '' }]);
  };

  const updateReceptionSpecialMoment = (index: number, field: string, value: string) => {
    const updated = [...receptionSpecialMoments];
    updated[index] = { ...updated[index], [field]: value };
    setReceptionSpecialMoments(updated);
  };

  const removeReceptionSpecialMoment = (index: number) => {
    setReceptionSpecialMoments(receptionSpecialMoments.filter((_, i) => i !== index));
  };

  const addPlaylistLink = () => {
    setPlaylistLinks([...playlistLinks, { type: '', url: '', notes: '' }]);
  };

  const updatePlaylistLink = (index: number, field: string, value: string) => {
    const updated = [...playlistLinks];
    updated[index] = { ...updated[index], [field]: value };
    setPlaylistLinks(updated);
  };

  const removePlaylistLink = (index: number) => {
    setPlaylistLinks(playlistLinks.filter((_, i) => i !== index));
  };

  const addProcessionalSong = () => {
    setProcessionalSongs([...processionalSongs, { 
      category: '', 
      walkerCount: '', 
      title: '', 
      artist: '',
      videoUrl: '',
      notes: ''
    }]);
  };

  const updateProcessionalSong = (index: number, field: string, value: string) => {
    const updated = [...processionalSongs];
    updated[index] = { ...updated[index], [field]: value };
    setProcessionalSongs(updated);
  };

  const removeProcessionalSong = (index: number) => {
    setProcessionalSongs(processionalSongs.filter((_, i) => i !== index));
  };

  const addGuestArrivalRequest = () => {
    setGuestArrivalRequests([...guestArrivalRequests, { title: '', artist: '', notes: '' }]);
  };

  const updateGuestArrivalRequest = (index: number, field: string, value: string) => {
    const updated = [...guestArrivalRequests];
    updated[index] = { ...updated[index], [field]: value };
    setGuestArrivalRequests(updated);
  };

  const removeGuestArrivalRequest = (index: number) => {
    setGuestArrivalRequests(guestArrivalRequests.filter((_, i) => i !== index));
  };

  const addCocktailRequest = () => {
    setCocktailRequests([...cocktailRequests, { title: '', artist: '', notes: '' }]);
  };

  const updateCocktailRequest = (index: number, field: string, value: string) => {
    const updated = [...cocktailRequests];
    updated[index] = { ...updated[index], [field]: value };
    setCocktailRequests(updated);
  };

  const removeCocktailRequest = (index: number) => {
    setCocktailRequests(cocktailRequests.filter((_, i) => i !== index));
  };

  const addAfterpartyRequest = () => {
    setAfterpartyRequests([...afterpartyRequests, { title: '', artist: '', notes: '' }]);
  };

  const updateAfterpartyRequest = (index: number, field: string, value: string) => {
    const updated = [...afterpartyRequests];
    updated[index] = { ...updated[index], [field]: value };
    setAfterpartyRequests(updated);
  };

  const removeAfterpartyRequest = (index: number) => {
    setAfterpartyRequests(afterpartyRequests.filter((_, i) => i !== index));
  };

  const addWelcomeRequest = () => {
    setWelcomeRequests([...welcomeRequests, { title: '', artist: '', notes: '' }]);
  };

  const updateWelcomeRequest = (index: number, field: string, value: string) => {
    const updated = [...welcomeRequests];
    updated[index] = { ...updated[index], [field]: value };
    setWelcomeRequests(updated);
  };

  const removeWelcomeRequest = (index: number) => {
    setWelcomeRequests(welcomeRequests.filter((_, i) => i !== index));
  };

  const addCocktailSpecialMoment = () => {
    setCocktailSpecialMoments([...cocktailSpecialMoments, { title: '', artist: '', videoUrl: '', notes: '' }]);
  };

  const updateCocktailSpecialMoment = (index: number, field: string, value: string) => {
    const updated = [...cocktailSpecialMoments];
    updated[index] = { ...updated[index], [field]: value };
    setCocktailSpecialMoments(updated);
  };

  const removeCocktailSpecialMoment = (index: number) => {
    setCocktailSpecialMoments(cocktailSpecialMoments.filter((_, i) => i !== index));
  };

  const addCeremonySpecialMoment = () => {
    setCeremonySpecialMoments([...ceremonySpecialMoments, { title: '', artist: '', videoUrl: '', notes: '' }]);
  };

  const updateCeremonySpecialMoment = (index: number, field: string, value: string) => {
    const updated = [...ceremonySpecialMoments];
    updated[index] = { ...updated[index], [field]: value };
    setCeremonySpecialMoments(updated);
  };

  const removeCeremonySpecialMoment = (index: number) => {
    setCeremonySpecialMoments(ceremonySpecialMoments.filter((_, i) => i !== index));
  };

  const addCocktailPlaylist = () => {
    setCocktailPlaylists([...cocktailPlaylists, { type: '', url: '', notes: '' }]);
  };

  const updateCocktailPlaylist = (index: number, field: string, value: string) => {
    const updated = [...cocktailPlaylists];
    updated[index] = { ...updated[index], [field]: value };
    setCocktailPlaylists(updated);
  };

  const removeCocktailPlaylist = (index: number) => {
    setCocktailPlaylists(cocktailPlaylists.filter((_, i) => i !== index));
  };


  const handleEditSong = (song: any) => {
    setEditingSong(song);
    setShowEditModal(true);
  };

  const handleSaveSong = () => {
    // Save song logic here
    setShowEditModal(false);
    setEditingSong(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-6">
            <div className="text-lg font-bold text-black">Aretha Franklin & Ted White • Wedding</div>
            <div className="text-sm text-gray-600">Saturday 4/20/1961 • The Plaza Hotel, New York</div>
      </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            <div className="flex flex-wrap gap-2">
              {/* General Info Tabs */}
        <button
                onClick={() => setMainTab('general')}
                className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                  mainTab === 'general' 
                    ? 'bg-white text-black shadow-md' 
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`}
              >
                Services
        </button>
        <button
                onClick={() => setMainTab('gettingtoknow')}
                className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                  mainTab === 'gettingtoknow' 
                    ? 'bg-white text-black shadow-md' 
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`}
              >
                Getting To Know You
        </button>
        <button
                onClick={() => setMainTab('contacts')}
                className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                  mainTab === 'contacts' 
                    ? 'bg-white text-black shadow-md' 
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`}
              >
                Contacts
        </button>
      <button
                onClick={() => setMainTab('eventinfo')}
                className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                  mainTab === 'eventinfo' 
                    ? 'bg-white text-black shadow-md' 
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`}
              >
                Event Info
      </button>
              
              {/* Music Planning Tabs */}
              <button
                onClick={() => setMainTab('welcome')}
                className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                  mainTab === 'welcome' 
                    ? 'bg-white text-black shadow-md' 
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`}
              >
                Welcome Party
              </button>
          <button
                onClick={() => setMainTab('ceremony')}
                className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                  mainTab === 'ceremony' 
                    ? 'bg-white text-black shadow-md' 
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`}
              >
                Ceremony
              </button>
              <button
                onClick={() => setMainTab('cocktail')}
                className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                  mainTab === 'cocktail' 
                    ? 'bg-white text-black shadow-md' 
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cocktail Hour
              </button>
              <button
                onClick={() => setMainTab('reception')}
                className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                  mainTab === 'reception' 
                    ? 'bg-white text-black shadow-md' 
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`}
              >
                Reception
              </button>
              <button
                onClick={() => setMainTab('afterparty')}
                className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                  mainTab === 'afterparty' 
                    ? 'bg-white text-black shadow-md' 
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`}
              >
                After-Party
              </button>
              <button
                onClick={() => setMainTab('summary')}
                className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                  mainTab === 'summary' 
                    ? 'bg-white text-black shadow-md' 
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`}
              >
                Music Summary
              </button>
              
              {/* Band Prep Button */}
              <button
                onClick={() => setMainTab('band-prep')}
                className="px-4 py-2 text-sm font-semibold rounded transition-all bg-purple-600 text-white hover:bg-purple-700"
              >
                Band Prep →
          </button>
                </div>
              </div>
        </div>

        {/* Content */}
        {mainTab === 'general' && (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-8">
            <div className="border-l-4 border-purple-600 pl-4 mb-8">
              <h2 className="text-3xl font-bold text-black">Entertainment & Production Services</h2>
              <p className="text-gray-600 mt-2">Complete entertainment and production services for your wedding</p>
            </div>

            {/* Reception Services */}
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-black mb-4">Reception - 15-Piece Full Band</h3>
            </div>
          </div>
        )}

        {/* Getting To Know You Tab */}
        {mainTab === 'gettingtoknow' && (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-8">
            <div className="border-l-4 border-purple-600 pl-4 mb-8">
              <h2 className="text-3xl font-bold text-black">Getting To Know You</h2>
              <p className="text-gray-600 mt-2">Tell us about yourselves and your musical preferences</p>
            </div>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">How did you meet?</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    placeholder="Tell us your story..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-black mb-2">What's your favorite type of music?</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Pop, Rock, Jazz, etc..."
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-black mb-2">Any songs that are special to you as a couple?</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Share the songs that mean something to you..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-black mb-2">What's your ideal wedding vibe?</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Describe the atmosphere you want to create..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-black mb-2">Any songs you definitely DON'T want to hear?</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={2}
                  placeholder="Any songs or genres to avoid..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {mainTab === 'contacts' && (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-8">
            <div className="border-l-4 border-purple-600 pl-4 mb-8">
              <h2 className="text-3xl font-bold text-black">Contacts</h2>
              <p className="text-gray-600 mt-2">Your wedding team contacts</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-black mb-6">👫 Couple</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">Bride's Name</label>
          <input
            type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter bride's name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">Groom's Name</label>
          <input
            type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter groom's name"
          />
        </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">Bride's Email</label>
        <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="bride@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">Groom's Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="groom@email.com"
        />
      </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">Bride's Phone</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="(555) 123-4567"
                      />
      </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">Groom's Phone</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-black mb-6">🏢 Vendors</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">📋 Wedding Planner</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Planner name"
                      />
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="planner@email.com"
            />
          </div>
        </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-2">🏛️ Venue Coordinator</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Coordinator name"
                      />
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="coordinator@venue.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">📸 Photographer</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Photographer name"
                      />
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="photographer@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">📹 Videographer</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Videographer name"
                      />
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="videographer@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">🌸 Florist</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Florist name"
                      />
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="florist@email.com"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <p className="text-sm text-purple-700 mb-2">
                    <strong>Looking for vendors?</strong> Check out our recommendations
                  </p>
        <button
                    onClick={() => setMainTab('vendor-recommendations')}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-all"
        >
                    View Vendor Recommendations
        </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Event Info Tab */}
        {mainTab === 'eventinfo' && (
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-8">
            <div className="border-l-4 border-purple-600 pl-4 mb-8">
              <h2 className="text-3xl font-bold text-black">Event Information</h2>
              <p className="text-gray-600 mt-2">Your wedding details</p>
          </div>

            <div className="space-y-8">
              {/* Wedding Overview */}
              <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                <h3 className="text-xl font-bold text-black mb-4">📅 Wedding Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Wedding Date</label>
                    <input
                      type="text"
                      value={eventInfo.weddingDate}
                      onChange={(e) => setEventInfo({...eventInfo, weddingDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
              </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Venue</label>
                    <input
                      type="text"
                      value={eventInfo.venue}
                      onChange={(e) => setEventInfo({...eventInfo, venue: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Guest Count</label>
                    <input
                      type="text"
                      value={eventInfo.guestCount}
                      onChange={(e) => setEventInfo({...eventInfo, guestCount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter expected guest count"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Music Planning Deadline</label>
                    <input
                      type="text"
                      value={eventInfo.musicDeadline}
                      onChange={(e) => setEventInfo({...eventInfo, musicDeadline: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
            </div>
          </div>

              {/* Guest Information */}
              <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                <h3 className="text-xl font-bold text-black mb-4">👥 Guest Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Guest Arrival Time (formatted as 24 hour day like 23:00)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., 15:30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">What Is The Guest Attire?</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Black tie, Cocktail attire"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">How Should THC Dress?</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Black tie, Formal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Where Do We Eat Our Vendor Meal?</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Back room, Separate area"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">How Will Vendor Meals Be Served? Plated, Buffet etc</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Plated, Buffet, Family style"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">What Is The Rain Plan For The Wedding?</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Indoor ceremony, Tent setup"
                    />
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                <h3 className="text-xl font-bold text-black mb-4">⏰ Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Ceremony Start Time</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Cocktail Hour Start</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Reception Start</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Reception End</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Guest Attire & Details */}
              <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                <h3 className="text-xl font-bold text-black mb-4">👔 Guest Details</h3>
              <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Guest Attire</label>
                    <input
                      type="text"
                      value={eventInfo.guestAttire}
                      onChange={(e) => setEventInfo({...eventInfo, guestAttire: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Black tie, Cocktail attire, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">THC Dress Code</label>
                    <input
                      type="text"
                      value={eventInfo.thcDress}
                      onChange={(e) => setEventInfo({...eventInfo, thcDress: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Black suits, cocktail dresses, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Vendor Meal Location</label>
                    <input
                      type="text"
                      value={eventInfo.vendorMealLocation}
                      onChange={(e) => setEventInfo({...eventInfo, vendorMealLocation: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Separate room, same as guests, etc."
                    />
                  </div>
                </div>
              </div>
              
              {/* Status Bar */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
                <div className="flex justify-center">
                  <div className="inline-block min-w-[400px]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-700">Music Planning Deadline</span>
                      <span className="text-sm font-bold text-red-600">Overdue!</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-red-500 h-3 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-center">Please complete your music selections as soon as possible</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Music Planning Tabs */}
        {mainTab === 'welcome' && (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-8">
            <div className="border-l-4 border-purple-600 pl-4 mb-8">
              <h2 className="text-3xl font-bold text-black">Welcome Party</h2>
              <p className="text-gray-600 mt-2">Music for your welcome party</p>
                              </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-black mb-4">Song Requests</h3>
                <p className="text-sm text-gray-600 mb-4">Request any songs you'd like to hear during your welcome party. These can be songs from our repertoire that are especially special to you, or songs that are not on our repertoire that you'd like us to play.</p>
                
                {welcomeRequests.map((request, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded border-2 border-gray-200 mb-4">
                    <div className="flex justify-between items-start mb-4">
                      <h5 className="text-lg font-bold text-black">Request {index + 1}</h5>
                              <button
                        onClick={() => removeWelcomeRequest(index)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-all"
                      >
                        Remove
                              </button>
                            </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">Song Title</label>
                        <input
                          type="text"
                          value={request.title}
                          onChange={(e) => updateWelcomeRequest(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter song title"
                        />
                    </div>
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">Artist</label>
                        <input
                          type="text"
                          value={request.artist}
                          onChange={(e) => updateWelcomeRequest(index, 'artist', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter artist name"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-black mb-2">Notes (Optional)</label>
                        <input
                          type="text"
                          value={request.notes}
                          onChange={(e) => updateWelcomeRequest(index, 'notes', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Any special notes or requests"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {welcomeRequests.length < 5 && (
                  <button
                    onClick={addWelcomeRequest}
                    className="w-full py-3 border-2 border-dashed border-purple-400 rounded text-purple-600 hover:border-purple-500 hover:text-purple-700 transition-all"
                  >
                    + Add Request
                  </button>
                  )}
                </div>

              <div>
                <h3 className="text-xl font-bold text-black mb-4">THC Song List</h3>
                <p className="text-sm text-gray-600 mb-4">Choose from our curated selection of welcome party songs</p>
                
                {/* Song Progress Tracker */}
                <div className="bg-white p-4 rounded border-2 border-gray-200 mb-6">
                  <h4 className="text-lg font-bold text-black mb-4">🎵 Song Progress</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded border-2 border-green-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-green-700">Definitely Play!</span>
                        <span className="text-lg font-bold text-green-700">{songCounts.definitely}</span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((songCounts.definitely / 20) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-green-600 mt-1">Goal: 15-20 songs</p>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded border-2 border-yellow-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-yellow-700">If The Mood Is Right..</span>
                        <span className="text-lg font-bold text-yellow-700">{songCounts.maybe}</span>
                              </div>
                      <div className="w-full bg-yellow-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((songCounts.maybe / 15) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-yellow-600 mt-1">Goal: 10-15 songs</p>
                    </div>
                    
                    <div className="bg-red-50 p-4 rounded border-2 border-red-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-red-700">Avoid Playing</span>
                        <span className="text-lg font-bold text-red-700">{songCounts.avoid}</span>
                      </div>
                      <div className="w-full bg-red-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((songCounts.avoid / 10) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-red-600 mt-1">Goal: 5-10 songs</p>
                    </div>
                  </div>
                </div>
                
                {/* Genre Tabs */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {songsData && Object.keys(songsData).map((genre) => (
                              <button
                        key={genre}
                        onClick={() => setActiveGenre(genre)}
                        className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                          activeGenre === genre 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {genre === 'pop' && '🎤 Pop'}
                        {genre === 'soul' && '🎵 Soul/R&B'}
                        {genre === 'rock' && '🎸 Rock'}
                        {genre === 'hiphop' && '🎤 Hip-Hop'}
                        {genre === 'disco' && '💃 Disco'}
                        {genre === 'punk' && '🎸 Pop Punk'}
                        {genre === 'country' && '🤠 Country'}
                        {genre === 'latin' && '🌶️ Latin'}
                        {genre === 'ballads' && '💕 Ballads'}
                              </button>
                    ))}
                            </div>
                </div>

                {/* Song List */}
                    <div className="space-y-2">
                  {songsData && songsData[activeGenre] && songsData[activeGenre].map((song: any, index: number) => (
                    <SongRow
                      key={index}
                      song={song.song}
                      artist={song.artist}
                      videoUrl={song.videoUrl}
                      prefKey={`welcome-${activeGenre}-${index}`}
                      preferences={preferences}
                      setPreferences={setPreferences}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-black mb-4">Playlist Links</h3>
                <p className="text-sm text-gray-600 mb-4">Add any playlist links for your welcome party</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Welcome Party Playlist (Optional)</label>
                    <input
                      type="url"
                      value={welcomePlaylist}
                      onChange={(e) => setWelcomePlaylist(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://spotify.com/playlist/..."
                    />
                              </div>
                            </div>
                    </div>
                </div>
              </div>
        )}

        {/* Ceremony Tab */}
        {mainTab === 'ceremony' && (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-8">
            <div className="border-l-4 border-purple-600 pl-4 mb-8">
              <h2 className="text-3xl font-bold text-black">Ceremony</h2>
              <p className="text-gray-600 mt-2">Music for your ceremony</p>
                </div>
            
            {/* Ceremony Navigation */}
            <div className="mb-8">
              <div className="bg-gray-100 rounded-lg p-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCeremonyTab('guest-arrival')}
                    className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                      ceremonyTab === 'guest-arrival' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-transparent text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Guest Arrival
                  </button>
                  <button
                    onClick={() => setCeremonyTab('ceremony-music')}
                    className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                      ceremonyTab === 'ceremony-music' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-transparent text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Ceremony Music
                  </button>
                </div>
                    </div>
                  </div>

            {/* Guest Arrival Tab */}
            {ceremonyTab === 'guest-arrival' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-black mb-4">Guest Arrival Requests</h3>
                  <p className="text-sm text-gray-600 mb-4">Request any songs you'd like to hear as guests arrive</p>
                  
                  {guestArrivalRequests.map((request, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded border-2 border-gray-200 mb-4">
                      <div className="flex justify-between items-start mb-4">
                        <h5 className="text-lg font-bold text-black">Request {index + 1}</h5>
                            <button
                          onClick={() => removeGuestArrivalRequest(index)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-all"
                        >
                          Remove
                            </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">Song Title</label>
                          <input
                            type="text"
                            value={request.title}
                            onChange={(e) => updateGuestArrivalRequest(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter song title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">Artist</label>
                          <input
                            type="text"
                            value={request.artist}
                            onChange={(e) => updateGuestArrivalRequest(index, 'artist', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter artist name"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-black mb-2">Notes (Optional)</label>
                          <input
                            type="text"
                            value={request.notes}
                            onChange={(e) => updateGuestArrivalRequest(index, 'notes', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Any special notes or requests"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {guestArrivalRequests.length < 2 && (
                            <button
                      onClick={addGuestArrivalRequest}
                      className="w-full py-3 border-2 border-dashed border-purple-400 rounded text-purple-600 hover:border-purple-500 hover:text-purple-700 transition-all"
                    >
                      + Add Request
                            </button>
                  )}
                          </div>

                <div>
                  <h3 className="text-xl font-bold text-black mb-4">THC Song List</h3>
                  <p className="text-sm text-gray-600 mb-4">Choose from our curated selection of ceremony-appropriate songs</p>
                  
                  {/* Song Progress Tracker */}
                  <div className="bg-white p-4 rounded border-2 border-gray-200 mb-6">
                    <h4 className="text-lg font-bold text-black mb-4">🎵 Song Progress</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 p-4 rounded border-2 border-green-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-green-700">Definitely Play!</span>
                          <span className="text-lg font-bold text-green-700">{songCounts.definitely}</span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((songCounts.definitely / 20) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-green-600 mt-1">Goal: 15-20 songs</p>
                      </div>
                      
                      <div className="bg-yellow-50 p-4 rounded border-2 border-yellow-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-yellow-700">If The Mood Is Right..</span>
                          <span className="text-lg font-bold text-yellow-700">{songCounts.maybe}</span>
                        </div>
                        <div className="w-full bg-yellow-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((songCounts.maybe / 15) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-yellow-600 mt-1">Goal: 10-15 songs</p>
                      </div>
                      
                      <div className="bg-red-50 p-4 rounded border-2 border-red-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-red-700">Avoid Playing</span>
                          <span className="text-lg font-bold text-red-700">{songCounts.avoid}</span>
                        </div>
                        <div className="w-full bg-red-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((songCounts.avoid / 10) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-red-600 mt-1">Goal: 5-10 songs</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Song List */}
                  <div className="space-y-2">
                    {songsData && songsData['pop'] && songsData['pop'].slice(0, 10).map((song: any, index: number) => (
                      <SongRow
                        key={index}
                        song={song.song}
                        artist={song.artist}
                        videoUrl={song.videoUrl}
                        prefKey={`ceremony-guest-${index}`}
                        preferences={preferences}
                        setPreferences={setPreferences}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Ceremony Music Tab */}
            {ceremonyTab === 'ceremony-music' && (
              <div className="space-y-6">
                              <div>
                  <h3 className="text-xl font-bold text-black mb-4">Processional Songs</h3>
                  <p className="text-sm text-gray-600 mb-4">Add songs for your processional</p>
                  
                  {processionalSongs.map((song, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded border-2 border-gray-200 mb-4">
                      <div className="flex justify-between items-start mb-4">
                        <h5 className="text-lg font-bold text-black">Processional Song {index + 1}</h5>
                        <button
                          onClick={() => removeProcessionalSong(index)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-all"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">Category</label>
                                <select
                            value={song.category}
                            onChange={(e) => updateProcessionalSong(index, 'category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="">Select category</option>
                            <option value="wedding-party">Wedding Party</option>
                            <option value="bridesmaid">Bridesmaid</option>
                            <option value="groomsmen">Groomsmen</option>
                            <option value="bridal-processional">Bridal Processional</option>
                            <option value="family">Family</option>
                            <option value="flower-girl">Flower Girl</option>
                            <option value="ring-bearer">Ring Bearer</option>
                            <option value="other">Other</option>
                                </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">How Many Pairs or Individuals Will Walk Down To This Song?</label>
                          <input
                            type="text"
                            value={song.walkerCount}
                            onChange={(e) => updateProcessionalSong(index, 'walkerCount', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g., 2 pairs, 4 individuals"
                          />
                          <p className="text-xs text-gray-500 mt-1">We will confirm actual names and precise order in the weeks before the wedding</p>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">Title</label>
                          <input
                            type="text"
                            value={song.title}
                            onChange={(e) => updateProcessionalSong(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter song title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">Artist</label>
                          <input
                            type="text"
                            value={song.artist}
                            onChange={(e) => updateProcessionalSong(index, 'artist', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter artist name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">YouTube Link (Optional)</label>
                          <input
                            type="url"
                            value={song.videoUrl}
                            onChange={(e) => updateProcessionalSong(index, 'videoUrl', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="https://youtube.com/watch?v=..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">Notes (Optional)</label>
                          <input
                            type="text"
                            value={song.notes}
                            onChange={(e) => updateProcessionalSong(index, 'notes', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Any special notes or requests"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={addProcessionalSong}
                    className="w-full py-3 border-2 border-dashed border-purple-400 rounded text-purple-600 hover:border-purple-500 hover:text-purple-700 transition-all"
                  >
                    + Add Processional Song
                  </button>
                              </div>

                              <div>
                  <h3 className="text-xl font-bold text-black mb-4">Recessional Song</h3>
                  <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">Title</label>
                        <input
                          type="text"
                          value={recessionalSong?.title || ''}
                          onChange={(e) => setRecessionalSong({...recessionalSong, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter song title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">Artist</label>
                        <input
                          type="text"
                          value={recessionalSong?.artist || ''}
                          onChange={(e) => setRecessionalSong({...recessionalSong, artist: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter artist name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">YouTube Link (Optional)</label>
                        <input
                          type="url"
                          value={recessionalSong?.videoUrl || ''}
                          onChange={(e) => setRecessionalSong({...recessionalSong, videoUrl: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">Performance Style</label>
                                <select
                          value={recessionalSong?.performanceStyle || ''}
                          onChange={(e) => setRecessionalSong({...recessionalSong, performanceStyle: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select style</option>
                          <option value="live">Live</option>
                          <option value="recorded">Recorded Track</option>
                                </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-black mb-2">Notes (Optional)</label>
                        <input
                          type="text"
                          value={recessionalSong?.notes || ''}
                          onChange={(e) => setRecessionalSong({...recessionalSong, notes: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Any special notes or requests"
                        />
                      </div>
                    </div>
                              </div>
                            </div>

                <div>
                  <h3 className="text-xl font-bold text-black mb-4">Ceremony Special Moments</h3>
                  <p className="text-sm text-gray-600 mb-4">Add any special musical moments during the ceremony</p>
                  
                  {ceremonySpecialMoments.map((moment, index) => (
                    <SpecialMomentForm
                      key={index}
                      moment={moment}
                      onUpdate={(updatedMoment) => updateCeremonySpecialMoment(index, 'title', updatedMoment.title)}
                      onRemove={() => removeCeremonySpecialMoment(index)}
                    />
                  ))}
                  
                  <button
                    onClick={addCeremonySpecialMoment}
                    className="w-full py-3 border-2 border-dashed border-purple-400 rounded text-purple-600 hover:border-purple-500 hover:text-purple-700 transition-all"
                  >
                    + Add Special Moment
                  </button>
                            </div>
                          </div>
            )}
          </div>
        )}

        {/* Cocktail Hour Tab */}
        {mainTab === 'cocktail' && (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-8">
            <div className="border-l-4 border-purple-600 pl-4 mb-8">
              <h2 className="text-3xl font-bold text-black">Cocktail Hour</h2>
              <p className="text-gray-600 mt-2">Music for your cocktail hour</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-black mb-4">Song Requests</h3>
                <p className="text-sm text-gray-600 mb-4">Request any songs you'd like to hear during cocktail hour. These can be songs from our repertoire that are especially special to you, or songs that are not on our repertoire that you'd like us to play.</p>
                
                {cocktailRequests.map((request, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded border-2 border-gray-200 mb-4">
                    <div className="flex justify-between items-start mb-4">
                      <h5 className="text-lg font-bold text-black">Request {index + 1}</h5>
                          <button
                        onClick={() => removeCocktailRequest(index)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-all"
                          >
                            Remove
                          </button>
                        </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">Song Title</label>
                        <input
                          type="text"
                          value={request.title}
                          onChange={(e) => updateCocktailRequest(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter song title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">Artist</label>
                        <input
                          type="text"
                          value={request.artist}
                          onChange={(e) => updateCocktailRequest(index, 'artist', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter artist name"
                        />
                  </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-black mb-2">Notes (Optional)</label>
                        <input
                          type="text"
                          value={request.notes}
                          onChange={(e) => updateCocktailRequest(index, 'notes', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Any special notes or requests"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {cocktailRequests.length < 5 && (
                  <button
                    onClick={addCocktailRequest}
                    className="w-full py-3 border-2 border-dashed border-purple-400 rounded text-purple-600 hover:border-purple-500 hover:text-purple-700 transition-all"
                  >
                    + Add Request
                    </button>
                )}
                  </div>
              
              <div>
                <h3 className="text-xl font-bold text-black mb-4">THC Song List</h3>
                <p className="text-sm text-gray-600 mb-4">Choose from our curated selection of cocktail hour songs</p>
                
                {/* Song Progress Tracker */}
                <div className="bg-white p-4 rounded border-2 border-gray-200 mb-6">
                  <h4 className="text-lg font-bold text-black mb-4">🎵 Song Progress</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded border-2 border-green-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-green-700">Definitely Play!</span>
                        <span className="text-lg font-bold text-green-700">{songCounts.definitely}</span>
                </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((songCounts.definitely / 20) * 100, 100)}%` }}
                        />
        </div>
                      <p className="text-xs text-green-600 mt-1">Goal: 15-20 songs</p>
      </div>
                    
                    <div className="bg-yellow-50 p-4 rounded border-2 border-yellow-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-yellow-700">If The Mood Is Right..</span>
                        <span className="text-lg font-bold text-yellow-700">{songCounts.maybe}</span>
                      </div>
                      <div className="w-full bg-yellow-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((songCounts.maybe / 15) * 100, 100)}%` }}
          />
        </div>
                      <p className="text-xs text-yellow-600 mt-1">Goal: 10-15 songs</p>
      </div>

                    <div className="bg-red-50 p-4 rounded border-2 border-red-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-red-700">Avoid Playing</span>
                        <span className="text-lg font-bold text-red-700">{songCounts.avoid}</span>
                      </div>
                      <div className="w-full bg-red-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((songCounts.avoid / 10) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-red-600 mt-1">Goal: 5-10 songs</p>
                    </div>
                  </div>
                </div>
                
                {/* Genre Tabs */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {songsData && Object.keys(songsData).map((genre) => (
            <button
                        key={genre}
                        onClick={() => setActiveGenre(genre)}
                        className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                          activeGenre === genre 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {genre === 'pop' && '🎤 Pop'}
                        {genre === 'soul' && '🎵 Soul/R&B'}
                        {genre === 'rock' && '🎸 Rock'}
                        {genre === 'hiphop' && '🎤 Hip-Hop'}
                        {genre === 'disco' && '💃 Disco'}
                        {genre === 'punk' && '🎸 Pop Punk'}
                        {genre === 'country' && '🤠 Country'}
                        {genre === 'latin' && '🌶️ Latin'}
                        {genre === 'ballads' && '💕 Ballads'}
            </button>
                    ))}
                  </div>
                </div>
                
                {/* Song List */}
                <div className="space-y-2">
                  {songsData && songsData[activeGenre] && songsData[activeGenre].map((song: any, index: number) => (
                    <SongRow
                      key={index}
                      song={song.song}
                      artist={song.artist}
                      videoUrl={song.videoUrl}
                      prefKey={`cocktail-${activeGenre}-${index}`}
                      preferences={preferences}
                      setPreferences={setPreferences}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-black mb-4">Special Moments</h3>
                <p className="text-sm text-gray-600 mb-4">Add any special moments during cocktail hour</p>
                
                {cocktailSpecialMoments.map((moment, index) => (
                  <SpecialMomentForm
                    key={index}
                    moment={moment}
                    onUpdate={(updatedMoment) => updateCocktailSpecialMoment(index, 'title', updatedMoment.title)}
                    onRemove={() => removeCocktailSpecialMoment(index)}
                  />
                ))}
                
            <button
                  onClick={addCocktailSpecialMoment}
                  className="w-full py-3 border-2 border-dashed border-purple-400 rounded text-purple-600 hover:border-purple-500 hover:text-purple-700 transition-all"
                >
                  + Add Special Moment
            </button>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-black mb-4">Playlist Links</h3>
                <p className="text-sm text-gray-600 mb-4">Add any playlist links for cocktail hour</p>
                
                {cocktailPlaylists.map((playlist, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded border-2 border-gray-200 mb-4">
                    <div className="flex justify-between items-start mb-4">
                      <h5 className="text-lg font-bold text-black">Playlist {index + 1}</h5>
            <button
                        onClick={() => removeCocktailPlaylist(index)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-all"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">Playlist Type</label>
                        <select
                          value={playlist.type}
                          onChange={(e) => updateCocktailPlaylist(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select type</option>
                          <option value="background">Background Music</option>
                          <option value="dancing">Dancing</option>
                          <option value="general">General</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">URL</label>
                        <input
                          type="url"
                          value={playlist.url}
                          onChange={(e) => updateCocktailPlaylist(index, 'url', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="https://spotify.com/playlist/..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-black mb-2">Notes (Optional)</label>
                        <input
                          type="text"
                          value={playlist.notes}
                          onChange={(e) => updateCocktailPlaylist(index, 'notes', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Any special notes or requests"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addCocktailPlaylist}
                  className="w-full py-3 border-2 border-dashed border-purple-400 rounded text-purple-600 hover:border-purple-500 hover:text-purple-700 transition-all"
                >
                  + Add Playlist
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reception Tab */}
        {mainTab === 'reception' && (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-8">
            <div className="border-l-4 border-purple-600 pl-4 mb-8">
              <h2 className="text-3xl font-bold text-black">Reception</h2>
              <p className="text-gray-600 mt-2">Music for your reception</p>
            </div>
            
            {/* Reception Navigation */}
            <div className="mb-8">
              <div className="bg-gray-100 rounded-lg p-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setReceptionTab('requests')}
                    className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                      receptionTab === 'requests' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-transparent text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Requests
            </button>
            <button
                    onClick={() => setReceptionTab('repertoire')}
                    className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                      receptionTab === 'repertoire' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-transparent text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Repertoire
            </button>
            <button
                    onClick={() => setReceptionTab('special-moments')}
                    className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                      receptionTab === 'special-moments' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-transparent text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Special Moments
            </button>
          </div>
        </div>
            </div>

            {/* Requests Tab */}
            {receptionTab === 'requests' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-black mb-4">Essential Requests</h3>
                  <p className="text-sm text-gray-600 mb-4">These are non-negotiable songs we'll be looking out for on the dance floor</p>
                  
                  {receptionRequests.slice(0, 2).map((request, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded border-2 border-gray-200 mb-4">
                      <div className="flex justify-between items-start mb-4">
                        <h5 className="text-lg font-bold text-black">Essential Request {index + 1}</h5>
        <button
                          onClick={() => removeReceptionRequest(index)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-all"
        >
                          Remove
        </button>
      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">Song Title</label>
                          <input
                            type="text"
                            value={request.title}
                            onChange={(e) => updateReceptionRequest(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter song title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">Artist</label>
                          <input
                            type="text"
                            value={request.artist}
                            onChange={(e) => updateReceptionRequest(index, 'artist', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter artist name"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-black mb-2">Notes (Optional)</label>
                          <input
                            type="text"
                            value={request.notes}
                            onChange={(e) => updateReceptionRequest(index, 'notes', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Any special notes or requests"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {receptionRequests.length < 2 && (
                    <button
                      onClick={addReceptionRequest}
                      className="w-full py-3 border-2 border-dashed border-purple-400 rounded text-purple-600 hover:border-purple-500 hover:text-purple-700 transition-all"
                    >
                      + Add Essential Request
                    </button>
                  )}
          </div>

                <div>
                  <h3 className="text-xl font-bold text-black mb-4">Additional Requests</h3>
                  <p className="text-sm text-gray-600 mb-4">Your musical moodboard - we'll play as many as possible</p>
                  
                  {receptionRequests.slice(2).map((request, index) => (
                    <div key={index + 2} className="bg-gray-50 p-4 rounded border-2 border-gray-200 mb-4">
                      <div className="flex justify-between items-start mb-4">
                        <h5 className="text-lg font-bold text-black">Additional Request {index + 1}</h5>
                        <button
                          onClick={() => removeReceptionRequest(index + 2)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-all"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">Song Title</label>
                <input 
                  type="text" 
                            value={request.title}
                            onChange={(e) => updateReceptionRequest(index + 2, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter song title"
                />
              </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">Artist</label>
                          <input
                            type="text"
                            value={request.artist}
                            onChange={(e) => updateReceptionRequest(index + 2, 'artist', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter artist name"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-black mb-2">Notes (Optional)</label>
                          <input
                            type="text"
                            value={request.notes}
                            onChange={(e) => updateReceptionRequest(index + 2, 'notes', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Any special notes or requests"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {receptionRequests.length < 7 && (
                    <button
                      onClick={addReceptionRequest}
                      className="w-full py-3 border-2 border-dashed border-purple-400 rounded text-purple-600 hover:border-purple-500 hover:text-purple-700 transition-all"
                    >
                      + Add Additional Request
                    </button>
                  )}
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-black mb-4">Playlist Links</h3>
                  <p className="text-sm text-gray-600 mb-4">Add any playlist links for your reception</p>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-black mb-2">Dinner Playlist (Required)</label>
                    <input
                      type="url"
                      value={dinnerPlaylist}
                      onChange={(e) => setDinnerPlaylist(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://spotify.com/playlist/..."
                      required
                    />
                <input 
                  type="text" 
                      value={dinnerPlaylistNotes}
                      onChange={(e) => setDinnerPlaylistNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 mt-2"
                      placeholder="Notes about your dinner playlist"
                />
              </div>

                  {playlistLinks.map((playlist, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded border-2 border-gray-200 mb-4">
                      <div className="flex justify-between items-start mb-4">
                        <h5 className="text-lg font-bold text-black">Playlist {index + 1}</h5>
                        <button
                          onClick={() => removePlaylistLink(index)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-all"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">Playlist Type</label>
                          <select
                            value={playlist.type}
                            onChange={(e) => updatePlaylistLink(index, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="">Select type</option>
                            <option value="dancing">Dancing</option>
                            <option value="background">Background</option>
                            <option value="slow">Slow</option>
                            <option value="party">Party</option>
                            <option value="general">General</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">URL</label>
                          <input
                            type="url"
                            value={playlist.url}
                            onChange={(e) => updatePlaylistLink(index, 'url', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="https://spotify.com/playlist/..."
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-black mb-2">Notes (Optional)</label>
                <input 
                  type="text" 
                            value={playlist.notes}
                            onChange={(e) => updatePlaylistLink(index, 'notes', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Any special notes or requests"
                />
              </div>
            </div>
          </div>
                  ))}
                  
                  <button
                    onClick={addPlaylistLink}
                    className="w-full py-3 border-2 border-dashed border-purple-400 rounded text-purple-600 hover:border-purple-500 hover:text-purple-700 transition-all"
                  >
                    + Add Playlist
                  </button>
                </div>
              </div>
            )}

            {/* Repertoire Tab */}
            {receptionTab === 'repertoire' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-black mb-4">THC Song List</h3>
                  <p className="text-sm text-gray-600 mb-4">Choose from our curated selection of reception songs</p>
                  
                  {/* Song Progress Tracker */}
                  <div className="bg-white p-4 rounded border-2 border-gray-200 mb-6">
                    <h4 className="text-lg font-bold text-black mb-4">🎵 Song Progress</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 p-4 rounded border-2 border-green-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-green-700">Definitely Play!</span>
                          <span className="text-lg font-bold text-green-700">{songCounts.definitely}</span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((songCounts.definitely / 20) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-green-600 mt-1">Goal: 15-20 songs</p>
              </div>

                      <div className="bg-yellow-50 p-4 rounded border-2 border-yellow-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-yellow-700">If The Mood Is Right..</span>
                          <span className="text-lg font-bold text-yellow-700">{songCounts.maybe}</span>
                        </div>
                        <div className="w-full bg-yellow-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((songCounts.maybe / 15) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-yellow-600 mt-1">Goal: 10-15 songs</p>
              </div>

                      <div className="bg-red-50 p-4 rounded border-2 border-red-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-red-700">Avoid Playing</span>
                          <span className="text-lg font-bold text-red-700">{songCounts.avoid}</span>
                        </div>
                        <div className="w-full bg-red-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((songCounts.avoid / 10) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-red-600 mt-1">Goal: 5-10 songs</p>
                      </div>
                    </div>
              </div>

                  {/* Genre Tabs */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {songsData && Object.keys(songsData).map((genre) => (
                        <button
                          key={genre}
                          onClick={() => setActiveGenre(genre)}
                          className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                            activeGenre === genre 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {genre === 'pop' && '🎤 Pop'}
                          {genre === 'soul' && '🎵 Soul/R&B'}
                          {genre === 'rock' && '🎸 Rock'}
                          {genre === 'hiphop' && '🎤 Hip-Hop'}
                          {genre === 'disco' && '💃 Disco'}
                          {genre === 'punk' && '🎸 Pop Punk'}
                          {genre === 'country' && '🤠 Country'}
                          {genre === 'latin' && '🌶️ Latin'}
                          {genre === 'ballads' && '💕 Ballads'}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Song List */}
                  <div className="space-y-2">
                    {songsData && songsData[activeGenre] && songsData[activeGenre].map((song: any, index: number) => (
                      <SongRow
                        key={index}
                        song={song.song}
                        artist={song.artist}
                        videoUrl={song.videoUrl}
                        prefKey={`reception-${activeGenre}-${index}`}
                        preferences={preferences}
                        setPreferences={setPreferences}
                      />
                    ))}
              </div>
            </div>
          </div>
            )}

            {/* Special Moments Tab */}
            {receptionTab === 'special-moments' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-black mb-4">Special Moments</h3>
                  <p className="text-sm text-gray-600 mb-4">Add any special moments for your reception</p>
                  
                  {receptionSpecialMoments.map((moment, index) => (
                    <SpecialMomentForm
                      key={index}
                      moment={moment}
                      onUpdate={(updatedMoment) => updateReceptionSpecialMoment(index, 'title', updatedMoment.title)}
                      onRemove={() => removeReceptionSpecialMoment(index)}
                    />
                  ))}
                  
                  <button
                    onClick={addReceptionSpecialMoment}
                    className="w-full py-3 border-2 border-dashed border-purple-400 rounded text-purple-600 hover:border-purple-500 hover:text-purple-700 transition-all"
                  >
                    + Add Special Moment
                  </button>
                </div>
              </div>
            )}
        </div>
      )}

        {/* After-Party Tab */}
        {mainTab === 'afterparty' && (
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-8">
            <div className="border-l-4 border-purple-600 pl-4 mb-8">
              <h2 className="text-3xl font-bold text-black">After-Party</h2>
              <p className="text-gray-600 mt-2">Music for your after-party</p>
          </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-black mb-4">Song Requests</h3>
                <p className="text-sm text-gray-600 mb-4">Request any songs you'd like to hear during your after-party. These can be songs from our repertoire that are especially special to you, or songs that are not on our repertoire that you'd like us to play.</p>
                
                {afterpartyRequests.map((request, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded border-2 border-gray-200 mb-4">
                    <div className="flex justify-between items-start mb-4">
                      <h5 className="text-lg font-bold text-black">Request {index + 1}</h5>
                      <button
                        onClick={() => removeAfterpartyRequest(index)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-all"
                      >
                        Remove
                      </button>
        </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">Song Title</label>
                        <input
                          type="text"
                          value={request.title}
                          onChange={(e) => updateAfterpartyRequest(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter song title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">Artist</label>
                        <input
                          type="text"
                          value={request.artist}
                          onChange={(e) => updateAfterpartyRequest(index, 'artist', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter artist name"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-black mb-2">Notes (Optional)</label>
                        <input
                          type="text"
                          value={request.notes}
                          onChange={(e) => updateAfterpartyRequest(index, 'notes', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Any special notes or requests"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {afterpartyRequests.length < 5 && (
                  <button
                    onClick={addAfterpartyRequest}
                    className="w-full py-3 border-2 border-dashed border-purple-400 rounded text-purple-600 hover:border-purple-500 hover:text-purple-700 transition-all"
                  >
                    + Add Request
                  </button>
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-black mb-4">THC Song List</h3>
                <p className="text-sm text-gray-600 mb-4">Choose from our curated selection of after-party songs</p>
                
                {/* Song Progress Tracker */}
                <div className="bg-white p-4 rounded border-2 border-gray-200 mb-6">
                  <h4 className="text-lg font-bold text-black mb-4">🎵 Song Progress</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded border-2 border-green-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-green-700">Definitely Play!</span>
                        <span className="text-lg font-bold text-green-700">{songCounts.definitely}</span>
          </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((songCounts.definitely / 20) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-green-600 mt-1">Goal: 15-20 songs</p>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded border-2 border-yellow-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-yellow-700">If The Mood Is Right..</span>
                        <span className="text-lg font-bold text-yellow-700">{songCounts.maybe}</span>
                      </div>
                      <div className="w-full bg-yellow-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((songCounts.maybe / 15) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-yellow-600 mt-1">Goal: 10-15 songs</p>
                    </div>
                    
                    <div className="bg-red-50 p-4 rounded border-2 border-red-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-red-700">Avoid Playing</span>
                        <span className="text-lg font-bold text-red-700">{songCounts.avoid}</span>
                      </div>
                      <div className="w-full bg-red-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((songCounts.avoid / 10) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-red-600 mt-1">Goal: 5-10 songs</p>
                    </div>
                  </div>
                </div>
                
                {/* Genre Tabs */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {songsData && Object.keys(songsData).map((genre) => (
                      <button
                        key={genre}
                        onClick={() => setActiveGenre(genre)}
                        className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                          activeGenre === genre 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {genre === 'pop' && '🎤 Pop'}
                        {genre === 'soul' && '🎵 Soul/R&B'}
                        {genre === 'rock' && '🎸 Rock'}
                        {genre === 'hiphop' && '🎤 Hip-Hop'}
                        {genre === 'disco' && '💃 Disco'}
                        {genre === 'punk' && '🎸 Pop Punk'}
                        {genre === 'country' && '🤠 Country'}
                        {genre === 'latin' && '🌶️ Latin'}
                        {genre === 'ballads' && '💕 Ballads'}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Song List */}
                <div className="space-y-2">
                  {songsData && songsData[activeGenre] && songsData[activeGenre].map((song: any, index: number) => (
                    <SongRow
                      key={index}
                      song={song.song}
                      artist={song.artist}
                      videoUrl={song.videoUrl}
                      prefKey={`afterparty-${activeGenre}-${index}`}
                      preferences={preferences}
                      setPreferences={setPreferences}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-black mb-4">Playlist Links</h3>
                <p className="text-sm text-gray-600 mb-4">Add any playlist links for your after-party</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">After-Party Playlist (Optional)</label>
                    <input
                      type="url"
                      value={afterpartyPlaylist}
                      onChange={(e) => setAfterpartyPlaylist(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://spotify.com/playlist/..."
                    />
                  </div>
                </div>
              </div>
            </div>
        </div>
      )}

        {/* Vendor Recommendations Tab */}
        {mainTab === 'vendor-recommendations' && (
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-8">
            <div className="border-l-4 border-purple-600 pl-4 mb-6">
              <h2 className="text-3xl font-bold text-black">Vendor Recommendations</h2>
              <p className="text-gray-600 mt-2">Trusted wedding professionals we love working with</p>
          </div>
            
            <div className="space-y-8">
              {/* Wedding Planners */}
              <div>
                <h3 className="text-2xl font-bold text-black mb-4">📋 Wedding Planners</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                    <h4 className="font-bold text-black">Sarah Johnson Events</h4>
                    <p className="text-sm text-gray-600 mb-2">Full-service wedding planning with attention to detail</p>
                    <a href="https://sarahjohnsonevents.com" className="text-purple-600 hover:text-purple-700 text-sm">Visit Website</a>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                    <h4 className="font-bold text-black">Elegant Affairs</h4>
                    <p className="text-sm text-gray-600 mb-2">Luxury wedding planning and coordination</p>
                    <a href="https://elegantaffairs.com" className="text-purple-600 hover:text-purple-700 text-sm">Visit Website</a>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                    <h4 className="font-bold text-black">Dream Day Planning</h4>
                    <p className="text-sm text-gray-600 mb-2">Personalized wedding planning services</p>
                    <a href="https://dreamdayplanning.com" className="text-purple-600 hover:text-purple-700 text-sm">Visit Website</a>
                  </div>
                </div>
              </div>
              
              {/* Photography */}
              <div>
                <h3 className="text-2xl font-bold text-black mb-4">📸 Photography</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                    <h4 className="font-bold text-black">Michael Chen Photography</h4>
                    <p className="text-sm text-gray-600 mb-2">Award-winning wedding photography</p>
                    <a href="https://michaelchenphoto.com" className="text-purple-600 hover:text-purple-700 text-sm">Visit Website</a>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                    <h4 className="font-bold text-black">Emma Rodriguez Studios</h4>
                    <p className="text-sm text-gray-600 mb-2">Artistic and romantic wedding photography</p>
                    <a href="https://emmarodriguezstudios.com" className="text-purple-600 hover:text-purple-700 text-sm">Visit Website</a>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                    <h4 className="font-bold text-black">Golden Hour Photography</h4>
                    <p className="text-sm text-gray-600 mb-2">Natural light wedding photography</p>
                    <a href="https://goldenhourphoto.com" className="text-purple-600 hover:text-purple-700 text-sm">Visit Website</a>
                  </div>
                </div>
              </div>
              
              {/* Videography */}
              <div>
                <h3 className="text-2xl font-bold text-black mb-4">📹 Videography</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded border-2 border-purple-300">
                    <h4 className="font-bold text-black">The Hook Club</h4>
                    <p className="text-sm text-gray-600 mb-2">Professional wedding videography and music production</p>
                    <a href="https://thehookclub.com" className="text-purple-600 hover:text-purple-700 text-sm font-bold">Visit Website</a>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                    <h4 className="font-bold text-black">Cinematic Moments</h4>
                    <p className="text-sm text-gray-600 mb-2">Cinematic wedding films and highlights</p>
                    <a href="https://cinematicmoments.com" className="text-purple-600 hover:text-purple-700 text-sm">Visit Website</a>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                    <h4 className="font-bold text-black">Love Story Films</h4>
                    <p className="text-sm text-gray-600 mb-2">Emotional wedding storytelling</p>
                    <a href="https://lovestoryfilms.com" className="text-purple-600 hover:text-purple-700 text-sm">Visit Website</a>
                  </div>
                </div>
              </div>
              
              {/* Photo Booth */}
              <div>
                <h3 className="text-2xl font-bold text-black mb-4">🖼️ Photo Booth</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                    <h4 className="font-bold text-black">Snap & Smile</h4>
                    <p className="text-sm text-gray-600 mb-2">Interactive photo booth experiences</p>
                    <a href="https://snapandsmile.com" className="text-purple-600 hover:text-purple-700 text-sm">Visit Website</a>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                    <h4 className="font-bold text-black">Memory Lane Booth</h4>
                    <p className="text-sm text-gray-600 mb-2">Vintage-style photo booth rentals</p>
                    <a href="https://memorylanebooth.com" className="text-purple-600 hover:text-purple-700 text-sm">Visit Website</a>
                  </div>
                </div>
              </div>
              
              {/* Catering */}
              <div>
                <h3 className="text-2xl font-bold text-black mb-4">🍽️ Catering</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                    <h4 className="font-bold text-black">Gourmet Affairs</h4>
                    <p className="text-sm text-gray-600 mb-2">Fine dining wedding catering</p>
                    <a href="https://gourmetaffairs.com" className="text-purple-600 hover:text-purple-700 text-sm">Visit Website</a>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                    <h4 className="font-bold text-black">Farm to Table Catering</h4>
                    <p className="text-sm text-gray-600 mb-2">Local, sustainable wedding cuisine</p>
                    <a href="https://farmtotablecatering.com" className="text-purple-600 hover:text-purple-700 text-sm">Visit Website</a>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                    <h4 className="font-bold text-black">Artisan Kitchen</h4>
                    <p className="text-sm text-gray-600 mb-2">Creative and custom wedding menus</p>
                    <a href="https://artisankitchen.com" className="text-purple-600 hover:text-purple-700 text-sm">Visit Website</a>
                  </div>
                </div>
              </div>
              
              {/* Florist */}
              <div>
                <h3 className="text-2xl font-bold text-black mb-4">🌸 Florist</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                    <h4 className="font-bold text-black">Bloom & Blossom</h4>
                    <p className="text-sm text-gray-600 mb-2">Elegant floral arrangements</p>
                    <a href="https://bloomandblossom.com" className="text-purple-600 hover:text-purple-700 text-sm">Visit Website</a>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                    <h4 className="font-bold text-black">Garden Party Floral</h4>
                    <p className="text-sm text-gray-600 mb-2">Garden-inspired wedding florals</p>
                    <a href="https://gardenpartyfloral.com" className="text-purple-600 hover:text-purple-700 text-sm">Visit Website</a>
                  </div>
                </div>
              </div>
              
              {/* Lighting */}
              <div>
                <h3 className="text-2xl font-bold text-black mb-4">💡 Lighting</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                    <h4 className="font-bold text-black">Ambient Lighting Co.</h4>
                    <p className="text-sm text-gray-600 mb-2">Atmospheric wedding lighting design</p>
                    <a href="https://ambientlighting.com" className="text-purple-600 hover:text-purple-700 text-sm">Visit Website</a>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                    <h4 className="font-bold text-black">Luminous Events</h4>
                    <p className="text-sm text-gray-600 mb-2">Creative lighting installations</p>
                    <a href="https://luminousevents.com" className="text-purple-600 hover:text-purple-700 text-sm">Visit Website</a>
                  </div>
                </div>
              </div>
              
              {/* Staging */}
              <div>
                <h3 className="text-2xl font-bold text-black mb-4">🎭 Staging</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                    <h4 className="font-bold text-black">Stage Perfect</h4>
                    <p className="text-sm text-gray-600 mb-2">Professional wedding staging and setup</p>
                    <a href="https://stageperfect.com" className="text-purple-600 hover:text-purple-700 text-sm">Visit Website</a>
                  </div>
                </div>
              </div>
              
              {/* Makeup */}
              <div>
                <h3 className="text-2xl font-bold text-black mb-4">💄 Makeup</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                    <h4 className="font-bold text-black">Glamour Studio</h4>
                    <p className="text-sm text-gray-600 mb-2">Professional wedding makeup artistry</p>
                    <a href="https://glamourstudio.com" className="text-purple-600 hover:text-purple-700 text-sm">Visit Website</a>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                    <h4 className="font-bold text-black">Beauty by Design</h4>
                    <p className="text-sm text-gray-600 mb-2">Natural and elegant wedding looks</p>
                    <a href="https://beautybydesign.com" className="text-purple-600 hover:text-purple-700 text-sm">Visit Website</a>
                  </div>
                </div>
              </div>
            </div>
        </div>
      )}

        {/* Band Prep Tab */}
        {mainTab === 'band-prep' && (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-8">
            <div className="border-l-4 border-purple-600 pl-4 mb-8">
              <h2 className="text-3xl font-bold text-black">Band Prep</h2>
              <p className="text-gray-600 mt-2">Admin panel for managing songs and genres</p>
            </div>
            
          <div className="mb-6">
              <div className="bg-gray-100 rounded-lg p-2">
              <div className="flex gap-2">
                <button
                    onClick={() => setBandPrepTab('dashboard')}
                    className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                      bandPrepTab === 'dashboard' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-transparent text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Dashboard
                </button>
                <button
                    onClick={() => setBandPrepTab('database')}
                    className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                      bandPrepTab === 'database' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-transparent text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Songs Database
                </button>
                <button
                    onClick={() => setBandPrepTab('genres')}
                    className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                      bandPrepTab === 'genres' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-transparent text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Genre Management
                </button>
              </div>
            </div>
          </div>

                {/* Dashboard Tab */}
                {bandPrepTab === 'dashboard' && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded border-2 border-blue-200 mb-4">
                      <h3 className="text-lg font-bold text-blue-700">Band Prep Dashboard</h3>
                      <p className="text-sm text-blue-600">Welcome to the admin panel for managing songs and genres</p>
                      {!fullSongsData && (
                        <p className="text-xs text-red-600 mt-2">⚠️ Loading song data...</p>
                      )}
                      <p className="text-xs text-green-600 mt-2">✅ Modal is working! Dashboard content loaded.</p>
                      <div className="mt-4">
                        <label className="block text-sm font-bold text-black mb-2">Test Input Field:</label>
                        <input
                          type="text"
                          placeholder="Type something to test interactivity..."
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          onChange={(e) => console.log('Input changed:', e.target.value)}
                        />
                      </div>
                </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded border-2 border-gray-200">
                        <h3 className="text-lg font-bold text-black">Total Songs</h3>
                        <p className="text-2xl font-bold text-purple-600">
                          {fullSongsData?.songs?.length || fullSongsData?.metadata?.totalSongs || 0}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded border-2 border-gray-200">
                        <h3 className="text-lg font-bold text-black">Live Songs</h3>
                        <p className="text-2xl font-bold text-green-600">
                          {fullSongsData?.songs?.filter((s: any) => s.isLive).length || fullSongsData?.metadata?.activeSongs || 0}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded border-2 border-gray-200">
                        <h3 className="text-lg font-bold text-black">Inactive Songs</h3>
                        <p className="text-2xl font-bold text-red-600">
                          {fullSongsData?.songs?.filter((s: any) => !s.isLive).length || fullSongsData?.metadata?.inactiveSongs || 0}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded border-2 border-gray-200">
                        <h3 className="text-lg font-bold text-black">Total Genres</h3>
                        <p className="text-2xl font-bold text-blue-600">
                          {fullSongsData?.genres?.length || Object.keys(fullSongsData?.genres || {}).length || 0}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded border-2 border-gray-200">
                      <h4 className="text-lg font-bold text-black mb-2">Quick Actions</h4>
                      <div className="flex flex-wrap gap-2">
                  <button
                          onClick={() => {
                            console.log('Switching to database tab');
                            setBandPrepTab('database');
                          }}
                          className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-all"
                        >
                          View Songs Database
                        </button>
                        <button
                          onClick={() => {
                            console.log('Switching to genres tab');
                            setBandPrepTab('genres');
                          }}
                          className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-all"
                        >
                          Manage Genres
                        </button>
                        <button
                          onClick={() => {
                            console.log('Testing button click');
                            alert('Button is working! Modal is interactive.');
                          }}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-all"
                        >
                          Test Interaction
                  </button>
                </div>
                    </div>
                  </div>
                )}

                {/* Songs Database Tab */}
                {bandPrepTab === 'database' && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <div className="bg-gray-100 rounded-lg p-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setDatabaseTab('dashboard')}
                            className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                              databaseTab === 'dashboard' 
                                ? 'bg-purple-600 text-white' 
                                : 'bg-transparent text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Dashboard
                          </button>
                          <button
                            onClick={() => setDatabaseTab('database')}
                            className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                              databaseTab === 'database' 
                                ? 'bg-purple-600 text-white' 
                                : 'bg-transparent text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Full Database
                          </button>
                        </div>
                      </div>
                </div>

                    {databaseTab === 'dashboard' && (
                <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-white p-4 rounded border-2 border-gray-200">
                            <h3 className="text-lg font-bold text-black">Total Songs</h3>
                            <p className="text-2xl font-bold text-purple-600">{fullSongsData?.metadata?.totalSongs || 0}</p>
                  </div>
                          <div className="bg-white p-4 rounded border-2 border-gray-200">
                            <h3 className="text-lg font-bold text-black">Live Songs</h3>
                            <p className="text-2xl font-bold text-green-600">{fullSongsData?.metadata?.activeSongs || 0}</p>
                  </div>
                          <div className="bg-white p-4 rounded border-2 border-gray-200">
                            <h3 className="text-lg font-bold text-black">Inactive Songs</h3>
                            <p className="text-2xl font-bold text-red-600">{fullSongsData?.metadata?.inactiveSongs || 0}</p>
                  </div>
                          <div className="bg-white p-4 rounded border-2 border-gray-200">
                            <h3 className="text-lg font-bold text-black">Total Genres</h3>
                            <p className="text-2xl font-bold text-blue-600">{Object.keys(fullSongsData?.genres || {}).length}</p>
                </div>
                        </div>
                      </div>
                    )}

                    {databaseTab === 'database' && (
                      <div className="space-y-6">
                        <div className="flex flex-wrap gap-4 items-center">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSongFilter('all')}
                              className={`px-3 py-1 text-sm rounded transition-all ${
                                songFilter === 'all' 
                                  ? 'bg-purple-600 text-white' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              All Songs
                            </button>
                            <button
                              onClick={() => setSongFilter('live')}
                              className={`px-3 py-1 text-sm rounded transition-all ${
                                songFilter === 'live' 
                                  ? 'bg-purple-600 text-white' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              Live Only
                            </button>
                            <button
                              onClick={() => setSongFilter('inactive')}
                              className={`px-3 py-1 text-sm rounded transition-all ${
                                songFilter === 'inactive' 
                                  ? 'bg-purple-600 text-white' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              Inactive Only
                            </button>
                </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setSongSort('title')}
                              className={`px-3 py-1 text-sm rounded transition-all ${
                                songSort === 'title' 
                                  ? 'bg-purple-600 text-white' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              Sort by Title
                            </button>
                            <button
                              onClick={() => setSongSort('artist')}
                              className={`px-3 py-1 text-sm rounded transition-all ${
                                songSort === 'artist' 
                                  ? 'bg-purple-600 text-white' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              Sort by Artist
                            </button>
                    </div>
                          
                          <div className="flex-1">
                            <input
                              type="text"
                              value={songSearch}
                              onChange={(e) => setSongSearch(e.target.value)}
                              className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Search songs..."
                            />
                  </div>
                </div>

                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-300">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Song Title</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Artist</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Live</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {fullSongsData?.songs
                                ?.filter((song: any) => {
                                  if (songFilter === 'live') return song.isLive;
                                  if (songFilter === 'inactive') return !song.isLive;
                                  return true;
                                })
                                ?.filter((song: any) => {
                                  if (!songSearch) return true;
                                  const searchTerm = songSearch.toLowerCase();
                                  return (song.thcTitle || song.originalTitle).toLowerCase().includes(searchTerm) ||
                                         (song.thcArtist || song.originalArtist).toLowerCase().includes(searchTerm);
                                })
                                ?.sort((a: any, b: any) => {
                                  if (songSort === 'title') {
                                    return (a.thcTitle || a.originalTitle).localeCompare(b.thcTitle || b.originalTitle);
                                  } else {
                                    return (a.thcArtist || a.originalArtist).localeCompare(b.thcArtist || b.originalArtist);
                                  }
                                })
                                ?.map((song: any, index: number) => (
                                <tr key={song.id} className="hover:bg-gray-50">
                                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                  <td className="border border-gray-300 px-4 py-2">{song.thcTitle || song.originalTitle}</td>
                                  <td className="border border-gray-300 px-4 py-2">{song.thcArtist || song.originalArtist}</td>
                                  <td className="border border-gray-300 px-4 py-2">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                      song.isLive 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                      {song.isLive ? 'Live' : 'Inactive'}
                                    </span>
                                  </td>
                                  <td className="border border-gray-300 px-4 py-2">
                      <button
                                      onClick={() => handleEditSong(song)}
                                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-all"
                      >
                                      Edit
                      </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        </div>
                      )}
                  </div>
                )}

                {/* Genre Management Tab */}
                {bandPrepTab === 'genres' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-black mb-4">Genre Status Overview</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {fullSongsData?.genres && Object.entries(fullSongsData.genres).map(([key, genre]: [string, any]) => (
                          <div key={key} className="bg-white p-4 rounded border-2 border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-bold text-black">{genre.title}</h4>
                              <span className={`px-2 py-1 rounded text-xs ${
                                genre.isActive 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {genre.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{genre.description}</p>
                            <p className="text-xs text-gray-500">
                              {fullSongsData.songs.filter((song: any) => song.genre === key).length} songs
                            </p>
                    </div>
                  ))}
                </div>
                    </div>
                  </div>
            )}
          </div>
        )}

        {/* Music Summary Tab */}
        {mainTab === 'summary' && (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-8">
            <div className="border-l-4 border-purple-600 pl-4 mb-8">
              <h2 className="text-3xl font-bold text-black">Music Summary</h2>
              <p className="text-gray-600 mt-2">Overview of your music selections and progress</p>
            </div>
            
            <div className="space-y-8">
              {/* Song Progress Tracker */}
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                <h3 className="text-xl font-bold text-black mb-4">🎵 Song Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                    <h4 className="font-bold text-green-700 mb-2">Definitely Play</h4>
                    <div className="text-2xl font-bold text-green-600 mb-2">1/∞</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Goal: 25-50 songs</p>
                    <p className="text-sm text-yellow-600">⚠️ Need more songs</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                    <h4 className="font-bold text-yellow-700 mb-2">If Mood Is Right</h4>
                    <div className="text-2xl font-bold text-yellow-600 mb-2">1/∞</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Goal: ≥25 songs</p>
                    <p className="text-sm text-yellow-600">⚠️ Need more songs</p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                    <h4 className="font-bold text-red-700 mb-2">Avoid Playing</h4>
                    <div className="text-2xl font-bold text-red-600 mb-2">1/∞</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Goal: ≤50 songs</p>
                  </div>
                </div>
              </div>

              {/* Genre Breakdown */}
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                <h3 className="text-xl font-bold text-black mb-4">Genre Breakdown</h3>
                <div className="grid grid-cols-3 md:grid-cols-9 gap-4">
                  <div className="text-center">
                    <div className="bg-purple-500 h-16 w-8 mx-auto rounded-t"></div>
                    <p className="text-sm font-bold text-black mt-2">Pop</p>
                    <p className="text-xs text-gray-600">5</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-500 h-12 w-8 mx-auto rounded-t"></div>
                    <p className="text-sm font-bold text-black mt-2">Soul/R&B</p>
                    <p className="text-xs text-gray-600">3</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-red-500 h-20 w-8 mx-auto rounded-t"></div>
                    <p className="text-sm font-bold text-black mt-2">Rock</p>
                    <p className="text-xs text-gray-600">8</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-500 h-8 w-8 mx-auto rounded-t"></div>
                    <p className="text-sm font-bold text-black mt-2">Hip-Hop</p>
                    <p className="text-xs text-gray-600">2</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-500 h-24 w-8 mx-auto rounded-t"></div>
                    <p className="text-sm font-bold text-black mt-2">Disco</p>
                    <p className="text-xs text-gray-600">12</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-500 h-4 w-8 mx-auto rounded-t"></div>
                    <p className="text-sm font-bold text-black mt-2">Pop Punk</p>
                    <p className="text-xs text-gray-600">1</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-500 h-8 w-8 mx-auto rounded-t"></div>
                    <p className="text-sm font-bold text-black mt-2">Country</p>
                    <p className="text-xs text-gray-600">2</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-red-500 h-12 w-8 mx-auto rounded-t"></div>
                    <p className="text-sm font-bold text-black mt-2">Latin</p>
                    <p className="text-xs text-gray-600">3</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-500 h-16 w-8 mx-auto rounded-t"></div>
                    <p className="text-sm font-bold text-black mt-2">Ballads</p>
                    <p className="text-xs text-gray-600">4</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}