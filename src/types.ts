export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  releaseYear?: number | string;
  genre?: string;
  spotifySearchUrl: string;
  youtubeSearchUrl: string;
  appleMusicSearchUrl?: string;
  audioPreviewUrl?: string; // Standard demo audio or synthetic preview
}

export interface MovieMatch {
  id: string;
  movieTitle: string;
  releaseYear: number | string;
  director: string;
  genre: string;
  posterUrl: string;
  backdropUrl?: string;
  sceneDescription: string;
  timestamp: string; // e.g., "01:14:20" or "Opening Credits"
  sceneMood: string; // e.g., "High-Octane Chase", "Bittersweet Climax"
  characterContext: string;
  isThemeSong: boolean;
  isEndCredits: boolean;
  imdbOrWikiUrl: string;
  trivia: string;
  otherMoviesFeaturedIn?: string[];
}

export interface IdentifyResult {
  song: Song;
  primaryMovie: MovieMatch;
  otherMovieMatches: MovieMatch[];
  matchConfidence: number; // e.g. 96 (%)
  recognizedLyrics?: string;
  musicCharacteristics: string; // e.g. "Heavy 80s analog synth with driving percussion"
  identificationTip?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  result: IdentifyResult;
  notes?: string;
  isFavorite: boolean;
  inputMethod: 'mic' | 'audio_file' | 'search_text' | 'humming' | 'vault_preset';
}

export interface QuizQuestion {
  id: string;
  songTitle: string;
  artist: string;
  sceneHint: string;
  lyricOrMelodyHint: string;
  options: {
    movieTitle: string;
    year: string | number;
    director: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}
