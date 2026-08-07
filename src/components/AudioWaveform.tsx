import React, { useEffect, useState } from 'react';

interface AudioWaveformProps {
  isListening: boolean;
  isAnalyzing: boolean;
  volumeLevel?: number;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ isListening, isAnalyzing, volumeLevel = 0 }) => {
  const [bars, setBars] = useState<number[]>([15, 30, 45, 60, 40, 75, 50, 30, 20, 60, 80, 40, 25, 55, 35, 20]);

  useEffect(() => {
    if (!isListening && !isAnalyzing) return;

    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map(() => {
          if (isAnalyzing) {
            return Math.floor(Math.random() * 80) + 20;
          }
          // Scale randomly based on volume level or animated wave
          const base = Math.max(15, volumeLevel);
          return Math.min(100, Math.floor(Math.random() * base) + 15);
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isListening, isAnalyzing, volumeLevel]);

  return (
    <div className="flex items-center justify-center gap-1.5 h-16 px-4 py-2 my-4">
      {bars.map((height, idx) => (
        <div
          key={idx}
          className={`w-1.5 sm:w-2 rounded-full transition-all duration-150 ${
            isAnalyzing
              ? 'bg-gradient-to-t from-purple-500 via-rose-500 to-amber-400 animate-pulse'
              : isListening
              ? 'bg-gradient-to-t from-rose-600 via-amber-500 to-amber-300 shadow-sm shadow-rose-500/50'
              : 'bg-slate-800'
          }`}
          style={{
            height: isListening || isAnalyzing ? `${height}%` : '12px',
            opacity: isListening || isAnalyzing ? 0.9 : 0.3
          }}
        />
      ))}
    </div>
  );
};
