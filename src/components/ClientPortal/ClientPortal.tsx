'use client';

import { useState } from 'react';

export default function ClientPortal() {
  const [activeFirstTier, setActiveFirstTier] = useState<'services' | 'getting-to-know-you' | 'event-info'>('services');
  const [activeSecondTier, setActiveSecondTier] = useState<'welcome-party' | 'ceremony' | 'cocktail-hour' | 'reception' | 'after-party'>('welcome-party');

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Hook Club Branding */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hook Club Logo */}
          <div className="text-center mb-8">
            <div className="inline-block">
              <div className="text-6xl font-bold text-purple-600 mb-2" style={{fontFamily: 'serif'}}>
                <span className="text-pink-500 text-2xl font-light" style={{fontFamily: 'cursive'}}>The</span>
                <span className="ml-2">HOOK</span>
                <span className="text-pink-500 text-2xl font-light ml-2" style={{fontFamily: 'cursive'}}>Club</span>
              </div>
            </div>
          </div>
          
          {/* Main Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">THE HOOK CLUB</h1>
            <p className="text-xl text-gray-600">PLANNING PORTAL</p>
          </div>
          
          {/* Event Details */}
          <div className="text-center mb-8">
            <div className="text-2xl font-medium text-gray-800 mb-2">Harry Truman & Sally Fields • Wedding</div>
            <div className="text-xl text-gray-700">Saturday 9/27/25 • The Greenpoint Loft</div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Save Progress
            </button>
            <button className="px-6 py-3 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">
              Submit Selections
            </button>
          </div>
        </div>
      </div>

      {/* First Tier Tabs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center space-x-12">
            <button
              onClick={() => setActiveFirstTier('services')}
              className={`py-6 px-4 border-b-2 font-medium text-base ${
                activeFirstTier === 'services'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => setActiveFirstTier('getting-to-know-you')}
              className={`py-6 px-4 border-b-2 font-medium text-base ${
                activeFirstTier === 'getting-to-know-you'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              Getting To Know You
            </button>
            <button
              onClick={() => setActiveFirstTier('event-info')}
              className={`py-6 px-4 border-b-2 font-medium text-base ${
                activeFirstTier === 'event-info'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              Event Info
            </button>
          </nav>
        </div>
      </div>

      {/* Second Tier Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center space-x-8">
            <button
              onClick={() => setActiveSecondTier('welcome-party')}
              className={`py-4 px-3 border-b-2 font-medium text-sm ${
                activeSecondTier === 'welcome-party'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Welcome Party
            </button>
            <button
              onClick={() => setActiveSecondTier('ceremony')}
              className={`py-4 px-3 border-b-2 font-medium text-sm ${
                activeSecondTier === 'ceremony'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ceremony
            </button>
            <button
              onClick={() => setActiveSecondTier('cocktail-hour')}
              className={`py-4 px-3 border-b-2 font-medium text-sm ${
                activeSecondTier === 'cocktail-hour'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cocktail Hour
            </button>
            <button
              onClick={() => setActiveSecondTier('reception')}
              className={`py-4 px-3 border-b-2 font-medium text-sm ${
                activeSecondTier === 'reception'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reception
            </button>
            <button
              onClick={() => setActiveSecondTier('after-party')}
              className={`py-4 px-3 border-b-2 font-medium text-sm ${
                activeSecondTier === 'after-party'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              After Party
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* First Tier Content */}
        {activeFirstTier === 'services' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ceremony Music</h3>
                <p className="text-gray-600 mb-4">Beautiful live music for your ceremony with various ensemble options.</p>
                <div className="text-sm text-gray-500">
                  <p>• Solo Piano</p>
                  <p>• String Quartet</p>
                  <p>• Guitar & Violin</p>
                  <p>• And more...</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cocktail Hour</h3>
                <p className="text-gray-600 mb-4">Elegant background music during your cocktail hour.</p>
                <div className="text-sm text-gray-500">
                  <p>• Jazz Trio</p>
                  <p>• Acoustic Duo</p>
                  <p>• String Ensemble</p>
                  <p>• And more...</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Reception</h3>
                <p className="text-gray-600 mb-4">Full band experience to get your guests dancing all night.</p>
                <div className="text-sm text-gray-500">
                  <p>• 12 Genre Categories</p>
                  <p>• Custom Medleys</p>
                  <p>• Special Moments</p>
                  <p>• And more...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeFirstTier === 'getting-to-know-you' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Getting To Know You</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">Tell us about your musical preferences and wedding vision.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What's your favorite music genre?</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Pop, Rock, Jazz, Country..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Any must-play songs?</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="List any songs that are special to you..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeFirstTier === 'event-info' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Event Information</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wedding Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Venue Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter venue name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ceremony Time</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reception Start Time</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Second Tier Content */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {activeSecondTier === 'welcome-party' && 'Welcome Party Music'}
            {activeSecondTier === 'ceremony' && 'Ceremony Music'}
            {activeSecondTier === 'cocktail-hour' && 'Cocktail Hour Music'}
            {activeSecondTier === 'reception' && 'Reception Music'}
            {activeSecondTier === 'after-party' && 'After Party Music'}
          </h3>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 mb-4">
              {activeSecondTier === 'welcome-party' && 'Select songs for your welcome party celebration.'}
              {activeSecondTier === 'ceremony' && 'Choose your ceremony ensemble and music selections.'}
              {activeSecondTier === 'cocktail-hour' && 'Pick background music for your cocktail hour.'}
              {activeSecondTier === 'reception' && 'Build your reception playlist from our 12 genre categories.'}
              {activeSecondTier === 'after-party' && 'Select high-energy songs to keep the party going.'}
            </p>
            
            <div className="text-center py-8 text-gray-500">
              <p>Song selection interface will be implemented here</p>
              <p className="text-sm mt-2">This will connect to the songs database we built</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
