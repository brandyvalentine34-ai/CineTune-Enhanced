import React, { useEffect, useState } from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';

export const DisqusComments: React.FC = () => {
  const [scriptFailed, setScriptFailed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Suppress cross-origin "Script error." caused by Disqus or external scripts in iframe
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.message === 'Script error.' || (event.filename && event.filename.includes('disqus'))) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('error', handleGlobalError);

    try {
      // Define disqus_config so Disqus doesn't crash trying to inspect parent iframe URL
      (window as any).disqus_config = function (this: any) {
        this.page.url = window.location.origin + window.location.pathname;
        this.page.identifier = 'cinetune-comments';
      };

      // Check if embed script is already present
      const existingEmbedScript = document.querySelector('script[src*="disqus.com/embed.js"]');
      if (!existingEmbedScript) {
        const s = document.createElement('script');
        s.src = 'https://testing-bxxxoikjrb.disqus.com/embed.js';
        s.setAttribute('data-timestamp', (+new Date()).toString());
        s.async = true;
        s.onerror = () => {
          console.warn('Disqus embed script failed to load.');
          if (isMounted) setScriptFailed(true);
        };
        (document.head || document.body).appendChild(s);
      } else if ((window as any).DISQUS) {
        try {
          (window as any).DISQUS.reset({
            reload: true,
            config: (window as any).disqus_config,
          });
        } catch (e) {
          console.warn('Disqus reset error:', e);
        }
      }

      const existingCountScript = document.getElementById('dsq-count-scr');
      if (!existingCountScript) {
        const countScript = document.createElement('script');
        countScript.id = 'dsq-count-scr';
        countScript.src = 'https://testing-bxxxoikjrb.disqus.com/count.js';
        countScript.async = true;
        countScript.onerror = () => {
          console.warn('Disqus count script failed to load.');
        };
        (document.head || document.body).appendChild(countScript);
      }
    } catch (err) {
      console.warn('Disqus initialization error:', err);
      if (isMounted) setScriptFailed(true);
    }

    return () => {
      isMounted = false;
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  return (
    <section className="w-full bg-slate-950/80 border-t border-slate-900/80 py-10 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-4xl mx-auto rounded-2xl bg-slate-900/90 border border-slate-800/80 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-500/30 text-amber-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-display">Community Comments & Discussions</h3>
            <p className="text-xs text-slate-400">Share your favourite movie scenes, song discoveries, or soundtrack trivia!</p>
          </div>
        </div>

        {scriptFailed ? (
          <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
            <AlertCircle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-medium font-sans">Comments thread is currently unavailable in preview mode.</p>
            <p className="text-xs text-slate-500 mt-1">Disqus comments will load when accessed on a live public domain.</p>
          </div>
        ) : (
          /* Disqus Embed Container */
          <div id="disqus_thread" className="min-h-[200px]" />
        )}

        <noscript>
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript" className="text-amber-400 underline" target="_blank" rel="noopener noreferrer">
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    </section>
  );
};

