import React, { useState } from 'react';
import { MapPin, Clock, ArrowRight, Compass } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { NewsArticle } from '../types/news';

const jashpurBlocks = [
  'सभी ब्लॉक',
  'जशपुर नगर',
  'पत्थलगांव',
  'कुनकुरी',
  'बगीचा',
  'फरसाबहार',
  'दुलदुला',
  'मनोरा',
  'सन्ना'
];

export const JashpurLocalSection: React.FC = () => {
  const { articles, navigateToArticle, navigateToCategory } = useNews();
  const [activeBlock, setActiveBlock] = useState<string>('सभी ब्लॉक');

  // Filter articles belonging to Jashpur category or with local subLocation
  const publishedArticles = articles.filter(a => a.status === 'published' || !a.status);
  const jashpurArticles = publishedArticles.filter(a => 
    a.category === 'जशपुर' || 
    (a.subLocation && jashpurBlocks.slice(1).some(b => a.subLocation?.includes(b)))
  );

  const filteredArticles = activeBlock === 'सभी ब्लॉक'
    ? jashpurArticles
    : jashpurArticles.filter(a => a.subLocation?.includes(activeBlock));

  if (jashpurArticles.length === 0) return null;

  return (
    <section className="mb-10 bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-2xs">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-5 border-b border-gray-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#C71920] rounded-xs inline-block"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#182230] font-serif-hindi">
              जशपुर हलचल (स्थानीय बुलेटिन)
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            जशपुर नगर, पत्थलगांव, कुनकुरी, बगीचा समेत सभी 8 विकासखंडों की जमीनी रिपोर्टिंग
          </p>
        </div>

        {/* View all Jashpur news button */}
        <button
          onClick={() => navigateToCategory('जशपुर')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C71920] hover:text-red-700 transition-colors self-start md:self-auto cursor-pointer"
        >
          <span>जशपुर की सभी ख़बरें देखें</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Block Filter Tabs (Interactive Filter Controls per frontend-design guidelines) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
        <div className="flex items-center gap-1 text-xs text-gray-400 mr-2 shrink-0">
          <Compass className="w-3.5 h-3.5" />
          <span>ब्लॉक चुनें:</span>
        </div>
        {jashpurBlocks.map((block) => (
          <button
            key={block}
            onClick={() => setActiveBlock(block)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              activeBlock === block
                ? 'bg-[#C71920] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {block}
          </button>
        ))}
      </div>

      {/* News Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-600">
            {activeBlock} के लिए इस समय कोई नई खबर उपलब्ध नहीं है।
          </p>
          <button
            onClick={() => setActiveBlock('सभी ब्लॉक')}
            className="mt-3 text-xs text-[#C71920] font-semibold underline"
          >
            सभी ब्लॉक की खबरें देखें
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.slice(0, 6).map((article) => (
            <div
              key={article.id}
              onClick={() => navigateToArticle(article.id)}
              className="group border border-gray-200 rounded-lg overflow-hidden hover:border-[#C71920]/50 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between bg-white"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                    loading="lazy"
                  />
                  {article.subLocation && (
                    <div className="absolute bottom-2 left-2 bg-[#182230]/90 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-2xs flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>{article.subLocation}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-1.5">
                    <span className="font-medium text-gray-700">{article.author.name}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.publishedAt.split(',')[0]}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#182230] leading-snug line-clamp-2 group-hover:text-[#C71920] transition-colors font-serif-hindi">
                    {article.title}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-2 mt-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#C71920]">
                <span>विस्तार से पढ़ें</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
