import React, { useState } from 'react';
import { Search, Music, Film, Mic, Sparkles, Loader2, ArrowRight, BookOpen, Quote } from 'lucide-react';
import { IdentifyResult } from '../types';

interface TextSearchProps {
  onIdentified: (result: IdentifyResult, inputMethod: 'search_text' | 'humming') => void;
  onError: (err: string) => void;
}

export const TextSearch: React.FC<TextSearchProps> = ({ onIdentified, onError }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'text' | 'lyrics' | 'humming'>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sampleQueries = [
    { label: "Pixies - Where Is My Mind", type: 'text', text: "Where Is My Mind by Pixies" },
    { label: "Song at the end of Fight Club", type: 'text', text: "Song that plays when buildings collapse in Fight Club" },
    { label: "Night LA driving synth song", type: 'text', text: "Night driving synthwave song in Drive with Ryan Gosling" },
    { label: "Ooga chaka chant song", type: 'lyrics', text: "Ooga chaka ooga ooga hooked on a feeling" },
    { label: "Miles Morales dorm room song", type: 'text', text: "Song Miles Morales listens to in Spider-Verse dorm room" },
    { label: "Slow piano rising anthem", type: 'humming', text: "Slow rising piano and massive orchestral swelling theme in Inception" }
  ];

  const handleSearch = async (overrideQuery?: string, overrideType?: 'text' | 'lyrics' | 'humming') => {
    const q = (overrideQuery || query).trim();
    const type = overrideType || searchType;

    if (!q) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/search-soundtrack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          searchType: type
        })
      });

      const data = await response.json();
      setIsLoading(false);

      if (!response.ok || !data.success || !data.result) {
        throw new Error(data.error || data.details || "No matching movie soundtrack found for this query.");
      }

      onIdentified(data.result, type === 'humming' ? 'humming' : 'search_text');
    } catch (err: any) {
      console.error("Search error:", err);
      setIsLoading(false);
      setErrorMessage(err.message || "Failed to search soundtrack database.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 mb-3 text-xs text-amber-400 font-semibold">
          <Search className="w-3.5 h-3.5" />
          <span>Soundtrack & Scene Finder</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display mb-2">
          Search by Song, Lyrics, or Scene
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
          Type a song title, artist, lyric snippet, or scene description. Our AI will tell you which movie it appears in and the exact scene timestamp.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-center gap-2 mb-6 p-1 bg-slate-900/90 rounded-xl border border-slate-800 max-w-md mx-auto">
        <button
          onClick={() => setSearchType('text')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            searchType === 'text'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Song or Movie</span>
        </button>

        <button
          onClick={() => setSearchType('lyrics')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            searchType === 'lyrics'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Quote className="w-3.5 h-3.5" />
          <span>Lyrics Excerpt</span>
        </button>

        <button
          onClick={() => setSearchType('humming')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            searchType === 'humming'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>Humming / Scene</span>
        </button>
      </div>

      {/* Main Search Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="relative mb-6"
      >
        <div className="relative flex items-center">
          <input
            id="text-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              searchType === 'lyrics'
                ? 'Type lyrics snippet e.g. "where is my mind ooh stop"...'
                : searchType === 'humming'
                ? 'Describe melody or scene e.g. "slow piano crescendo LA driving scene"...'
                : 'Type song name, artist, or movie title e.g. "Time Hans Zimmer"...'
            }
            className="w-full pl-5 pr-28 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm sm:text-base placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 shadow-xl"
          />
          <button
            id="execute-search-btn"
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Finding...</span>
              </>
            ) : (
              <>
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs sm:text-sm">
          {errorMessage}
        </div>
      )}

      {/* Quick Example Tiles */}
      <div className="mt-8">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Popular Soundtrack Queries to Try</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {sampleQueries.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(item.text);
                setSearchType(item.type as any);
                handleSearch(item.text, item.type as any);
              }}
              className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-left transition-all group flex items-center justify-between"
            >
              <div className="truncate pr-2">
                <p className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors">
                  {item.label}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">"{item.text}"</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
