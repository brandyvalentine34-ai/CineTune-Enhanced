import React, { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle2, AlertCircle, LogOut, Music2, Copy, Sparkles, X, ListMusic } from 'lucide-react';

interface SpotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpotifyModal: React.FC<SpotifyModalProps> = ({ isOpen, onClose }) => {
  const [spotifyUser, setSpotifyUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('spotify_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isConfigured, setIsConfigured] = useState<boolean>(true);
  const [redirectUri, setRedirectUri] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Check Spotify status from backend
    fetch('/api/spotify/status')
      .then((res) => res.json())
      .then((data) => {
        setIsConfigured(data.configured);
        if (data.redirectUri) {
          setRedirectUri(data.redirectUri);
        }
      })
      .catch(() => {
        setIsConfigured(false);
      });
  }, []);

  useEffect(() => {
    // Listen for OAuth postMessage
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SPOTIFY_AUTH_SUCCESS') {
        const { user, tokens } = event.data;
        if (user) {
          setSpotifyUser(user);
          localStorage.setItem('spotify_user', JSON.stringify(user));
        }
        if (tokens) {
          localStorage.setItem('spotify_tokens', JSON.stringify(tokens));
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnectSpotify = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/spotify/url');
      const data = await res.json();

      if (!res.ok || !data.configured || !data.url) {
        setIsConfigured(false);
        if (data.redirectUri) setRedirectUri(data.redirectUri);
        setLoading(false);
        return;
      }

      const popup = window.open(
        data.url,
        'spotify_oauth_popup',
        'width=600,height=750,scrollbars=yes,status=yes'
      );

      if (!popup) {
        alert('Please allow popups to connect your Spotify account.');
      }
    } catch (err) {
      console.error('Spotify connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setSpotifyUser(null);
    localStorage.removeItem('spotify_user');
    localStorage.removeItem('spotify_tokens');
  };

  const handleCopyUri = () => {
    if (redirectUri) {
      navigator.clipboard.writeText(redirectUri);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1DB954]/20 border border-[#1DB954]/40 flex items-center justify-center text-[#1DB954]">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-display flex items-center gap-2">
                Connect Spotify
                <span className="text-[10px] font-semibold bg-[#1DB954]/20 text-[#1DB954] px-2 py-0.5 rounded-full border border-[#1DB954]/30">
                  Official Integration
                </span>
              </h3>
              <p className="text-xs text-slate-400">Sync soundtrack matches to your Spotify playlists</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {spotifyUser ? (
            /* Connected State */
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#1DB954]/10 via-slate-800/80 to-slate-900 border border-[#1DB954]/30 flex items-center gap-4">
                {spotifyUser.images?.[0]?.url ? (
                  <img
                    src={spotifyUser.images[0].url}
                    alt={spotifyUser.display_name}
                    className="w-14 h-14 rounded-full border-2 border-[#1DB954] object-cover shadow-md"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#1DB954] text-slate-950 font-bold flex items-center justify-center text-xl">
                    {spotifyUser.display_name?.charAt(0) || 'S'}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-[#1DB954] font-semibold mb-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected Account
                  </div>
                  <h4 className="font-bold text-white text-base truncate">{spotifyUser.display_name || 'Spotify User'}</h4>
                  <p className="text-xs text-slate-400 truncate">{spotifyUser.email || spotifyUser.id}</p>
                </div>

                <button
                  onClick={handleDisconnect}
                  title="Disconnect"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://open.spotify.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-slate-950 font-bold text-xs transition-transform active:scale-95 shadow-lg shadow-[#1DB954]/20"
                >
                  <ExternalLink className="w-4 h-4" /> Open Spotify Player
                </a>

                <a
                  href="https://open.spotify.com/search/movie%20soundtrack/playlists"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition-colors"
                >
                  <ListMusic className="w-4 h-4 text-[#1DB954]" /> View Movie Playlists
                </a>
              </div>
            </div>
          ) : (
            /* Disconnected / Connect State */
            <div className="space-y-5">
              <div className="text-center py-2">
                <div className="w-16 h-16 rounded-2xl bg-[#1DB954]/15 border border-[#1DB954]/30 flex items-center justify-center mx-auto mb-3 text-[#1DB954] shadow-inner">
                  <Music2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Connect Your Spotify Account</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Link your account to save identified soundtrack songs directly into your Spotify playlists and listen on demand.
                </p>
              </div>

              {/* Main Connect Button */}
              <button
                onClick={handleConnectSpotify}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-slate-950 font-extrabold text-sm transition-all duration-200 transform active:scale-[0.98] shadow-xl shadow-[#1DB954]/20"
              >
                <Music2 className="w-5 h-5 fill-current" />
                {loading ? 'Connecting...' : 'Connect to Spotify'}
              </button>

              {/* Direct Link to Spotify Web */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Want to browse Spotify directly?</span>
                <a
                  href="https://open.spotify.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[#1DB954] font-semibold hover:underline"
                >
                  Open Spotify Web <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Developer Setup Instructions if credentials missing */}
              {!isConfigured && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <AlertCircle className="w-4 h-4" />
                    <span>Spotify API Credentials Setup</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    To enable full OAuth login, set your Spotify Developer Client ID in AI Studio settings:
                  </p>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] flex items-center justify-between text-slate-300">
                    <span className="truncate mr-2">{redirectUri || 'https://.../api/auth/spotify/callback'}</span>
                    <button
                      onClick={handleCopyUri}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Add this Redirect URI in your <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noreferrer" className="text-amber-400 underline">Spotify Developer Dashboard</a>.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
