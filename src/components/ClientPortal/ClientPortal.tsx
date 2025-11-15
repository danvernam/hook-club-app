'use client';

import { useState, useEffect } from 'react';
import SongsDatabase from '@/components/SongsDatabase/SongsDatabase';
import apiService from '@/services/api';

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState<'services' | 'getting-to-know-you' | 'preferences' | 'documents' | 'vendors' | 'welcome-party' | 'ceremony' | 'cocktail-hour' | 'reception' | 'after-party'>('services');
  const [activeView, setActiveView] = useState<'client-portal' | 'database'>('client-portal');
  const [activeWelcomePartyTab, setActiveWelcomePartyTab] = useState<'special-requests' | 'core-repertoire'>('core-repertoire');
  const [welcomePartyDanceExpanded, setWelcomePartyDanceExpanded] = useState(false);
  const [welcomePartyLightExpanded, setWelcomePartyLightExpanded] = useState(false);
  const [welcomePartyDJExpanded, setWelcomePartyDJExpanded] = useState(false);
  const [welcomePartyReceptionExpanded, setWelcomePartyReceptionExpanded] = useState(false);
  const [welcomePartyEnsembleRecommendationsExpanded, setWelcomePartyEnsembleRecommendationsExpanded] = useState(false);
  const [selectedWelcomePartyEnsemble, setSelectedWelcomePartyEnsemble] = useState<string>('Folk Band (Violin + Guitar + Bass + Drums)');
  const [pianoTrioExpanded, setPianoTrioExpanded] = useState(false);
  const [guestArrivalExpanded, setGuestArrivalExpanded] = useState(false);
  const [cocktailHourGeneralExpanded, setCocktailHourGeneralExpanded] = useState(false);
  const [afterPartyOnlyExpanded, setAfterPartyOnlyExpanded] = useState(false);
  const [fullVendorListSent, setFullVendorListSent] = useState(false);
  const [vendors, setVendors] = useState<Array<{
    id: string;
    category: string;
    name: string;
    email: string;
    socialMedia: string;
  }>>([]);
  const [activeCeremonyTab, setActiveCeremonyTab] = useState<'ceremony-music' | 'guest-arrival-requests' | 'guest-arrival'>('guest-arrival');
  const [activeCocktailHourTab, setActiveCocktailHourTab] = useState<'song-requests' | 'cocktail-hour-song-list'>('cocktail-hour-song-list');
  const [selectedCocktailHourEnsemble, setSelectedCocktailHourEnsemble] = useState<string>('Jazz Quartet (Sax + Piano + Bass + Drums)');
  const [cocktailHourEnsembleRecommendationsExpanded, setCocktailHourEnsembleRecommendationsExpanded] = useState(false);
  const [selectedCeremonyGuestArrivalEnsemble, setSelectedCeremonyGuestArrivalEnsemble] = useState<string>('Piano Trio (Violin + Cello + Piano)');
  const [selectedReceptionEnsemble, setSelectedReceptionEnsemble] = useState<string>('Full Band');
  const [selectedAfterPartyEnsemble, setSelectedAfterPartyEnsemble] = useState<string>('DJ + Musicians');
  const [ceremonyGuestArrivalEnsembleRecommendationsExpanded, setCeremonyGuestArrivalEnsembleRecommendationsExpanded] = useState(false);
  const [ceremonyGuestArrivalFullRepertoireExpanded, setCeremonyGuestArrivalFullRepertoireExpanded] = useState(false);
  const [ceremonyFullRepertoireExpanded, setCeremonyFullRepertoireExpanded] = useState(false);
  const [cocktailHourFullRepertoireExpanded, setCocktailHourFullRepertoireExpanded] = useState(false);
  const [activeAfterPartyTab, setActiveAfterPartyTab] = useState<'special-requests' | 'core-repertoire'>('core-repertoire');
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
  const [receptionEssentialRequests, setReceptionEssentialRequests] = useState<Array<{
    clientSongTitle: string;
    clientArtist: string;
    clientLink: string;
    clientNote: string;
  }>>([]);
  const [receptionAdditionalRequests, setReceptionAdditionalRequests] = useState<Array<{
    clientSongTitle: string;
    clientArtist: string;
    clientLink: string;
    clientNote: string;
  }>>([]);
  const [receptionPlaylists, setReceptionPlaylists] = useState<Array<{
    playlistLink: string;
    playlistType: string;
    customType: string;
    notes: string;
  }>>([]);
  const [receptionSongs, setReceptionSongs] = useState<any[]>([]);
  const [sortedReceptionSongs, setSortedReceptionSongs] = useState<any[]>([]);
  const [receptionSongPreferences, setReceptionSongPreferences] = useState<Record<string, 'definitely' | 'maybe' | 'avoid'>>({});
  const [isLoadingReception, setIsLoadingReception] = useState(false);
  const [expandedReceptionGenres, setExpandedReceptionGenres] = useState<Record<string, boolean>>({});
  const [expandedAfterPartyGenres, setExpandedAfterPartyGenres] = useState<Record<string, boolean>>({});

  // Vendor categories
  const vendorCategories = [
    '💒 Venue',
    '💍 Wedding Planner',
    '📆 Month-of Coordinator',
    '📋 Day-of Coordinator',
    '🧑‍💼 Venue Event Coordinator',
    '🥗 Caterer',
    '🌸 Florist',
    '📸 Photographer',
    '📹 Videographer',
    '🎞️ Photo Booth',
    '🍽️ Rentals',
    '🎂 Cake',
    '💇 Hair/Makeup',
    '🧑‍⚖️ Officiant',
    'Other'
  ];

  // Helper functions for vendors
  const addVendor = () => {
    const newVendor = {
      id: Date.now().toString(),
      category: '',
      name: '',
      email: '',
      socialMedia: ''
    };
    setVendors([...vendors, newVendor]);
  };

  const updateVendor = (id: string, field: string, value: string) => {
    setVendors(vendors.map(vendor => 
      vendor.id === id ? { ...vendor, [field]: value } : vendor
    ));
  };

  const removeVendor = (id: string) => {
    setVendors(vendors.filter(vendor => vendor.id !== id));
  };
  const [selectedStageLook, setSelectedStageLook] = useState<string>('');
  const [selectedWashLighting, setSelectedWashLighting] = useState<string>('');
  const [selectedUplightingColor, setSelectedUplightingColor] = useState<string>('');
  const [selectedUplightingBehavior, setSelectedUplightingBehavior] = useState<string>('');
  const [selectedHaze, setSelectedHaze] = useState<string>('');
  const [documentType, setDocumentType] = useState<string>('');
  const [activeDocumentsTab, setActiveDocumentsTab] = useState<'upload' | 'booking' | 'payment' | 'uploaded'>('upload');
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
    playlistDescription: string;
    playlistLink: string;
  }>>([]);
  const [ceremonyPlaylists, setCeremonyPlaylists] = useState<Array<{
    playlistDescription: string;
    playlistLink: string;
  }>>([]);
  const [cocktailHourPlaylists, setCocktailHourPlaylists] = useState<Array<{
    playlistDescription: string;
    playlistLink: string;
  }>>([]);
  const [afterPartyPlaylists, setAfterPartyPlaylists] = useState<Array<{
    playlistDescription: string;
    playlistLink: string;
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
  const [selectedDinnerBreakPlaylist, setSelectedDinnerBreakPlaylist] = useState<string>('');
  const [customDinnerBreakPlaylistLink, setCustomDinnerBreakPlaylistLink] = useState<string>('');
  const [playlistLinks, setPlaylistLinks] = useState<Array<{
    title: string;
    url: string;
  }>>([]);
  const [songsData, setSongsData] = useState<any>(null);

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

  const normalizeLightGenreLabel = (genre: any) => {
    if (!genre) return genre;
    const bandKey = normalizeBandKey(genre.band);
    const normalizedBand = isSlowJamsBand(genre.band) ? 'dinner entertainment' : bandKey;
    const updatedClient = lightGenreLabelOverrides[normalizedBand as string];
    const clientLabel = updatedClient || genre.client;
    return { ...genre, band: normalizedBand, client: clientLabel };
  };

  const normalizeSongGenres = (song: any) => {
    const rawDanceGenres = Array.isArray(song.danceGenres) ? song.danceGenres : [];
    const rawLightGenres = Array.isArray(song.lightGenres) ? song.lightGenres : [];
    const normalizedLight = rawLightGenres
      .map(normalizeLightGenreLabel)
      .reduce((acc: any[], genre: any) => {
        if (!acc.some(existing => existing.band === genre.band)) {
          acc.push(genre);
        }
        return acc;
      }, []);

    const hasSlowJamsLight = normalizedLight.some((genre: any) => genre.band === 'dinner entertainment');
    const migratedFromDance = rawDanceGenres.some((genre: any) => isSlowJamsBand(genre?.band));
    const migratedFromGenres = Array.isArray(song.genres)
      ? song.genres.some((genre: any) => isSlowJamsBand(genre?.band))
      : false;

    if (!hasSlowJamsLight && (migratedFromDance || migratedFromGenres)) {
      normalizedLight.push({
        client: lightGenreLabelOverrides['dinner entertainment'],
        band: 'dinner entertainment'
      });
    }

    return {
      ...song,
      danceGenres: rawDanceGenres
        .filter((genre: any) => !isSlowJamsBand(genre?.band))
        .map((genre: any) => ({
          ...genre,
          band: normalizeBandKey(genre?.band)
        })),
      lightGenres: normalizedLight,
      genres: Array.isArray(song.genres)
        ? song.genres.filter((genre: any) => !isSlowJamsBand(genre?.band))
        : song.genres
    };
  };
  
  // Load songs data for special moment recommendations and song lists
  useEffect(() => {
    const loadSongs = async () => {
      try {
        const data = await apiService.getSongs();
        const normalizedSongs = (data.songs || []).map(normalizeSongGenres);
        setSongsData({ ...data, songs: normalizedSongs });
        setSongs(normalizedSongs || []);
        
        // Debug: Log songs with sections
        console.log('Loaded songs:', normalizedSongs?.length || 0);
        const songsWithSections = (normalizedSongs || []).filter((song: any) => song.sections && song.sections.length > 0);
        console.log('Songs with sections:', songsWithSections.length);
        songsWithSections.forEach((song: any) => {
          console.log(`${song.originalTitle} - sections:`, song.sections, 'isLive:', song.isLive);
        });
        
        // Sort songs by artist A-Z for the welcome party tab
        const sorted = [...(normalizedSongs || [])].sort((a, b) => 
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

  // Filter songs for Welcome Party - Dance Music Repertoire (all reception dance genres, excluding after party songs)
  const filteredWelcomePartyDanceSongs = songs.filter(song => 
    song.isLive && song.danceGenres && song.danceGenres.length > 0
  );

  // Filter songs for Welcome Party - DJ Song List (after party songs)
  const filteredWelcomePartyDJSongs = songs.filter(song => 
    song.isLive && song.sections && song.sections.includes('afterParty')
  );

  // Filter songs for Welcome Party - Light Music Repertoire (light bops, crooner corner, salad jazz, dinner entertainment, ceremony, cocktail hour)
  const filteredWelcomePartyLightSongs = songs.filter(song => 
    song.isLive && (
      // Light bops, crooner corner, salad jazz, dinner entertainment
      (song.lightGenres && song.lightGenres.some((genre: any) => 
        ['guest entrance', 'crooner corner', 'salad jazz', 'dinner entertainment'].includes((genre.band || '').toLowerCase())
      )) ||
      // Ceremony or cocktail hour ensembles
      (song.sections && (song.sections.includes('ceremony') || song.sections.includes('cocktailHour')))
    )
  );

  const ceremonyEnsembles = [
    "Solo Piano", 
    "Solo Guitar", 
    "Classic Duo (Piano + Guitar)", 
    "Lounge Duo (Vocalist + Piano)", 
    "Café Duo (Vocalist + Guitar)", 
    "Solo Violin", 
    "Solo Cello", 
    "Violin w/ Tracks (Violin + DJ)", 
    "Cello w/ Tracks (Cello + DJ)", 
    "String Duo (Violin + Cello)", 
    "Violin Duo (Violin I + Violin II)", 
    "Folk Duo (Violin + Guitar)", 
    "Elegant Duo (Violin + Piano)", 
    "Guitar Trio (Violin + Cello + Guitar)", 
    "Piano Trio (Violin + Cello + Piano)", 
    "Chamber Quartet (Violin + Cello + Guitar + Piano)", 
    "String Quartet (Violin I + Violin II + Viola + Cello)"
  ];

  const cocktailHourEnsembles = [
    "Jazzy Duo (Sax + Guitar)", 
    "Timeless Duo (Sax + Piano)", 
    "Power Duo (Guitar + Bass)", 
    "Funky Trio (Sax + Bass + Drums)", 
    "Organ Trio (Organ + Bass + Drums)", 
    "Jazzy Trio (Sax + Guitar + Drums)", 
    "Power Trio (Guitar + Bass + Drums)", 
    "Vocal Trio (Vocalist + Sax + Guitar)", 
    "Sax w/ Tracks (Sax + DJ)", 
    "Violin w/ Tracks (Violin + DJ)", 
    "Violin + Sax w/ Tracks (Violin + Sax + DJ)", 
    "Guitar Trio (Violin + Cello + Guitar)", 
    "Piano Trio (Violin + Cello + Piano)", 
    "Jazz Quartet (Sax + Piano + Bass + Drums)", 
    "Folk Band (Violin + Guitar + Bass + Drums)", 
    "Chamber Quartet (Violin + Cello + Guitar + Piano)", 
    "String Quartet (Violin I + Violin II + Viola + Cello)"
  ];

  // Organize cocktail hour ensembles by size
  const cocktailHourDuos = cocktailHourEnsembles.filter(e => e.includes('Duo')).sort();
  const cocktailHourTrios = cocktailHourEnsembles.filter(e => e.includes('Trio')).sort();
  const cocktailHourQuartets = cocktailHourEnsembles.filter(e => e.includes('Quartet')).sort();
  const cocktailHourWithTracks = cocktailHourEnsembles.filter(e => e.includes('w/ Tracks')).sort();
  const cocktailHourBands = cocktailHourEnsembles.filter(e => e.includes('Band')).sort();

  const ceremonyEnsembleSet = new Set(ceremonyEnsembles);
  const cocktailHourEnsembleSet = new Set(cocktailHourEnsembles);

  const receptionAndAfterPartyEnsembles = [
    "Solo DJ",
    "DJ + Musicians",
    "DJ Band",
    "Classic Band",
    "Full Band"
  ];

  const isCeremonySection = (section: string | undefined) => {
    if (!section) return false;
    return section.toLowerCase().replace(/[\s_-]/g, '') === 'ceremony';
  };

  const filteredCeremonyGuestArrivalSongs = songs.filter(song => {
    if (!song.isLive) {
      return false;
    }
    
    if (!song.ensembles || !Array.isArray(song.ensembles)) {
      return false;
    }
    
    if (!song.ensembles.includes(selectedCeremonyGuestArrivalEnsemble)) {
      return false;
    }

    if (Array.isArray(song.sections) && song.sections.length > 0) {
      const hasCeremonySection = song.sections.some((section: string) => isCeremonySection(section));
      return hasCeremonySection;
    }

    // If no sections array, allow it (for backward compatibility)
    return true;
  });
  
  // Debug logging (remove in production)
  useEffect(() => {
    if (selectedCeremonyGuestArrivalEnsemble === 'Lounge Duo (Vocalist + Piano)') {
      const loungeDuoSongs = songs.filter(s => 
        s.isLive && 
        s.ensembles && 
        Array.isArray(s.ensembles) && 
        s.ensembles.includes('Lounge Duo (Vocalist + Piano)')
      );
      const filteredCount = filteredCeremonyGuestArrivalSongs.length;
      console.log('All Lounge Duo songs:', loungeDuoSongs.length);
      console.log('Filtered Lounge Duo Ceremony songs:', filteredCount);
      if (filteredCount === 0 && loungeDuoSongs.length > 0) {
        console.log('Sample Lounge Duo song sections:', loungeDuoSongs[0]?.sections);
      }
    }
  }, [selectedCeremonyGuestArrivalEnsemble, songs.length]);

  const ceremonyGuestArrivalPreferenceCounts = filteredCeremonyGuestArrivalSongs.reduce(
    (acc, song) => {
      const songId = song.id as string | undefined;
      if (!songId) {
        return acc;
      }
      const preference = guestArrivalSongPreferences[songId];
      if (preference) {
        acc[preference] = acc[preference] + 1;
      }
      return acc;
    },
    { definitely: 0, maybe: 0, avoid: 0 } as Record<'definitely' | 'maybe' | 'avoid', number>
  );

  const filteredCeremonyGuestArrivalSongIds = new Set(
    filteredCeremonyGuestArrivalSongs
      .map(song => song.id)
      .filter((id): id is string => Boolean(id))
  );

  const fullCeremonyGuestArrivalSongs = songs.filter(song => {
    if (!song.isLive || !song.ensembles || !song.ensembles.some((ensemble: string) => ceremonyEnsembleSet.has(ensemble))) {
      return false;
    }

    if (song.id && filteredCeremonyGuestArrivalSongIds.has(song.id)) {
      return false;
    }

    if (Array.isArray(song.sections) && song.sections.length > 0) {
      return song.sections.some((section: string) => isCeremonySection(section));
    }

    return true;
  });

  const sortedFullCeremonyGuestArrivalSongs = [...fullCeremonyGuestArrivalSongs].sort((a, b) =>
    (a.originalTitle || '').localeCompare(b.originalTitle || '')
  );

  // Full Ceremony Repertoire (all ceremony ensemble songs, excluding the filtered ones)
  const fullCeremonySongs = songs.filter(song => {
    if (!song.isLive || !song.ensembles || !song.ensembles.some((ensemble: string) => ceremonyEnsembleSet.has(ensemble))) {
      return false;
    }

    if (song.id && filteredCeremonyGuestArrivalSongIds.has(song.id)) {
      return false;
    }

    if (Array.isArray(song.sections) && song.sections.length > 0) {
      return song.sections.some((section: string) => isCeremonySection(section));
    }

    return true;
  });

  const sortedFullCeremonySongs = [...fullCeremonySongs].sort((a, b) =>
    (a.originalTitle || '').localeCompare(b.originalTitle || '')
  );

  const formatEnsembleSummary = (ensemble: string) => {
    const match = ensemble.match(/^(.*?)\s*\((.*)\)$/);
    if (!match) {
      return ensemble;
    }
    const [, name, details] = match;
    const formattedDetails = details
      .split('+')
      .map(part => part.trim())
      .filter(Boolean)
      .join(' • ');
    return formattedDetails ? `${name.trim()} - ${formattedDetails}` : name.trim();
  };

  const receptionAfterPartyEnsembleDetails: Record<string, string> = {
    "Solo DJ": "DJ • Curated Mixes • Emcee Support",
    "DJ + Musicians": "DJ • Featured Instrumentalists (e.g., Sax, Violin)",
    "DJ Band": "DJ • Vocalist • Instrumentalists",
    "Classic Band": "8–11 Piece Live Band • Horn Section",
    "Full Band": "12+ Piece Show Band • Multiple Vocalists & Horns"
  };

  const getReceptionAfterPartyEnsembleSummary = (ensemble: string) => {
    const detail = receptionAfterPartyEnsembleDetails[ensemble];
    if (detail) {
      return `${ensemble} - ${detail}`;
    }
    return formatEnsembleSummary(ensemble);
  };

  const preferenceLabels: Record<'definitely' | 'maybe' | 'avoid', string> = {
    definitely: 'Definitely Play',
    maybe: 'If The Mood Is Right',
    avoid: 'Avoid Playing'
  };

  const getSongKey = (song: any) => {
    if (!song) return '';
    if (song.id) return `id:${song.id}`;
    const title = (song.originalTitle || '').toLowerCase();
    const artist = (song.originalArtist || '').toLowerCase();
    if (!title && !artist) return '';
    return `title:${title}::artist:${artist}`;
  };

  const renderSongPreferenceControls = (song: any, context: 'reception' | 'afterParty') => {
    const songKey = getSongKey(song);
    const isReceptionContext = context === 'reception';
    const localPreferences = isReceptionContext ? receptionSongPreferences : afterPartySongPreferences;
    const setLocalPreferences = isReceptionContext ? setReceptionSongPreferences : setAfterPartySongPreferences;
    const otherPreferences = isReceptionContext ? afterPartySongPreferences : receptionSongPreferences;
    const setOtherPreferences = isReceptionContext ? setAfterPartySongPreferences : setReceptionSongPreferences;
    const otherTabLabel = isReceptionContext ? 'After Party' : 'Reception';

    const localPreference = songKey ? (localPreferences as any)[songKey] : undefined;
    const otherPreference = songKey ? (otherPreferences as any)[songKey] : undefined;

    const handleLocalToggle = (target: 'definitely' | 'maybe' | 'avoid') => {
      if (!songKey) {
        return;
      }
      setLocalPreferences((prev: Record<string, 'definitely' | 'maybe' | 'avoid'>) => {
        const currentValue = (prev as any)[songKey];
        const updated = { ...prev } as Record<string, 'definitely' | 'maybe' | 'avoid'>;
        if (currentValue === target) {
          delete updated[songKey];
        } else {
          updated[songKey] = target;
        }
        return updated;
      });
    };

    const handleOtherUpdate = (target: 'definitely' | 'maybe' | 'avoid' | 'clear') => {
      if (!songKey) {
        return;
      }
      setOtherPreferences((prev: Record<string, 'definitely' | 'maybe' | 'avoid'>) => {
        const updated = { ...prev } as Record<string, 'definitely' | 'maybe' | 'avoid'>;
        if (target === 'clear') {
          delete updated[songKey];
        } else {
          updated[songKey] = target;
        }
        return updated;
      });
    };

    if (otherPreference) {
      return (
        <div className="sm:ml-4">
          <div className="inline-flex flex-col bg-purple-50 border border-purple-200 rounded-md px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-purple-700 font-medium leading-snug">
                <span className="block">Song Already Marked On:</span>
                <span className="block font-semibold">{otherTabLabel} Tab</span>
              </p>
              <button
                onClick={() => handleOtherUpdate('clear')}
                className="px-3 py-1 text-sm rounded border border-purple-200 text-purple-600 hover:bg-purple-100 transition-colors"
              >
                Clear Selection
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-2">
              {(['definitely', 'maybe', 'avoid'] as const).map(option => (
                <button
                  key={option}
                  onClick={() => handleOtherUpdate(option)}
                  className={`px-3 py-1 text-sm rounded border transition-colors ${
                    otherPreference === option
                      ? 'bg-purple-100 text-purple-800 border-purple-300'
                      : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  {option === 'definitely' && '🤘'}{option === 'maybe' && '👍'}{option === 'avoid' && '👎'}{' '}
                  {preferenceLabels[option]}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleLocalToggle('definitely')}
          className={`px-3 py-1 text-sm rounded border ${
            localPreference === 'definitely'
              ? 'bg-green-100 text-green-800 border-green-300'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
          }`}
        >
          🤘 Definitely Play
        </button>
        <button
          onClick={() => handleLocalToggle('maybe')}
          className={`px-3 py-1 text-sm rounded border ${
            localPreference === 'maybe'
              ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-yellow-50'
          }`}
        >
          👍 If The Mood is Right
        </button>
        <button
          onClick={() => handleLocalToggle('avoid')}
          className={`px-3 py-1 text-sm rounded border ${
            localPreference === 'avoid'
              ? 'bg-red-100 text-red-800 border-red-300'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-red-50'
          }`}
        >
          👎 Avoid Playing
        </button>
      </div>
    );
  };

  const receptionGenres = [
    { client: "🎷 Souled Out", band: "soul" },
    { client: "💯 Cream Of The Pop", band: "pop" },
    { client: "🎸 Rock Of Ages", band: "rock" },
    { client: "🎧 Can't Stop Hip Hop", band: "hip hop" },
    { client: "🛑 Stop! In The Name Of Motown", band: "motown" },
    { client: "🤘 Instant Mosh", band: "punk" },
    { client: "📖 The Latin Bible", band: "latin" },
    { client: "🕺 Studio '25", band: "disco" },
    { client: "🤠 Country For All", band: "country" },
    { client: "🚀 Next Level Bops", band: "popedm" },
    { client: "🌴 Top Of The Tropics", band: "caribbean" },
    { client: "💃 Get In Formation", band: "group-dances" },
    { client: "✨ Songs That Slay", band: "lgbtq" },
    { client: "🔥 Because I Got Lit", band: "club" },
    { client: "🌍 THC Worldwide", band: "world" },
    { client: "🎉 All The Rave", band: "rave" },
    { client: "🤔 What Do You Meme", band: "meme" },
    { client: "⭐ The Stars of La La Land", band: "showtunes" },
    { client: "🎈 Light Bops", band: "guest entrance" },
    { client: "🎺 Crooner Corner", band: "crooner corner" },
    { client: "🥗 Salad Jazz", band: "salad jazz" },
    { client: "🎻 Slow Jams", band: "dinner entertainment" }
  ];
  const lightGenreBands = ['guest entrance', 'crooner corner', 'salad jazz', 'dinner entertainment'];

  // Genres to exclude when Classic Band is selected
  const classicBandExcludedGenres = ["caribbean", "group-dances", "lgbtq", "club", "rave", "meme", "showtunes", "world"];

  // Filter genres based on selected ensemble
  const getFilteredReceptionGenres = () => {
    if (selectedReceptionEnsemble === 'Classic Band') {
      return receptionGenres.filter(genre => !classicBandExcludedGenres.includes(genre.band));
    }
    return receptionGenres;
  };

  const getFilteredAfterPartyGenres = () => {
    if (selectedAfterPartyEnsemble === 'Classic Band') {
      return receptionGenres.filter(genre => !classicBandExcludedGenres.includes(genre.band));
    }
    return receptionGenres;
  };

  // Filter genres for Welcome Party Reception Repertoire
  // If a reception ensemble is selected, use the same filtering as Reception tab
  // Otherwise, always use Classic Band exclusions
  const getFilteredWelcomePartyReceptionGenres = () => {
    // Check if selected ensemble is a reception ensemble
    const isReceptionEnsemble = receptionAndAfterPartyEnsembles.includes(selectedWelcomePartyEnsemble);
    
    if (isReceptionEnsemble) {
      // Use the same filtering logic as Reception tab
      if (selectedWelcomePartyEnsemble === 'Classic Band') {
        return receptionGenres.filter(genre => !classicBandExcludedGenres.includes(genre.band));
      }
      // For other reception ensembles, show all genres
      return receptionGenres;
    }
    
    // For ceremony/cocktail hour ensembles, always use Classic Band exclusions
    return receptionGenres.filter(genre => !classicBandExcludedGenres.includes(genre.band));
  };

  const afterPartySongsWithFlag = sortedAfterPartySongs.filter(song =>
    song.isLive && Array.isArray(song.sections) && song.sections.includes('afterParty')
  );

  const afterPartyGenresWithSongs = getFilteredAfterPartyGenres()
    .map((genre) => {
      const isLightGenre = lightGenreBands.includes(genre.band);
      const genreSongs = afterPartySongsWithFlag.filter((song) => {
        const collection = isLightGenre ? song.lightGenres : song.danceGenres;
        return Array.isArray(collection) && collection.some((g: any) => g.band === genre.band);
      });

      return {
        genre,
        songs: genreSongs,
        isLightGenre
      };
    })
    .filter(({ songs }) => songs.length > 0);

  const allGenreBands = new Set(receptionGenres.map((genre) => genre.band));
  const afterPartyUngroupedSongs = afterPartySongsWithFlag.filter((song) => {
    const hasDanceGenre = Array.isArray(song.danceGenres) && song.danceGenres.some((g: any) => allGenreBands.has(g.band));
    const hasLightGenre = Array.isArray(song.lightGenres) && song.lightGenres.some((g: any) => allGenreBands.has(g.band));
    return !hasDanceGenre && !hasLightGenre;
  });
  const totalAfterPartySongs = new Set(afterPartySongsWithFlag.map(getSongKey)).size;

  // Count songs available for selected After Party ensemble (based on filtered genres)
  // Returns the SUM of genre songs + ungrouped songs as displayed in UI
  const getAfterPartySongsCount = () => {
    const filteredGenres = getFilteredAfterPartyGenres();
    // Count genre-filtered songs by summing counts from each genre as displayed
    let genreSongsCount = 0;
    filteredGenres.forEach(genre => {
      const isLightGenre = lightGenreBands.includes(genre.band);
      const genreSongs = afterPartySongsWithFlag.filter(song => {
        if (!song.isLive) return false;
        const collection = isLightGenre ? song.lightGenres : song.danceGenres;
        return Array.isArray(collection) && collection.some((g: any) => g.band === genre.band);
      });
      genreSongsCount += genreSongs.length;
    });
    
    // Add ungrouped songs count as displayed in UI
    const ungroupedCount = afterPartyUngroupedSongs.length;
    
    // Return sum of both (as displayed in UI), not deduplicated
    return genreSongsCount + ungroupedCount;
  };

  // Helper function to count instruments in an ensemble name
  const countInstruments = (ensemble: string): number => {
    // Check for Solo = 1
    if (ensemble.includes('Solo ')) return 1;
    
    // Check for Duo = 2
    if (ensemble.includes('Duo')) return 2;
    
    // Check for Trio = 3
    if (ensemble.includes('Trio')) return 3;
    
    // Check for Quartet = 4
    if (ensemble.includes('Quartet')) return 4;
    
    // Check for Band - count instruments in parentheses or default to 4
    if (ensemble.includes('Band')) {
      const match = ensemble.match(/\(([^)]+)\)/);
      if (match) {
        // Count "+" signs and add 1
        return (match[1].match(/\+/g) || []).length + 1;
      }
      return 4; // Default for Band
    }
    
    // For "w/ Tracks" ensembles, count instruments in parentheses
    if (ensemble.includes('w/ Tracks')) {
      const match = ensemble.match(/\(([^)]+)\)/);
      if (match) {
        // Count "+" signs and add 1
        return (match[1].match(/\+/g) || []).length + 1;
      }
      return 2; // Default for w/ Tracks
    }
    
    // Default fallback
    return 0;
  };

  // Get all ceremony, cocktail hour, and reception ensembles (combined, no duplicates)
  // Separate into Small Ensembles and Reception Ensembles for dropdown grouping
  // Sort small ensembles by instrument count, then alphabetically within same count
  const allSmallEnsembles = Array.from(new Set([...ceremonyEnsembles, ...cocktailHourEnsembles]));
  const smallEnsembles = allSmallEnsembles.sort((a, b) => {
    const countA = countInstruments(a);
    const countB = countInstruments(b);
    if (countA !== countB) {
      return countA - countB; // Sort by instrument count
    }
    return a.localeCompare(b); // Then alphabetically
  });
  const receptionEnsembles = [...receptionAndAfterPartyEnsembles].sort();
  const allWelcomePartyEnsembles = [...smallEnsembles, ...receptionEnsembles];
  
  // Check if selected ensemble appears in both ceremony and cocktail hour
  const isEnsembleInCeremony = ceremonyEnsembles.includes(selectedWelcomePartyEnsemble);
  const isEnsembleInCocktailHour = cocktailHourEnsembles.includes(selectedWelcomePartyEnsemble);
  const isEnsembleInBoth = isEnsembleInCeremony && isEnsembleInCocktailHour;
  const isReceptionEnsemble = receptionAndAfterPartyEnsembles.includes(selectedWelcomePartyEnsemble);
  
  // Filter songs for selected ensemble
  const filteredWelcomePartyEnsembleSongs = songs.filter(song => 
    song.isLive && song.ensembles && song.ensembles.includes(selectedWelcomePartyEnsemble)
  );
  
  // If ensemble is in both, split into Light Music (ceremony) and Upbeat Music (cocktail hour)
  const filteredWelcomePartyEnsembleLightSongs = isEnsembleInBoth 
    ? filteredWelcomePartyEnsembleSongs.filter(song => 
        song.sections && song.sections.includes('Ceremony')
      )
    : [];
    
  const filteredWelcomePartyEnsembleUpbeatSongs = isEnsembleInBoth
    ? filteredWelcomePartyEnsembleSongs.filter(song => 
        song.sections && song.sections.includes('Cocktail Hour')
      )
    : filteredWelcomePartyEnsembleSongs;
  
  // Legacy filter for backward compatibility
  const filteredWelcomePartyFolkBandSongs = filteredWelcomePartyEnsembleSongs;

  // Filter songs for Cocktail Hour based on selected ensemble
  const cocktailHourSectionIdentifiers = new Set([
    'cocktailhour',
    'cocktail hour',
    'cocktail_hour'
  ]);

  const isCocktailHourSection = (section: string | undefined) => {
    if (!section) return false;
    const normalized = section.toLowerCase().replace(/[\s_-]/g, '');
    return cocktailHourSectionIdentifiers.has(normalized) || cocktailHourSectionIdentifiers.has(section.toLowerCase());
  };

  const filteredCocktailHourSongs = songs.filter(song => {
    if (!song.isLive || !song.ensembles || !song.ensembles.includes(selectedCocktailHourEnsemble)) {
      return false;
    }

    // If sections exist, ensure this song is tagged for Cocktail Hour
    if (Array.isArray(song.sections) && song.sections.length > 0) {
      return song.sections.some((section: string) => isCocktailHourSection(section));
    }

    return true;
  });

  const cocktailHourPreferenceCounts = filteredCocktailHourSongs.reduce(
    (acc, song) => {
      const preference = cocktailHourSongPreferences[song.id as string];
      if (preference) {
        acc[preference] = acc[preference] + 1;
      }
      return acc;
    },
    { definitely: 0, maybe: 0, avoid: 0 } as Record<'definitely' | 'maybe' | 'avoid', number>
  );

  const filteredCocktailHourSongIds = new Set(
    filteredCocktailHourSongs
      .map(song => song.id)
      .filter((id): id is string => Boolean(id))
  );

  const fullCocktailHourSongs = songs.filter(song => {
    if (!song.isLive || !song.ensembles || !song.ensembles.some((ensemble: string) => cocktailHourEnsembleSet.has(ensemble))) {
      return false;
    }

    if (song.id && filteredCocktailHourSongIds.has(song.id)) {
      return false;
    }

    if (Array.isArray(song.sections) && song.sections.length > 0) {
      return song.sections.some((section: string) => isCocktailHourSection(section));
    }

    return true;
  });

  const sortedFullCocktailHourSongs = [...fullCocktailHourSongs].sort((a, b) =>
    (a.originalTitle || '').localeCompare(b.originalTitle || '')
  );

  // Filter songs for After Party (only show songs tagged with after party section)
  const filteredAfterPartySongs = songs.filter(song => 
    song.isLive && song.sections && song.sections.includes('afterParty')
  );

  const afterPartyPreferenceCounts = filteredAfterPartySongs.reduce(
    (acc, song) => {
      const preference = afterPartySongPreferences[song.id as string];
      if (preference) {
        acc[preference] = acc[preference] + 1;
      }
      return acc;
    },
    { definitely: 0, maybe: 0, avoid: 0 } as Record<'definitely' | 'maybe' | 'avoid', number>
  );

  // Filter songs for Reception - separate into dance and light music
  const filteredReceptionDanceSongs = songs.filter(song =>
    song.danceGenres && song.danceGenres.length > 0 && song.isLive
  );
  
  const filteredReceptionLightSongs = songs.filter(song =>
    song.lightGenres && song.lightGenres.length > 0 && song.isLive
  );

  // Filter songs for Dinner Entertainment (only show songs tagged with dinner entertainment light genre)
  const filteredDinnerEntertainmentSongs = songs.filter(song => 
    song.lightGenres && song.lightGenres.some((genre: any) => 
      (genre.band || '').toLowerCase().includes('dinner entertainment')
    )
  );

  // Count total unique songs available in Reception (across dance and light music)
  const totalReceptionSongs = new Set(
    [...filteredReceptionDanceSongs, ...filteredReceptionLightSongs].map(getSongKey)
  ).size;

  // Count songs available for selected Reception ensemble (based on filtered genres)
  // Returns the SUM of all genre song counts as displayed in UI
  const getReceptionSongsCount = () => {
    const filteredGenres = getFilteredReceptionGenres();
    let totalCount = 0;
    
    // Sum up all genre song counts exactly as displayed in the UI
    filteredGenres.forEach(genre => {
      const isLightGenre = lightGenreBands.includes(genre.band);
      const genreSongs = sortedReceptionSongs.filter(song => {
        if (!song.isLive) return false;
        const collection = isLightGenre ? song.lightGenres : song.danceGenres;
        return Array.isArray(collection) && collection.some((g: any) => g.band === genre.band);
      });
      // Only count genres that have songs (same as UI: if (genreSongs.length === 0) return null)
      if (genreSongs.length > 0) {
        totalCount += genreSongs.length;
      }
    });
    
    return totalCount;
  };

  // Count songs available for selected Welcome Party ensemble
  // Includes ensemble-specific songs + reception repertoire (if not a reception ensemble)
  // Returns the SUM of both counts (as displayed in UI), not deduplicated
  const getWelcomePartySongsCount = () => {
    // Calculate ensemble-specific count as displayed in UI
    let ensembleCount;
    if (isEnsembleInBoth) {
      // When ensemble is in both ceremony and cocktail hour, count light + upbeat songs separately
      ensembleCount = filteredWelcomePartyEnsembleLightSongs.length + filteredWelcomePartyEnsembleUpbeatSongs.length;
    } else {
      // Otherwise, use the full ensemble-specific songs
      ensembleCount = filteredWelcomePartyEnsembleSongs.length;
    }
    
    // If it's not a reception ensemble, include reception repertoire songs
    if (!isReceptionEnsemble) {
      // Return the sum of both counts as they appear in the UI
      const receptionCount = totalWelcomePartyReceptionSongs;
      return ensembleCount + receptionCount;
    }
    
    // For reception ensembles, only count ensemble-specific songs
    return ensembleCount;
  };

  // Count songs available for selected Ceremony ensemble
  // Returns the SUM of ensemble-specific + full repertoire as displayed in UI
  const getCeremonySongsCount = () => {
    // Ensemble-specific count (as displayed in UI)
    const ensembleCount = filteredCeremonyGuestArrivalSongs.length;
    // Full ceremony repertoire count (as displayed in UI)
    const fullRepertoireCount = sortedFullCeremonySongs.length;
    // Return sum of both (as displayed in UI), not deduplicated
    return ensembleCount + fullRepertoireCount;
  };

  // Count songs available for selected Cocktail Hour ensemble
  // Returns the SUM of ensemble-specific + full repertoire as displayed in UI
  const getCocktailHourSongsCount = () => {
    // Ensemble-specific count (as displayed in UI)
    const ensembleCount = filteredCocktailHourSongs.length;
    // Full cocktail hour repertoire count (as displayed in UI)
    const fullRepertoireCount = sortedFullCocktailHourSongs.length;
    // Return sum of both (as displayed in UI), not deduplicated
    return ensembleCount + fullRepertoireCount;
  };

  // Count total unique songs for Welcome Party Reception Repertoire (using filtered genres)
  const filteredWelcomePartyReceptionGenresList = getFilteredWelcomePartyReceptionGenres();
  const welcomePartyReceptionSongs = sortedSongs.filter(song => {
    if (!song.isLive) return false;
    return filteredWelcomePartyReceptionGenresList.some(genre => {
      const isLightGenre = lightGenreBands.includes(genre.band);
      const songGenres = isLightGenre ? song.lightGenres : song.danceGenres;
      return Array.isArray(songGenres) && songGenres.some((g: any) => g.band === genre.band);
    });
  });
  const totalWelcomePartyReceptionSongs = new Set(welcomePartyReceptionSongs.map(getSongKey)).size;

  // Get recommended songs from database based on special moment type
  // For reception, checks ensemble-specific recommendations if ensemble is provided
  const getRecommendedSongs = (momentType: string, section?: string, ensemble?: string) => {
    if (!songsData || !songsData.songs) return [];
    
    return songsData.songs
      .filter((song: any) => {
        // For reception section, check ensemble-specific recommendations first
        if (section === 'reception' && ensemble && song.receptionEnsembleRecommendations) {
          const ensembleRecs = song.receptionEnsembleRecommendations[ensemble];
          if (Array.isArray(ensembleRecs) && ensembleRecs.includes(momentType)) {
            return true;
          }
        }
        
        // Fallback to general special moment types
        if (song.specialMomentTypes && song.specialMomentTypes.length > 0) {
          return song.specialMomentTypes.includes(momentType);
        }
        
        return false;
      })
      .map((song: any) => ({
        title: song.originalTitle || song.thcTitle,
        artist: song.originalArtist || song.thcArtist,
        videoUrl: song.videoUrl || '',
        spotifyUrl: song.spotifyUrl || '',
        id: song.id
      }));
  };

  // Helper function to check if a song is selected as a reception special moment
  const isSongSelectedAsReceptionSpecialMoment = (songId: string) => {
    if (!receptionSpecialMoments || receptionSpecialMoments.length === 0) return null;
    const song = songs?.find((s: any) => s.id === songId);
    if (!song) return null;
    
    for (const moment of receptionSpecialMoments) {
      if (moment.clientSongTitle && moment.clientArtist) {
        const momentTitle = normalizeText(moment.clientSongTitle);
        const momentArtist = normalizeText(moment.clientArtist);
        const songTitle = normalizeText(song.originalTitle || song.thcTitle || '');
        const songArtist = normalizeText(song.originalArtist || song.thcArtist || '');
        
        if (momentTitle === songTitle && momentArtist === songArtist) {
          return moment.specialMomentType;
        }
      }
    }
    return null;
  };

  // Helper function to check if a song is selected as a ceremony processional/recessional
  const isSongSelectedAsCeremonyMoment = (songId: string) => {
    if (!ceremonySongs || ceremonySongs.length === 0) return null;
    const song = songs?.find((s: any) => s.id === songId);
    if (!song) return null;
    
    for (const ceremonySong of ceremonySongs) {
      if (ceremonySong.clientSongTitle && ceremonySong.clientArtist && 
          (ceremonySong.ceremonyMomentType === 'Ceremony Processional' || 
           ceremonySong.ceremonyMomentType === 'Ceremony Recessional')) {
        const momentTitle = normalizeText(ceremonySong.clientSongTitle);
        const momentArtist = normalizeText(ceremonySong.clientArtist);
        const songTitle = normalizeText(song.originalTitle || song.thcTitle || '');
        const songArtist = normalizeText(song.originalArtist || song.thcArtist || '');
        
        if (momentTitle === songTitle && momentArtist === songArtist) {
          return ceremonySong.ceremonyMomentType;
        }
      }
    }
    return null;
  };

  // Helper function to normalize text for comparison
  const normalizeText = (text: string) => {
    return (text || '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/["'`'']/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ');
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
        "First Dance"
      ],
      'reception': [
        "Wedding Party Intro",
        "Newlyweds Intro",
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
        "Money Dance",
        "Newlyweds Exit",
        "Private Last Dance",
        "Grand Finale"
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

  // Playlist types for request playlists
  const playlistTypes = [
    "Dancing Requests",
    "Guest Entrance", 
    "Dinner",
    "Salads",
    "Cultural Music"
  ];

  // Helper function to get the best link for a song (videoUrl first, then spotifyUrl)
  const getSongLink = (song: any): string => {
    return song.videoUrl || song.spotifyUrl || '';
  };

  // Get ceremony ensemble recommendations from database based on selected ensemble and moment type
  const getCeremonyEnsembleRecommendations = (ensemble: string, momentType: string) => {
    if (!songs || songs.length === 0) return [];
    
    const recommendationType = momentType === 'Ceremony Processional' ? 'processional' : 
                              momentType === 'Ceremony Recessional' ? 'recessional' : null;
    
    if (!recommendationType) return [];
    
    // Filter songs that have this ensemble recommendation for the specified type
    return songs
      .filter((song: any) => {
        if (!song.ceremonyEnsembleRecommendations || !song.ceremonyEnsembleRecommendations[ensemble]) {
          return false;
        }
        return song.ceremonyEnsembleRecommendations[ensemble][recommendationType] === true;
      })
      .map((song: any) => ({
        title: song.originalTitle || song.thcTitle,
        artist: song.originalArtist || song.thcArtist,
        videoUrl: song.videoUrl || '',
        spotifyUrl: song.spotifyUrl || ''
      }));
  };

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
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wider">PLANNING PORTAL</h1>
          </div>
          
          {/* Demo Notice */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 italic">
              This is a demo of the planning portal. Couples receive a customized version for their wedding.
            </p>
          </div>
          
          {/* Event Details */}
          <div className="text-center mb-8">
            <div className="text-xl font-medium text-gray-800 mb-1">Carrie Bradshaw & Mr. Big • Wedding</div>
            <div className="text-lg text-gray-600">Saturday, April 20th 2008 • The Plaza Hotel</div>
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
                <button
                  onClick={() => setActiveTab('vendors')}
                  className={`py-6 px-4 border-b-2 font-medium text-base ${
                    activeTab === 'vendors'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                  }`}
                >
                  Vendors
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
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Selected Services</h2>
                
                {/* Services Grid - Stacked Vertically */}
                <div className="space-y-6">
                  {/* Entertainment Services */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Entertainment Services</h3>
                    <div className="space-y-4">
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-medium text-gray-900">Welcome Party</h4>
                        <div className="mt-2">
                          <select
                            value={selectedWelcomePartyEnsemble}
                            onChange={(e) => setSelectedWelcomePartyEnsemble(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                          >
                            <optgroup label="Small Ensembles">
                              {smallEnsembles.map(ensemble => (
                              <option key={ensemble} value={ensemble}>
                                {ensemble}
                              </option>
                            ))}
                            </optgroup>
                            <optgroup label="Reception Ensembles">
                              {receptionEnsembles.map(ensemble => (
                                <option key={ensemble} value={ensemble}>
                                  {ensemble}
                                </option>
                              ))}
                            </optgroup>
                          </select>
                        </div>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-medium text-gray-900">Ceremony</h4>
                        <div className="mt-2">
                          <select
                            value={selectedCeremonyGuestArrivalEnsemble}
                            onChange={(e) => setSelectedCeremonyGuestArrivalEnsemble(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                          >
                            {ceremonyEnsembles.map(ensemble => (
                              <option key={ensemble} value={ensemble}>
                                {ensemble}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-medium text-gray-900">Cocktail Hour</h4>
                        <div className="mt-2">
                          <select
                            value={selectedCocktailHourEnsemble}
                            onChange={(e) => setSelectedCocktailHourEnsemble(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                          >
                            {cocktailHourDuos.length > 0 && (
                              <optgroup label="Duos">
                                {cocktailHourDuos.map(ensemble => (
                                  <option key={ensemble} value={ensemble}>
                                    {ensemble}
                                  </option>
                                ))}
                              </optgroup>
                            )}
                            {cocktailHourTrios.length > 0 && (
                              <optgroup label="Trios">
                                {cocktailHourTrios.map(ensemble => (
                                  <option key={ensemble} value={ensemble}>
                                    {ensemble}
                                  </option>
                                ))}
                              </optgroup>
                            )}
                            {cocktailHourQuartets.length > 0 && (
                              <optgroup label="Quartets">
                                {cocktailHourQuartets.map(ensemble => (
                                  <option key={ensemble} value={ensemble}>
                                    {ensemble}
                                  </option>
                                ))}
                              </optgroup>
                            )}
                            {cocktailHourWithTracks.length > 0 && (
                              <optgroup label="With Tracks">
                                {cocktailHourWithTracks.map(ensemble => (
                                  <option key={ensemble} value={ensemble}>
                                    {ensemble}
                                  </option>
                                ))}
                              </optgroup>
                            )}
                            {cocktailHourBands.length > 0 && (
                              <optgroup label="Bands">
                                {cocktailHourBands.map(ensemble => (
                                  <option key={ensemble} value={ensemble}>
                                    {ensemble}
                                  </option>
                                ))}
                              </optgroup>
                            )}
                          </select>
                        </div>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-medium text-gray-900">Reception</h4>
                        <div className="mt-2">
                          <select
                            value={selectedReceptionEnsemble}
                            onChange={(e) => setSelectedReceptionEnsemble(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                          >
                            {receptionAndAfterPartyEnsembles.map(ensemble => (
                              <option key={ensemble} value={ensemble}>
                                {ensemble}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-medium text-gray-900">After Party</h4>
                        <div className="mt-2">
                          <select
                            value={selectedAfterPartyEnsemble}
                            onChange={(e) => setSelectedAfterPartyEnsemble(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                          >
                            {receptionAndAfterPartyEnsembles.map(ensemble => (
                              <option key={ensemble} value={ensemble}>
                                {ensemble}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Production Services */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Production Services</h3>
                    <div className="space-y-4">
                      <div className="border-l-4 border-pink-500 pl-4">
                        <h4 className="font-medium text-gray-900">Welcome Party</h4>
                        <p className="text-sm text-gray-600">PA System • Sound Engineer • Toast Mic • Wash Lighting</p>
                      </div>
                      <div className="border-l-4 border-pink-500 pl-4">
                        <h4 className="font-medium text-gray-900">Ceremony</h4>
                        <p className="text-sm text-gray-600">Musician Amplification • Wireless Mic/Speakers</p>
                      </div>
                      <div className="border-l-4 border-pink-500 pl-4">
                        <h4 className="font-medium text-gray-900">Cocktail Hour</h4>
                        <p className="text-sm text-gray-600">Musician Amplification</p>
                      </div>
                      <div className="border-l-4 border-pink-500 pl-4">
                        <h4 className="font-medium text-gray-900">Reception</h4>
                        <p className="text-sm text-gray-600">PA System • Sound Engineer • Toast Mic • Wash Lighting • Dance Lighting Package</p>
                      </div>
                      <div className="border-l-4 border-pink-500 pl-4">
                        <h4 className="font-medium text-gray-900">After Party</h4>
                        <p className="text-sm text-gray-600">PA System • Announcement Mic • 10 Uplights</p>
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
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  {/* Documents Sub-tabs */}
                  <div className="border-b border-gray-200 mb-6">
                    <nav className="flex justify-center space-x-8">
                      <button
                        onClick={() => setActiveDocumentsTab('booking')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeDocumentsTab === 'booking'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                        }`}
                      >
                        Booking Documents
                      </button>
                      <button
                        onClick={() => setActiveDocumentsTab('payment')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeDocumentsTab === 'payment'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                        }`}
                      >
                        Payment Information
                      </button>
                      <button
                        onClick={() => setActiveDocumentsTab('uploaded')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeDocumentsTab === 'uploaded'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                        }`}
                      >
                        Uploaded Documents
                      </button>
                      <button
                        onClick={() => setActiveDocumentsTab('upload')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeDocumentsTab === 'upload'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-900 hover:text-purple-600 hover:border-purple-300'
                        }`}
                      >
                        Upload Document
                      </button>
                    </nav>
                  </div>

                  {/* Upload Document Content */}
                  {activeDocumentsTab === 'upload' && (
                    <div className="space-y-4">
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
                  )}

                  {/* Booking Documents Content */}
                  {activeDocumentsTab === 'booking' && (
                    <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Booking Documents</h3>
                  
                  <div className="space-y-4">
                    <p className="text-gray-600 mb-4">Important documents related to your booking will appear here.</p>
                    
                    {/* Contract Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Contract</h4>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="px-2 py-1 bg-gray-100 rounded-full">Pending</span>
                        </div>
                      </div>
                    </div>

                    {/* Retainer Invoice Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Retainer Invoice</h4>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="px-2 py-1 bg-gray-100 rounded-full">Pending</span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Documents Placeholder */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Additional Documents</h4>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="px-2 py-1 bg-gray-100 rounded-full">None</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  )}

                  {/* Payment Information Content */}
                  {activeDocumentsTab === 'payment' && (
                    <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h3>
                  
                  <div className="space-y-6">
                    {/* Retainer Payment */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-medium text-gray-900">25% Retainer Payment</h4>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Paid</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                          <div className="text-lg font-semibold text-gray-900">$____</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date Paid</label>
                          <div className="text-sm text-gray-600">____/____/____</div>
                        </div>
                      </div>
                    </div>

                    {/* Final Payment */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-medium text-gray-900">75% Final Payment</h4>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Pending</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                          <div className="text-lg font-semibold text-gray-900">$____</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                          <div className="text-sm text-gray-600">2 weeks before event date</div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-gray-900 mb-3">Payment Summary</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Package Price:</span>
                          <span className="font-medium text-gray-900">$____</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Retainer Paid (25%):</span>
                          <span className="font-medium text-green-600">$____</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Remaining Balance (75%):</span>
                          <span className="font-medium text-yellow-600">$____</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2">
                          <div className="flex justify-between text-sm font-medium">
                            <span className="text-gray-900">Status:</span>
                            <span className="text-yellow-600">Partially Paid</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  )}

                  {/* Uploaded Documents Content */}
                  {activeDocumentsTab === 'uploaded' && (
                    <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
                  
                  <div className="text-center py-8">
                    <p className="text-gray-500">No documents uploaded yet</p>
                  </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Vendors Content */}
            {activeTab === 'vendors' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Vendors</h2>
                
                {/* Full Vendor List Checkbox */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="fullVendorListSent"
                      checked={fullVendorListSent}
                      onChange={(e) => setFullVendorListSent(e.target.checked)}
                      className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-0.5"
                    />
                    <label htmlFor="fullVendorListSent" className="text-base text-gray-700 leading-relaxed cursor-pointer">
                      Check box if you would rather upload your vendor list separately, prior to the wedding
                    </label>
                  </div>
                </div>

                {fullVendorListSent ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="text-center space-y-3">
                      <h3 className="text-lg font-semibold text-blue-900">Vendor list will be provided</h3>
                      <p className="text-base text-blue-700 leading-relaxed max-w-2xl mx-auto">
                        When possible, please send us a list of all vendors working the wedding and their contact/social media info!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Add Vendor Button */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">Add Vendors</h3>
                        <button
                          onClick={addVendor}
                          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                        >
                          + Add Vendor
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">Add your wedding vendors one by one with their contact information.</p>
                    </div>

                    {/* Vendors List */}
                    {vendors.length > 0 && (
                      <div className="space-y-4">
                        {vendors.map((vendor, index) => (
                          <div key={vendor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-lg font-medium text-gray-900">Vendor {index + 1}</h4>
                              <button
                                onClick={() => removeVendor(vendor.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Remove
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Category</label>
                                <select
                                  value={vendor.category}
                                  onChange={(e) => updateVendor(vendor.id, 'category', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                                >
                                  <option value="">Select category...</option>
                                  {vendorCategories.map((category) => (
                                    <option key={category} value={category}>
                                      {category}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                                <input
                                  type="text"
                                  value={vendor.name}
                                  onChange={(e) => updateVendor(vendor.id, 'name', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                                  placeholder="Enter vendor name"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                  type="email"
                                  value={vendor.email}
                                  onChange={(e) => updateVendor(vendor.id, 'email', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                                  placeholder="Enter email address"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Social Media Handle(s)</label>
                                <input
                                  type="text"
                                  value={vendor.socialMedia}
                                  onChange={(e) => updateVendor(vendor.id, 'socialMedia', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                                  placeholder="e.g., @vendor_instagram, @vendor_twitter"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {vendors.length === 0 && (
                      <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <div className="text-gray-400 mb-4">
                          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors added yet</h3>
                        <p className="text-gray-600 mb-4">Click "Add Vendor" to start adding your wedding vendors.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Recommended Vendors Section */}
                <div className="bg-purple-50 rounded-lg shadow-sm border border-purple-200 p-8">
                  <div className="text-center">
                    <button className="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 font-medium text-base shadow-md transition-all duration-200 hover:shadow-lg">
                      Click here for a list of The Hook Club's recommended vendors!
                    </button>
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-medium text-gray-900">Welcome Party</h4>
                        <span className="text-lg font-medium text-gray-900">-</span>
                        <select
                          value={selectedWelcomePartyEnsemble}
                          onChange={(e) => setSelectedWelcomePartyEnsemble(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                        >
                          <optgroup label="Small Ensembles">
                            {smallEnsembles.map(ensemble => (
                            <option key={ensemble} value={ensemble}>
                              {ensemble}
                            </option>
                          ))}
                          </optgroup>
                          <optgroup label="Reception Ensembles">
                            {receptionEnsembles.map(ensemble => (
                              <option key={ensemble} value={ensemble}>
                                {ensemble}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {getWelcomePartySongsCount()} songs available
                      </div>
                    </div>
                  </div>
                  
                  {/* Welcome Party Sub-tabs */}
                  <div className="border-b border-gray-200 mb-6">
                    <nav className="flex justify-center space-x-8">
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
                          <span className="text-sm text-gray-500">{welcomePartyPlaylists.length}/2 playlists</span>
                        </div>
                        
                        {/* Add Playlist Button */}
                        {welcomePartyPlaylists.length < 2 && (
                          <button
                            onClick={() => setWelcomePartyPlaylists([...welcomePartyPlaylists, { playlistDescription: '', playlistLink: '' }])}
                            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors mb-4"
                          >
                            + Add Request Playlist
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
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Playlist Description</label>
                              <input
                                type="text"
                                value={playlist.playlistDescription}
                                onChange={(e) => {
                                  const newPlaylists = [...welcomePartyPlaylists];
                                  newPlaylists[index].playlistDescription = e.target.value;
                                  setWelcomePartyPlaylists(newPlaylists);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Describe the playlist"
                              />
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
                        ))}
                        
                        {welcomePartyPlaylists.length === 0 && (
                          <div className="text-center py-4 text-gray-500">
                            <p className="text-sm">No playlist requests added yet</p>
                            <p className="text-xs mt-1">Click "Add Request Playlist" to get started</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Core Repertoire Content */}
                  {activeWelcomePartyTab === 'core-repertoire' && (
                    <div className="space-y-6">
                      {/* If reception ensemble is selected, show Reception tab content */}
                      {isReceptionEnsemble ? (
                        <>
                          {/* Song Progress Section - Reception style */}
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
                              </div>

                              {/* Avoid Playing Card */}
                              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="font-medium text-red-800">👎 Avoid Playing</h5>
                                  <span className="text-sm text-red-600">
                                    {Object.values(receptionSongPreferences).filter(pref => pref === 'avoid').length}/100
                                  </span>
                                </div>
                                <div className="w-full bg-red-200 rounded-full h-2 mb-2">
                                  <div 
                                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                                    style={{ 
                                      width: `${Math.min(100, (Object.values(receptionSongPreferences).filter(pref => pref === 'avoid').length / 100) * 100)}%` 
                                    }}
                                  ></div>
                                </div>
                                <p className="text-sm text-gray-600">Goal: ≤100 songs</p>
                              </div>
                            </div>
                          </div>

                          {/* Songs List by Genre - Reception style */}
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
                              <div className="space-y-3 p-3">
                                {(selectedWelcomePartyEnsemble === 'Classic Band' 
                                  ? receptionGenres.filter(genre => !classicBandExcludedGenres.includes(genre.band))
                                  : receptionGenres
                                ).map((genre) => {
                                  const isLightGenre = lightGenreBands.includes(genre.band);
                                  const genreSongs = sortedReceptionSongs.filter(song => {
                                    if (!song.isLive) return false;
                                    const collection = isLightGenre ? song.lightGenres : song.danceGenres;
                                    return Array.isArray(collection) && collection.some((g: any) => g.band === genre.band);
                                  });

                                  if (genreSongs.length === 0) return null;

                                  return (
                                    <div key={genre.band} className="border border-gray-200 rounded-lg">
                                      <button
                                        onClick={() => setExpandedReceptionGenres(prev => ({
                                          ...prev,
                                          [genre.band]: !prev[genre.band]
                                        }))}
                                        className={`w-full px-4 py-3 text-left border-b border-gray-200 flex items-center justify-between ${
                                          isLightGenre
                                            ? 'bg-blue-50 hover:bg-blue-100'
                                            : 'bg-purple-50 hover:bg-purple-100'
                                        }`}
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
                                          {genreSongs.map((song, index) => {
                                            const selectedAsSpecialMoment = song.id ? isSongSelectedAsReceptionSpecialMoment(song.id) : null;
                                            return (
                                            <div key={song.id || index} className="px-3 py-2 hover:bg-gray-50">
                                              <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                  <div className="flex items-center space-x-3">
                                                    <div className="flex-1">
                                                      <div className="flex items-center space-x-2">
                                                        {getSongLink(song) ? (
                                                          <a
                                                            href={getSongLink(song)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-medium text-purple-600 hover:text-purple-800 underline"
                                                          >
                                                            {song.originalTitle}
                                                          </a>
                                                        ) : (
                                                          <span className="font-medium text-purple-600 underline">{song.originalTitle}</span>
                                                        )}
                                                        {selectedAsSpecialMoment && (
                                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800" title={`Selected as ${selectedAsSpecialMoment}`}>
                                                            🎵 {selectedAsSpecialMoment}
                                                          </span>
                                                        )}
                                                      </div>
                                                      <p className="text-sm text-gray-600">{song.originalArtist}</p>
                                                    </div>
                                                  </div>
                                                </div>

                                                {isLightGenre ? (
                                                  <div className="flex items-center space-x-2">
                                                    <button
                                                      onClick={() => setReceptionSongPreferences(prev => ({
                                                        ...prev,
                                                        [song.id]: prev[song.id] === 'definitely' ? undefined : 'definitely'
                                                      }))}
                                                      className={`px-3 py-0.5 text-sm rounded border ${
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
                                                      className={`px-3 py-0.5 text-sm rounded border ${
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
                                                      className={`px-3 py-0.5 text-sm rounded border ${
                                                        receptionSongPreferences[song.id] === 'avoid'
                                                          ? 'bg-red-100 text-red-800 border-red-300'
                                                          : 'bg-white text-gray-700 border-gray-300 hover:bg-red-50'
                                                      }`}
                                                    >
                                                      👎 Avoid Playing
                                                    </button>
                                                  </div>
                                                ) : (
                                                  renderSongPreferenceControls(song, 'reception')
                                                )}
                                              </div>
                                            </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Song Progress Section - Welcome Party style */}
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
                                      width: `${Math.min(100, (Object.values(songPreferences).filter(pref => pref === 'definitely').length / 30) * 100)}%` 
                                }}
                              ></div>
                            </div>
                                <p className="text-sm text-gray-600">Goal: 15-30 songs</p>
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
                          </div>

                          {/* Avoid Playing Card */}
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-red-800">👎 Avoid Playing</h5>
                              <span className="text-sm text-red-600">
                                    {Object.values(songPreferences).filter(pref => pref === 'avoid').length}/50
                              </span>
                            </div>
                            <div className="w-full bg-red-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                      width: `${Math.min(100, (Object.values(songPreferences).filter(pref => pref === 'avoid').length / 50) * 100)}%` 
                                }}
                              ></div>
                            </div>
                                <p className="text-sm text-gray-600">Goal: ≤50 songs</p>
                          </div>
                        </div>
                      </div>

                      {/* Ensemble-Specific Recommendations */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => setWelcomePartyEnsembleRecommendationsExpanded(!welcomePartyEnsembleRecommendationsExpanded)}
                            className="flex items-center space-x-2 text-left hover:text-purple-600 transition-colors"
                          >
                            <h3 className="text-lg font-medium text-gray-900">🎻 Ensemble-Specific Recommendations</h3>
                            <span className="text-sm text-gray-500">
                              {isEnsembleInBoth
                                ? `(${filteredWelcomePartyEnsembleLightSongs.length + filteredWelcomePartyEnsembleUpbeatSongs.length} songs)`
                                : `(${filteredWelcomePartyEnsembleSongs.length} songs)`}
                            </span>
                            <svg
                              className={`w-5 h-5 transition-transform ${welcomePartyEnsembleRecommendationsExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>

                        {welcomePartyEnsembleRecommendationsExpanded && (
                          <div className="bg-white rounded-lg border border-gray-200">
                            {isLoading ? (
                              <div className="text-center py-8 text-gray-500">
                                <p>Loading songs...</p>
                              </div>
                            ) : isEnsembleInBoth ? (
                              // Split into Light Music and Upbeat Music sections
                              <div className="space-y-6">
                                {/* Light Music Section (Ceremony) */}
                                {filteredWelcomePartyEnsembleLightSongs.length > 0 && (
                                  <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-4 px-4 pt-4">🎵 Light Music</h4>
                                    <div className="divide-y divide-gray-200">
                                      {filteredWelcomePartyEnsembleLightSongs.map((song, index) => (
                                        <div key={song.id || index} className="p-4 hover:bg-gray-50">
                                          <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                              <div className="flex items-center space-x-4">
                                                <div>
                                                  {getSongLink(song) ? (
                                                  <a
                                                      href={getSongLink(song)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-medium text-purple-600 hover:text-purple-800 underline"
                                                  >
                                                    {song.originalTitle}
                                                  </a>
                                                  ) : (
                                                    <span className="font-medium text-purple-600 underline">{song.originalTitle}</span>
                                                  )}
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
                                                👍 If Mood Is Right
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
                                  </div>
                                )}

                                {/* Upbeat Music Section (Cocktail Hour) */}
                                {filteredWelcomePartyEnsembleUpbeatSongs.length > 0 && (
                                  <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-4 px-4 pt-4">🎧 Upbeat Music</h4>
                                    <div className="divide-y divide-gray-200">
                                      {filteredWelcomePartyEnsembleUpbeatSongs.map((song, index) => (
                                        <div key={song.id || index} className="p-4 hover:bg-gray-50">
                                          <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                              <div className="flex items-center space-x-4">
                                                <div>
                                                  {getSongLink(song) ? (
                                                  <a
                                                      href={getSongLink(song)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-medium text-purple-600 hover:text-purple-800 underline"
                                                  >
                                                    {song.originalTitle}
                                                  </a>
                                                  ) : (
                                                    <span className="font-medium text-purple-600 underline">{song.originalTitle}</span>
                                                  )}
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
                                                👍 If Mood Is Right
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
                                  </div>
                                )}

                                {filteredWelcomePartyEnsembleLightSongs.length === 0 && filteredWelcomePartyEnsembleUpbeatSongs.length === 0 && (
                                  <div className="text-center py-8 text-gray-500">
                                    <p>No songs tagged for {selectedWelcomePartyEnsemble}</p>
                                  </div>
                                )}
                              </div>
                            ) : filteredWelcomePartyEnsembleSongs.length === 0 ? (
                              <div className="text-center py-8 text-gray-500">
                                <p>No songs tagged for {selectedWelcomePartyEnsemble}</p>
                              </div>
                            ) : (
                              <div className="divide-y divide-gray-200">
                                {filteredWelcomePartyEnsembleSongs.map((song, index) => (
                                  <div key={song.id || index} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-4">
                                          <div>
                                            {getSongLink(song) ? (
                                            <a
                                                href={getSongLink(song)}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="font-medium text-purple-600 hover:text-purple-800 underline"
                                            >
                                              {song.originalTitle}
                                            </a>
                                            ) : (
                                              <span className="font-medium text-purple-600 underline">{song.originalTitle}</span>
                                            )}
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
                                          👍 If Mood Is Right
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
                        )}
                      </div>

                      {/* Reception Repertoire Reference - Only show for non-reception ensembles */}
                      {!isReceptionEnsemble && (
                      <div className="space-y-4 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => setWelcomePartyReceptionExpanded(!welcomePartyReceptionExpanded)}
                            className="flex items-center space-x-2 text-left hover:text-purple-600 transition-colors"
                          >
                            <h3 className="text-lg font-medium text-gray-900">🎉 Reception Repertoire</h3>
                            <span className="text-sm text-gray-500">({totalWelcomePartyReceptionSongs} songs)</span>
                            <svg
                              className={`w-5 h-5 transition-transform ${welcomePartyReceptionExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>

                        {welcomePartyReceptionExpanded && (
                          <div className="bg-white rounded-lg border border-gray-200">
                            {totalWelcomePartyReceptionSongs === 0 ? (
                              <div className="text-center py-8 text-gray-500">
                                <p>No reception repertoire songs available</p>
                              </div>
                            ) : (
                              <div className="space-y-4 p-4">
                                {getFilteredWelcomePartyReceptionGenres().map((genre) => {
                                  const isLightGenre = lightGenreBands.includes(genre.band);
                                  const genreSongs = sortedSongs.filter(song => {
                                    if (!song.isLive) return false;
                                    const songGenres = isLightGenre ? song.lightGenres : song.danceGenres;
                                    return Array.isArray(songGenres) && songGenres.some((g: any) => g.band === genre.band);
                                  });

                                  if (genreSongs.length === 0) return null;

                                  return (
                                    <div key={genre.band} className="border border-gray-200 rounded-lg">
                                      <button
                                        onClick={() => setExpandedReceptionGenres(prev => ({
                                          ...prev,
                                          [genre.band]: !prev[genre.band]
                                        }))}
                                        className={`w-full px-4 py-3 text-left border-b border-gray-200 flex items-center justify-between ${
                                          isLightGenre
                                            ? 'bg-blue-50 hover:bg-blue-100'
                                            : 'bg-purple-50 hover:bg-purple-100'
                                        }`}
                                      >
                                        <div className="flex items-center space-x-3">
                                          <span className="text-lg font-medium text-gray-900">{genre.client}</span>
                                          <span className="text-sm text-gray-600">({genreSongs.length} songs)</span>
                                        </div>
                                        <svg
                                          className={`w-5 h-5 transform transition-transform ${expandedReceptionGenres[genre.band] ? 'rotate-180' : ''}`}
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                      </button>

                                      {expandedReceptionGenres[genre.band] && (
                                        <div className="divide-y divide-gray-200">
                                          {genreSongs.map((song, index) => (
                                            <div key={song.id || index} className="p-4 hover:bg-gray-50">
                                              <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                  <div className="flex items-center space-x-4">
                                                    <div>
                                                      {getSongLink(song) ? (
                                                      <a
                                                          href={getSongLink(song)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="font-medium text-purple-600 hover:text-purple-800 underline"
                                                      >
                                                        {song.originalTitle}
                                                      </a>
                                                      ) : (
                                                        <span className="font-medium text-purple-600 underline">{song.originalTitle}</span>
                                                      )}
                                                      <p className="text-sm text-gray-600">{song.originalArtist}</p>
                                                    </div>
                                                  </div>
                                                </div>

                                                {renderSongPreferenceControls(song, 'reception')}
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
                        )}
                      </div>
                      )}
                        </>
                      )}
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-medium text-gray-900">Ceremony</h4>
                        <span className="text-lg font-medium text-gray-900">-</span>
                        <select
                          value={selectedCeremonyGuestArrivalEnsemble}
                          onChange={(e) => setSelectedCeremonyGuestArrivalEnsemble(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                        >
                          {ceremonyEnsembles.map(ensemble => (
                            <option key={ensemble} value={ensemble}>
                              {ensemble}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {getCeremonySongsCount()} songs available
                      </div>
                    </div>
                  </div>
                  
                  {/* Ceremony Sub-tabs */}
                  <div className="border-b border-gray-200 mb-6">
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
                    <div className="space-y-6">
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

                            {/* Ensemble-Specific Recommended Options */}
                            {song.ceremonyMomentType && (song.ceremonyMomentType === 'Ceremony Processional' || song.ceremonyMomentType === 'Ceremony Recessional') && getCeremonyEnsembleRecommendations(selectedCeremonyGuestArrivalEnsemble, song.ceremonyMomentType).length > 0 && (
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
                                    Recommended Options for {selectedCeremonyGuestArrivalEnsemble} ({getCeremonyEnsembleRecommendations(selectedCeremonyGuestArrivalEnsemble, song.ceremonyMomentType).length} songs)
                                  </span>
                                  <span className="text-purple-500">
                                    {expandedCeremonyRecommendations[index] ? '▼' : '▶'}
                                  </span>
                                </button>

                                {expandedCeremonyRecommendations[index] && (
                                  <div className="mt-3 p-4 bg-purple-50 border border-purple-200 rounded-lg max-h-64 overflow-y-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {getCeremonyEnsembleRecommendations(selectedCeremonyGuestArrivalEnsemble, song.ceremonyMomentType).map((recSong: {title: string, artist: string, videoUrl?: string, spotifyUrl?: string}, songIndex: number) => (
                                        <button
                                          key={songIndex}
                                          type="button"
                                          onClick={() => {
                                            const newSongs = [...ceremonySongs];
                                            newSongs[index].clientSongTitle = recSong.title;
                                            newSongs[index].clientArtist = recSong.artist;
                                            // Prefer videoUrl (YouTube), fallback to spotifyUrl
                                            newSongs[index].clientLink = recSong.videoUrl || recSong.spotifyUrl || '';
                                            setCeremonySongs(newSongs);
                                          }}
                                          className="p-3 text-left bg-white border border-purple-200 rounded-lg hover:bg-purple-100 hover:border-purple-300 transition-colors"
                                        >
                                          {(recSong.videoUrl || recSong.spotifyUrl) ? (
                                            <a
                                              href={recSong.videoUrl || recSong.spotifyUrl || ''}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-sm font-medium text-purple-600 hover:text-purple-800 underline block"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              {recSong.title}
                                            </a>
                                          ) : (
                                            <div className="text-sm font-medium text-purple-600 underline">{recSong.title}</div>
                                          )}
                                          <div className="text-xs text-gray-600">{recSong.artist}</div>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Other Recommended Options (for non-processional/recessional moments) */}
                            {song.ceremonyMomentType && song.ceremonyMomentType !== 'Ceremony Processional' && song.ceremonyMomentType !== 'Ceremony Recessional' && getRecommendedSongs(song.ceremonyMomentType).length > 0 && (
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
                                      {getRecommendedSongs(song.ceremonyMomentType).map((recSong: {title: string, artist: string, videoUrl: string, spotifyUrl?: string}, songIndex: number) => (
                                        <button
                                          key={songIndex}
                                          type="button"
                                          onClick={() => {
                                            const newSongs = [...ceremonySongs];
                                            newSongs[index].clientSongTitle = recSong.title;
                                            newSongs[index].clientArtist = recSong.artist;
                                            // Prefer videoUrl (YouTube), fallback to spotifyUrl
                                            newSongs[index].clientLink = recSong.videoUrl || recSong.spotifyUrl || '';
                                            setCeremonySongs(newSongs);
                                          }}
                                          className="p-3 text-left bg-white border border-purple-200 rounded-lg hover:bg-purple-100 hover:border-purple-300 transition-colors"
                                        >
                                          {(recSong.videoUrl || recSong.spotifyUrl) ? (
                                            <a
                                              href={recSong.videoUrl || recSong.spotifyUrl || ''}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-sm font-medium text-purple-600 hover:text-purple-800 underline block"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              {recSong.title}
                                            </a>
                                          ) : (
                                            <div className="text-sm font-medium text-purple-600 underline">{recSong.title}</div>
                                          )}
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
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Guest Arrival Song Requests</h3>
                        <span className="text-sm text-gray-500">{guestArrivalRequests.length}/2 requests</span>
                      </div>

                      {/* Song Requests Section */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-medium text-gray-900">Song Requests</h4>
                          <span className="text-sm text-gray-500">{guestArrivalRequests.length}/2 requests</span>
                        </div>
                        
                        {/* Add Guest Arrival Request Button */}
                        {guestArrivalRequests.length < 2 && (
                          <button
                            onClick={() => setGuestArrivalRequests([...guestArrivalRequests, { clientSongTitle: '', clientArtist: '', clientLink: '', clientNote: '' }])}
                            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors mb-4"
                          >
                            + Add Guest Arrival Song Request
                          </button>
                        )}

                        {/* Guest Arrival Requests List */}
                        {guestArrivalRequests.map((request, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 space-y-4 mb-4 border border-gray-200">
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
                          <div className="text-center py-4 text-gray-500">
                            <p className="text-sm">No guest arrival song requests added yet</p>
                            <p className="text-xs mt-1">Click "Add Guest Arrival Song Request" to get started</p>
                          </div>
                        )}
                      </div>

                      {/* Request Playlist Section */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-medium text-gray-900">Request Playlist</h4>
                          <span className="text-sm text-gray-500">{ceremonyPlaylists.length}/1 playlist</span>
                        </div>
                        
                        {/* Add Playlist Button */}
                        {ceremonyPlaylists.length < 1 && (
                          <button
                            onClick={() => setCeremonyPlaylists([...ceremonyPlaylists, { playlistDescription: '', playlistLink: '' }])}
                            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors mb-4"
                          >
                            + Add Request Playlist
                          </button>
                        )}
                        
                        {/* Playlist Request List */}
                        {ceremonyPlaylists.map((playlist, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 space-y-4 mb-4 border border-gray-200">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium text-gray-900">Playlist {index + 1}</h5>
                              <button
                                onClick={() => setCeremonyPlaylists(ceremonyPlaylists.filter((_, i) => i !== index))}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Playlist Description</label>
                              <input
                                type="text"
                                value={playlist.playlistDescription}
                                onChange={(e) => {
                                  const newPlaylists = [...ceremonyPlaylists];
                                  newPlaylists[index].playlistDescription = e.target.value;
                                  setCeremonyPlaylists(newPlaylists);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Describe the playlist"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Playlist Link</label>
                              <input
                                type="url"
                                value={playlist.playlistLink}
                                onChange={(e) => {
                                  const newPlaylists = [...ceremonyPlaylists];
                                  newPlaylists[index].playlistLink = e.target.value;
                                  setCeremonyPlaylists(newPlaylists);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Spotify, Apple Music, or other playlist link"
                              />
                            </div>
                          </div>
                        ))}
                        
                        {ceremonyPlaylists.length === 0 && (
                          <div className="text-center py-4 text-gray-500">
                            <p className="text-sm">No playlist request added yet</p>
                            <p className="text-xs mt-1">Click "Add Request Playlist" to get started</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Guest Arrival Song List Content */}
                  {activeCeremonyTab === 'guest-arrival' && (
                    <div className="space-y-6">
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
                                {ceremonyGuestArrivalPreferenceCounts.definitely}/15
                              </span>
                            </div>
                            <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (ceremonyGuestArrivalPreferenceCounts.definitely / 10) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: 10-15 songs</p>
                          </div>

                          {/* If Mood Is Right Card */}
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-yellow-800">👍 If Mood Is Right</h5>
                              <span className="text-sm text-yellow-600">
                                {ceremonyGuestArrivalPreferenceCounts.maybe}/∞
                              </span>
                            </div>
                            <div className="w-full bg-yellow-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (ceremonyGuestArrivalPreferenceCounts.maybe / 5) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: ≥5 songs</p>
                          </div>

                          {/* Avoid Playing Card */}
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-red-800">👎 Avoid Playing</h5>
                              <span className="text-sm text-red-600">
                                {ceremonyGuestArrivalPreferenceCounts.avoid}/5
                              </span>
                            </div>
                            <div className="w-full bg-red-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (ceremonyGuestArrivalPreferenceCounts.avoid / 5) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: ≤5 songs</p>
                          </div>
                        </div>
                      </div>

                      {/* Ensemble-Specific Recommendations */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => setCeremonyGuestArrivalEnsembleRecommendationsExpanded(!ceremonyGuestArrivalEnsembleRecommendationsExpanded)}
                            className="flex items-center space-x-2 text-left hover:text-purple-600 transition-colors"
                          >
                            <h3 className="text-lg font-medium text-gray-900">🎻 Ensemble-Specific Recommendations</h3>
                            <span className="text-sm text-gray-500">({filteredCeremonyGuestArrivalSongs.length} songs)</span>
                            <svg
                              className={`w-5 h-5 transition-transform ${ceremonyGuestArrivalEnsembleRecommendationsExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>

                        {ceremonyGuestArrivalEnsembleRecommendationsExpanded && (
                          <div className="bg-white rounded-lg border border-gray-200">
                            {isLoadingGuestArrival ? (
                              <div className="text-center py-8 text-gray-500">
                                <p>Loading songs...</p>
                              </div>
                            ) : filteredCeremonyGuestArrivalSongs.length === 0 ? (
                              <div className="text-center py-8 text-gray-500">
                                <p>No songs tagged for {selectedCeremonyGuestArrivalEnsemble}</p>
                              </div>
                            ) : (
                              <div className="divide-y divide-gray-200">
                                {filteredCeremonyGuestArrivalSongs.map((song, index) => {
                                  const selectedAsCeremonyMoment = song.id ? isSongSelectedAsCeremonyMoment(song.id) : null;
                                  return (
                                  <div key={song.id || index} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-4">
                                          <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                              <a
                                                href={getSongLink(song)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium text-purple-600 hover:text-purple-800 underline"
                                              >
                                                {song.originalTitle}
                                              </a>
                                              {selectedAsCeremonyMoment && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800" title={`Selected as ${selectedAsCeremonyMoment}`}>
                                                  🎻 {selectedAsCeremonyMoment}
                                                </span>
                                              )}
                                            </div>
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
                                          👍 If Mood Is Right
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
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Full Ceremony Repertoire */}
                      <div className="space-y-4 pt-2 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => setCeremonyFullRepertoireExpanded(!ceremonyFullRepertoireExpanded)}
                            className="flex items-center space-x-2 text-left hover:text-purple-600 transition-colors"
                          >
                            <h3 className="text-lg font-medium text-gray-900">🎼 Full Ceremony Repertoire</h3>
                            <span className="text-sm text-gray-500">({sortedFullCeremonySongs.length} songs)</span>
                            <svg
                              className={`w-5 h-5 transition-transform ${ceremonyFullRepertoireExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>

                        {ceremonyFullRepertoireExpanded && (
                          <div className="bg-white rounded-lg border border-gray-200">
                            {isLoadingGuestArrival ? (
                              <div className="text-center py-8 text-gray-500">
                                <p>Loading songs...</p>
                              </div>
                            ) : sortedFullCeremonySongs.length === 0 ? (
                              <div className="text-center py-8 text-gray-500">
                                <p>No additional ceremony songs available</p>
                              </div>
                            ) : (
                              <div className="divide-y divide-gray-200">
                                {sortedFullCeremonySongs.map((song, index) => (
                                  <div key={song.id || index} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-4">
                                          <div>
                                            <a
                                              href={getSongLink(song)}
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
                                          👍 If Mood Is Right
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-medium text-gray-900">Cocktail Hour</h4>
                        <span className="text-lg font-medium text-gray-900">-</span>
                        <select
                          value={selectedCocktailHourEnsemble}
                          onChange={(e) => setSelectedCocktailHourEnsemble(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                        >
                          {[...cocktailHourEnsembles].sort().map(ensemble => (
                            <option key={ensemble} value={ensemble}>
                              {ensemble}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {getCocktailHourSongsCount()} songs available
                      </div>
                    </div>
                  </div>
                  
                  {/* Cocktail Hour Sub-tabs */}
                  <div className="border-b border-gray-200 mb-6">
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

                  {/* Song Requests Content */}
                  {activeCocktailHourTab === 'song-requests' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Song Requests</h3>
                        <span className="text-sm text-gray-500">{cocktailHourRequests.length}/2 requests</span>
                      </div>

                      {/* Song Requests Section */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-medium text-gray-900">Song Requests</h4>
                          <span className="text-sm text-gray-500">{cocktailHourRequests.length}/2 requests</span>
                        </div>
                        
                        {/* Add Request Button */}
                        {cocktailHourRequests.length < 2 && (
                          <button
                            onClick={() => setCocktailHourRequests([...cocktailHourRequests, { clientSongTitle: '', clientArtist: '', clientLink: '', clientNote: '' }])}
                            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors mb-4"
                          >
                            + Add Song Request
                          </button>
                        )}

                        {/* Song Requests List */}
                        {cocktailHourRequests.map((request, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 space-y-4 mb-4 border border-gray-200">
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
                          <div className="text-center py-4 text-gray-500">
                            <p className="text-sm">No song requests added yet</p>
                            <p className="text-xs mt-1">Click "Add Song Request" to get started</p>
                          </div>
                        )}
                      </div>

                      {/* Request Playlist Section */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-medium text-gray-900">Request Playlist</h4>
                          <span className="text-sm text-gray-500">{cocktailHourPlaylists.length}/1 playlist</span>
                        </div>
                        
                        {/* Add Playlist Button */}
                        {cocktailHourPlaylists.length < 1 && (
                          <button
                            onClick={() => setCocktailHourPlaylists([...cocktailHourPlaylists, { playlistDescription: '', playlistLink: '' }])}
                            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors mb-4"
                          >
                            + Add Request Playlist
                          </button>
                        )}
                        
                        {/* Playlist Request List */}
                        {cocktailHourPlaylists.map((playlist, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 space-y-4 mb-4 border border-gray-200">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium text-gray-900">Playlist {index + 1}</h5>
                              <button
                                onClick={() => setCocktailHourPlaylists(cocktailHourPlaylists.filter((_, i) => i !== index))}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Playlist Description</label>
                              <input
                                type="text"
                                value={playlist.playlistDescription}
                                onChange={(e) => {
                                  const newPlaylists = [...cocktailHourPlaylists];
                                  newPlaylists[index].playlistDescription = e.target.value;
                                  setCocktailHourPlaylists(newPlaylists);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Describe the playlist"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Playlist Link</label>
                              <input
                                type="url"
                                value={playlist.playlistLink}
                                onChange={(e) => {
                                  const newPlaylists = [...cocktailHourPlaylists];
                                  newPlaylists[index].playlistLink = e.target.value;
                                  setCocktailHourPlaylists(newPlaylists);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Spotify, Apple Music, or other playlist link"
                              />
                            </div>
                          </div>
                        ))}
                        
                        {cocktailHourPlaylists.length === 0 && (
                          <div className="text-center py-4 text-gray-500">
                            <p className="text-sm">No playlist request added yet</p>
                            <p className="text-xs mt-1">Click "Add Request Playlist" to get started</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cocktail Hour Song List Content */}
                  {activeCocktailHourTab === 'cocktail-hour-song-list' && (
                    <div className="space-y-6">
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
                                {cocktailHourPreferenceCounts.definitely}/15
                              </span>
                            </div>
                            <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (cocktailHourPreferenceCounts.definitely / 10) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: 10-15 songs</p>
                          </div>

                          {/* If Mood Is Right Card */}
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-yellow-800">👍 If Mood Is Right</h5>
                              <span className="text-sm text-yellow-600">
                                {cocktailHourPreferenceCounts.maybe}/∞
                              </span>
                            </div>
                            <div className="w-full bg-yellow-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (cocktailHourPreferenceCounts.maybe / 5) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: ≥5 songs</p>
                          </div>

                          {/* Avoid Playing Card */}
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-red-800">👎 Avoid Playing</h5>
                              <span className="text-sm text-red-600">
                                {cocktailHourPreferenceCounts.avoid}/5
                              </span>
                            </div>
                            <div className="w-full bg-red-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (cocktailHourPreferenceCounts.avoid / 5) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: ≤5 songs</p>
                          </div>
                        </div>
                      </div>

                      {/* Ensemble-Specific Recommendations */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => setCocktailHourEnsembleRecommendationsExpanded(!cocktailHourEnsembleRecommendationsExpanded)}
                            className="flex items-center space-x-2 text-left hover:text-purple-600 transition-colors"
                          >
                            <h3 className="text-lg font-medium text-gray-900">🎷 Ensemble-Specific Recommendations</h3>
                            <span className="text-sm text-gray-500">({filteredCocktailHourSongs.length} songs)</span>
                            <svg
                              className={`w-5 h-5 transition-transform ${cocktailHourEnsembleRecommendationsExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>

                        {cocktailHourEnsembleRecommendationsExpanded && (
                          <div className="bg-white rounded-lg border border-gray-200">
                            {isLoadingCocktailHour ? (
                              <div className="text-center py-8 text-gray-500">
                                <p>Loading songs...</p>
                              </div>
                            ) : filteredCocktailHourSongs.length === 0 ? (
                              <div className="text-center py-8 text-gray-500">
                                <p>No songs tagged for {selectedCocktailHourEnsemble}</p>
                              </div>
                            ) : (
                              <div className="divide-y divide-gray-200">
                                {filteredCocktailHourSongs.map((song, index) => (
                                  <div key={song.id || index} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-4">
                                          <div>
                                            {getSongLink(song) ? (
                                            <a
                                                href={getSongLink(song)}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="font-medium text-purple-600 hover:text-purple-800 underline"
                                            >
                                              {song.originalTitle}
                                            </a>
                                            ) : (
                                              <span className="font-medium text-purple-600 underline">{song.originalTitle}</span>
                                            )}
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
                        )}
                      </div>

                      {/* Full Cocktail Hour Repertoire */}
                      <div className="space-y-4 pt-2 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => setCocktailHourFullRepertoireExpanded(!cocktailHourFullRepertoireExpanded)}
                            className="flex items-center space-x-2 text-left hover:text-purple-600 transition-colors"
                          >
                            <h3 className="text-lg font-medium text-gray-900">🍸 Full Cocktail Hour Repertoire</h3>
                            <span className="text-sm text-gray-500">({sortedFullCocktailHourSongs.length} songs)</span>
                            <svg
                              className={`w-5 h-5 transition-transform ${cocktailHourFullRepertoireExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>

                        {cocktailHourFullRepertoireExpanded && (
                          <div className="bg-white rounded-lg border border-gray-200">
                            {isLoadingCocktailHour ? (
                              <div className="text-center py-8 text-gray-500">
                                <p>Loading songs...</p>
                              </div>
                            ) : sortedFullCocktailHourSongs.length === 0 ? (
                              <div className="text-center py-8 text-gray-500">
                                <p>No additional cocktail hour songs available</p>
                              </div>
                            ) : (
                              <div className="divide-y divide-gray-200">
                                {sortedFullCocktailHourSongs.map((song, index) => (
                                  <div key={song.id || index} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-4">
                                          <div>
                                            {getSongLink(song) ? (
                                            <a
                                                href={getSongLink(song)}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="font-medium text-purple-600 hover:text-purple-800 underline"
                                            >
                                              {song.originalTitle}
                                            </a>
                                            ) : (
                                              <span className="font-medium text-purple-600 underline">{song.originalTitle}</span>
                                            )}
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
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-purple-600 text-center flex-1">Reception</h2>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-medium text-gray-900">Reception</h4>
                        <span className="text-lg font-medium text-gray-900">-</span>
                        <select
                          value={selectedReceptionEnsemble}
                          onChange={(e) => setSelectedReceptionEnsemble(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                        >
                          {receptionAndAfterPartyEnsembles.map((ensemble) => (
                            <option key={ensemble} value={ensemble}>
                              {ensemble}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {getReceptionSongsCount()} songs available
                      </div>
                    </div>
                  </div>
                  
                  {/* Reception Sub-tabs */}
                  <div className="border-b border-gray-200 mb-6">
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
                    <div className="space-y-6">
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
                              {moment.specialMomentType && getRecommendedSongs(moment.specialMomentType, 'reception', selectedReceptionEnsemble).length > 0 ? (
                                <select
                                  value={moment.clientSongTitle}
                                  onChange={(e) => {
                                    const newMoments = [...receptionSpecialMoments];
                                    const selectedSong = getRecommendedSongs(moment.specialMomentType, 'reception', selectedReceptionEnsemble).find((s: any) => s.title === e.target.value);
                                    newMoments[index].clientSongTitle = e.target.value;
                                    if (selectedSong) {
                                      newMoments[index].clientArtist = selectedSong.artist;
                                      // Prefer videoUrl (YouTube), fallback to spotifyUrl
                                      newMoments[index].clientLink = selectedSong.videoUrl || selectedSong.spotifyUrl || '';
                                    }
                                    setReceptionSpecialMoments(newMoments);
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                >
                                  <option value="">Select a recommended song...</option>
                                  {getRecommendedSongs(moment.specialMomentType, 'reception', selectedReceptionEnsemble).map((song: {title: string, artist: string, videoUrl: string, spotifyUrl?: string}, songIndex: number) => (
                                    <option key={songIndex} value={song.title}>
                                      {song.title} - {song.artist}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                              <input
                                type="text"
                                value={moment.clientSongTitle}
                                onChange={(e) => {
                                  const newMoments = [...receptionSpecialMoments];
                                  newMoments[index].clientSongTitle = e.target.value;
                                  setReceptionSpecialMoments(newMoments);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                  placeholder={moment.specialMomentType ? "Enter song title (no recommendations available)" : "Select a special moment first"}
                              />
                              )}
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
                    <div className="space-y-8 mt-6">
                      {/* Note */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700">
                          <strong>Note:</strong> These requests are for the dance sets only, they are separate from your "special songs" (first dance, parent dances, etc)
                        </p>
                      </div>

                      {/* Essential Song Requests */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-medium text-gray-900">Essential Song Requests</h4>
                          <span className="text-sm text-gray-500">{receptionEssentialRequests.length}/2 requests</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">Your most important requests - songs we can't leave the building until they've been played</p>

                        {/* Add Essential Request Button */}
                        {receptionEssentialRequests.length < 2 && (
                          <button
                            onClick={() => setReceptionEssentialRequests([...receptionEssentialRequests, { clientSongTitle: '', clientArtist: '', clientLink: '', clientNote: '' }])}
                            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors mb-4"
                          >
                            + Add Essential Song Request
                          </button>
                        )}

                        {/* Essential Requests List */}
                        {receptionEssentialRequests.map((request, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 space-y-4 mb-4 border border-gray-200">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium text-gray-900">Essential Request {index + 1}</h4>
                              <button
                                onClick={() => setReceptionEssentialRequests(receptionEssentialRequests.filter((_, i) => i !== index))}
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
                                    const newRequests = [...receptionEssentialRequests];
                                    newRequests[index].clientSongTitle = e.target.value;
                                    setReceptionEssentialRequests(newRequests);
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
                                    const newRequests = [...receptionEssentialRequests];
                                    newRequests[index].clientArtist = e.target.value;
                                    setReceptionEssentialRequests(newRequests);
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
                                    const newRequests = [...receptionEssentialRequests];
                                    newRequests[index].clientLink = e.target.value;
                                    setReceptionEssentialRequests(newRequests);
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
                                    const newRequests = [...receptionEssentialRequests];
                                    newRequests[index].clientNote = e.target.value;
                                    setReceptionEssentialRequests(newRequests);
                                  }}
                                  rows={1}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                  placeholder="Special instructions or notes"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Additional Song Requests */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-medium text-gray-900">Additional Song Requests</h4>
                          <span className="text-sm text-gray-500">{receptionAdditionalRequests.length}/5 requests</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">More songs or artists you want to hear - we'll play as many as we possibly can!</p>

                        {/* Add Additional Request Button */}
                        {receptionAdditionalRequests.length < 5 && (
                          <button
                            onClick={() => setReceptionAdditionalRequests([...receptionAdditionalRequests, { clientSongTitle: '', clientArtist: '', clientLink: '', clientNote: '' }])}
                            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors mb-4"
                          >
                            + Add Additional Song Request
                          </button>
                        )}

                        {/* Additional Requests List */}
                        {receptionAdditionalRequests.map((request, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 space-y-4 mb-4 border border-gray-200">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium text-gray-900">Additional Request {index + 1}</h4>
                              <button
                                onClick={() => setReceptionAdditionalRequests(receptionAdditionalRequests.filter((_, i) => i !== index))}
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
                                    const newRequests = [...receptionAdditionalRequests];
                                    newRequests[index].clientSongTitle = e.target.value;
                                    setReceptionAdditionalRequests(newRequests);
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
                                    const newRequests = [...receptionAdditionalRequests];
                                    newRequests[index].clientArtist = e.target.value;
                                    setReceptionAdditionalRequests(newRequests);
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
                                    const newRequests = [...receptionAdditionalRequests];
                                    newRequests[index].clientLink = e.target.value;
                                    setReceptionAdditionalRequests(newRequests);
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
                                    const newRequests = [...receptionAdditionalRequests];
                                    newRequests[index].clientNote = e.target.value;
                                    setReceptionAdditionalRequests(newRequests);
                                  }}
                                  rows={1}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                  placeholder="Special instructions or notes"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {receptionAdditionalRequests.length === 0 && (
                          <div className="text-center py-4 text-gray-500">
                            <p className="text-sm">No additional song requests added yet</p>
                            <p className="text-xs mt-1">Click "Add Additional Song Request" to get started</p>
                          </div>
                        )}
                      </div>

                      {/* Playlist Links */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-medium text-gray-900">Request Playlists</h4>
                          <span className="text-sm text-gray-500">{receptionPlaylists.length}/3 playlists</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">Share your Spotify, Apple Music, or other playlists with us - share your musical mood board!</p>

                        {/* Add Playlist Button */}
                        {receptionPlaylists.length < 3 && (
                          <button
                            onClick={() => setReceptionPlaylists([...receptionPlaylists, { playlistLink: '', playlistType: '', customType: '', notes: '' }])}
                            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors mb-4"
                          >
                            + Add Request Playlist
                          </button>
                        )}

                        {/* Playlists List */}
                        {receptionPlaylists.map((playlist, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 space-y-4 mb-4 border border-gray-200">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium text-gray-900">Playlist {index + 1}</h4>
                              <button
                                onClick={() => setReceptionPlaylists(receptionPlaylists.filter((_, i) => i !== index))}
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
                                    const newPlaylists = [...receptionPlaylists];
                                    newPlaylists[index].playlistType = e.target.value;
                                    if (e.target.value !== 'Custom') {
                                      newPlaylists[index].customType = '';
                                    }
                                    setReceptionPlaylists(newPlaylists);
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                >
                                  <option value="">Select playlist type</option>
                                  <option value="Dancing Requests">Dancing Requests</option>
                                  <option value="Background Music">Background Music</option>
                                  <option value="Cultural Music">Cultural Music</option>
                                  <option value="Custom">Custom</option>
                                </select>
                                {playlist.playlistType === 'Custom' && (
                                  <input
                                    type="text"
                                    value={playlist.customType}
                                    onChange={(e) => {
                                      const newPlaylists = [...receptionPlaylists];
                                      newPlaylists[index].customType = e.target.value;
                                      setReceptionPlaylists(newPlaylists);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 mt-2"
                                    placeholder="Enter custom playlist type/description"
                                  />
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Playlist Link</label>
                                <input
                                  type="url"
                                  value={playlist.playlistLink}
                                  onChange={(e) => {
                                    const newPlaylists = [...receptionPlaylists];
                                    newPlaylists[index].playlistLink = e.target.value;
                                    setReceptionPlaylists(newPlaylists);
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                  placeholder="Spotify, Apple Music, or other playlist link"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                              <textarea
                                value={playlist.notes}
                                onChange={(e) => {
                                  const newPlaylists = [...receptionPlaylists];
                                  newPlaylists[index].notes = e.target.value;
                                  setReceptionPlaylists(newPlaylists);
                                }}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Special instructions or notes about this playlist"
                              />
                            </div>
                          </div>
                        ))}
                        
                        {receptionPlaylists.length === 0 && (
                          <div className="text-center py-4 text-gray-500">
                            <p className="text-sm">No playlist requests added yet</p>
                            <p className="text-xs mt-1">Click "Add Request Playlist" to get started</p>
                          </div>
                        )}
                      </div>

                      {/* Dinner Break Playlist */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Dinner Break Playlist</h3>
                        <p className="text-gray-600 mb-6 text-center italic">We will take a short dinner break, choose a playlist we can put on!</p>
                        
                        <div className="space-y-3">
                          {/* Option 1: Classics */}
                          <div 
                            onClick={() => {
                              setSelectedDinnerBreakPlaylist('classics');
                              setCustomDinnerBreakPlaylistLink('');
                            }}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedDinnerBreakPlaylist === 'classics' 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <a 
                                href="#" 
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Prevent default only for placeholder links
                                  if (e.currentTarget.getAttribute('href') === '#') {
                                    e.preventDefault();
                                  }
                                  // TODO: Replace href="#" with actual playlist links
                                }}
                                className="font-medium text-purple-600 underline hover:text-purple-800"
                              >
                                Dinner Playlist #1 (Classics)
                              </a>
                              <div className="flex items-center space-x-2">
                                {selectedDinnerBreakPlaylist === 'classics' ? (
                                  <span className="text-purple-600">✓</span>
                                ) : (
                                  <span className="text-gray-400">☐</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Option 2: Contemporary */}
                          <div 
                            onClick={() => {
                              setSelectedDinnerBreakPlaylist('contemporary');
                              setCustomDinnerBreakPlaylistLink('');
                            }}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedDinnerBreakPlaylist === 'contemporary' 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <a 
                                href="#" 
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Prevent default only for placeholder links
                                  if (e.currentTarget.getAttribute('href') === '#') {
                                    e.preventDefault();
                                  }
                                  // TODO: Replace href="#" with actual playlist links
                                }}
                                className="font-medium text-purple-600 underline hover:text-purple-800"
                              >
                                Dinner Playlist #2 (Contemporary)
                              </a>
                              <div className="flex items-center space-x-2">
                                {selectedDinnerBreakPlaylist === 'contemporary' ? (
                                  <span className="text-purple-600">✓</span>
                                ) : (
                                  <span className="text-gray-400">☐</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Option 3: Light Rock */}
                          <div 
                            onClick={() => {
                              setSelectedDinnerBreakPlaylist('light-rock');
                              setCustomDinnerBreakPlaylistLink('');
                            }}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedDinnerBreakPlaylist === 'light-rock' 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <a 
                                href="#" 
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Prevent default only for placeholder links
                                  if (e.currentTarget.getAttribute('href') === '#') {
                                    e.preventDefault();
                                  }
                                  // TODO: Replace href="#" with actual playlist links
                                }}
                                className="font-medium text-purple-600 underline hover:text-purple-800"
                              >
                                Dinner Playlist #3 (Light Rock)
                              </a>
                              <div className="flex items-center space-x-2">
                                {selectedDinnerBreakPlaylist === 'light-rock' ? (
                                  <span className="text-purple-600">✓</span>
                                ) : (
                                  <span className="text-gray-400">☐</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Option 4: Client-Provided List */}
                          <div 
                            onClick={() => setSelectedDinnerBreakPlaylist('custom')}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedDinnerBreakPlaylist === 'custom' 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium text-gray-900">Client-Provided List</h4>
                              <div className="flex items-center space-x-2">
                                {selectedDinnerBreakPlaylist === 'custom' ? (
                                  <span className="text-purple-600">✓</span>
                                ) : (
                                  <span className="text-gray-400">☐</span>
                                )}
                              </div>
                            </div>
                            
                            {selectedDinnerBreakPlaylist === 'custom' && (
                              <div 
                                onClick={(e) => e.stopPropagation()}
                                className="mt-3 pt-3 border-t border-gray-200"
                              >
                                <input
                                  type="url"
                                  value={customDinnerBreakPlaylistLink}
                                  onChange={(e) => setCustomDinnerBreakPlaylistLink(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                                  placeholder="Enter playlist link (Spotify, Apple Music, etc.)"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reception Song List Content */}
                  {activeReceptionTab === 'reception-song-list' && (
                    <div className="space-y-6">
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
                          </div>

                          {/* Avoid Playing Card */}
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-red-800">👎 Avoid Playing</h5>
                              <span className="text-sm text-red-600">
                                {Object.values(receptionSongPreferences).filter(pref => pref === 'avoid').length}/100
                              </span>
                            </div>
                            <div className="w-full bg-red-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (Object.values(receptionSongPreferences).filter(pref => pref === 'avoid').length / 100) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: ≤100 songs</p>
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
                          <div className="space-y-3 p-3">
                            {getFilteredReceptionGenres().map((genre) => {
                              const isLightGenre = lightGenreBands.includes(genre.band);
                              const genreSongs = sortedReceptionSongs.filter(song => {
                                if (!song.isLive) return false;
                                const collection = isLightGenre ? song.lightGenres : song.danceGenres;
                                return Array.isArray(collection) && collection.some((g: any) => g.band === genre.band);
                              });

                              if (genreSongs.length === 0) return null;

                              return (
                                <div key={genre.band} className="border border-gray-200 rounded-lg">
                                  <button
                                    onClick={() => setExpandedReceptionGenres(prev => ({
                                      ...prev,
                                      [genre.band]: !prev[genre.band]
                                    }))}
                                    className={`w-full px-4 py-3 text-left border-b border-gray-200 flex items-center justify-between ${
                                      isLightGenre
                                        ? 'bg-blue-50 hover:bg-blue-100'
                                        : 'bg-purple-50 hover:bg-purple-100'
                                    }`}
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
                                        <div key={song.id || index} className="px-3 py-2 hover:bg-gray-50">
                                          <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                              <div className="flex items-center space-x-3">
                                                <div>
                                                  {getSongLink(song) ? (
                                                  <a
                                                      href={getSongLink(song)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-medium text-purple-600 hover:text-purple-800 underline"
                                                  >
                                                    {song.originalTitle}
                                                  </a>
                                                  ) : (
                                                    <span className="font-medium text-purple-600 underline">{song.originalTitle}</span>
                                                  )}
                                                  <p className="text-sm text-gray-600">{song.originalArtist}</p>
                                                </div>
                                              </div>
                                            </div>

                                            {isLightGenre ? (
                                              <div className="flex items-center space-x-2">
                                                <button
                                                  onClick={() => setReceptionSongPreferences(prev => ({
                                                    ...prev,
                                                    [song.id]: prev[song.id] === 'definitely' ? undefined : 'definitely'
                                                  }))}
                                                      className={`px-3 py-0.5 text-sm rounded border ${
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
                                                      className={`px-3 py-0.5 text-sm rounded border ${
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
                                                  className={`px-3 py-0.5 text-sm rounded border ${
                                                    receptionSongPreferences[song.id] === 'avoid'
                                                      ? 'bg-red-100 text-red-800 border-red-300'
                                                      : 'bg-white text-gray-700 border-gray-300 hover:bg-red-50'
                                                  }`}
                                                >
                                                  👎 Avoid Playing
                                                </button>
                                              </div>
                                            ) : (
                                              renderSongPreferenceControls(song, 'reception')
                                            )}
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
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-purple-600 text-center flex-1">After Party</h2>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-medium text-gray-900">After Party</h4>
                        <span className="text-lg font-medium text-gray-900">-</span>
                        <select
                          value={selectedAfterPartyEnsemble}
                          onChange={(e) => setSelectedAfterPartyEnsemble(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                        >
                          {receptionAndAfterPartyEnsembles.map((ensemble) => (
                            <option key={ensemble} value={ensemble}>
                              {ensemble}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {getAfterPartySongsCount()} songs available
                      </div>
                    </div>
                  </div>
                  
                  {/* After Party Sub-tabs */}
                  <div className="border-b border-gray-200 mb-6">
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

                  {/* Song Requests Content */}
                  {activeAfterPartyTab === 'special-requests' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Song Requests</h3>
                        <span className="text-sm text-gray-500">{afterPartySpecialRequests.length}/5 requests</span>
                      </div>

                      {/* Song Requests Section */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-medium text-gray-900">Song Requests</h4>
                          <span className="text-sm text-gray-500">{afterPartySpecialRequests.length}/5 requests</span>
                        </div>
                        
                        {/* Add Request Button */}
                        {afterPartySpecialRequests.length < 5 && (
                          <button
                            onClick={() => setAfterPartySpecialRequests([...afterPartySpecialRequests, { clientSongTitle: '', clientArtist: '', clientLink: '', clientNote: '' }])}
                            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors mb-4"
                          >
                            + Add Song Request
                          </button>
                        )}

                        {/* Song Requests List */}
                        {afterPartySpecialRequests.map((request, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 space-y-4 mb-4 border border-gray-200">
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
                          <div className="text-center py-4 text-gray-500">
                            <p className="text-sm">No song requests added yet</p>
                            <p className="text-xs mt-1">Click "Add Song Request" to get started</p>
                          </div>
                        )}
                      </div>

                      {/* Request Playlist Section */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-medium text-gray-900">Request Playlist</h4>
                          <span className="text-sm text-gray-500">{afterPartyPlaylists.length}/1 playlist</span>
                        </div>
                        
                        {/* Add Playlist Button */}
                        {afterPartyPlaylists.length < 1 && (
                          <button
                            onClick={() => setAfterPartyPlaylists([...afterPartyPlaylists, { playlistDescription: '', playlistLink: '' }])}
                            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors mb-4"
                          >
                            + Add Request Playlist
                          </button>
                        )}
                        
                        {/* Playlist Request List */}
                        {afterPartyPlaylists.map((playlist, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 space-y-4 mb-4 border border-gray-200">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium text-gray-900">Playlist {index + 1}</h5>
                              <button
                                onClick={() => setAfterPartyPlaylists(afterPartyPlaylists.filter((_, i) => i !== index))}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Playlist Description</label>
                              <input
                                type="text"
                                value={playlist.playlistDescription}
                                onChange={(e) => {
                                  const newPlaylists = [...afterPartyPlaylists];
                                  newPlaylists[index].playlistDescription = e.target.value;
                                  setAfterPartyPlaylists(newPlaylists);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Describe the playlist"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Playlist Link</label>
                              <input
                                type="url"
                                value={playlist.playlistLink}
                                onChange={(e) => {
                                  const newPlaylists = [...afterPartyPlaylists];
                                  newPlaylists[index].playlistLink = e.target.value;
                                  setAfterPartyPlaylists(newPlaylists);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Spotify, Apple Music, or other playlist link"
                              />
                            </div>
                          </div>
                        ))}
                        
                        {afterPartyPlaylists.length === 0 && (
                          <div className="text-center py-4 text-gray-500">
                            <p className="text-sm">No playlist request added yet</p>
                            <p className="text-xs mt-1">Click "Add Request Playlist" to get started</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* After Party Song List Content */}
                  {activeAfterPartyTab === 'core-repertoire' && (
                    <div className="space-y-6">
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
                                {afterPartyPreferenceCounts.definitely}/50
                              </span>
                            </div>
                            <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (afterPartyPreferenceCounts.definitely / 25) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: 25-50 songs</p>
                          </div>

                          {/* If Mood Is Right Card */}
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-yellow-800">👍 If Mood Is Right</h5>
                              <span className="text-sm text-yellow-600">
                                {afterPartyPreferenceCounts.maybe}/∞
                              </span>
                            </div>
                            <div className="w-full bg-yellow-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (afterPartyPreferenceCounts.maybe / 25) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: ≥25 songs</p>
                          </div>

                          {/* Avoid Playing Card */}
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-red-800">👎 Avoid Playing</h5>
                              <span className="text-sm text-red-600">
                                {afterPartyPreferenceCounts.avoid}/100
                              </span>
                            </div>
                            <div className="w-full bg-red-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, (afterPartyPreferenceCounts.avoid / 100) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">Goal: ≤100 songs</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg border border-gray-200">
                        {isLoadingAfterParty ? (
                          <div className="text-center py-8 text-gray-500">
                            <p>Loading songs...</p>
                          </div>
                        ) : totalAfterPartySongs === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <p>No after party songs available yet.</p>
                            <p className="text-sm mt-1">Tag songs for the After Party section to see them here.</p>
                          </div>
                        ) : (
                          <div className="space-y-3 p-3">
                            {afterPartyGenresWithSongs.map(({ genre, songs, isLightGenre }) => {
                              const isExpanded = expandedAfterPartyGenres[genre.band];

                              return (
                                <div key={genre.band} className="border border-gray-200 rounded-lg">
                                  <button
                                    onClick={() =>
                                      setExpandedAfterPartyGenres((prev) => ({
                                        ...prev,
                                        [genre.band]: !prev[genre.band],
                                      }))
                                    }
                                    className={`w-full px-4 py-3 text-left border-b border-gray-200 flex items-center justify-between ${
                                      isLightGenre
                                        ? 'bg-blue-50 hover:bg-blue-100'
                                        : 'bg-purple-50 hover:bg-purple-100'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <span className="text-lg font-medium text-gray-900">{genre.client}</span>
                                      <span className="text-sm text-gray-600">({songs.length} songs)</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <svg
                                        className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </div>
                                  </button>

                                  {isExpanded && (
                                    <div className="divide-y divide-gray-200">
                                      {songs.map((song, index) => (
                                        <div key={song.id || index} className="px-3 py-2 hover:bg-gray-50">
                                          <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                              <div className="flex items-center space-x-3">
                                                <div>
                                                  {getSongLink(song) ? (
                                                  <a
                                                      href={getSongLink(song)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-medium text-purple-600 hover:text-purple-800 underline"
                                                  >
                                                    {song.originalTitle}
                                                  </a>
                                                  ) : (
                                                    <span className="font-medium text-purple-600 underline">{song.originalTitle}</span>
                                                  )}
                                                  <p className="text-sm text-gray-600">{song.originalArtist}</p>
                                                </div>
                                              </div>
                                            </div>

                                            {renderSongPreferenceControls(song, 'afterParty')}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            {afterPartyUngroupedSongs.length > 0 && (
                              <div className="border border-gray-200 rounded-lg">
                                <button
                                  onClick={() => setAfterPartyOnlyExpanded((prev) => !prev)}
                                  className="w-full px-4 py-3 text-left border-b border-gray-200 flex items-center justify-between bg-gray-50 hover:bg-gray-100"
                                >
                                  <div className="flex items-center space-x-3">
                                    <span className="text-lg font-medium text-gray-900">🎧 Unsorted After Party Songs</span>
                                    <span className="text-sm text-gray-600">({afterPartyUngroupedSongs.length} songs)</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <svg
                                      className={`w-5 h-5 transform transition-transform ${afterPartyOnlyExpanded ? 'rotate-180' : ''}`}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </div>
                                </button>

                                {afterPartyOnlyExpanded && (
                                  <div className="divide-y divide-gray-200">
                                    {afterPartyUngroupedSongs.map((song, index) => (
                                      <div key={song.id || index} className="px-3 py-2 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                          <div className="flex-1">
                                            <div className="flex items-center space-x-3">
                                              <div>
                                                <a
                                                  href={getSongLink(song)}
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

                                          {renderSongPreferenceControls(song, 'afterParty')}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
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