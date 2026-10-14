import React, { useState } from 'react';
import { Sparkles, Pause, Play } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { breakingHeadlines } from '../data/initialNews';

export const BreakingNewsTicker: React.FC = () => {
  const { articles, navigateToArticle, lang } = useNews();
  const [isPaused, setIsPaused] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);

  // Dynamic breaking articles strictly controlled by the Breaking News button (ON = included, OFF = removed)
  const breakingArticles = [...articles]
    .filter(a => (a.status === 'published' || a.status === undefined) && !!a.isBreaking)
    .sort((a, b) => {
      const timeA = new Date(a.createdAt || a.updatedAt || 0).getTime();
      const timeB = new Date(b.createdAt || b.updatedAt || 0).getTime();
      return timeB - timeA;
    });

  // If no articles have breaking ticker ON, or all are removed/off, leave ticker area completely empty (khali)
  if (breakingArticles.length === 0) {
    return null;
  }

  const rawItems = breakingArticles.slice(0, 15).map((a, idx) => ({
    id: a.id,
    title: a.title,
    subLocation: a.subLocation || 'जशपुर',
    isBreaking: true,
    isNew: idx < 3
  }));

  // Duplicate for seamless 0% -> -50% CSS infinite loop
  const baseItems = rawItems.length < 4 ? [...rawItems, ...rawItems] : rawItems;
  const tickerItems = [...baseItems, ...baseItems];

  const effectivelyPaused = isPaused || manualPaused;

  return (
    <div 
      role="region" 
      aria-label="ताज़ा खबर टिकर"
      className="bg-[#C71920] text-white border-b border-red-800 select-none relative overflow-hidden shadow-xs h-9 sm:h-10 flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center px-2 sm:px-4 gap-2 relative">
        {/* Left Fixed Badge: Red/Dark Badge with Blinking Live Indicator */}
        <div className="flex items-center gap-1.5 bg-[#182230] text-white px-2.5 py-1 rounded text-xs font-black uppercase tracking-wider shrink-0 z-20 shadow-xs border border-white/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-90"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-[11px] font-sans font-black whitespace-nowrap">
            {lang === 'en' ? '🔴 Breaking News' : '🔴 ताज़ा खबर'}
          </span>
        </div>

        {/* Center: Live Continuous Sliding Marquee Track */}
        <div 
          className="flex-1 overflow-hidden min-w-0 relative flex items-center cursor-pointer"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className={`animate-ticker flex items-center gap-8 ${effectivelyPaused ? 'ticker-paused' : ''}`}
            style={{
              animationPlayState: effectivelyPaused ? 'paused' : 'running'
            }}
          >
            {tickerItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                onClick={() => {
                  if (item.id) navigateToArticle(item.id);
                }}
                className="inline-flex items-center gap-2 group whitespace-nowrap text-xs sm:text-sm text-white hover:text-amber-200 transition-colors py-0.5 cursor-pointer"
                title={lang === 'en' ? 'Click to read' : 'पढ़ने के लिए क्लिक करें'}
              >
                {item.isBreaking && (
                  <span className="bg-yellow-300 text-black text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 shadow-xs">
                    {lang === 'en' ? 'BREAKING' : 'ब्रेकिंग'}
                  </span>
                )}
                {item.isNew && !item.isBreaking && (
                  <span className="bg-black/30 text-amber-200 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 border border-white/20">
                    {lang === 'en' ? 'NEW' : 'ताज़ा'}
                  </span>
                )}
                {item.subLocation && (
                  <span className="text-amber-200 font-bold bg-black/25 px-1.5 py-0.2 rounded text-[11px] shrink-0">
                    [{item.subLocation}]
                  </span>
                )}
                <span className="group-hover:underline font-semibold">
                  {item.title}
                </span>

                {/* Separator between headlines */}
                <span className="text-amber-300 font-bold px-2 inline-flex items-center opacity-80">
                  <Sparkles className="w-3 h-3 fill-amber-300 text-amber-300" />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Controls: Pause / Play Button for comfortable reading */}
        <button
          onClick={() => setManualPaused(!manualPaused)}
          className="bg-black/40 hover:bg-black/60 text-white p-1.5 rounded text-xs flex items-center gap-1 shrink-0 z-25 transition-colors border border-white/20"
          title={manualPaused ? "चलाना शुरू करें (Play ticker)" : "टिकर रोकें (Pause to read)"}
        >
          {manualPaused ? (
            <>
              <Play className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span className="hidden md:inline text-[10px] font-bold">चलाएं</span>
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline text-[10px] font-bold">रोकें</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
