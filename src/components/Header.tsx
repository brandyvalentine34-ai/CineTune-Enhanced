import React, { useState } from 'react';
import { Disc, Search, Film, Clock, HelpCircle, Music2 } from 'lucide-react';
import { SpotifyModal } from './SpotifyModal';

interface HeaderProps {
  activeTab: 'mic' | 'search' | 'vault' | 'history' | 'quiz';
  setActiveTab: (tab: 'mic' | 'search' | 'vault' | 'history' | 'quiz') => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, historyCount }) => {
  const [isSpotifyOpen, setIsSpotifyOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col items-center gap-3">
          {/* Top Row: Prominent App Title */}
          <div 
            onClick={() => setActiveTab('mic')}
            className="flex items-center gap-3 cursor-pointer group text-center"
            id="brand-logo-btn"
          >
            <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 shadow-xl shadow-rose-950/50 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <Disc className="w-6 h-6 text-amber-400 animate-spin-slow" />
                <Film className="w-4 h-4 text-rose-400 absolute opacity-80" />
              </div>
            </div>
            <div className="flex flex-col items-start">
              <h1 className="font-black text-2xl sm:text-3xl md:text-4xl tracking-tight text-white font-display flex items-center gap-2">
                Cine<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400">Tune</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Find your favourite movie soundtrack</p>
            </div>
          </div>

          {/* Navigation Tabs - Dedicated Row Below */}
          <nav className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 w-full pt-1">
            <button
              id="nav-mic-btn"
              onClick={() => setActiveTab('mic')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'mic'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-950/60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Disc className={`w-4 h-4 ${activeTab === 'mic' ? 'animate-spin' : ''}`} />
              <span>Listen</span>
            </button>

            <button
              id="nav-search-btn"
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'search'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>

            <button
              id="nav-vault-btn"
              onClick={() => setActiveTab('vault')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'vault'
                  ? 'bg-slate-800 text-rose-400 border border-rose-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Movie Vault</span>
            </button>

            <button
              id="nav-quiz-btn"
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'quiz'
                  ? 'bg-slate-800 text-purple-400 border border-purple-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Quiz</span>
            </button>

            <button
              id="nav-history-btn"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all relative ${
                activeTab === 'history'
                  ? 'bg-slate-800 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>History</span>
              {historyCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                  {historyCount}
                </span>
              )}
            </button>

            {/* Spotify Button */}
            <button
              id="nav-spotify-btn"
              onClick={() => setIsSpotifyOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-[#1DB954]/15 hover:bg-[#1DB954]/25 text-[#1DB954] border border-[#1DB954]/30 transition-all shadow-sm ml-1"
              title="Connect Spotify Account"
            >
              <Music2 className="w-4 h-4" />
              <span>Spotify</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Spotify Modal */}
      <SpotifyModal isOpen={isSpotifyOpen} onClose={() => setIsSpotifyOpen(false)} />
    </>
  );
};

