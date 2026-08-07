import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MicListener } from './components/MicListener';
import { TextSearch } from './components/TextSearch';
import { ResultCard } from './components/ResultCard';
import { VaultView } from './components/VaultView';
import { HistoryView } from './components/HistoryView';
import { QuizGame } from './components/QuizGame';
import { DisqusComments } from './components/DisqusComments';
import { IdentifyResult, HistoryItem } from './types';
import { VAULT_PRESETS } from './data/vaultData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'mic' | 'search' | 'vault' | 'history' | 'quiz'>('mic');
  const [currentResult, setCurrentResult] = useState<IdentifyResult | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  // Load history from localStorage on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cinetune_history');
      if (saved) {
        setHistoryItems(JSON.parse(saved));
      } else {
        // Seed initial history with 2 vault presets so history is never blank
        const initialSeed: HistoryItem[] = VAULT_PRESETS.slice(0, 2).map((item, idx) => ({
          id: `seed-${idx}`,
          timestamp: Date.now() - idx * 86400000,
          result: item,
          isFavorite: idx === 0,
          notes: idx === 0 ? "Iconic resolution sequence" : undefined,
          inputMethod: 'vault_preset'
        }));
        setHistoryItems(initialSeed);
        localStorage.setItem('cinetune_history', JSON.stringify(initialSeed));
      }
    } catch (err) {
      console.warn("Could not load history from localStorage:", err);
    }
  }, []);

  const saveHistoryToStorage = (updated: HistoryItem[]) => {
    setHistoryItems(updated);
    try {
      localStorage.setItem('cinetune_history', JSON.stringify(updated));
    } catch (err) {
      console.warn("Could not write history to localStorage:", err);
    }
  };

  const handleIdentified = (result: IdentifyResult, inputMethod: 'mic' | 'audio_file' | 'search_text' | 'humming') => {
    setCurrentResult(result);

    // Auto add to history
    const newItem: HistoryItem = {
      id: `history-${Date.now()}`,
      timestamp: Date.now(),
      result,
      isFavorite: false,
      inputMethod
    };

    saveHistoryToStorage([newItem, ...historyItems]);
  };

  const handleSaveToHistory = (result: IdentifyResult, notes?: string) => {
    const existingIndex = historyItems.findIndex((item) => item.result.song.id === result.song.id);

    if (existingIndex >= 0) {
      const updated = [...historyItems];
      updated[existingIndex].notes = notes || updated[existingIndex].notes;
      updated[existingIndex].isFavorite = true;
      saveHistoryToStorage(updated);
    } else {
      const newItem: HistoryItem = {
        id: `history-${Date.now()}`,
        timestamp: Date.now(),
        result,
        notes,
        isFavorite: true,
        inputMethod: 'mic'
      };
      saveHistoryToStorage([newItem, ...historyItems]);
    }
  };

  const handleToggleFavorite = (id: string) => {
    const updated = historyItems.map((item) => {
      if (item.id === id) {
        return { ...item, isFavorite: !item.isFavorite };
      }
      return item;
    });
    saveHistoryToStorage(updated);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your soundtrack history?")) {
      saveHistoryToStorage([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setCurrentResult(null); // Return to standard view when clicking header tabs
        }}
        historyCount={historyItems.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentResult ? (
          <ResultCard
            result={currentResult}
            onBack={() => setCurrentResult(null)}
            onSaveToHistory={handleSaveToHistory}
            isSaved={historyItems.some((h) => h.result.song.id === currentResult.song.id && h.isFavorite)}
          />
        ) : activeTab === 'mic' ? (
          <MicListener
            onIdentified={(res, method) => handleIdentified(res, method)}
            onError={(msg) => console.error(msg)}
          />
        ) : activeTab === 'search' ? (
          <TextSearch
            onIdentified={(res, method) => handleIdentified(res, method)}
            onError={(msg) => console.error(msg)}
          />
        ) : activeTab === 'vault' ? (
          <VaultView
            onSelectResult={(preset) => setCurrentResult(preset)}
          />
        ) : activeTab === 'history' ? (
          <HistoryView
            historyItems={historyItems}
            onSelectResult={(res) => setCurrentResult(res)}
            onToggleFavorite={handleToggleFavorite}
            onClearHistory={handleClearHistory}
          />
        ) : activeTab === 'quiz' ? (
          <QuizGame />
        ) : null}
      </main>

      {/* Disqus Comments Section */}
      <DisqusComments />

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5">
            <span>CineTune — Find your favourite movie soundtrack</span>
            <span>•</span>
            <span className="text-amber-400/80 font-medium">For Movie & Music Lovers</span>
          </p>
          <p className="text-slate-600">Powered by Google Gemini 3.6 Multimodal AI</p>
        </div>
      </footer>
    </div>
  );
}
