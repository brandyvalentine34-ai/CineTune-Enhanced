import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Upload, Sparkles, Loader2, Music, Film, Radio, AlertCircle, Info, Disc } from 'lucide-react';
import { startRecording, RecordingControls } from '../lib/audioRecorder';
import { AudioWaveform } from './AudioWaveform';
import { IdentifyResult } from '../types';
import heroBannerImg from '../assets/images/cinematic_hero_banner_1785989820637.jpg';

interface MicListenerProps {
  onIdentified: (result: IdentifyResult, inputMethod: 'mic' | 'audio_file') => void;
  onError: (err: string) => void;
}

export const MicListener: React.FC<MicListenerProps> = ({ onIdentified, onError }) => {
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [userHint, setUserHint] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recordingControlsRef = useRef<RecordingControls | null>(null);
  const timerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recordingControlsRef.current) {
        recordingControlsRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleStartListening = async () => {
    setErrorMessage(null);
    try {
      const controls = await startRecording((level) => {
        setVolumeLevel(level);
      });
      recordingControlsRef.current = controls;
      setIsListening(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 12) {
            // Auto stop at 12 seconds for optimal analysis
            handleStopAndIdentify();
            return 12;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error("Microphone error:", err);
      setErrorMessage(err.message || "Microphone permission was denied or is not supported in this browser.");
      onError(err.message || "Microphone permission error");
    }
  };

  const handleStopAndIdentify = async () => {
    if (!recordingControlsRef.current || !isListening) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setIsListening(false);
    setIsAnalyzing(true);

    try {
      const { base64, mimeType } = await recordingControlsRef.current.stop();
      recordingControlsRef.current = null;

      // Call server API
      const response = await fetch('/api/identify-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64,
          mimeType,
          userHint: userHint.trim() || undefined
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.result) {
        throw new Error(data.error || data.details || "Could not identify the song in our movie database.");
      }

      setIsAnalyzing(false);
      onIdentified(data.result, 'mic');
    } catch (err: any) {
      console.error("Audio identification error:", err);
      setIsAnalyzing(false);
      setErrorMessage(err.message || "Failed to identify audio snippet. Please try again or use text search.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage("Audio file size must be less than 20MB.");
      return;
    }

    setErrorMessage(null);
    setIsAnalyzing(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const response = await fetch('/api/identify-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64,
            mimeType: file.type || 'audio/mp3',
            userHint: userHint.trim() || undefined
          })
        });

        const data = await response.json();
        setIsAnalyzing(false);

        if (!response.ok || !data.success || !data.result) {
          throw new Error(data.error || data.details || "Could not identify song from uploaded audio file.");
        }

        onIdentified(data.result, 'audio_file');
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setIsAnalyzing(false);
      setErrorMessage(err.message || "Failed to process audio file.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] py-6 px-4 text-center">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-rose-600/10 via-amber-500/10 to-purple-600/10 blur-3xl rounded-full pointer-events-none" />

      {/* Cinematic Banner Graphic */}
      <div className="relative w-full max-w-3xl mb-6 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
        <img
          src={heroBannerImg}
          alt="Cinematic Vinyl Record Banner"
          referrerPolicy="no-referrer"
          className="w-full h-40 sm:h-52 object-cover object-center transform group-hover:scale-105 transition-transform duration-700 brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent flex items-end justify-center p-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/30 shadow-lg">
            <Disc className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span className="text-xs font-semibold text-amber-200">AI Film Audio Identification</span>
          </div>
        </div>
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display mb-3 max-w-2xl">
        Play any song and we will tell you what <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400">movie</span> this is
      </h1>
      <p className="text-slate-400 text-sm sm:text-base max-w-xl mb-8">
        Play a song snippet, hum a melody, or upload an audio clip. Our AI instantly pinpoints the song title, artist, exact film, scene description, and timestamp.
      </p>

      {/* Big Circle Audio Trigger Button */}
      <div className="relative my-6 flex items-center justify-center">
        {/* Pulsating Radar Rings when listening */}
        {isListening && (
          <>
            <div className="absolute w-56 h-56 rounded-full border-2 border-rose-500/30 animate-ping pointer-events-none" />
            <div className="absolute w-72 h-72 rounded-full border border-amber-500/20 animate-pulse pointer-events-none" />
          </>
        )}

        {isAnalyzing && (
          <div className="absolute w-60 h-60 rounded-full border-2 border-purple-500/40 animate-spin pointer-events-none border-t-amber-400" />
        )}

        <button
          id="mic-trigger-btn"
          onClick={isListening ? handleStopAndIdentify : isAnalyzing ? undefined : handleStartListening}
          disabled={isAnalyzing}
          className={`relative z-10 w-40 h-40 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 shadow-2xl ${
            isListening
              ? 'bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 text-white shadow-rose-600/50 scale-105 animate-pulse'
              : isAnalyzing
              ? 'bg-slate-900 border-2 border-purple-500/50 text-purple-300 cursor-wait'
              : 'bg-gradient-to-tr from-slate-900 via-slate-850 to-slate-800 hover:from-rose-950 hover:to-amber-950 text-amber-400 border-4 border-slate-800 hover:border-amber-500/50 shadow-slate-950 hover:shadow-amber-500/20 group'
          }`}
        >
          {isAnalyzing ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
              <span className="text-xs font-bold tracking-wider text-purple-200 uppercase">Matching Film...</span>
            </div>
          ) : isListening ? (
            <div className="flex flex-col items-center gap-2">
              <Mic className="w-12 h-12 text-white animate-bounce" />
              <span className="text-sm font-bold text-white tracking-wide">TAP TO MATCH</span>
              <span className="text-xs font-mono bg-black/30 px-2 py-0.5 rounded text-amber-200">
                00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds} / 00:12
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 group-hover:scale-105 transition-transform">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center group-hover:bg-rose-500/20 group-hover:border-rose-500/50 transition-colors">
                <Disc className="w-8 h-8 text-amber-400 group-hover:text-rose-400 animate-spin-slow" />
              </div>
              <span className="text-sm font-extrabold text-white tracking-wider font-display">TAP TO LISTEN</span>
              <span className="text-[11px] text-slate-400">Song or Humming</span>
            </div>
          )}
        </button>
      </div>

      {/* Audio Waveform visualization */}
      <AudioWaveform isListening={isListening} isAnalyzing={isAnalyzing} volumeLevel={volumeLevel} />

      {/* Context / Hint Input Optional */}
      <div className="w-full max-w-md mt-2 mb-6">
        <div className="relative">
          <input
            id="user-hint-input"
            type="text"
            value={userHint}
            onChange={(e) => setUserHint(e.target.value)}
            placeholder="Optional context (e.g. '80s action movie car chase' or 'piano theme')..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40"
          />
        </div>
      </div>

      {/* Secondary Upload Audio File Option */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
          id="audio-file-upload-input"
        />
        <button
          id="upload-audio-file-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={isListening || isAnalyzing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all"
        >
          <Upload className="w-4 h-4 text-rose-400" />
          <span>Upload Audio Clip (MP3 / WAV / M4A)</span>
        </button>
      </div>

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="mt-6 p-4 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs sm:text-sm max-w-md flex items-start gap-3 text-left shadow-lg">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-300">Identification Error</p>
            <p className="text-slate-300 mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Quick Guide */}
      <div className="mt-12 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60 max-w-lg text-left">
        <div className="flex items-center gap-2 mb-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Info className="w-4 h-4" />
          <span>How CineTune Works</span>
        </div>
        <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
          <li>Hold your mic near TV speakers, radio, laptop, or hum the tune.</li>
          <li>Gemini AI analyzes spectral features, melody, and movie soundtrack databases.</li>
          <li>Get the exact movie title, scene timestamp, director, mood, and soundtrack trivia.</li>
        </ul>
      </div>
    </div>
  );
};
