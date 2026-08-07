import React, { useState } from 'react';
import { HistoryItem, IdentifyResult } from '../types';
import { Clock, Bookmark, Search, Trash2, ArrowRight, Disc, Film, Star } from 'lucide-react';

interface HistoryViewProps {
  historyItems: HistoryItem[];
  onSelectResult: (result: IdentifyResult) => void;
  onToggleFavorite: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  historyItems,
  onSelectResult,
  onToggleFavorite,
  onClearHistory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const filtered = historyItems.filter((item) => {
    const matchesFav = onlyFavorites ? item.isFavorite : true;
    const matchesSearch =
      item.result.song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.result.song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.result.primaryMovie.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFav && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white font-display flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-400" />
            <span>Soundtrack History & Favorites</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {historyItems.length} song matches saved on this device
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={onClearHistory}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/50 border border-slate-800 text-slate-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved songs or movies..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          onClick={() => setOnlyFavorites(!onlyFavorites)}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center ${
            onlyFavorites
              ? 'bg-amber-500 text-slate-950'
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-slate-950' : ''}`} />
          <span>Favorites Only</span>
        </button>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/50 border border-slate-800">
          <Disc className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-spin-slow" />
          <h3 className="text-lg font-bold text-white mb-1">No Saved Soundtrack Matches</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Identify songs using the microphone, search bar, or explore the Movie Vault to save your favorites here.
          </p>
        </div>
      ) : (
        /* History List */
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-between gap-4 group"
            >
              <div
                onClick={() => onSelectResult(item.result)}
                className="flex items-center gap-4 cursor-pointer flex-1 min-w-0"
              >
                <img
                  src={item.result.primaryMovie.posterUrl}
                  alt={item.result.primaryMovie.movieTitle}
                  className="w-12 h-16 rounded-lg object-cover flex-shrink-0 border border-slate-800"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-extrabold text-amber-300 truncate">
                      "{item.result.song.title}"
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-white font-medium truncate">
                    Movie: <span className="text-rose-300 font-bold">{item.result.primaryMovie.movieTitle}</span> ({item.result.primaryMovie.releaseYear})
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    Scene: {item.result.primaryMovie.timestamp} • {item.result.song.artist}
                  </p>
                  {item.notes && (
                    <p className="text-[11px] text-amber-400/90 italic truncate mt-1">
                      Note: "{item.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleFavorite(item.id)}
                  className={`p-2 rounded-lg border transition-colors ${
                    item.isFavorite
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white'
                  }`}
                  title="Toggle Favorite"
                >
                  <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-400' : ''}`} />
                </button>

                <button
                  onClick={() => onSelectResult(item.result)}
                  className="p-2 rounded-lg bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-300 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
