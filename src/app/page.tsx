'use client';

import { useState } from 'react';
import SongsDatabase from '@/components/SongsDatabase/SongsDatabase';
import ClientPortal from '@/components/ClientPortal/ClientPortal';

export default function Home() {
  const [activeView, setActiveView] = useState<'database' | 'client-portal'>('database');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gray-900">Hook Club App</h1>
              <nav className="flex space-x-6">
                <button
                  onClick={() => setActiveView('database')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    activeView === 'database'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Songs Database
                </button>
                <button
                  onClick={() => setActiveView('client-portal')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    activeView === 'client-portal'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Client Portal
                </button>
              </nav>
            </div>
            <div className="text-sm text-gray-500">
              {activeView === 'database' ? 'Manage your song repertoire' : 'Plan wedding music with clients'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {activeView === 'database' && <SongsDatabase />}
      {activeView === 'client-portal' && <ClientPortal />}
    </div>
  );
}