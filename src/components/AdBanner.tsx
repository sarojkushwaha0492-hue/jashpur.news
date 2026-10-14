import React, { useState, useEffect } from 'react';
import { ExternalLink, Megaphone } from 'lucide-react';

interface AdBannerProps {
  format?: 'horizontal-leaderboard' | 'rectangle-sidebar' | 'inline-article';
  variant?: 1 | 2 | 3;
}

interface SponsorAd {
  id: string;
  title: string;
  type: 'leaderboard' | 'sidebar' | 'sponsor_logo';
  imageUrl: string;
  targetUrl: string;
  description: string;
  status: 'active' | 'paused';
}

const defaultAds: SponsorAd[] = [
  {
    id: 'ad-1',
    title: "छत्तीसगढ़ पर्यटन: जशपुर का शिमला 'सन्ना' और रानीदाह जलप्रपात",
    type: 'leaderboard',
    imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80',
    targetUrl: '#tourism',
    description: 'प्राकृतिक सौंदर्य, घने वन और चाय बागानों के बीच शांत विश्राम का आनंद लें। विशेष पैकेज उपलब्ध।',
    status: 'active'
  },
  {
    id: 'ad-2',
    title: 'संकल्प शिक्षण संस्थान, जशपुर',
    type: 'sidebar',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80',
    targetUrl: '#education',
    description: 'NEET, JEE एवं राज्य लोक सेवा आयोग परीक्षा हेतु विशेष आवासीय मार्गदर्शन सत्र।',
    status: 'active'
  }
];

export const AdBanner: React.FC<AdBannerProps> = ({ format = 'horizontal-leaderboard', variant = 1 }) => {
  const [ads, setAds] = useState<SponsorAd[]>(() => {
    try {
      const saved = localStorage.getItem('jashpur_sponsors_ads_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      //
    }
    return defaultAds;
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('jashpur_sponsors_ads_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setAds(parsed);
        }
      } catch {
        //
      }
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 1500);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const activeLeaderboardAds = ads.filter(a => a.type === 'leaderboard' && a.status === 'active');
  const activeSidebarAds = ads.filter(a => a.type === 'sidebar' && a.status === 'active');

  if (format === 'horizontal-leaderboard') {
    const currentAd = activeLeaderboardAds[(variant - 1) % Math.max(1, activeLeaderboardAds.length)] || defaultAds[0];

    return (
      <div className="w-full my-6 bg-linear-to-r from-amber-50 via-white to-red-50 border border-amber-200/80 rounded-md p-3 sm:p-4 text-center relative overflow-hidden shadow-2xs">
        <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 border-b border-amber-100 pb-1">
          <span className="font-semibold text-amber-800 flex items-center gap-1">
            <Megaphone className="w-3 h-3 text-[#C71920]" />
            विज्ञापन / SPONSORED & PARTNER
          </span>
          <span className="text-gray-400">Jashpur Admin Verified</span>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            {currentAd.imageUrl ? (
              <img 
                src={currentAd.imageUrl} 
                alt={currentAd.title} 
                className="w-14 h-14 object-cover rounded shadow-xs shrink-0 border border-amber-200"
              />
            ) : (
              <div className="w-12 h-12 bg-[#C71920] text-white rounded flex items-center justify-center font-bold text-lg shrink-0">
                AD
              </div>
            )}
            <div>
              <h4 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">
                {currentAd.title}
              </h4>
              <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                {currentAd.description}
              </p>
            </div>
          </div>
          <a
            href={currentAd.targetUrl || '#'}
            onClick={(e) => {
              if (currentAd.targetUrl.startsWith('#')) e.preventDefault();
            }}
            className="inline-flex items-center gap-1 bg-[#182230] hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded transition-colors whitespace-nowrap shadow-2xs"
          >
            <span>अधिक जानें</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  if (format === 'rectangle-sidebar') {
    const currentSidebarAd = activeSidebarAds[0] || defaultAds[1];

    return (
      <div className="bg-linear-to-b from-gray-50 to-white border border-gray-200 rounded-md p-4 text-center relative shadow-2xs mb-6">
        <div className="text-[10px] text-gray-400 uppercase tracking-widest text-right mb-2 flex items-center justify-end gap-1">
          <Megaphone className="w-2.5 h-2.5 text-[#C71920]" />
          <span>प्रायोजित विज्ञापन</span>
        </div>
        {currentSidebarAd.imageUrl ? (
          <img 
            src={currentSidebarAd.imageUrl} 
            alt={currentSidebarAd.title}
            className="w-full h-32 object-cover rounded-md mb-3 border border-gray-200 shadow-2xs"
          />
        ) : (
          <div className="w-14 h-14 bg-[#C71920]/10 text-[#C71920] rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">
            AD
          </div>
        )}
        <h4 className="font-bold text-gray-900 text-sm">
          {currentSidebarAd.title}
        </h4>
        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
          {currentSidebarAd.description}
        </p>
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>जशपुर मुख्य मार्ग</span>
          <a 
            href={currentSidebarAd.targetUrl || '#'}
            className="text-[#C71920] font-semibold hover:underline"
          >
            संपर्क करें →
          </a>
        </div>
      </div>
    );
  }

  // Inline article format
  return (
    <div className="my-6 p-4 bg-gray-50 border-l-4 border-[#C71920] rounded-r text-sm text-gray-700 shadow-2xs">
      <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
        <span className="font-semibold text-gray-800 flex items-center gap-1">
          <Megaphone className="w-3.5 h-3.5 text-[#C71920]" />
          विशेष सूचना / प्रायोजक विज्ञापन
        </span>
        <span>Jashpur Commerce Bureau</span>
      </div>
      <p className="font-medium text-gray-900">
        जशपुर जिले में व्यापारिक विज्ञापन, स्पॉन्सरशिप, वैवाहिक सूचना या सरकारी निविदा प्रकाशन हेतु संपर्क करें: ads@jashpur.news / WhatsApp: +91 99073 18667
      </p>
    </div>
  );
};
