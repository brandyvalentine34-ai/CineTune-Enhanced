import React, { useState } from 'react';
import { IdentifyResult } from '../types';
import {
  Film, Music, Clock, Sparkles, ExternalLink, Bookmark, Check, Play, Volume2,
  Share2, ArrowLeft, Disc, Award, Clapperboard, MessageSquare, Plus, Info, Layers
} from 'lucide-react';
import { playSyntheticMelody } from '../lib/audioRecorder';

interface ResultCardProps {
  result: IdentifyResult;
  onBack: () => void;
  onSaveToHistory: (result: IdentifyResult, notes?: string) => void;
  isSaved?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  onBack,
  onSaveToHistory,
  isSaved = false
}) => {
  const [saved, setSaved] = useState(isSaved);
  const [userNote, setUserNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlayingSynth, setIsPlayingSynth] = useState(false);

  const { song, primaryMovie, otherMovieMatches, matchConfidence, musicCharacteristics } = result;

  const handleSave = () => {
    onSaveToHistory(result, userNote.trim() || undefined);
    setSaved(true);
    setShowNoteInput(false);
  };

  const handleShare = async () => {
    try {
      const text = `🎵 Song: "${song.title}" by ${song.artist}\n🎬 Movie: ${primaryMovie.movieTitle} (${primaryMovie.releaseYear})\n⏱️ Scene: ${primaryMovie.timestamp}\nFound via CineTune!`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Clipboard copy failed:", err);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePlayMelody = () => {
    setIsPlayingSynth(true);
    playSyntheticMelody(110);
    setTimeout(() => setIsPlayingSynth(false), 4500);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          id="result-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs sm:text-sm font-semibold text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Identify Another Song</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="share-result-btn"
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors relative"
            title="Share Movie Match"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            id="save-favorite-btn"
            onClick={() => {
              if (!saved) setShowNoteInput(!showNoteInput);
            }}
            disabled={saved}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              saved
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/50'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>{saved ? 'Saved to History' : 'Save Match'}</span>
          </button>
        </div>
      </div>

      {/* Note Input Popup if requested */}
      {showNoteInput && !saved && (
        <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-amber-500/40 shadow-xl">
          <p className="text-xs font-bold text-amber-400 mb-2">Add a personal note to this movie match:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              placeholder="e.g. 'Heard during movie night with Sarah' or 'Favorite Hans Zimmer score'"
              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400"
            >
              Confirm Save
            </button>
          </div>
        </div>
      )}

      {/* Match Confidence Header Banner */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-500/20 mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-200">
            Movie Match Confidence: <span className="text-amber-400">{matchConfidence}%</span>
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">ID: {song.id.slice(0, 10)}</span>
      </div>

      {/* Main Feature Hero Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800/80 overflow-hidden shadow-2xl mb-8">
        {/* Poster & Backdrop Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={primaryMovie.backdropUrl || primaryMovie.posterUrl}
            alt={primaryMovie.movieTitle}
            className="w-full h-full object-cover object-center filter brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

          {/* Floating Movie Badge */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <img
                src={primaryMovie.posterUrl}
                alt={primaryMovie.movieTitle}
                className="w-20 h-28 sm:w-28 sm:h-40 rounded-xl object-cover border-2 border-slate-800 shadow-2xl flex-shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-rose-500/80 text-white text-[10px] font-extrabold uppercase tracking-wider">
                    {primaryMovie.genre}
                  </span>
                  <span className="text-xs font-mono text-amber-300 bg-black/50 px-2 py-0.5 rounded border border-amber-500/30">
                    {primaryMovie.releaseYear}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display drop-shadow-md">
                  {primaryMovie.movieTitle}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Directed by <span className="text-amber-300 font-semibold">{primaryMovie.director}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Identified Song Details Card */}
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 shadow-lg flex-shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Disc className="w-6 h-6 text-amber-400 animate-spin-slow" />
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Identified Track</p>
                <h2 className="text-lg sm:text-xl font-bold text-white">{song.title}</h2>
                <p className="text-xs text-slate-300">{song.artist} {song.album ? `• ${song.album}` : ''}</p>
              </div>
            </div>

            {/* External Links & Synth Player */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                id="play-synth-melody-btn"
                onClick={handlePlayMelody}
                disabled={isPlayingSynth}
                className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 flex items-center justify-center gap-1.5 transition-colors"
                title="Play Synthetic Melody Preview"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isPlayingSynth ? 'animate-bounce text-amber-400' : ''}`} />
                <span>{isPlayingSynth ? 'Playing...' : 'Audio Preview'}</span>
              </button>

              <a
                href={song.spotifySearchUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <span>Spotify</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href={song.youtubeSearchUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <span>YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* EXACT SCENE BREAKDOWN */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/20 via-slate-900 to-rose-950/20 border border-amber-500/30">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Clapperboard className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Exact Scene Breakdown</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{primaryMovie.timestamp}</span>
                </span>
                {primaryMovie.isThemeSong && (
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-bold uppercase">
                    Theme Track
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans mb-4">
              "{primaryMovie.sceneDescription}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Scene Atmosphere/Mood: </span>
                <span className="text-amber-300 font-semibold">{primaryMovie.sceneMood}</span>
              </div>
              {primaryMovie.characterContext && (
                <div>
                  <span className="text-slate-400 font-medium">Character Context: </span>
                  <span className="text-rose-300 font-semibold">{primaryMovie.characterContext}</span>
                </div>
              )}
            </div>
          </div>

          {/* Film Trivia & Behind-the-scenes callout */}
          {primaryMovie.trivia && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Soundtrack Trivia & Behind The Scenes</span>
              </div>
              <p className="text-slate-300 leading-relaxed italic">{primaryMovie.trivia}</p>
            </div>
          )}

          {/* Audio Characteristics */}
          {musicCharacteristics && (
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs flex items-center gap-2">
              <Disc className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span className="text-slate-400">Acoustic Signature: </span>
              <span className="text-slate-200 font-medium">{musicCharacteristics}</span>
            </div>
          )}

          {/* Other Movies or TV Shows featuring this track */}
          {otherMovieMatches && otherMovieMatches.length > 0 && (
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Also Featured in Other Films / TV Shows</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {otherMovieMatches.map((other, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-amber-300">{other.movieTitle} ({other.releaseYear})</span>
                      <span className="text-[10px] font-mono text-slate-400">{other.timestamp}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] line-clamp-2">{other.sceneDescription}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
