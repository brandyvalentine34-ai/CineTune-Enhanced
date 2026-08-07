import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { HelpCircle, Award, CheckCircle2, XCircle, ArrowRight, Loader2, Disc, Trophy, Sparkles, RefreshCw } from 'lucide-react';
import quizBannerImg from '../assets/images/quiz_trivia_banner_1785989870433.jpg';

export const QuizGame: React.FC = () => {
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [answered, setAnswered] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchNextQuestion = async () => {
    setLoading(true);
    setSelectedOption(null);
    setAnswered(false);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success || !data.quiz) {
        throw new Error(data.error || "Could not load quiz question.");
      }

      setCurrentQuiz(data.quiz);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg("Failed to generate trivia question. Please try again.");
    }
  };

  useEffect(() => {
    fetchNextQuestion();
  }, []);

  const handleSelectOption = (idx: number, isCorrect: boolean) => {
    if (answered) return;
    setSelectedOption(idx);
    setAnswered(true);

    if (isCorrect) {
      setScore((prev) => prev + 100 + streak * 20);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Quiz Banner Header */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl mb-6 group">
        <img
          src={quizBannerImg}
          alt="Cinematic Soundtrack Quiz"
          referrerPolicy="no-referrer"
          className="w-full h-36 sm:h-44 object-cover object-center transform group-hover:scale-105 transition-transform duration-700 brightness-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent flex flex-col justify-end p-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold w-fit mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Soundtrack Trivia</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display">
            Test Your Film Music Knowledge
          </h2>
        </div>
      </div>

      {/* Header Stats */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 mb-6 shadow-lg">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Score</p>
            <p className="text-lg font-extrabold text-white font-mono">{score}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-400 animate-pulse" />
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Streak</p>
            <p className="text-lg font-extrabold text-amber-400 font-mono">{streak} 🔥</p>
          </div>
        </div>

        <button
          onClick={fetchNextQuestion}
          disabled={loading}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Skip / Next Question"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800/80 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-4">
          <HelpCircle className="w-4 h-4" />
          <span>Movie Soundtrack Challenge</span>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-10 h-10 text-amber-400 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">Generating AI Soundtrack Question...</p>
          </div>
        ) : errorMsg ? (
          <div className="py-8 text-center text-rose-300 text-sm">
            <p>{errorMsg}</p>
            <button
              onClick={fetchNextQuestion}
              className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
            >
              Retry
            </button>
          </div>
        ) : currentQuiz ? (
          <div>
            {/* Song title */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6 text-center">
              <Disc className="w-8 h-8 text-rose-400 mx-auto mb-2 animate-spin-slow" />
              <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                "{currentQuiz.songTitle}"
              </h3>
              <p className="text-xs text-amber-300 font-medium">by {currentQuiz.artist}</p>
            </div>

            {/* Hint Box */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-300 mb-6 italic">
              <span className="font-bold text-amber-400 not-italic">Scene Hint: </span>
              "{currentQuiz.sceneHint}"
            </div>

            <p className="text-sm font-bold text-white mb-4">Which movie features this iconic track?</p>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQuiz.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                let btnStyle = "bg-slate-950 border-slate-800 text-slate-200 hover:border-amber-500/50";

                if (answered) {
                  if (opt.isCorrect) {
                    btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold";
                  } else if (isSelected) {
                    btnStyle = "bg-rose-950/80 border-rose-500 text-rose-200";
                  } else {
                    btnStyle = "bg-slate-950 border-slate-900 text-slate-600 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx, opt.isCorrect)}
                    disabled={answered}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <div>
                      <span className="font-bold">{opt.movieTitle}</span>
                      <span className="ml-2 font-mono text-[11px] opacity-70">({opt.year})</span>
                      {opt.director && <span className="ml-2 text-[11px] opacity-70">• Dir. {opt.director}</span>}
                    </div>

                    {answered && (
                      <div>
                        {opt.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : isSelected ? (
                          <XCircle className="w-5 h-5 text-rose-400" />
                        ) : null}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next Button */}
            {answered && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  <span className="font-bold text-amber-400">Movie Fact: </span>
                  {currentQuiz.explanation}
                </p>

                <button
                  onClick={fetchNextQuestion}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 hover:from-amber-400 hover:to-rose-400 transition-all shadow-md"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
