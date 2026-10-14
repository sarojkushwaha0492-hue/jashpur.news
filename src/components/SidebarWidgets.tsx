import React from 'react';
import { TrendingUp, MessageCircle, ArrowUpRight, TrendingDown, Minus, Eye, Sparkles } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { mandiRatesList } from '../data/initialNews';
import { AdBanner } from './AdBanner';

export const SidebarWidgets: React.FC = () => {
  const { articles, navigateToArticle } = useNews();

  // Top trending / most read published articles sorted by views
  const publishedArticles = articles.filter(a => a.status === 'published' || !a.status);
  const trendingArticles = [...publishedArticles].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <aside className="space-y-6">
      {/* WhatsApp Community Join Card */}
      <div className="bg-emerald-700 text-white p-4 sm:p-5 rounded-xl shadow-xs relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200">
              सीधे आपके मोबाइल पर
            </span>
            <h4 className="font-bold text-base sm:text-lg leading-snug">
              Jashpur.News WhatsApp ग्रुप
            </h4>
            <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
              जशपुर जिले की हर बड़ी ब्रेकिंग और विश्वसनीय अपडेट सबसे पहले पाने के लिए जुड़ें।
            </p>
            <a
              href="https://chat.whatsapp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3.5 inline-flex items-center gap-1.5 bg-white text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-md hover:bg-emerald-50 transition-colors shadow-2xs"
            >
              <span>ग्रुप से जुड़ें</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Most Read / Trending News Block */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
        <div className="border-b-2 border-[#C71920] pb-2.5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#C71920]" />
            <h3 className="font-bold text-base text-[#182230] font-serif-hindi">
              सर्वाधिक पढ़ी गई खबरें
            </h3>
          </div>
          <span className="text-[11px] text-gray-500 font-medium">ट्रेंडिंग</span>
        </div>

        <div className="divide-y divide-gray-100">
          {trendingArticles.map((article, idx) => (
            <div
              key={article.id}
              onClick={() => navigateToArticle(article.id)}
              className="py-3 first:pt-0 last:pb-0 flex items-start gap-3 cursor-pointer group"
            >
              <span className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                idx === 0 
                  ? 'bg-[#C71920] text-white' 
                  : idx === 1 
                  ? 'bg-amber-500 text-white' 
                  : idx === 2 
                  ? 'bg-[#182230] text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {idx + 1}
              </span>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#C71920] transition-colors leading-snug line-clamp-2 font-serif-hindi">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
                  <span>{article.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {article.views}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* Editorial Quote / विचार कॉर्नर */}
      <div className="bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 text-gray-800 shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>संपादकीय विचार</span>
        </div>
        <p className="text-xs leading-relaxed italic text-gray-700">
          "पत्रकारिता का वास्तविक धर्म सत्ता की प्रशंसा नहीं, बल्कि समाज के अंतिम व्यक्ति के दर्द और सच को निर्भीकता से सामने लाना है।"
        </p>
        <div className="mt-2 text-right text-[11px] font-bold text-gray-900">
          — संपादक मंडल, Jashpur.News
        </div>
      </div>
    </aside>
  );
};
