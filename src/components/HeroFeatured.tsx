import React from 'react';
import { Clock, Eye, MapPin, ArrowRight } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { NewsArticle } from '../types/news';

export const HeroFeatured: React.FC = () => {
  const { articles, navigateToArticle } = useNews();

  // Filter strictly published articles for public hero
  const publishedArticles = articles.filter(a => a.status === 'published' || !a.status);

  // Pick lead article
  const leadArticle = publishedArticles.find(a => a.isFeatured) || publishedArticles[0];
  // Pick next 3 prominent articles
  const secondaryArticles = publishedArticles.filter(a => a.id !== leadArticle?.id).slice(0, 3);

  if (!leadArticle) return null;

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Lead Story (Takes 7 cols on desktop) */}
        <div 
          onClick={() => navigateToArticle(leadArticle.id)}
          className="lg:col-span-7 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between"
        >
          <div>
            {/* Lead Image with Aspect Ratio */}
            <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
              <img
                src={leadArticle.imageUrl}
                alt={leadArticle.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                loading="eager"
              />
              {/* Category Marker */}
              <div className="absolute top-3 left-3 bg-[#C71920] text-white text-xs font-bold px-2.5 py-1 rounded-xs uppercase tracking-wide shadow-sm">
                {leadArticle.category}
              </div>
              {leadArticle.subLocation && (
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-xs font-medium px-2.5 py-1 rounded-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-400" />
                  <span>{leadArticle.subLocation}</span>
                </div>
              )}
            </div>

            {/* Lead Content */}
            <div className="p-5 sm:p-6">
              {/* Clean unboxed metadata per frontend-design guidelines */}
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2.5">
                <span className="font-semibold text-gray-700">{leadArticle.author.name}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {leadArticle.publishedAt}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {leadArticle.views} देखा गया
                </span>
              </div>

              {/* Bold Headline */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#182230] leading-snug font-serif-hindi group-hover:text-[#C71920] transition-colors mb-3">
                {leadArticle.title}
              </h1>

              {/* Excerpt */}
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed line-clamp-3">
                {leadArticle.summary}
              </p>
            </div>
          </div>

          <div className="px-5 sm:px-6 pb-5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-[#C71920] font-semibold">
            <span>पूरी खबर पढ़ें</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Secondary Top Stories (Takes 5 cols on desktop) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="border-b-2 border-[#C71920] pb-2 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#182230] font-serif-hindi flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#C71920] inline-block"></span>
              शीर्ष बड़ी ख़बरें
            </h2>
            <span className="text-xs text-gray-500 font-medium">लाइव कवरेज</span>
          </div>

          <div className="flex flex-col gap-3.5 flex-1 justify-between">
            {secondaryArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => navigateToArticle(article.id)}
                className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-[#C71920]/40 hover:shadow-xs transition-all cursor-pointer group flex gap-3.5 items-start"
              >
                {/* Thumbnail */}
                <div className="w-24 h-24 sm:w-28 sm:h-24 rounded-md overflow-hidden shrink-0 bg-gray-100 relative">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-1 left-1 bg-[#182230]/85 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-2xs">
                    {article.category}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
                    {article.subLocation && (
                      <>
                        <span className="text-[#C71920] font-semibold">{article.subLocation}</span>
                        <span aria-hidden="true">·</span>
                      </>
                    )}
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-[#182230] leading-snug line-clamp-2 group-hover:text-[#C71920] transition-colors font-serif-hindi">
                    {article.title}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-1 mt-1 hidden sm:block">
                    {article.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
