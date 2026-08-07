import React, { useState } from 'react';
import { IdentifyResult } from '../types';
import { VAULT_PRESETS } from '../data/vaultData';
import { Film, Disc, ArrowRight, Sparkles, Filter, Clapperboard } from 'lucide-react';
import orchestraBg from '../assets/images/cinema_orchestra_bg_1785989835202.jpg';

interface VaultViewProps {
  onSelectResult: (result: IdentifyResult) => void;
}

export const VaultView: React.FC<VaultViewProps> = ({ onSelectResult }) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  const genres = ['All', 'Sci-Fi', 'Crime', 'Synthwave', 'Rock', 'Pop'];

  const filteredPresets = VAULT_PRESETS.filter((item) => {
    if (selectedGenre === 'All') return true;
    return (
      item.primaryMovie.genre.toLowerCase().includes(selectedGenre.toLowerCase()) ||
      item.song.genre?.toLowerCase().includes(selectedGenre.toLowerCase())
    );
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Hero Image Header */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl mb-8 group">
        <img
          src={orchestraBg}
          alt="Cinema Orchestra Performing"
          referrerPolicy="no-referrer"
          className="w-full h-48 sm:h-64 object-cover object-center transform group-hover:scale-105 transition-transform duration-700 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col justify-end p-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold w-fit mx-auto sm:mx-0 mb-2">
            <Film className="w-3.5 h-3.5" />
            <span>The Cinematic Soundtrack Vault</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display mb-1">
            Iconic Movie Soundtrack Moments
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Explore legendary songs that defined cinematic history. Click any soundtrack card to view its full scene breakdown, timestamp, and director trivia.
          </p>
        </div>
      </div>

      {/* Genre Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedGenre === genre
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Grid of Movie Soundtrack Preset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPresets.map((preset) => (
          <div
            key={preset.song.id}
            onClick={() => onSelectResult(preset)}
            className="group rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-amber-500/50 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-950/20 flex flex-col justify-between"
          >
            <div>
              {/* Image banner */}
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={preset.primaryMovie.posterUrl}
                  alt={preset.primaryMovie.movieTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <span className="absolute top-3 right-3 px-2 py-1 rounded bg-black/70 backdrop-blur-md border border-slate-800 text-amber-300 font-mono text-[11px] font-bold">
                  {preset.primaryMovie.timestamp}
                </span>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/80 text-white mb-1 inline-block">
                    {preset.primaryMovie.movieTitle} ({preset.primaryMovie.releaseYear})
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    "{preset.song.title}"
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">{preset.song.artist}</p>
                </div>
              </div>

              {/* Scene teaser snippet */}
              <div className="p-4 text-xs text-slate-400 space-y-2">
                <p className="line-clamp-2 text-slate-300 italic">
                  "{preset.primaryMovie.sceneDescription}"
                </p>
                <div className="flex items-center gap-2 text-[11px] text-amber-400 font-medium">
                  <Clapperboard className="w-3.5 h-3.5" />
                  <span>Dir. {preset.primaryMovie.director}</span>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 flex items-center justify-between text-xs font-semibold text-rose-400 group-hover:text-amber-300 transition-colors border-t border-slate-800/60 mt-2">
              <span>Inspect Full Movie Match</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
