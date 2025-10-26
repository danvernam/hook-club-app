'use client';

import { useState, useEffect } from 'react';
import SongsDatabase from '@/components/SongsDatabase/SongsDatabase';
import apiService from '@/services/api';

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState<'services' | 'getting-to-know-you' | 'preferences' | 'documents' | 'welcome-party' | 'ceremony' | 'cocktail-hour' | 'reception' | 'after-party'>('services');
  const [activeView, setActiveView] = useState<'client-portal' | 'database'>('client-portal');
  const [activeWelcomePartyTab, setActiveWelcomePartyTab] = useState<'special-songs' | 'special-requests' | 'core-repertoire'>('core-repertoire');
  const [activeCeremonyTab, setActiveCeremonyTab] = useState<'ceremony-music' | 'guest-arrival-requests' | 'guest-arrival'>('guest-arrival');
  const [activeCocktailHourTab, setActiveCocktailHourTab] = useState<'special-songs' | 'song-requests' | 'cocktail-hour-song-list'>('cocktail-hour-song-list');
  const [activeAfterPartyTab, setActiveAfterPartyTab] = useState<'special-songs' | 'special-requests' | 'core-repertoire'>('core-repertoire');
  const [activeReceptionTab, setActiveReceptionTab] = useState<'special-songs' | 'special-requests' | 'reception-song-list'>('reception-song-list');
  const [guestArrivalSongs, setGuestArrivalSongs] = useState<any[]>([]);
  const [sortedGuestArrivalSongs, setSortedGuestArrivalSongs] = useState<any[]>([]);
  const [guestArrivalSongPreferences, setGuestArrivalSongPreferences] = useState<Record<string, 'definitely' | 'maybe' | 'avoid'>>({});
  const [isLoadingGuestArrival, setIsLoadingGuestArrival] = useState(false);
  const [ceremonySongs, setCeremonySongs] = useState<Array<{
    ceremonyMomentType: string;
    clientSongTitle: string;
    clientArtist: string;
    clientLink: string;
    clientNote: string;
    processionalWalkers?: string;
  }>>([]);
  const [guestArrivalRequests, setGuestArrivalRequests] = useState<Array<{
    clientSongTitle: string;
    clientArtist: string;
    clientLink: string;
    clientNote: string;
  }>>([]);
  const [cocktailHourRequests, setCocktailHourRequests] = useState<Array<{
    clientSongTitle: string;
    clientArtist: string;
    clientLink: string;
    clientNote: string;
  }>>([]);
  const [cocktailHourSpecialMoments, setCocktailHourSpecialMoments] = useState<Array<{
    specialMomentType: string;
    clientSongTitle: string;
    clientArtist: string;
    clientLink: string;
    clientNote: string;
    reason?: string;
  }>>([]);
  const [afterPartySpecialMoments, setAfterPartySpecialMoments] = useState<Array<{
    specialMomentType: string;
    clientSongTitle: string;
    clientArtist: string;
    clientLink: string;
    clientNote: string;
    reason?: string;
  }>>([]);
  const [afterPartySpecialRequests, setAfterPartySpecialRequests] = useState<Array<{
    clientSongTitle: string;
    clientArtist: string;
    clientLink: string;
    clientNote: string;
  }>>([]);
  const [afterPartySongs, setAfterPartySongs] = useState<any[]>([]);
  const [sortedAfterPartySongs, setSortedAfterPartySongs] = useState<any[]>([]);
  const [afterPartySongPreferences, setAfterPartySongPreferences] = useState<Record<string, 'definitely' | 'maybe' | 'avoid'>>({});
  const [isLoadingAfterParty, setIsLoadingAfterParty] = useState(false);
  const [receptionSpecialMoments, setReceptionSpecialMoments] = useState<Array<{
    specialMomentType: string;
    clientSongTitle: string;
    clientArtist: string;
    clientLink: string;
    clientNote: string;
    reason?: string;
  }>>([]);
  const [receptionSpecialRequests, setReceptionSpecialRequests] = useState<Array<{
    clientSongTitle: string;
    clientArtist: string;
    clientLink: string;
    clientNote: string;
  }>>([]);
  const [receptionSongs, setReceptionSongs] = useState<any[]>([]);
  const [sortedReceptionSongs, setSortedReceptionSongs] = useState<any[]>([]);
  const [receptionSongPreferences, setReceptionSongPreferences] = useState<Record<string, 'definitely' | 'maybe' | 'avoid'>>({});
  const [isLoadingReception, setIsLoadingReception] = useState(false);
  const [expandedReceptionGenres, setExpandedReceptionGenres] = useState<Record<string, boolean>>({});
  const [selectedStageLook, setSelectedStageLook] = useState<string>('');
  const [selectedWashLighting, setSelectedWashLighting] = useState<string>('');
  const [selectedUplightingColor, setSelectedUplightingColor] = useState<string>('');
  const [selectedUplightingBehavior, setSelectedUplightingBehavior] = useState<string>('');
  const [selectedHaze, setSelectedHaze] = useState<string>('');
  const [documentType, setDocumentType] = useState<string>('');
  const [selectedWardrobe, setSelectedWardrobe] = useState<string>('');
  const [cocktailHourSongs, setCocktailHourSongs] = useState<any[]>([]);
  const [sortedCocktailHourSongs, setSortedCocktailHourSongs] = useState<any[]>([]);
  const [cocktailHourSongPreferences, setCocktailHourSongPreferences] = useState<Record<string, 'definitely' | 'maybe' | 'avoid'>>({});
  const [isLoadingCocktailHour, setIsLoadingCocktailHour] = useState(false);
  const [welcomePartySpecialRequests, setWelcomePartySpecialRequests] = useState<Array<{
    clientSongTitle: string;
    clientArtist: string;
    clientLink: string;
    clientNote: string;
    // Future fields for database matching:
    // matchedSongId?: string;
    // isInDatabase?: boolean;
    // databaseMatch?: {
    //   thcTitle: string;
    //   thcArtist: string;
    //   originalTitle: string;
    //   originalArtist: string;
    // };
  }>>([]);
  const [welcomePartySpecialMoments, setWelcomePartySpecialMoments] = useState<Array<{
    specialMomentType: string;
    clientSongTitle: string;
    clientArtist: string;
    clientLink: string;
    clientNote: string;
    reason?: string;
    // Future fields for database matching:
    // matchedSongId?: string;
    // isInDatabase?: boolean;
  }>>([]);
  const [welcomePartyPlaylists, setWelcomePartyPlaylists] = useState<Array<{
    playlistType: string;
    playlistLink: string;
    playlistNote: string;
  }>>([]);
  const [expandedRecommendations, setExpandedRecommendations] = useState<Record<number, boolean>>({});
  const [expandedCeremonyRecommendations, setExpandedCeremonyRecommendations] = useState<Record<number, boolean>>({});
  
  // Missing state variables
  const [receptionRequests, setReceptionRequests] = useState<Array<{
    clientSongTitle: string;
    clientArtist: string;
    clientLink: string;
    clientNote: string;
  }>>([]);
  
  const [dinnerPlaylist, setDinnerPlaylist] = useState<string>('');
  const [dinnerPlaylistNotes, setDinnerPlaylistNotes] = useState<string>('');
  const [playlistLinks, setPlaylistLinks] = useState<Array<{
    title: string;
    url: string;
  }>>([]);
  const [songsData, setSongsData] = useState<any>(null);
  
  // Load songs data for special moment recommendations and song lists
  useEffect(() => {
    const loadSongs = async () => {
      try {
        const data = await apiService.getSongs();
        setSongsData(data);
        setSongs(data.songs || []);
        
        // Sort songs by artist A-Z for the welcome party tab
        const sorted = [...(data.songs || [])].sort((a, b) => 
          (a.originalArtist || '').localeCompare(b.originalArtist || '')
        );
        setSortedSongs(sorted);
      } catch (error) {
        console.error('Error loading songs:', error);
        setSongs([]);
        setSortedSongs([]);
      }
    };
    loadSongs();
  }, []);
  
  // Form fields (no auto-save)
  const [howDidYouFindUs, setHowDidYouFindUs] = useState<string>('');
  const [whereDoYouLive, setWhereDoYouLive] = useState<string>('');
  const [whereAreYouFrom, setWhereAreYouFrom] = useState<string>('');
  const [whatDoYouDo, setWhatDoYouDo] = useState<string>('');
  const [whatDoesYourPartnerDo, setWhatDoesYourPartnerDo] = useState<string>('');
  const [howDidYouMeet, setHowDidYouMeet] = useState<string>('');
  const [favoriteMemory, setFavoriteMemory] = useState<string>('');
  const [whatMakesYouLaugh, setWhatMakesYouLaugh] = useState<string>('');
  const [favoriteThingAboutPartner, setFavoriteThingAboutPartner] = useState<string>('');
  const [whatAreYouMostExcitedAbout, setWhatAreYouMostExcitedAbout] = useState<string>('');
  const [anythingElse, setAnythingElse] = useState<string>('');
  
  // Ceremony moment types
  const ceremonyMomentTypes = [
    'Ceremony Processional',
    'Ceremony Recessional'
  ];
  
  // Core Repertoire state
  const [songs, setSongs] = useState<any[]>([]);
  const [sortedSongs, setSortedSongs] = useState<any[]>([]);
  const [songPreferences, setSongPreferences] = useState<Record<string, 'definitely' | 'maybe' | 'avoid'>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Filter songs for Welcome Party (only show songs tagged with welcome party genres)
  const filteredWelcomePartySongs = songs.filter(song => 
    song.genres && song.genres.some((genre: any) => 
      ['pop', 'disco', 'soul', 'rock', 'country', 'hip hop', 'r&b', 'jazz', 'folk', 'indie', 'alternative', 'punk'].includes((genre.band || '').toLowerCase())
    )
  );

  // Filter songs for Guest Arrival (only show songs tagged with Guest Entrance genre)
  const filteredGuestArrivalSongs = songs.filter(song => 
    song.genres && song.genres.some((genre: any) => 
      (genre.client || '').toLowerCase().includes('guest entrance') ||
      (genre.band || '').toLowerCase().includes('guest entrance')
    )
  );

  // Filter songs for Cocktail Hour (only show songs tagged with cocktail hour genres)
  const filteredCocktailHourSongs = songs.filter(song => 
    song.genres && song.genres.some((genre: any) => 
      ['jazz', 'soul', 'r&b', 'lounge', 'acoustic'].includes((genre.band || '').toLowerCase())
    )
  );

  // Filter songs for After Party (only show songs tagged with after party genres)
  const filteredAfterPartySongs = songs.filter(song => 
    song.genres && song.genres.some((genre: any) => 
      ['pop', 'disco', 'hip hop', 'rock', 'electronic'].includes((genre.band || '').toLowerCase())
    )
  );

  // Filter songs for Reception (only show songs tagged with reception genres)
  const filteredReceptionSongs = songs.filter(song => 
    song.genres && song.genres.some((genre: any) => 
      ['pop', 'disco', 'soul', 'rock', 'country', 'hip hop', 'r&b', 'jazz', 'folk', 'indie', 'alternative', 'punk'].includes((genre.band || '').toLowerCase())
    )
  );

  // Filter songs for Dinner Entertainment (only show songs tagged with Dinner Entertainment genre)
  const filteredDinnerEntertainmentSongs = songs.filter(song => 
    song.genres && song.genres.some((genre: any) => 
      (genre.client || '').toLowerCase().includes('dinner entertainment') ||
      (genre.band || '').toLowerCase().includes('dinner entertainment')
    )
  );

  // Count total songs available in Reception genres
  const totalReceptionSongs = songs.filter(song => 
    song.genres && song.genres.some((g: any) => 
      ['pop', 'disco', 'soul', 'rock', 'country', 'hip hop', 'r&b', 'jazz', 'folk', 'indie', 'alternative', 'punk'].includes(g.band)
    )
  ).length;

  // Get recommended songs from database based on special moment type
  const getRecommendedSongs = (momentType: string) => {
    if (!songsData || !songsData.songs) return [];
    
    return songsData.songs
      .filter((song: any) => 
        song.specialMomentRecommendations && 
        song.specialMomentRecommendations.includes(momentType)
      )
      .map((song: any) => ({
        title: song.originalTitle,
        artist: song.originalArtist,
        videoUrl: song.videoUrl || ''
      }));
  };

  // Section-specific special moment types
  const getSpecialMomentTypes = (section: string) => {
    const baseTypes: Record<string, string[]> = {
      'welcome-party': [
        "Grand Finale",
        "Fireworks Song",
        "Fire/Belly Dancer Song"
      ],
      'ceremony': [
        "Ceremony Processional",
        "Ceremony Recessional",
        "Wedding Party Intro",
        "Newlyweds Intro"
      ],
      'cocktail-hour': [
        "Wedding Party Intro",
        "Newlyweds Intro",
        "First Dance",
        "Toast"
      ],
      'reception': [
        "First Dance",
        "Parent Dance",
        "Cake Cutting",
        "Anniversary Dance",
        "Bouquet Toss",
        "Mezinka Dance",
        "Tea Ceremony",
        "Tarantella",
        "Goldun",
        "Money Spray",
        "Money Dance"
      ],
      'after-party': [
        "Grand Finale",
        "Fireworks Song",
        "Fire/Belly Dancer Song",
        "Sparkler Sendoff"
      ]
    };
    
    const sectionTypes = baseTypes[section] || [];
    return [...sectionTypes, "Custom"];
  };

  // Reception genres for organizing songs
  const receptionGenres = [
    { client: "💯 Cream Of The Pop", band: "pop" },
    { client: "🎷 Souled Out", band: "soul" },
    { client: "🎸 Rock Of Ages", band: "rock" },
    { client: "🎧 Can't Stop Hip Hop", band: "hip hop" },
    { client: "🕺 Studio '25", band: "disco" },
    { client: "🤘 Instant Mosh", band: "punk" },
    { client: "🤠 Country For All", band: "country" },
    { client: "🔥 The Latin Bible", band: "latin" },
    { client: "🎶 Slow Jams", band: "slowjams" },
    { client: "🚪 Guest Entrance", band: "entrance" },
    { client: "🍽️ Dinner Entertainment", band: "dinner" }
  ];

  // Playlist types for request playlists
  const playlistTypes = [
    "Dancing Requests",
    "Guest Entrance", 
    "Dinner",
    "Salads",
    "Cultural Music"
  ];

  // Save only essential client data to API (song feedback)
  const saveClientData = async () => {
    try {
      const clientData = {
        guestArrivalSongPreferences
      };
      
      await apiService.updateClientData('default', clientData);
    } catch (error) {
      console.error('Error saving client data:', error);
    }
  };

  // Load client data from API
  useEffect(() => {
    const loadClientData = async () => {
      try {
        const data = await apiService.getClientData('default');
        // Load only essential data (song feedback)
        if (data.guestArrivalSongPreferences) setGuestArrivalSongPreferences(data.guestArrivalSongPreferences);
      } catch (error) {
        console.error('Error loading client data:', error);
      }
    };
    
    loadClientData();
  }, []);

  // Auto-save only song feedback data when it changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveClientData();
    }, 1000); // Debounce saves

    return () => clearTimeout(timeoutId);
  }, [
    guestArrivalSongPreferences
  ]);

  // Set loading state when switching to core repertoire tab
  useEffect(() => {
    if (activeWelcomePartyTab === 'core-repertoire') {
      setIsLoading(false); // Songs are already loaded, just set loading to false
    }
  }, [activeWelcomePartyTab]);

  // Load songs for guest arrival song list
  useEffect(() => {
    const loadGuestArrivalSongs = async () => {
      setIsLoadingGuestArrival(true);
      try {
        const data = await apiService.getSongs();
        const songsData = data.songs || [];
        setGuestArrivalSongs(songsData);
        
        // Sort songs by artist A-Z
        const sorted = [...songsData].sort((a, b) => 
          (a.originalArtist || '').localeCompare(b.originalArtist || '')
        );
        setSortedGuestArrivalSongs(sorted);
      } catch (error) {
        console.error('Error loading guest arrival songs:', error);
        setGuestArrivalSongs([]);
        setSortedGuestArrivalSongs([]);
      } finally {
        setIsLoadingGuestArrival(false);
      }
    };

    if (activeCeremonyTab === 'guest-arrival') {
      loadGuestArrivalSongs();
    }
  }, [activeCeremonyTab]);

  // Load songs for cocktail hour song list
  useEffect(() => {
    const loadCocktailHourSongs = async () => {
      setIsLoadingCocktailHour(true);
      try {
        const data = await apiService.getSongs();
        const songsData = data.songs || [];
        setCocktailHourSongs(songsData);
        
        // Sort songs by artist A-Z
        const sorted = [...songsData].sort((a, b) => 
          (a.originalArtist || '').localeCompare(b.originalArtist || '')
        );
        setSortedCocktailHourSongs(sorted);
      } catch (error) {
        console.error('Error loading cocktail hour songs:', error);
        setCocktailHourSongs([]);
        setSortedCocktailHourSongs([]);
      } finally {
        setIsLoadingCocktailHour(false);
      }
    };

    if (activeCocktailHourTab === 'cocktail-hour-song-list') {
      loadCocktailHourSongs();
    }
  }, [activeCocktailHourTab]);

  // Load songs for after party song list
  useEffect(() => {
    const loadAfterPartySongs = async () => {
      setIsLoadingAfterParty(true);
      try {
        const data = await apiService.getSongs();
        const songsData = data.songs || [];
        setAfterPartySongs(songsData);
        
        // Sort songs by artist A-Z
        const sorted = [...songsData].sort((a, b) => 
          (a.originalArtist || '').localeCompare(b.originalArtist || '')
        );
        setSortedAfterPartySongs(sorted);
      } catch (error) {
        console.error('Error loading after party songs:', error);
        setAfterPartySongs([]);
        setSortedAfterPartySongs([]);
      } finally {
        setIsLoadingAfterParty(false);
      }
    };

    if (activeAfterPartyTab === 'core-repertoire') {
      loadAfterPartySongs();
    }
  }, [activeAfterPartyTab]);

  // Load songs for reception song list
  useEffect(() => {
    const loadReceptionSongs = async () => {
      setIsLoadingReception(true);
      try {
        const data = await apiService.getSongs();
        const songsData = data.songs || [];
        setReceptionSongs(songsData);
        
        // Sort songs by artist A-Z
        const sorted = [...songsData].sort((a, b) => 
          (a.originalArtist || '').localeCompare(b.originalArtist || '')
        );
        setSortedReceptionSongs(sorted);
      } catch (error) {
        console.error('Error loading reception songs:', error);
        setReceptionSongs([]);
        setSortedReceptionSongs([]);
      } finally {
        setIsLoadingReception(false);
      }
    };

    if (activeReceptionTab === 'reception-song-list') {
      loadReceptionSongs();
    }
  }, [activeReceptionTab]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Header with Hook Club Branding */}
      <div className="bg-white w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hook Club Logo */}
          <div className="text-center mb-8">
            <img 
              src="/hook-club-logo.png" 
              alt="The Hook Club" 
              className="h-24 mx-auto"
            />
          </div>
          
          {/* Planning Portal Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wider">PLANNING PORTAL</h1>
          </div>
          
          {/* Event Details */}
          <div className="text-center mb-8">
            <div className="text-xl font-medium text-gray-800 mb-1">Carrie Bradshaw & Mr. Big • Wedding</div>
            <div className="text-lg text-gray-600">Saturday 4/20/08 • The Plaza Hotel</div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => setActiveView('client-portal')}
              className={`px-6 py-3 text-sm font-medium rounded-md ${
                activeView === 'client-portal'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Planning Portal
            </button>
            <button 
              onClick={() => setActiveView('database')}
              className={`px-6 py-3 text-sm font-medium rounded-md ${
                activeView === 'database'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* Separator Line */}
      <div className="border-t-2 border-gray-300"></div>

      {/* Conditional Content */}
      {activeView === 'database' ? (
        <SongsDatabase />
      ) : (
        <div className="w-full">
          {/* General Info Tabs */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-8">
            <div className="text-center py-1 mb-2">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">General Info</h3>
            </div>
            <div className="bg-white border border-purple-200 rounded-lg p-2">
              <nav className="flex justify-center space-x-12">
                <button
                  onClick={() => setActiveTab('services')}
                  className={`py-6 px-4 border-b-2 font-medium text-base ${
                    activeTab === 'services'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                  }`}
                >
                  Services
                </button>
                <button
                  onClick={() => setActiveTab('getting-to-know-you')}
                  className={`py-6 px-4 border-b-2 font-medium text-base ${
                    activeTab === 'getting-to-know-you'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                  }`}
                >
                  Getting To Know You
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`py-6 px-4 border-b-2 font-medium text-base ${
                    activeTab === 'preferences'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                  }`}
                >
                  Preferences
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`py-6 px-4 border-b-2 font-medium text-base ${
                    activeTab === 'documents'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                  }`}
                >
                  Documents
                </button>
              </nav>
            </div>
          </div>

          {/* Music Planning Tabs */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center py-1 mb-2">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Music Planning</h3>
            </div>
            <div className="bg-white border border-purple-200 rounded-lg p-2">
              <nav className="flex justify-center space-x-8">
                <button
                  onClick={() => setActiveTab('welcome-party')}
                  className={`py-4 px-3 border-b-2 font-medium text-sm ${
                    activeTab === 'welcome-party'
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                  }`}
                >
                  Welcome Party
                </button>
                <button
                  onClick={() => setActiveTab('ceremony')}
                  className={`py-4 px-3 border-b-2 font-medium text-sm ${
                    activeTab === 'ceremony'
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                  }`}
                >
                  Ceremony
                </button>
                <button
                  onClick={() => setActiveTab('cocktail-hour')}
                  className={`py-4 px-3 border-b-2 font-medium text-sm ${
                    activeTab === 'cocktail-hour'
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                  }`}
                >
                  Cocktail Hour
                </button>
                <button
                  onClick={() => setActiveTab('reception')}
                  className={`py-4 px-3 border-b-2 font-medium text-sm ${
                    activeTab === 'reception'
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                  }`}
                >
                  Reception
                </button>
                <button
                  onClick={() => setActiveTab('after-party')}
                  className={`py-4 px-3 border-b-2 font-medium text-sm ${
                    activeTab === 'after-party'
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                  }`}
                >
                  After Party
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            {/* Services Content */}
            {activeTab === 'services' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900">Selected Services</h2>
                
                {/* Entertainment Services */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Entertainment Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-medium text-gray-900">Welcome Party</h4>
                        <p className="text-sm text-gray-600">Folk Band - Violin • Guitar • Bass • Drums</p>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-medium text-gray-900">Ceremony</h4>
                        <p className="text-sm text-gray-600">Piano Trio - Violin • Cello • Piano</p>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-medium text-gray-900">Cocktail Hour</h4>
                        <p className="text-sm text-gray-600">Jazz Quartet - Sax • Guitar • Bass • Drums</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-medium text-gray-900">Reception</h4>
                        <p className="text-sm text-gray-600">15-Piece Full Band - 5 Vocalists • Violin • Trumpet • Sax • Trombone • Guitar • Keyboard • Synths • Bass • Percussion • Drums</p>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-medium text-gray-900">After Party</h4>
                        <p className="text-sm text-gray-600">DJ + Violin + Sax</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Production Services */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Production Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="border-l-4 border-pink-500 pl-4">
                        <h4 className="font-medium text-gray-900">Welcome Party - PA System • Sound Engineer • Toast Mic • Wash Lighting</h4>
                      </div>
                      <div className="border-l-4 border-pink-500 pl-4">
                        <h4 className="font-medium text-gray-900">Ceremony - Musician Amplification • Wireless Mic/Speakers</h4>
                      </div>
                      <div className="border-l-4 border-pink-500 pl-4">
                        <h4 className="font-medium text-gray-900">Cocktail Hour - Musician Amplification</h4>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="border-l-4 border-pink-500 pl-4">
                        <h4 className="font-medium text-gray-900">Reception - PA System • Sound Engineer • Toast Mic • Wash Lighting • Dance Lighting Package</h4>
                      </div>
                      <div className="border-l-4 border-pink-500 pl-4">
                        <h4 className="font-medium text-gray-900">After Party - PA System • Announcement Mic • 10 Uplights</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Getting To Know You Content */}
            {activeTab === 'getting-to-know-you' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Getting To Know You</h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <p className="text-gray-600 mb-6">Help us get to know you better so we can create the perfect musical experience for your special day.</p>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">How Did You Find The Hook Club Originally?</label>
                      <input
                        type="text"
                        value={howDidYouFindUs}
                        onChange={(e) => setHowDidYouFindUs(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Where Do You Live?</label>
                      <input
                        type="text"
                        value={whereDoYouLive}
                        onChange={(e) => setWhereDoYouLive(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Where Are You From Originally?</label>
                      <input
                        type="text"
                        value={whereAreYouFrom}
                        onChange={(e) => setWhereAreYouFrom(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">How Did You Meet?</label>
                      <input
                        type="text"
                        value={howDidYouMeet}
                        onChange={(e) => setHowDidYouMeet(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">When Did You Get Engaged?</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">What Are Your Professions?</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">How Would You Describe Your Guests?</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">What Is Your Vision For The Music?</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Content */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Preferences</h2>
                
                {/* Wardrobe Choice Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Wardrobe Choice</h3>
                  <p className="text-gray-600 mb-6">Select the attire style for The Hook Club at your wedding.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 1. Stylish Cocktail Attire */}
                    <div 
                      onClick={() => setSelectedWardrobe('cocktail')}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedWardrobe === 'cocktail' 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">Stylish Cocktail Attire</h4>
                        <div className="flex items-center space-x-2">
                          {selectedWardrobe === 'cocktail' ? (
                            <span className="text-purple-600">✓</span>
                          ) : (
                            <span className="text-gray-400">☐</span>
                          )}
                          <span className="text-xs text-gray-500">Option 1</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        <div><strong>Masc:</strong> Seasonal colored suits, blazers with dress pants, stylish shirts</div>
                        <div><strong>Femme:</strong> Cocktail dresses in seasonal colors, stylish separates, jumpsuits</div>
                      </div>
                      <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                        View Examples
                      </button>
                    </div>

                    {/* 2. Stylish Black Tie */}
                    <div 
                      onClick={() => setSelectedWardrobe('black-tie')}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedWardrobe === 'black-tie' 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">Stylish Black Tie</h4>
                        <div className="flex items-center space-x-2">
                          {selectedWardrobe === 'black-tie' ? (
                            <span className="text-purple-600">✓</span>
                          ) : (
                            <span className="text-gray-400">☐</span>
                          )}
                          <span className="text-xs text-gray-500">Option 2</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        <div><strong>Masc:</strong> Black suits, skinny black ties</div>
                        <div><strong>Femme:</strong> Black dresses</div>
                      </div>
                      <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                        View Examples
                      </button>
                    </div>

                    {/* 3. Formal Black Tie */}
                    <div 
                      onClick={() => setSelectedWardrobe('formal-black-tie')}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedWardrobe === 'formal-black-tie' 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">Formal Black Tie</h4>
                        <div className="flex items-center space-x-2">
                          {selectedWardrobe === 'formal-black-tie' ? (
                            <span className="text-purple-600">✓</span>
                          ) : (
                            <span className="text-gray-400">☐</span>
                          )}
                          <span className="text-xs text-gray-500">Option 3</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        <div><strong>Masc:</strong> Black tux jackets, black bowties</div>
                        <div><strong>Femme:</strong> Sparkly black dresses</div>
                      </div>
                      <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                        View Examples
                      </button>
                    </div>

                    {/* 4. White Tux Formal */}
                    <div 
                      onClick={() => setSelectedWardrobe('white-tux-formal')}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedWardrobe === 'white-tux-formal' 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">White Tux Formal</h4>
                        <div className="flex items-center space-x-2">
                          {selectedWardrobe === 'white-tux-formal' ? (
                            <span className="text-purple-600">✓</span>
                          ) : (
                            <span className="text-gray-400">☐</span>
                          )}
                          <span className="text-xs text-gray-500">Option 4</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        <div><strong>Masc:</strong> White & black tux jackets, black bowties</div>
                        <div><strong>Femme:</strong> Black and white dresses</div>
                      </div>
                      <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                        View Examples
                      </button>
                    </div>

                    {/* 5. THC Formal */}
                    <div 
                      onClick={() => setSelectedWardrobe('thc-formal')}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedWardrobe === 'thc-formal' 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">THC Formal</h4>
                        <div className="flex items-center space-x-2">
                          {selectedWardrobe === 'thc-formal' ? (
                            <span className="text-purple-600">✓</span>
                          ) : (
                            <span className="text-gray-400">☐</span>
                          )}
                          <span className="text-xs text-gray-500">Option 5</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        <div><strong>Masc:</strong> Purple tux jackets, purple bowties</div>
                        <div><strong>Femme:</strong> Purple sparkly dresses</div>
                      </div>
                      <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                        View Examples
                      </button>
                    </div>

                    {/* 6. Custom Wardrobe */}
                    <div 
                      onClick={() => setSelectedWardrobe('custom')}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedWardrobe === 'custom' 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">Custom Attire</h4>
                        <div className="flex items-center space-x-2">
                          {selectedWardrobe === 'custom' ? (
                            <span className="text-purple-600">✓</span>
                          ) : (
                            <span className="text-gray-400">☐</span>
                          )}
                          <span className="text-xs text-gray-500">Option 6</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        <div><strong>Custom:</strong> Specify your preferred attire style</div>
                        <div className="text-xs text-amber-600 font-medium mt-1">*Subject to additional fees</div>
                      </div>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                      >
                        View Examples
                      </button>

                      {/* Custom Attire Input Fields - Inside the card */}
                      {selectedWardrobe === 'custom' && (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="mt-4 pt-4 border-t border-gray-200"
                        >
                          <h5 className="text-sm font-medium text-gray-900 mb-3">Custom Attire Details</h5>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Masc Attire Description</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                                placeholder="Describe the masculine attire style..."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Femme Attire Description</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                                placeholder="Describe the feminine attire style..."
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stage Design Choices Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Stage Design Choices</h3>
                  
                  {/* Stage Look Option */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Stage Look</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Light Mode */}
                      <div 
                        onClick={() => setSelectedStageLook('light')}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedStageLook === 'light' 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900">Light Mode</h5>
                          {selectedStageLook === 'light' ? (
                            <span className="text-purple-600">✓</span>
                          ) : (
                            <span className="text-gray-400">☐</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">White bandstands, white mic stands, white drum kit</p>
                        <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                          View Examples
                        </button>
                      </div>

                      {/* Dark Mode */}
                      <div 
                        onClick={() => setSelectedStageLook('dark')}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedStageLook === 'dark' 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900">Dark Mode</h5>
                          {selectedStageLook === 'dark' ? (
                            <span className="text-purple-600">✓</span>
                          ) : (
                            <span className="text-gray-400">☐</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Black bandstands, black mic stands, dark drum kit</p>
                        <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                          View Examples
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Stage Wash */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Stage Wash</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Natural Option */}
                      <div 
                        onClick={() => setSelectedWashLighting('natural')}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedWashLighting === 'natural' 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h5 className="font-medium text-gray-900">Natural</h5>
                          {selectedWashLighting === 'natural' ? (
                            <span className="text-purple-600">✓</span>
                          ) : (
                            <span className="text-gray-400">☐</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">We'll match the room color</p>
                        <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                          View Examples
                        </button>
                      </div>

                      {/* Color Option */}
                      <div 
                        onClick={() => setSelectedWashLighting('color')}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedWashLighting === 'color' 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h5 className="font-medium text-gray-900">Color</h5>
                          {selectedWashLighting === 'color' ? (
                            <span className="text-purple-600">✓</span>
                          ) : (
                            <span className="text-gray-400">☐</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Colored stage wash lighting</p>
                        
                        {/* Dropdown only shows when Color is selected */}
                        {selectedWashLighting === 'color' && (
                          <div className="space-y-2 mb-3">
                            <label className="block text-xs font-medium text-gray-700">Choose Color:</label>
                            <select 
                              onClick={(e) => e.stopPropagation()}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-900"
                            >
                              <option value="white">White</option>
                              <option value="warm-white">Warm White</option>
                              <option value="amber">Amber</option>
                              <option value="gold">Gold</option>
                              <option value="cream">Cream</option>
                              <option value="ivory">Ivory</option>
                            </select>
                          </div>
                        )}
                        
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                        >
                          View Examples
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Uplighting Options */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Uplighting</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Uplighting Color</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Natural Option */}
                          <div 
                            onClick={() => setSelectedUplightingColor('natural')}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedUplightingColor === 'natural' 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <h5 className="font-medium text-gray-900">Natural</h5>
                              {selectedUplightingColor === 'natural' ? (
                                <span className="text-purple-600">✓</span>
                              ) : (
                                <span className="text-gray-400">☐</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">We'll match the room color</p>
                            <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                              View Examples
                            </button>
                          </div>

                          {/* Color Option */}
                          <div 
                            onClick={() => setSelectedUplightingColor('color')}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedUplightingColor === 'color' 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <h5 className="font-medium text-gray-900">Color</h5>
                              {selectedUplightingColor === 'color' ? (
                                <span className="text-purple-600">✓</span>
                              ) : (
                                <span className="text-gray-400">☐</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">Colored uplighting</p>
                            
                            {/* Dropdown only shows when Color is selected */}
                            {selectedUplightingColor === 'color' && (
                              <div className="space-y-2 mb-3">
                                <label className="block text-xs font-medium text-gray-700">Choose Color:</label>
                                <select 
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-900"
                                >
                                  <option value="white">White</option>
                                  <option value="blue">Blue</option>
                                  <option value="red">Red</option>
                                  <option value="green">Green</option>
                                  <option value="purple">Purple</option>
                                  <option value="pink">Pink</option>
                                </select>
                              </div>
                            )}
                            
                            <button 
                              onClick={(e) => e.stopPropagation()}
                              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                            >
                              View Examples
                            </button>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Uplighting Behavior</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div 
                            onClick={() => setSelectedUplightingBehavior('static')}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedUplightingBehavior === 'static' 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <h5 className="font-medium text-gray-900 mb-1">Keep Static Color</h5>
                            <p className="text-sm text-gray-600 mb-3">Maintain the same color throughout the event</p>
                            <button className="text-xs text-purple-600 hover:text-purple-800 font-medium">
                              View Examples
                            </button>
                          </div>
                          <div 
                            onClick={() => setSelectedUplightingBehavior('changing')}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedUplightingBehavior === 'changing' 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <h5 className="font-medium text-gray-900 mb-1">Color-Changing for Dancing</h5>
                            <p className="text-sm text-gray-600 mb-3">Switch to dynamic colors during dance portions</p>
                            <button className="text-xs text-purple-600 hover:text-purple-800 font-medium">
                              View Examples
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dance Lighting Package */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Dance Lighting Package</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Haze (Outdoor Weddings Only)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div 
                            onClick={() => setSelectedHaze('yes')}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedHaze === 'yes' 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <h5 className="font-medium text-gray-900 mb-1">Yes, Add Haze</h5>
                            <p className="text-sm text-gray-600 mb-3">Atmospheric haze for dramatic lighting effects</p>
                            <button className="text-xs text-purple-600 hover:text-purple-800 font-medium">
                              View Examples
                            </button>
                          </div>
                          <div 
                            onClick={() => setSelectedHaze('no')}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedHaze === 'no' 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <h5 className="font-medium text-gray-900 mb-1">No Haze</h5>
                            <p className="text-sm text-gray-600 mb-3">Keep lighting clean without atmospheric effects</p>
                            <button className="text-xs text-purple-600 hover:text-purple-800 font-medium">
                              View Examples
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Wedding Colors/Theme */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Wedding Colors & Theme</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Wedding Colors/Theme</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                          placeholder="Describe your wedding colors and theme..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Moodboards/Wardrobe Instructions</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Documents Content */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
                
                {/* Document Upload Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Document</h3>
                  
                  {/* Document Upload Form */}
                  <div className="space-y-4">
                    {/* File Upload */}
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
             <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
               <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                 <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
               </svg>
               <p className="mt-1 text-sm text-gray-600">Click to upload document or drag and drop</p>
               <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
             </div>
           </div>

                    {/* Document Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                      <select 
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                      >
                        <option value="">Select document type...</option>
                        <option value="timeline">Timeline</option>
                        <option value="ceremony-script">Ceremony Script</option>
                        <option value="venue-guidelines">Venue Guidelines</option>
                        <option value="parking-permit">Parking Permit Form</option>
                        <option value="vendor-list">Vendor List</option>
                        <option value="social-media">Social Media Info</option>
                        <option value="sample-coi">Sample COI</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>

                    {/* Custom Type Input (only shows when Custom is selected) */}
                    {documentType === 'custom' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Document Type</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                          placeholder="Enter custom document type..."
                        />
                      </div>
                    )}

                    {/* Document Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Document Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                        placeholder="Enter a name for this document..."
                      />
                    </div>

                    {/* Upload Button */}
                    <div className="pt-4">
                      <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium">
                        Upload Document
                      </button>
                    </div>
                  </div>
                </div>

                {/* Uploaded Documents */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
                  
                  <div className="text-center py-8">
                    <p className="text-gray-500">No documents uploaded yet</p>
                  </div>
                </div>
              </div>
            )}

            {/* Welcome Party Content */}
            {activeTab === 'welcome-party' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-purple-600 text-center">Welcome Party</h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900">Welcome Party - Folk Band</h4>
                  </div>
                  
                  {/* Welcome Party Sub-tabs */}
                  <div className="border-b border-gray-200 mb-6">
                    <nav className="flex justify-center space-x-6">
                      <button
                        onClick={() => setActiveWelcomePartyTab('core-repertoire')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeWelcomePartyTab === 'core-repertoire'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                        }`}
                      >
                        Welcome Party Song List
                      </button>
                      <button
                        onClick={() => setActiveWelcomePartyTab('special-songs')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeWelcomePartyTab === 'special-songs'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                        }`}
                      >
                        Special Songs
                      </button>
                      <button
                        onClick={() => setActiveWelcomePartyTab('special-requests')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeWelcomePartyTab === 'special-requests'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                        }`}
                      >
                        Song Requests
                      </button>
                    </nav>
                  </div>

                  {/* Special Moments Content */}
                  {activeWelcomePartyTab === 'special-songs' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Special Songs</h3>
                        <span className="text-sm text-gray-500">{welcomePartySpecialMoments.length}/5 songs</span>
                      </div>
                      
                      {/* Add Moment Button */}
                      {welcomePartySpecialMoments.length < 5 && (
                        <button
                          onClick={() => setWelcomePartySpecialMoments([...welcomePartySpecialMoments, { specialMomentType: '', clientSongTitle: '', clientArtist: '', clientLink: '', clientNote: '' }])}
                          className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
                        >
                          + Add Special Song
                        </button>
                      )}
                      
                      {/* Special Moments List */}
                      {welcomePartySpecialMoments.map((moment, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-900">Moment {index + 1}</h4>
                            <button
                              onClick={() => setWelcomePartySpecialMoments(welcomePartySpecialMoments.filter((_, i) => i !== index))}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Special Moment Type</label>
                              <select
                                value={moment.specialMomentType}
                                onChange={(e) => {
                                  const newMoments = [...welcomePartySpecialMoments];
                                  newMoments[index].specialMomentType = e.target.value;
                                  setWelcomePartySpecialMoments(newMoments);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                              >
                                <option value="">Select moment type</option>
                                {getSpecialMomentTypes('welcome-party').map((type) => (
                                  <option key={type} value={type}>
                                    {type}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Song</label>
                              <input
                                type="text"
                                value={moment.clientSongTitle}
                                onChange={(e) => {
                                  const newMoments = [...welcomePartySpecialMoments];
                                  newMoments[index].clientSongTitle = e.target.value;
                                  setWelcomePartySpecialMoments(newMoments);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter song title"
                              />
                            </div>
                          </div>

                          {/* Reason field - show when Custom is selected */}
                          {moment.specialMomentType === 'Custom' && (
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for this song</label>
                              <textarea
                                value={moment.reason || ''}
                                onChange={(e) => {
                                  const newMoments = [...welcomePartySpecialMoments];
                                  newMoments[index].reason = e.target.value;
                                  setWelcomePartySpecialMoments(newMoments);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Explain why this song is special for this moment"
                                rows={3}
                              />
                            </div>
                          )}

                          {/* Recommended Songs Section */}
                          {moment.specialMomentType && getRecommendedSongs(moment.specialMomentType).length > 0 && (
                            <div className="mt-4">
                              <button
                                type="button"
                                onClick={() => {
                                  setExpandedRecommendations(prev => ({
                                    ...prev,
                                    [index]: !prev[index]
                                  }));
                                }}
                                className="flex items-center justify-between w-full p-2 text-left text-sm font-medium text-gray-700 bg-gray-50 rounded-lg border hover:bg-gray-100"
                              >
                                <span>Recommended Options ({getRecommendedSongs(moment.specialMomentType).length} songs)</span>
                                <span className={`transform transition-transform ${expandedRecommendations[index] ? 'rotate-180' : ''}`}>
                                  ▼
                                </span>
                              </button>
                              
                              {expandedRecommendations[index] && (
                                <div className="mt-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3">
                                    {getRecommendedSongs(moment.specialMomentType).map((song: {title: string, artist: string, videoUrl: string}, songIndex: number) => (
                                      <div key={songIndex} className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50">
                                        <div className="flex-1 min-w-0">
                                          <div className="font-medium text-gray-900 text-sm truncate">{song.title}</div>
                                          <div className="text-xs text-gray-600 truncate">{song.artist}</div>
                                        </div>
                                        <div className="flex items-center space-x-1 ml-2">
                                          <a
                                            href={song.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                          >
                                            Video
                                          </a>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newMoments = [...welcomePartySpecialMoments];
                                              newMoments[index].clientSongTitle = song.title;
                                              newMoments[index].clientArtist = song.artist;
                                              newMoments[index].clientLink = song.videoUrl;
                                              setWelcomePartySpecialMoments(newMoments);
                                            }}
                                            className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                                          >
                                            Select
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                              <input
                                type="text"
                                value={moment.clientArtist}
                                onChange={(e) => {
                                  const newMoments = [...welcomePartySpecialMoments];
                                  newMoments[index].clientArtist = e.target.value;
                                  setWelcomePartySpecialMoments(newMoments);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter artist name"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                              <input
                                type="url"
                                value={moment.clientLink}
                                onChange={(e) => {
                                  const newMoments = [...welcomePartySpecialMoments];
                                  newMoments[index].clientLink = e.target.value;
                                  setWelcomePartySpecialMoments(newMoments);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="YouTube, Spotify, or other link"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                            <textarea
                              value={moment.clientNote}
                              onChange={(e) => {
                                const newMoments = [...welcomePartySpecialMoments];
                                newMoments[index].clientNote = e.target.value;
                                setWelcomePartySpecialMoments(newMoments);
                              }}
                              rows={1}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                              placeholder="Special instructions or notes"
                            />
                          </div>
                        </div>
                      ))}
                      
                      {welcomePartySpecialMoments.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>No special songs added yet</p>
                          <p className="text-sm mt-1">Click "Add Special Song" to get started</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Special Requests Content */}
                  {activeWelcomePartyTab === 'special-requests' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Song Requests</h3>
                        <span className="text-sm text-gray-500">{welcomePartySpecialRequests.length}/5 requests</span>
                      </div>

                      {/* Song Requests Section */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-medium text-gray-900">Song Requests</h4>
                          <span className="text-sm text-gray-500">{welcomePartySpecialRequests.length}/5 requests</span>
                        </div>
                        
                        {/* Add Request Button */}
                        {welcomePartySpecialRequests.length < 5 && (
                          <button
                            onClick={() => setWelcomePartySpecialRequests([...welcomePartySpecialRequests, { clientSongTitle: '', clientArtist: '', clientLink: '', clientNote: '' }])}
                            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors mb-4"
                          >
                            + Add Song Request
                          </button>
                        )}
                      
                        {/* Special Requests List */}
                        {welcomePartySpecialRequests.map((request, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 space-y-4 mb-4 border border-gray-200">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium text-gray-900">Request {index + 1}</h5>
                              <button
                                onClick={() => setWelcomePartySpecialRequests(welcomePartySpecialRequests.filter((_, i) => i !== index))}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Song</label>
                                <input
                                  type="text"
                                  value={request.clientSongTitle}
                                  onChange={(e) => {
                                    const newRequests = [...welcomePartySpecialRequests];
                                    newRequests[index].clientSongTitle = e.target.value;
                                    setWelcomePartySpecialRequests(newRequests);
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                  placeholder="Enter song title"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                                <input
                                  type="text"
                                  value={request.clientArtist}
                                  onChange={(e) => {
                                    const newRequests = [...welcomePartySpecialRequests];
                                    newRequests[index].clientArtist = e.target.value;
                                    setWelcomePartySpecialRequests(newRequests);
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                  placeholder="Enter artist name"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                                <input
                                  type="url"
                                  value={request.clientLink}
                                  onChange={(e) => {
                                    const newRequests = [...welcomePartySpecialRequests];
                                    newRequests[index].clientLink = e.target.value;
                                    setWelcomePartySpecialRequests(newRequests);
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                  placeholder="YouTube, Spotify, or other link"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                                <textarea
                                  value={request.clientNote}
                                  onChange={(e) => {
                                    const newRequests = [...welcomePartySpecialRequests];
                                    newRequests[index].clientNote = e.target.value;
                                    setWelcomePartySpecialRequests(newRequests);
                                  }}
                                  rows={1}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                  placeholder="Special instructions or notes"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        {welcomePartySpecialRequests.length === 0 && (
                          <div className="text-center py-4 text-gray-500">
                            <p className="text-sm">No song requests added yet</p>
                            <p className="text-xs mt-1">Click "Add Song Request" to get started</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Request Playlists Section */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-medium text-gray-900">Request Playlists</h4>
                          <span className="text-sm text-gray-500">{welcomePartyPlaylists.length}/5 playlists</span>
                        </div>
                        
                        {/* Add Playlist Button */}
                        {welcomePartyPlaylists.length < 5 && (
                          <button
                            onClick={() => setWelcomePartyPlaylists([...welcomePartyPlaylists, { playlistType: '', playlistLink: '', playlistNote: '' }])}
                            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors mb-4"
                          >
                            + Add Playlist Request
                          </button>
                        )}
                        
                        {/* Playlist Requests List */}
                        {welcomePartyPlaylists.map((playlist, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 space-y-4 mb-4 border border-gray-200">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium text-gray-900">Playlist {index + 1}</h5>
                              <button
                                onClick={() => setWelcomePartyPlaylists(welcomePartyPlaylists.filter((_, i) => i !== index))}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Playlist Type</label>
                                <select
                                  value={playlist.playlistType}
                                  onChange={(e) => {
                                    const newPlaylists = [...welcomePartyPlaylists];
                                    newPlaylists[index].playlistType = e.target.value;
                                    setWelcomePartyPlaylists(newPlaylists);
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                >
                                  <option value="">Select playlist type</option>
                                  {playlistTypes.map((type) => (
                                    <option key={type} value={type}>
                                      {type}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Playlist Link</label>
                                <input
                                  type="url"
                                  value={playlist.playlistLink}
                                  onChange={(e) => {
                                    const newPlaylists = [...welcomePartyPlaylists];
                                    newPlaylists[index].playlistLink = e.target.value;
                                    setWelcomePartyPlaylists(newPlaylists);
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                  placeholder="Spotify, Apple Music, or other playlist link"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                              <textarea
                                value={playlist.playlistNote}
                                onChange={(e) => {
                                  const newPlaylists = [...welcomePartyPlaylists];
                                  newPlaylists[index].playlistNote = e.target.value;
                                  setWelcomePartyPlaylists(newPlaylists);
                                }}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Special instructions or notes about this playlist"
                              />
                            </div>
                          </div>
                        ))}
                        
                        {welcomePartyPlaylists.length === 0 && (
                          <div className="text-center py-4 text-gray-500">
                            <p className="text-sm">No playlist requests added yet</p>
                            <p className="text-xs mt-1">Click "Add Playlist Request" to get started</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Core Repertoire Content */}
                  {activeWelcomePartyTab === 'core-repertoire' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Welcome Party Song List</h3>
                        <span className="text-sm text-gray-500">{filteredWelcomePartySongs.length} songs available</span>
                      </div>

                      {/* Song Progress Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <span className="mr-2">🎵</span>
                          Song Progress
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Definitely Play Card */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-green-800">🤘 Definitely Play</h5>
                              <span className="text-sm text-green-600">
                                {Object.values(songPreferences).filter(pref => pref === 'definitely').length}/30
                              </span>
                            </div>
                            <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (Object.values(songPreferences).filter(pref => pref === 'definitely').length / 15) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: 15-30 songs</p>
                            {Object.values(songPreferences).filter(pref => pref === 'definitely').length < 15 && (
                              <p className="text-sm text-orange-600 mt-1 flex items-center">
                                <span className="mr-1">⚠️</span>
                                Need more songs
                              </p>
                            )}
                            {Object.values(songPreferences).filter(pref => pref === 'definitely').length > 30 && (
                              <p className="text-sm text-red-600 mt-1 flex items-center">
                                <span className="mr-1">🚨</span>
                                Over limit (max 30 songs)
                              </p>
                            )}
                          </div>

                          {/* If Mood Is Right Card */}
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-yellow-800">👍 If Mood Is Right</h5>
                              <span className="text-sm text-yellow-600">
                                {Object.values(songPreferences).filter(pref => pref === 'maybe').length}/∞
                              </span>
                            </div>
                            <div className="w-full bg-yellow-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (Object.values(songPreferences).filter(pref => pref === 'maybe').length / 20) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: ≥20 songs</p>
                            {Object.values(songPreferences).filter(pref => pref === 'maybe').length < 20 && (
                              <p className="text-sm text-orange-600 mt-1 flex items-center">
                                <span className="mr-1">⚠️</span>
                                Need more songs
                              </p>
                            )}
                          </div>

                          {/* Avoid Playing Card */}
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-red-800">👎 Avoid Playing</h5>
                              <span className="text-sm text-red-600">
                                {Object.values(songPreferences).filter(pref => pref === 'avoid').length}/25
                              </span>
                            </div>
                            <div className="w-full bg-red-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (Object.values(songPreferences).filter(pref => pref === 'avoid').length / 25) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: ≤25 songs</p>
                            {Object.values(songPreferences).filter(pref => pref === 'avoid').length > 25 && (
                              <p className="text-sm text-red-600 mt-1 flex items-center">
                                <span className="mr-1">🚨</span>
                                Over limit (max 25 songs)
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Songs List */}
                      <div className="bg-white rounded-lg border border-gray-200">
                        {isLoading ? (
                          <div className="text-center py-8 text-gray-500">
                            <p>Loading songs...</p>
                          </div>
                        ) : filteredWelcomePartySongs.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <p>No songs tagged for Welcome Party</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-200">
                            {filteredWelcomePartySongs.map((song, index) => (
                              <div key={song.id || index} className="p-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-4">
                                      <div>
                                        <a
                                          href={song.videoUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="font-medium text-purple-600 hover:text-purple-800 underline"
                                        >
                                          {song.originalTitle}
                                        </a>
                                        <p className="text-sm text-gray-600">{song.originalArtist}</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => setSongPreferences(prev => ({
                                        ...prev,
                                        [song.id]: prev[song.id] === 'definitely' ? undefined : 'definitely'
                                      }))}
                                      className={`px-3 py-1 text-sm rounded border ${
                                        songPreferences[song.id] === 'definitely'
                                          ? 'bg-green-100 text-green-800 border-green-300'
                                          : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
                                      }`}
                                    >
                                      🤘 Definitely Play
                                    </button>
                                    <button
                                      onClick={() => setSongPreferences(prev => ({
                                        ...prev,
                                        [song.id]: prev[song.id] === 'maybe' ? undefined : 'maybe'
                                      }))}
                                      className={`px-3 py-1 text-sm rounded border ${
                                        songPreferences[song.id] === 'maybe'
                                          ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                          : 'bg-white text-gray-700 border-gray-300 hover:bg-yellow-50'
                                      }`}
                                    >
                                      👍 If the Mood is Right
                                    </button>
                                    <button
                                      onClick={() => setSongPreferences(prev => ({
                                        ...prev,
                                        [song.id]: prev[song.id] === 'avoid' ? undefined : 'avoid'
                                      }))}
                                      className={`px-3 py-1 text-sm rounded border ${
                                        songPreferences[song.id] === 'avoid'
                                          ? 'bg-red-100 text-red-800 border-red-300'
                                          : 'bg-white text-gray-700 border-gray-300 hover:bg-red-50'
                                      }`}
                                    >
                                      👎 Avoid Playing
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ceremony Content */}
            {activeTab === 'ceremony' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-purple-600 text-center">Ceremony</h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900">Ceremony - Piano Trio</h4>
                  </div>
                  
                  {/* Ceremony Sub-tabs */}
                  <div className="border-b border-gray-200">
                    <nav className="flex justify-center space-x-8">
                      <button
                        onClick={() => setActiveCeremonyTab('guest-arrival')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeCeremonyTab === 'guest-arrival'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                        }`}
                      >
                        Guest Arrival Song List
                      </button>
                      <button
                        onClick={() => setActiveCeremonyTab('guest-arrival-requests')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeCeremonyTab === 'guest-arrival-requests'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                        }`}
                      >
                        Guest Arrival Song Requests
                      </button>
                      <button
                        onClick={() => setActiveCeremonyTab('ceremony-music')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeCeremonyTab === 'ceremony-music'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                        }`}
                      >
                        Ceremony Music
                      </button>
                    </nav>
                  </div>

                  {/* Ceremony Music Content */}
                  {activeCeremonyTab === 'ceremony-music' && (
                    <div className="space-y-6 mt-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Ceremony Music</h3>
                        <span className="text-sm text-gray-500">{ceremonySongs.length} songs</span>
                      </div>

                      {/* Add Ceremony Song Button */}
                      <button
                        onClick={() => setCeremonySongs([...ceremonySongs, { ceremonyMomentType: '', clientSongTitle: '', clientArtist: '', clientLink: '', clientNote: '', processionalWalkers: '' }])}
                        className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
                      >
                        + Add Ceremony Song
                      </button>

                      {/* Ceremony Songs List */}
                      {ceremonySongs.map((song, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <div className="flex flex-col space-y-1">
                                <button
                                  onClick={() => {
                                    if (index > 0) {
                                      const newSongs = [...ceremonySongs];
                                      [newSongs[index - 1], newSongs[index]] = [newSongs[index], newSongs[index - 1]];
                                      setCeremonySongs(newSongs);
                                    }
                                  }}
                                  disabled={index === 0}
                                  className={`p-1 rounded ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'}`}
                                  title="Move up"
                                >
                                  ▲
                                </button>
                                <button
                                  onClick={() => {
                                    if (index < ceremonySongs.length - 1) {
                                      const newSongs = [...ceremonySongs];
                                      [newSongs[index], newSongs[index + 1]] = [newSongs[index + 1], newSongs[index]];
                                      setCeremonySongs(newSongs);
                                    }
                                  }}
                                  disabled={index === ceremonySongs.length - 1}
                                  className={`p-1 rounded ${index === ceremonySongs.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'}`}
                                  title="Move down"
                                >
                                  ▼
                                </button>
                              </div>
                              <h4 className="font-medium text-gray-900">Ceremony Song {index + 1}</h4>
                            </div>
                            <button
                              onClick={() => setCeremonySongs(ceremonySongs.filter((_, i) => i !== index))}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Ceremony Moment</label>
                              <select
                                value={song.ceremonyMomentType}
                                onChange={(e) => {
                                  const newSongs = [...ceremonySongs];
                                  newSongs[index].ceremonyMomentType = e.target.value;
                                  setCeremonySongs(newSongs);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                              >
                                <option value="">Select ceremony moment</option>
                                {ceremonyMomentTypes.map((type) => (
                                  <option key={type} value={type}>
                                    {type}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Recommended Options */}
                            {song.ceremonyMomentType && getRecommendedSongs(song.ceremonyMomentType).length > 0 && (
                              <div className="col-span-2">
                                <button
                                  type="button"
                                  onClick={() => setExpandedCeremonyRecommendations({
                                    ...expandedCeremonyRecommendations,
                                    [index]: !expandedCeremonyRecommendations[index]
                                  })}
                                  className="flex items-center justify-between w-full p-3 text-left bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                                >
                                  <span className="text-sm font-medium text-purple-700">
                                    Recommended Options ({getRecommendedSongs(song.ceremonyMomentType).length} songs)
                                  </span>
                                  <span className="text-purple-500">
                                    {expandedCeremonyRecommendations[index] ? '▼' : '▶'}
                                  </span>
                                </button>

                                {expandedCeremonyRecommendations[index] && (
                                  <div className="mt-3 p-4 bg-purple-50 border border-purple-200 rounded-lg max-h-48 overflow-y-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {getRecommendedSongs(song.ceremonyMomentType).map((recSong: {title: string, artist: string, videoUrl: string}, songIndex: number) => (
                                        <button
                                          key={songIndex}
                                          type="button"
                                          onClick={() => {
                                            const newSongs = [...ceremonySongs];
                                            newSongs[index].clientSongTitle = recSong.title;
                                            newSongs[index].clientArtist = recSong.artist;
                                            newSongs[index].clientLink = recSong.videoUrl;
                                            setCeremonySongs(newSongs);
                                          }}
                                          className="p-3 text-left bg-white border border-purple-200 rounded-lg hover:bg-purple-100 hover:border-purple-300 transition-colors"
                                        >
                                          <div className="text-sm font-medium text-gray-900">{recSong.title}</div>
                                          <div className="text-xs text-gray-600">{recSong.artist}</div>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Song</label>
                              <input
                                type="text"
                                value={song.clientSongTitle}
                                onChange={(e) => {
                                  const newSongs = [...ceremonySongs];
                                  newSongs[index].clientSongTitle = e.target.value;
                                  setCeremonySongs(newSongs);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter song title"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                              <input
                                type="text"
                                value={song.clientArtist}
                                onChange={(e) => {
                                  const newSongs = [...ceremonySongs];
                                  newSongs[index].clientArtist = e.target.value;
                                  setCeremonySongs(newSongs);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter artist name"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                              <input
                                type="url"
                                value={song.clientLink}
                                onChange={(e) => {
                                  const newSongs = [...ceremonySongs];
                                  newSongs[index].clientLink = e.target.value;
                                  setCeremonySongs(newSongs);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="YouTube, Spotify, or other link"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                            <textarea
                              value={song.clientNote}
                              onChange={(e) => {
                                const newSongs = [...ceremonySongs];
                                newSongs[index].clientNote = e.target.value;
                                setCeremonySongs(newSongs);
                              }}
                              rows={1}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                              placeholder="Special instructions or notes"
                            />
                          </div>

                          {/* Processional Walkers field - show only when Ceremony Processional is selected */}
                          {song.ceremonyMomentType === 'Ceremony Processional' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Who is walking down to this song?</label>
                              <textarea
                                value={song.processionalWalkers || ''}
                                onChange={(e) => {
                                  const newSongs = [...ceremonySongs];
                                  newSongs[index].processionalWalkers = e.target.value;
                                  setCeremonySongs(newSongs);
                                }}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="e.g., Bride, Groom, Wedding Party, Parents, etc."
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                Note: We will get the official order from you closer to the wedding
                              </p>
                            </div>
                          )}
                        </div>
                      ))}

                      {ceremonySongs.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>No ceremony songs added yet</p>
                          <p className="text-sm mt-1">Click "Add Ceremony Song" to get started</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ceremony Script Upload */}
                  {activeCeremonyTab === 'ceremony-music' && (
                    <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Ceremony Script Upload</h4>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">Click to upload ceremony script or drag and drop</p>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                      </div>
                    </div>
                  )}

                  {/* Guest Arrival Song Requests Content */}
                  {activeCeremonyTab === 'guest-arrival-requests' && (
                    <div className="space-y-6 mt-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Guest Arrival Song Requests</h3>
                        <span className="text-sm text-gray-500">{guestArrivalRequests.length}/2 requests</span>
                      </div>

                      {/* Add Guest Arrival Request Button */}
                      {guestArrivalRequests.length < 2 && (
                        <button
                          onClick={() => setGuestArrivalRequests([...guestArrivalRequests, { clientSongTitle: '', clientArtist: '', clientLink: '', clientNote: '' }])}
                          className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
                        >
                          + Add Guest Arrival Song Request
                        </button>
                      )}

                      {/* Guest Arrival Requests List */}
                      {guestArrivalRequests.map((request, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-900">Request {index + 1}</h4>
                            <button
                              onClick={() => setGuestArrivalRequests(guestArrivalRequests.filter((_, i) => i !== index))}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Song</label>
                              <input
                                type="text"
                                value={request.clientSongTitle}
                                onChange={(e) => {
                                  const newRequests = [...guestArrivalRequests];
                                  newRequests[index].clientSongTitle = e.target.value;
                                  setGuestArrivalRequests(newRequests);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter song title"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                              <input
                                type="text"
                                value={request.clientArtist}
                                onChange={(e) => {
                                  const newRequests = [...guestArrivalRequests];
                                  newRequests[index].clientArtist = e.target.value;
                                  setGuestArrivalRequests(newRequests);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter artist name"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                              <input
                                type="url"
                                value={request.clientLink}
                                onChange={(e) => {
                                  const newRequests = [...guestArrivalRequests];
                                  newRequests[index].clientLink = e.target.value;
                                  setGuestArrivalRequests(newRequests);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="YouTube, Spotify, or other link"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                              <textarea
                                value={request.clientNote}
                                onChange={(e) => {
                                  const newRequests = [...guestArrivalRequests];
                                  newRequests[index].clientNote = e.target.value;
                                  setGuestArrivalRequests(newRequests);
                                }}
                                rows={1}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Special instructions or notes"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {guestArrivalRequests.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>No guest arrival song requests added yet</p>
                          <p className="text-sm mt-1">Click "Add Guest Arrival Song Request" to get started</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Guest Arrival Song List Content */}
                  {activeCeremonyTab === 'guest-arrival' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Guest Arrival Song List</h3>
                        <span className="text-sm text-gray-500">{filteredGuestArrivalSongs.length} songs available</span>
                      </div>

                      {/* Song Progress Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <span className="mr-2">🎵</span>
                          Song Progress
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Definitely Play Card */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-green-800">🤘 Definitely Play</h5>
                              <span className="text-sm text-green-600">
                                {Object.values(guestArrivalSongPreferences).filter(pref => pref === 'definitely').length}/10
                              </span>
                            </div>
                            <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (Object.values(guestArrivalSongPreferences).filter(pref => pref === 'definitely').length / 5) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: 5-10 songs</p>
                            {Object.values(guestArrivalSongPreferences).filter(pref => pref === 'definitely').length < 5 && (
                              <p className="text-sm text-orange-600 mt-1 flex items-center">
                                <span className="mr-1">⚠️</span>
                                Need more songs
                              </p>
                            )}
                            {Object.values(guestArrivalSongPreferences).filter(pref => pref === 'definitely').length > 10 && (
                              <p className="text-sm text-red-600 mt-1 flex items-center">
                                <span className="mr-1">🚨</span>
                                Over limit (max 10 songs)
                              </p>
                            )}
                          </div>

                          {/* If Mood Is Right Card */}
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-yellow-800">👍 If Mood Is Right</h5>
                              <span className="text-sm text-yellow-600">
                                {Object.values(guestArrivalSongPreferences).filter(pref => pref === 'maybe').length}/∞
                              </span>
                            </div>
                            <div className="w-full bg-yellow-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (Object.values(guestArrivalSongPreferences).filter(pref => pref === 'maybe').length / 5) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: ≥5 songs</p>
                            {Object.values(guestArrivalSongPreferences).filter(pref => pref === 'maybe').length < 5 && (
                              <p className="text-sm text-orange-600 mt-1 flex items-center">
                                <span className="mr-1">⚠️</span>
                                Need more songs
                              </p>
                            )}
                          </div>

                          {/* Avoid Playing Card */}
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-red-800">👎 Avoid Playing</h5>
                              <span className="text-sm text-red-600">
                                {Object.values(guestArrivalSongPreferences).filter(pref => pref === 'avoid').length}/5
                              </span>
                            </div>
                            <div className="w-full bg-red-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (Object.values(guestArrivalSongPreferences).filter(pref => pref === 'avoid').length / 5) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: ≤5 songs</p>
                            {Object.values(guestArrivalSongPreferences).filter(pref => pref === 'avoid').length > 5 && (
                              <p className="text-sm text-red-600 mt-1 flex items-center">
                                <span className="mr-1">🚨</span>
                                Over limit (max 5 songs)
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Songs List */}
                      <div className="bg-white rounded-lg border border-gray-200">
                        {isLoadingGuestArrival ? (
                          <div className="text-center py-8 text-gray-500">
                            <p>Loading songs...</p>
                          </div>
                        ) : filteredGuestArrivalSongs.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <p>No songs tagged for Guest Arrival</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-200">
                            {filteredGuestArrivalSongs.map((song, index) => (
                              <div key={song.id || index} className="p-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-4">
                                      <div>
                                        <a
                                          href={song.videoUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="font-medium text-purple-600 hover:text-purple-800 underline"
                                        >
                                          {song.originalTitle}
                                        </a>
                                        <p className="text-sm text-gray-600">{song.originalArtist}</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => setGuestArrivalSongPreferences(prev => ({
                                        ...prev,
                                        [song.id]: prev[song.id] === 'definitely' ? undefined : 'definitely'
                                      }))}
                                      className={`px-3 py-1 text-sm rounded border ${
                                        guestArrivalSongPreferences[song.id] === 'definitely'
                                          ? 'bg-green-100 text-green-800 border-green-300'
                                          : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
                                      }`}
                                    >
                                      🤘 Definitely Play
                                    </button>
                                    <button
                                      onClick={() => setGuestArrivalSongPreferences(prev => ({
                                        ...prev,
                                        [song.id]: prev[song.id] === 'maybe' ? undefined : 'maybe'
                                      }))}
                                      className={`px-3 py-1 text-sm rounded border ${
                                        guestArrivalSongPreferences[song.id] === 'maybe'
                                          ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                          : 'bg-white text-gray-700 border-gray-300 hover:bg-yellow-50'
                                      }`}
                                    >
                                      👍 If the Mood is Right
                                    </button>
                                    <button
                                      onClick={() => setGuestArrivalSongPreferences(prev => ({
                                        ...prev,
                                        [song.id]: prev[song.id] === 'avoid' ? undefined : 'avoid'
                                      }))}
                                      className={`px-3 py-1 text-sm rounded border ${
                                        guestArrivalSongPreferences[song.id] === 'avoid'
                                          ? 'bg-red-100 text-red-800 border-red-300'
                                          : 'bg-white text-gray-700 border-gray-300 hover:bg-red-50'
                                      }`}
                                    >
                                      👎 Avoid Playing
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cocktail Hour Content */}
            {activeTab === 'cocktail-hour' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-purple-600 text-center">Cocktail Hour</h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900">Cocktail Hour - Jazz Quartet</h4>
                  </div>
                  
                  {/* Cocktail Hour Sub-tabs */}
                  <div className="border-b border-gray-200">
                    <nav className="flex justify-center space-x-8">
                      <button
                        onClick={() => setActiveCocktailHourTab('cocktail-hour-song-list')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeCocktailHourTab === 'cocktail-hour-song-list'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                        }`}
                      >
                        Cocktail Hour Song List
                      </button>
                      <button
                        onClick={() => setActiveCocktailHourTab('special-songs')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeCocktailHourTab === 'special-songs'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                        }`}
                      >
                        Special Songs
                      </button>
                      <button
                        onClick={() => setActiveCocktailHourTab('song-requests')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeCocktailHourTab === 'song-requests'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                        }`}
                      >
                        Song Requests
                      </button>
                    </nav>
                  </div>

                  {/* Special Moments Content */}
                  {activeCocktailHourTab === 'special-songs' && (
                    <div className="space-y-6 mt-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Special Songs</h3>
                        <span className="text-sm text-gray-500">{cocktailHourSpecialMoments.length} songs</span>
                      </div>

                      {/* Add Special Moment Button */}
                      <button
                        onClick={() => setCocktailHourSpecialMoments([...cocktailHourSpecialMoments, { specialMomentType: '', clientSongTitle: '', clientArtist: '', clientLink: '', clientNote: '' }])}
                        className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
                      >
                        + Add Special Song
                      </button>

                      {/* Special Moments List */}
                      {cocktailHourSpecialMoments.map((moment, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-900">Special Song {index + 1}</h4>
                            <button
                              onClick={() => setCocktailHourSpecialMoments(cocktailHourSpecialMoments.filter((_, i) => i !== index))}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Special Moment</label>
                              <select
                                value={moment.specialMomentType}
                                onChange={(e) => {
                                  const newMoments = [...cocktailHourSpecialMoments];
                                  newMoments[index].specialMomentType = e.target.value;
                                  setCocktailHourSpecialMoments(newMoments);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                              >
                                <option value="">Select special moment</option>
                                {getSpecialMomentTypes('cocktail-hour').map((type) => (
                                  <option key={type} value={type}>
                                    {type}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Song</label>
                              <input
                                type="text"
                                value={moment.clientSongTitle}
                                onChange={(e) => {
                                  const newMoments = [...cocktailHourSpecialMoments];
                                  newMoments[index].clientSongTitle = e.target.value;
                                  setCocktailHourSpecialMoments(newMoments);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter song title"
                              />
                            </div>
                          </div>

                          {/* Reason field - show when Custom is selected */}
                          {moment.specialMomentType === 'Custom' && (
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for this song</label>
                              <textarea
                                value={moment.reason || ''}
                                onChange={(e) => {
                                  const newMoments = [...cocktailHourSpecialMoments];
                                  newMoments[index].reason = e.target.value;
                                  setCocktailHourSpecialMoments(newMoments);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Explain why this song is special for this moment"
                                rows={3}
                              />
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                              <input
                                type="text"
                                value={moment.clientArtist}
                                onChange={(e) => {
                                  const newMoments = [...cocktailHourSpecialMoments];
                                  newMoments[index].clientArtist = e.target.value;
                                  setCocktailHourSpecialMoments(newMoments);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter artist name"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                              <input
                                type="url"
                                value={moment.clientLink}
                                onChange={(e) => {
                                  const newMoments = [...cocktailHourSpecialMoments];
                                  newMoments[index].clientLink = e.target.value;
                                  setCocktailHourSpecialMoments(newMoments);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="YouTube, Spotify, or other link"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                            <textarea
                              value={moment.clientNote}
                              onChange={(e) => {
                                const newMoments = [...cocktailHourSpecialMoments];
                                newMoments[index].clientNote = e.target.value;
                                setCocktailHourSpecialMoments(newMoments);
                              }}
                              rows={1}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                              placeholder="Special instructions or notes"
                            />
                          </div>
                        </div>
                      ))}

                      {cocktailHourSpecialMoments.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>No special songs added yet</p>
                          <p className="text-sm mt-1">Click "Add Special Song" to get started</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Song Requests Content */}
                  {activeCocktailHourTab === 'song-requests' && (
                    <div className="space-y-6 mt-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Song Requests</h3>
                        <span className="text-sm text-gray-500">{cocktailHourRequests.length}/5 requests</span>
                      </div>

                      {/* Add Request Button */}
                      {cocktailHourRequests.length < 5 && (
                        <button
                          onClick={() => setCocktailHourRequests([...cocktailHourRequests, { clientSongTitle: '', clientArtist: '', clientLink: '', clientNote: '' }])}
                          className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
                        >
                          + Add Song Request
                        </button>
                      )}

                      {/* Song Requests List */}
                      {cocktailHourRequests.map((request, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-900">Request {index + 1}</h4>
                            <button
                              onClick={() => setCocktailHourRequests(cocktailHourRequests.filter((_, i) => i !== index))}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Song</label>
                              <input
                                type="text"
                                value={request.clientSongTitle}
                                onChange={(e) => {
                                  const newRequests = [...cocktailHourRequests];
                                  newRequests[index].clientSongTitle = e.target.value;
                                  setCocktailHourRequests(newRequests);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter song title"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                              <input
                                type="text"
                                value={request.clientArtist}
                                onChange={(e) => {
                                  const newRequests = [...cocktailHourRequests];
                                  newRequests[index].clientArtist = e.target.value;
                                  setCocktailHourRequests(newRequests);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter artist name"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                              <input
                                type="url"
                                value={request.clientLink}
                                onChange={(e) => {
                                  const newRequests = [...cocktailHourRequests];
                                  newRequests[index].clientLink = e.target.value;
                                  setCocktailHourRequests(newRequests);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="YouTube, Spotify, or other link"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                              <textarea
                                value={request.clientNote}
                                onChange={(e) => {
                                  const newRequests = [...cocktailHourRequests];
                                  newRequests[index].clientNote = e.target.value;
                                  setCocktailHourRequests(newRequests);
                                }}
                                rows={1}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Special instructions or notes"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {cocktailHourRequests.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>No song requests added yet</p>
                          <p className="text-sm mt-1">Click "Add Song Request" to get started</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cocktail Hour Song List Content */}
                  {activeCocktailHourTab === 'cocktail-hour-song-list' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Cocktail Hour Song List</h3>
                        <span className="text-sm text-gray-500">{filteredCocktailHourSongs.length} songs available</span>
                      </div>

                      {/* Song Progress Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <span className="mr-2">🎵</span>
                          Song Progress
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Definitely Play Card */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-green-800">🤘 Definitely Play</h5>
                              <span className="text-sm text-green-600">
                                {Object.values(cocktailHourSongPreferences).filter(pref => pref === 'definitely').length}/15
                              </span>
                            </div>
                            <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (Object.values(cocktailHourSongPreferences).filter(pref => pref === 'definitely').length / 10) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: 10-15 songs</p>
                            {Object.values(cocktailHourSongPreferences).filter(pref => pref === 'definitely').length < 10 && (
                              <p className="text-sm text-orange-600 mt-1 flex items-center">
                                <span className="mr-1">⚠️</span>
                                Need more songs
                              </p>
                            )}
                            {Object.values(cocktailHourSongPreferences).filter(pref => pref === 'definitely').length > 15 && (
                              <p className="text-sm text-red-600 mt-1 flex items-center">
                                <span className="mr-1">🚨</span>
                                Over limit (max 15 songs)
                              </p>
                            )}
                          </div>

                          {/* If Mood Is Right Card */}
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-yellow-800">👍 If Mood Is Right</h5>
                              <span className="text-sm text-yellow-600">
                                {Object.values(cocktailHourSongPreferences).filter(pref => pref === 'maybe').length}/∞
                              </span>
                            </div>
                            <div className="w-full bg-yellow-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (Object.values(cocktailHourSongPreferences).filter(pref => pref === 'maybe').length / 5) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: ≥5 songs</p>
                            {Object.values(cocktailHourSongPreferences).filter(pref => pref === 'maybe').length < 5 && (
                              <p className="text-sm text-orange-600 mt-1 flex items-center">
                                <span className="mr-1">⚠️</span>
                                Need more songs
                              </p>
                            )}
                          </div>

                          {/* Avoid Playing Card */}
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-red-800">👎 Avoid Playing</h5>
                              <span className="text-sm text-red-600">
                                {Object.values(cocktailHourSongPreferences).filter(pref => pref === 'avoid').length}/5
                              </span>
                            </div>
                            <div className="w-full bg-red-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (Object.values(cocktailHourSongPreferences).filter(pref => pref === 'avoid').length / 5) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: ≤5 songs</p>
                            {Object.values(cocktailHourSongPreferences).filter(pref => pref === 'avoid').length > 5 && (
                              <p className="text-sm text-red-600 mt-1 flex items-center">
                                <span className="mr-1">🚨</span>
                                Over limit (max 5 songs)
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Songs List */}
                      <div className="bg-white rounded-lg border border-gray-200">
                        {isLoadingCocktailHour ? (
                          <div className="text-center py-8 text-gray-500">
                            <p>Loading songs...</p>
                          </div>
                        ) : filteredCocktailHourSongs.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <p>No songs tagged for Cocktail Hour</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-200">
                            {filteredCocktailHourSongs.map((song, index) => (
                              <div key={song.id || index} className="p-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-4">
                                      <div>
                                        <a
                                          href={song.videoUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="font-medium text-purple-600 hover:text-purple-800 underline"
                                        >
                                          {song.originalTitle}
                                        </a>
                                        <p className="text-sm text-gray-600">{song.originalArtist}</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => setCocktailHourSongPreferences(prev => ({
                                        ...prev,
                                        [song.id]: prev[song.id] === 'definitely' ? undefined : 'definitely'
                                      }))}
                                      className={`px-3 py-1 text-sm rounded border ${
                                        cocktailHourSongPreferences[song.id] === 'definitely'
                                          ? 'bg-green-100 text-green-800 border-green-300'
                                          : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
                                      }`}
                                    >
                                      🤘 Definitely Play
                                    </button>
                                    <button
                                      onClick={() => setCocktailHourSongPreferences(prev => ({
                                        ...prev,
                                        [song.id]: prev[song.id] === 'maybe' ? undefined : 'maybe'
                                      }))}
                                      className={`px-3 py-1 text-sm rounded border ${
                                        cocktailHourSongPreferences[song.id] === 'maybe'
                                          ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                          : 'bg-white text-gray-700 border-gray-300 hover:bg-yellow-50'
                                      }`}
                                    >
                                      👍 If the Mood is Right
                                    </button>
                                    <button
                                      onClick={() => setCocktailHourSongPreferences(prev => ({
                                        ...prev,
                                        [song.id]: prev[song.id] === 'avoid' ? undefined : 'avoid'
                                      }))}
                                      className={`px-3 py-1 text-sm rounded border ${
                                        cocktailHourSongPreferences[song.id] === 'avoid'
                                          ? 'bg-red-100 text-red-800 border-red-300'
                                          : 'bg-white text-gray-700 border-gray-300 hover:bg-red-50'
                                      }`}
                                    >
                                      👎 Avoid Playing
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reception Content */}
            {activeTab === 'reception' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-purple-600 text-center">Reception</h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900">Reception - 15-Piece Full Band</h4>
                  </div>
                  
                  {/* Reception Sub-tabs */}
                  <div className="border-b border-gray-200">
                    <nav className="flex justify-center space-x-8">
                      <button
                        onClick={() => setActiveReceptionTab('reception-song-list')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeReceptionTab === 'reception-song-list'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                        }`}
                      >
                        Reception Song List
                      </button>
                      <button
                        onClick={() => setActiveReceptionTab('special-songs')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeReceptionTab === 'special-songs'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                        }`}
                      >
                        Special Songs
                      </button>
                      <button
                        onClick={() => setActiveReceptionTab('special-requests')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeReceptionTab === 'special-requests'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                        }`}
                      >
                        Song Requests
                      </button>
                    </nav>
                  </div>

                  {/* Special Moments Content */}
                  {activeReceptionTab === 'special-songs' && (
                    <div className="space-y-6 mt-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Special Songs</h3>
                        <span className="text-sm text-gray-500">{receptionSpecialMoments.length} songs</span>
                      </div>

                      {/* Add Special Moment Button */}
                      <button
                        onClick={() => setReceptionSpecialMoments([...receptionSpecialMoments, { specialMomentType: '', clientSongTitle: '', clientArtist: '', clientLink: '', clientNote: '' }])}
                        className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
                      >
                        + Add Special Song
                      </button>

                      {/* Special Moments List */}
                      {receptionSpecialMoments.map((moment, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-900">Special Song {index + 1}</h4>
                            <button
                              onClick={() => setReceptionSpecialMoments(receptionSpecialMoments.filter((_, i) => i !== index))}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Special Moment</label>
                              <select
                                value={moment.specialMomentType}
                                onChange={(e) => {
                                  const newMoments = [...receptionSpecialMoments];
                                  newMoments[index].specialMomentType = e.target.value;
                                  setReceptionSpecialMoments(newMoments);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                              >
                                <option value="">Select special moment</option>
                                {getSpecialMomentTypes('reception').map((type) => (
                                  <option key={type} value={type}>
                                    {type}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Song</label>
                              <input
                                type="text"
                                value={moment.clientSongTitle}
                                onChange={(e) => {
                                  const newMoments = [...receptionSpecialMoments];
                                  newMoments[index].clientSongTitle = e.target.value;
                                  setReceptionSpecialMoments(newMoments);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter song title"
                              />
                            </div>
                          </div>

                          {/* Reason field - show when Custom is selected */}
                          {moment.specialMomentType === 'Custom' && (
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for this song</label>
                              <textarea
                                value={moment.reason || ''}
                                onChange={(e) => {
                                  const newMoments = [...receptionSpecialMoments];
                                  newMoments[index].reason = e.target.value;
                                  setReceptionSpecialMoments(newMoments);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Explain why this song is special for this moment"
                                rows={3}
                              />
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                              <input
                                type="text"
                                value={moment.clientArtist}
                                onChange={(e) => {
                                  const newMoments = [...receptionSpecialMoments];
                                  newMoments[index].clientArtist = e.target.value;
                                  setReceptionSpecialMoments(newMoments);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter artist name"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                              <input
                                type="url"
                                value={moment.clientLink}
                                onChange={(e) => {
                                  const newMoments = [...receptionSpecialMoments];
                                  newMoments[index].clientLink = e.target.value;
                                  setReceptionSpecialMoments(newMoments);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="YouTube, Spotify, or other link"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                            <textarea
                              value={moment.clientNote}
                              onChange={(e) => {
                                const newMoments = [...receptionSpecialMoments];
                                newMoments[index].clientNote = e.target.value;
                                setReceptionSpecialMoments(newMoments);
                              }}
                              rows={1}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                              placeholder="Special instructions or notes"
                            />
                          </div>
                        </div>
                      ))}

                      {receptionSpecialMoments.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>No special songs added yet</p>
                          <p className="text-sm mt-1">Click "Add Special Song" to get started</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Song Requests Content */}
                  {activeReceptionTab === 'special-requests' && (
                    <div className="space-y-6 mt-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Song Requests</h3>
                        <span className="text-sm text-gray-500">{receptionSpecialRequests.length}/5 requests</span>
                      </div>

                      {/* Add Request Button */}
                      {receptionSpecialRequests.length < 5 && (
                        <button
                          onClick={() => setReceptionSpecialRequests([...receptionSpecialRequests, { clientSongTitle: '', clientArtist: '', clientLink: '', clientNote: '' }])}
                          className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
                        >
                          + Add Song Request
                        </button>
                      )}

                      {/* Song Requests List */}
                      {receptionSpecialRequests.map((request, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-900">Request {index + 1}</h4>
                            <button
                              onClick={() => setReceptionSpecialRequests(receptionSpecialRequests.filter((_, i) => i !== index))}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Song</label>
                              <input
                                type="text"
                                value={request.clientSongTitle}
                                onChange={(e) => {
                                  const newRequests = [...receptionSpecialRequests];
                                  newRequests[index].clientSongTitle = e.target.value;
                                  setReceptionSpecialRequests(newRequests);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter song title"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                              <input
                                type="text"
                                value={request.clientArtist}
                                onChange={(e) => {
                                  const newRequests = [...receptionSpecialRequests];
                                  newRequests[index].clientArtist = e.target.value;
                                  setReceptionSpecialRequests(newRequests);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter artist name"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                              <input
                                type="url"
                                value={request.clientLink}
                                onChange={(e) => {
                                  const newRequests = [...receptionSpecialRequests];
                                  newRequests[index].clientLink = e.target.value;
                                  setReceptionSpecialRequests(newRequests);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="YouTube, Spotify, or other link"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                              <textarea
                                value={request.clientNote}
                                onChange={(e) => {
                                  const newRequests = [...receptionSpecialRequests];
                                  newRequests[index].clientNote = e.target.value;
                                  setReceptionSpecialRequests(newRequests);
                                }}
                                rows={1}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Special instructions or notes"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {receptionSpecialRequests.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>No song requests added yet</p>
                          <p className="text-sm mt-1">Click "Add Song Request" to get started</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reception Song List Content */}
                  {activeReceptionTab === 'reception-song-list' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Reception Song List</h3>
                        <span className="text-sm text-gray-500">{totalReceptionSongs} songs available</span>
                      </div>

                      {/* Song Progress Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <span className="mr-2">🎵</span>
                          Song Progress
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Definitely Play Card */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-green-800">🤘 Definitely Play</h5>
                              <span className="text-sm text-green-600">
                                {Object.values(receptionSongPreferences).filter(pref => pref === 'definitely').length}/50
                              </span>
                            </div>
                            <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (Object.values(receptionSongPreferences).filter(pref => pref === 'definitely').length / 25) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: 25-50 songs</p>
                            {Object.values(receptionSongPreferences).filter(pref => pref === 'definitely').length < 25 && (
                              <p className="text-sm text-orange-600 mt-1 flex items-center">
                                <span className="mr-1">⚠️</span>
                                Need more songs
                              </p>
                            )}
                          </div>

                          {/* If Mood Is Right Card */}
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-yellow-800">👍 If Mood Is Right</h5>
                              <span className="text-sm text-yellow-600">
                                {Object.values(receptionSongPreferences).filter(pref => pref === 'maybe').length}/∞
                              </span>
                            </div>
                            <div className="w-full bg-yellow-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (Object.values(receptionSongPreferences).filter(pref => pref === 'maybe').length / 25) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: ≥25 songs</p>
                            {Object.values(receptionSongPreferences).filter(pref => pref === 'maybe').length < 25 && (
                              <p className="text-sm text-orange-600 mt-1 flex items-center">
                                <span className="mr-1">⚠️</span>
                                Need more songs
                              </p>
                            )}
                          </div>

                          {/* Avoid Playing Card */}
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-red-800">👎 Avoid Playing</h5>
                              <span className="text-sm text-red-600">
                                {Object.values(receptionSongPreferences).filter(pref => pref === 'avoid').length}/25
                              </span>
                            </div>
                            <div className="w-full bg-red-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (Object.values(receptionSongPreferences).filter(pref => pref === 'avoid').length / 50) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: ≤50 songs</p>
                          </div>
                        </div>
                      </div>

                      {/* Songs List by Genre */}
                      <div className="bg-white rounded-lg border border-gray-200">
                        {isLoadingReception ? (
                          <div className="text-center py-8 text-gray-500">
                            <p>Loading songs...</p>
                          </div>
                        ) : sortedReceptionSongs.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <p>No songs available</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {receptionGenres.map((genre) => {
                              // Filter songs by genre
                              const genreSongs = sortedReceptionSongs.filter(song => 
                                song.genres && song.genres.some((g: any) => g.band === genre.band)
                              );

                              return (
                                <div key={genre.band} className="border border-gray-200 rounded-lg">
                                  <button
                                    onClick={() => setExpandedReceptionGenres(prev => ({
                                      ...prev,
                                      [genre.band]: !prev[genre.band]
                                    }))}
                                    className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 border-b border-gray-200 flex items-center justify-between"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <span className="text-lg font-medium text-gray-900">{genre.client}</span>
                                      <span className="text-sm text-gray-600">({genreSongs.length} songs)</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <svg
                                        className={`w-5 h-5 transform transition-transform ${
                                          expandedReceptionGenres[genre.band] ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </div>
                                  </button>
                                  
                                  {expandedReceptionGenres[genre.band] && (
                                    <div className="divide-y divide-gray-200">
                                      {genreSongs.map((song, index) => (
                                        <div key={song.id || index} className="p-4 hover:bg-gray-50">
                                          <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                              <div className="flex items-center space-x-4">
                                                <div>
                                                  <a
                                                    href={song.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-medium text-purple-600 hover:text-purple-800 underline"
                                                  >
                                                    {song.originalTitle}
                                                  </a>
                                                  <p className="text-sm text-gray-600">{song.originalArtist}</p>
                                                </div>
                                              </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                              <button
                                                onClick={() => setReceptionSongPreferences(prev => ({
                                                  ...prev,
                                                  [song.id]: prev[song.id] === 'definitely' ? undefined : 'definitely'
                                                }))}
                                                className={`px-3 py-1 text-sm rounded border ${
                                                  receptionSongPreferences[song.id] === 'definitely'
                                                    ? 'bg-green-100 text-green-800 border-green-300'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
                                                }`}
                                              >
                                                🤘 Definitely Play
                                              </button>
                                              <button
                                                onClick={() => setReceptionSongPreferences(prev => ({
                                                  ...prev,
                                                  [song.id]: prev[song.id] === 'maybe' ? undefined : 'maybe'
                                                }))}
                                                className={`px-3 py-1 text-sm rounded border ${
                                                  receptionSongPreferences[song.id] === 'maybe'
                                                    ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-yellow-50'
                                                }`}
                                              >
                                                👍 If the Mood is Right
                                              </button>
                                              <button
                                                onClick={() => setReceptionSongPreferences(prev => ({
                                                  ...prev,
                                                  [song.id]: prev[song.id] === 'avoid' ? undefined : 'avoid'
                                                }))}
                                                className={`px-3 py-1 text-sm rounded border ${
                                                  receptionSongPreferences[song.id] === 'avoid'
                                                    ? 'bg-red-100 text-red-800 border-red-300'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-red-50'
                                                }`}
                                              >
                                                👎 Avoid Playing
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* After Party Content */}
            {activeTab === 'after-party' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-purple-600 text-center">After Party</h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900">After Party - DJ + Violin + Sax</h4>
                  </div>
                  
                  {/* After Party Sub-tabs */}
                  <div className="border-b border-gray-200">
                    <nav className="flex justify-center space-x-8">
                      <button
                        onClick={() => setActiveAfterPartyTab('core-repertoire')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeAfterPartyTab === 'core-repertoire'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                        }`}
                      >
                        After Party Song List
                      </button>
                      <button
                        onClick={() => setActiveAfterPartyTab('special-songs')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeAfterPartyTab === 'special-songs'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                        }`}
                      >
                        Special Songs
                      </button>
                      <button
                        onClick={() => setActiveAfterPartyTab('special-requests')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeAfterPartyTab === 'special-requests'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                        }`}
                      >
                        Song Requests
                      </button>
                    </nav>
                  </div>

                  {/* Special Moments Content */}
                  {activeAfterPartyTab === 'special-songs' && (
                    <div className="space-y-6 mt-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Special Songs</h3>
                        <span className="text-sm text-gray-500">{afterPartySpecialMoments.length} songs</span>
                      </div>

                      {/* Add Special Moment Button */}
                      <button
                        onClick={() => setAfterPartySpecialMoments([...afterPartySpecialMoments, { specialMomentType: '', clientSongTitle: '', clientArtist: '', clientLink: '', clientNote: '' }])}
                        className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
                      >
                        + Add Special Song
                      </button>

                      {/* Special Moments List */}
                      {afterPartySpecialMoments.map((moment, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-900">Special Song {index + 1}</h4>
                            <button
                              onClick={() => setAfterPartySpecialMoments(afterPartySpecialMoments.filter((_, i) => i !== index))}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Special Moment</label>
                              <select
                                value={moment.specialMomentType}
                                onChange={(e) => {
                                  const newMoments = [...afterPartySpecialMoments];
                                  newMoments[index].specialMomentType = e.target.value;
                                  setAfterPartySpecialMoments(newMoments);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                              >
                                <option value="">Select special moment</option>
                                {getSpecialMomentTypes('after-party').map((type) => (
                                  <option key={type} value={type}>
                                    {type}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Song</label>
                              <input
                                type="text"
                                value={moment.clientSongTitle}
                                onChange={(e) => {
                                  const newMoments = [...afterPartySpecialMoments];
                                  newMoments[index].clientSongTitle = e.target.value;
                                  setAfterPartySpecialMoments(newMoments);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter song title"
                              />
                            </div>
                          </div>

                          {/* Reason field - show when Custom is selected */}
                          {moment.specialMomentType === 'Custom' && (
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for this song</label>
                              <textarea
                                value={moment.reason || ''}
                                onChange={(e) => {
                                  const newMoments = [...afterPartySpecialMoments];
                                  newMoments[index].reason = e.target.value;
                                  setAfterPartySpecialMoments(newMoments);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Explain why this song is special for this moment"
                                rows={3}
                              />
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                              <input
                                type="text"
                                value={moment.clientArtist}
                                onChange={(e) => {
                                  const newMoments = [...afterPartySpecialMoments];
                                  newMoments[index].clientArtist = e.target.value;
                                  setAfterPartySpecialMoments(newMoments);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter artist name"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                              <input
                                type="url"
                                value={moment.clientLink}
                                onChange={(e) => {
                                  const newMoments = [...afterPartySpecialMoments];
                                  newMoments[index].clientLink = e.target.value;
                                  setAfterPartySpecialMoments(newMoments);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="YouTube, Spotify, or other link"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                            <textarea
                              value={moment.clientNote}
                              onChange={(e) => {
                                const newMoments = [...afterPartySpecialMoments];
                                newMoments[index].clientNote = e.target.value;
                                setAfterPartySpecialMoments(newMoments);
                              }}
                              rows={1}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                              placeholder="Special instructions or notes"
                            />
                          </div>
                        </div>
                      ))}

                      {afterPartySpecialMoments.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>No special songs added yet</p>
                          <p className="text-sm mt-1">Click "Add Special Song" to get started</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Song Requests Content */}
                  {activeAfterPartyTab === 'special-requests' && (
                    <div className="space-y-6 mt-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Song Requests</h3>
                        <span className="text-sm text-gray-500">{afterPartySpecialRequests.length}/5 requests</span>
                      </div>

                      {/* Add Request Button */}
                      {afterPartySpecialRequests.length < 5 && (
                        <button
                          onClick={() => setAfterPartySpecialRequests([...afterPartySpecialRequests, { clientSongTitle: '', clientArtist: '', clientLink: '', clientNote: '' }])}
                          className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
                        >
                          + Add Song Request
                        </button>
                      )}

                      {/* Song Requests List */}
                      {afterPartySpecialRequests.map((request, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-900">Request {index + 1}</h4>
                            <button
                              onClick={() => setAfterPartySpecialRequests(afterPartySpecialRequests.filter((_, i) => i !== index))}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Song</label>
                              <input
                                type="text"
                                value={request.clientSongTitle}
                                onChange={(e) => {
                                  const newRequests = [...afterPartySpecialRequests];
                                  newRequests[index].clientSongTitle = e.target.value;
                                  setAfterPartySpecialRequests(newRequests);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter song title"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                              <input
                                type="text"
                                value={request.clientArtist}
                                onChange={(e) => {
                                  const newRequests = [...afterPartySpecialRequests];
                                  newRequests[index].clientArtist = e.target.value;
                                  setAfterPartySpecialRequests(newRequests);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter artist name"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                              <input
                                type="url"
                                value={request.clientLink}
                                onChange={(e) => {
                                  const newRequests = [...afterPartySpecialRequests];
                                  newRequests[index].clientLink = e.target.value;
                                  setAfterPartySpecialRequests(newRequests);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="YouTube, Spotify, or other link"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                              <textarea
                                value={request.clientNote}
                                onChange={(e) => {
                                  const newRequests = [...afterPartySpecialRequests];
                                  newRequests[index].clientNote = e.target.value;
                                  setAfterPartySpecialRequests(newRequests);
                                }}
                                rows={1}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Special instructions or notes"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {afterPartySpecialRequests.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>No song requests added yet</p>
                          <p className="text-sm mt-1">Click "Add Song Request" to get started</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* After Party Song List Content */}
                  {activeAfterPartyTab === 'core-repertoire' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">After Party Song List</h3>
                        <span className="text-sm text-gray-500">{filteredAfterPartySongs.length} songs available</span>
                      </div>

                      {/* Song Progress Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <span className="mr-2">🎵</span>
                          Song Progress
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Definitely Play Card */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-green-800">🤘 Definitely Play</h5>
                              <span className="text-sm text-green-600">
                                {Object.values(afterPartySongPreferences).filter(pref => pref === 'definitely').length}/30
                              </span>
                            </div>
                            <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (Object.values(afterPartySongPreferences).filter(pref => pref === 'definitely').length / 15) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: 15-30 songs</p>
                            {Object.values(afterPartySongPreferences).filter(pref => pref === 'definitely').length < 15 && (
                              <p className="text-sm text-orange-600 mt-1 flex items-center">
                                <span className="mr-1">⚠️</span>
                                Need more songs
                              </p>
                            )}
                            {Object.values(afterPartySongPreferences).filter(pref => pref === 'definitely').length > 30 && (
                              <p className="text-sm text-red-600 mt-1 flex items-center">
                                <span className="mr-1">🚨</span>
                                Over limit (max 30 songs)
                              </p>
                            )}
                          </div>

                          {/* If Mood Is Right Card */}
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-yellow-800">👍 If Mood Is Right</h5>
                              <span className="text-sm text-yellow-600">
                                {Object.values(afterPartySongPreferences).filter(pref => pref === 'maybe').length}/∞
                              </span>
                            </div>
                            <div className="w-full bg-yellow-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (Object.values(afterPartySongPreferences).filter(pref => pref === 'maybe').length / 20) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: ≥20 songs</p>
                            {Object.values(afterPartySongPreferences).filter(pref => pref === 'maybe').length < 20 && (
                              <p className="text-sm text-orange-600 mt-1 flex items-center">
                                <span className="mr-1">⚠️</span>
                                Need more songs
                              </p>
                            )}
                          </div>

                          {/* Avoid Playing Card */}
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-red-800">👎 Avoid Playing</h5>
                              <span className="text-sm text-red-600">
                                {Object.values(afterPartySongPreferences).filter(pref => pref === 'avoid').length}/25
                              </span>
                            </div>
                            <div className="w-full bg-red-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (Object.values(afterPartySongPreferences).filter(pref => pref === 'avoid').length / 50) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: ≤50 songs</p>
                          </div>
                        </div>
                      </div>

                      {/* Songs List */}
                      <div className="bg-white rounded-lg border border-gray-200">
                        {isLoadingAfterParty ? (
                          <div className="text-center py-8 text-gray-500">
                            <p>Loading songs...</p>
                          </div>
                        ) : filteredAfterPartySongs.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <p>No songs tagged for After Party</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-200">
                            {filteredAfterPartySongs.map((song, index) => (
                              <div key={song.id || index} className="p-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-4">
                                      <div>
                                        <a
                                          href={song.videoUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="font-medium text-purple-600 hover:text-purple-800 underline"
                                        >
                                          {song.originalTitle}
                                        </a>
                                        <p className="text-sm text-gray-600">{song.originalArtist}</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => setAfterPartySongPreferences(prev => ({
                                        ...prev,
                                        [song.id]: prev[song.id] === 'definitely' ? undefined : 'definitely'
                                      }))}
                                      className={`px-3 py-1 text-sm rounded border ${
                                        afterPartySongPreferences[song.id] === 'definitely'
                                          ? 'bg-green-100 text-green-800 border-green-300'
                                          : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
                                      }`}
                                    >
                                      🤘 Definitely Play
                                    </button>
                                    <button
                                      onClick={() => setAfterPartySongPreferences(prev => ({
                                        ...prev,
                                        [song.id]: prev[song.id] === 'maybe' ? undefined : 'maybe'
                                      }))}
                                      className={`px-3 py-1 text-sm rounded border ${
                                        afterPartySongPreferences[song.id] === 'maybe'
                                          ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                          : 'bg-white text-gray-700 border-gray-300 hover:bg-yellow-50'
                                      }`}
                                    >
                                      👍 If the Mood is Right
                                    </button>
                                    <button
                                      onClick={() => setAfterPartySongPreferences(prev => ({
                                        ...prev,
                                        [song.id]: prev[song.id] === 'avoid' ? undefined : 'avoid'
                                      }))}
                                      className={`px-3 py-1 text-sm rounded border ${
                                        afterPartySongPreferences[song.id] === 'avoid'
                                          ? 'bg-red-100 text-red-800 border-red-300'
                                          : 'bg-white text-gray-700 border-gray-300 hover:bg-red-50'
                                      }`}
                                    >
                                      👎 Avoid Playing
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}