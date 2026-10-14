import React from 'react';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { NewsCategory, NewsArticle } from '../types/news';
import { AdBanner } from './AdBanner';

export const CategoryGridSections: React.FC = () => {
  const { articles, navigateToArticle, navigateToCategory } = useNews();

  const publishedArticles = articles.filter(a => a.status === 'published' || !a.status);
  if (publishedArticles.length === 0) {
    return null;
  }

  // Helper to get published articles by category
  const getArticlesByCategory = (category: NewsCategory, count = 4): NewsArticle[] => {
    return publishedArticles.filter(a => a.category === category).slice(0, count);
  };

  const chhattisgarhNews = getArticlesByCategory('छत्तीसगढ़', 3);
  const politicsNews = getArticlesByCategory('राजनीति', 2);
  const crimeNews = getArticlesByCategory('अपराध', 2);
  const sportsNews = getArticlesByCategory('खेल', 2);
  const educationNews = getArticlesByCategory('शिक्षा', 2);
  const businessNews = getArticlesByCategory('व्यापार', 3);
  const entertainmentNews = getArticlesByCategory('मनोरंजन', 2);
  const nationalNews = getArticlesByCategory('देश-दुनिया', 2);

  const renderSectionHeader = (title: string, category: NewsCategory, count?: number) => (
    <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-[#C71920]">
      <h3 className="text-lg sm:text-xl font-bold text-[#182230] font-serif-hindi flex items-center gap-2">
        <span className="w-2.5 h-2.5 bg-[#C71920]"></span>
        <span>{title}</span>
      </h3>
      <button
        onClick={() => navigateToCategory(category)}
        className="text-xs font-semibold text-[#C71920] hover:text-red-800 transition-colors flex items-center gap-1 cursor-pointer"
      >
        <span>और देखें</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* 1. छत्तीसगढ़ विशेष (Chhattisgarh Special Section) */}
      <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
        {renderSectionHeader('छत्तीसगढ़ विशेष (राज्य हलचल)', 'छत्तीसगढ़')}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {chhattisgarhNews.map((article) => (
            <div
              key={article.id}
              onClick={() => navigateToArticle(article.id)}
              className="group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 rounded-lg overflow-hidden bg-gray-100 mb-3">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-[#182230]/85 text-white text-[10px] font-bold px-2 py-0.5 rounded-2xs">
                    {article.subLocation || 'रायपुर'}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-1.5">
                  <span className="font-semibold text-gray-700">{article.author.name}</span>
                  <span aria-hidden="true">·</span>
                  <span>{article.readTime}</span>
                </div>

                <h4 className="font-bold text-sm sm:text-base text-gray-900 leading-snug line-clamp-2 group-hover:text-[#C71920] transition-colors font-serif-hindi">
                  {article.title}
                </h4>

                <p className="text-xs text-gray-600 line-clamp-2 mt-1.5 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center text-xs text-[#C71920] font-medium">
                <span>विस्तार से</span>
                <ArrowRight className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Middle Leaderboard Ad */}
      <AdBanner format="horizontal-leaderboard" variant={1} />

      {/* 2. राजनीति एवं अपराध (Dual Column: Politics & Crime) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Politics */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
          {renderSectionHeader('राजनीति (सियासत)', 'राजनीति')}

          <div className="space-y-4">
            {politicsNews.map((article) => (
              <div
                key={article.id}
                onClick={() => navigateToArticle(article.id)}
                className="flex gap-3 group cursor-pointer border-b border-gray-100 pb-3 last:border-0 last:pb-0"
              >
                <div className="w-24 h-20 rounded-md overflow-hidden shrink-0 bg-gray-100">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-1">
                    <span className="text-[#C71920] font-semibold">{article.subLocation}</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.publishedAt.split(',')[0]}</span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#C71920] transition-colors line-clamp-2 font-serif-hindi">
                    {article.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Crime */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
          {renderSectionHeader('अपराध व कानून-व्यवस्था', 'अपराध')}

          <div className="space-y-4">
            {crimeNews.map((article) => (
              <div
                key={article.id}
                onClick={() => navigateToArticle(article.id)}
                className="flex gap-3 group cursor-pointer border-b border-gray-100 pb-3 last:border-0 last:pb-0"
              >
                <div className="w-24 h-20 rounded-md overflow-hidden shrink-0 bg-gray-100">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-1">
                    <span className="text-[#C71920] font-semibold">{article.subLocation}</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#C71920] transition-colors line-clamp-2 font-serif-hindi">
                    {article.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 3. खेल एवं शिक्षा (Dual Column: Sports & Education) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sports */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
          {renderSectionHeader('खेलकूद (जशपुर का गौरव)', 'खेल')}

          <div className="space-y-4">
            {sportsNews.map((article) => (
              <div
                key={article.id}
                onClick={() => navigateToArticle(article.id)}
                className="flex gap-3 group cursor-pointer border-b border-gray-100 pb-3 last:border-0 last:pb-0"
              >
                <div className="w-24 h-20 rounded-md overflow-hidden shrink-0 bg-gray-100">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-1">
                    <span className="text-emerald-700 font-semibold">हॉकी व एथलेटिक्स</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.publishedAt.split(',')[0]}</span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#C71920] transition-colors line-clamp-2 font-serif-hindi">
                    {article.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
          {renderSectionHeader('शिक्षा व रोजगार', 'शिक्षा')}

          <div className="space-y-4">
            {educationNews.map((article) => (
              <div
                key={article.id}
                onClick={() => navigateToArticle(article.id)}
                className="flex gap-3 group cursor-pointer border-b border-gray-100 pb-3 last:border-0 last:pb-0"
              >
                <div className="w-24 h-20 rounded-md overflow-hidden shrink-0 bg-gray-100">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-1">
                    <span className="text-amber-700 font-semibold">स्वामी आत्मानंद स्कूल</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#C71920] transition-colors line-clamp-2 font-serif-hindi">
                    {article.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 4. व्यापार, मनोरंजन व देश-दुनिया (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Business */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
          {renderSectionHeader('व्यापार व कृषि', 'व्यापार')}
          <div className="space-y-3">
            {businessNews.slice(0, 2).map((article) => (
              <div
                key={article.id}
                onClick={() => navigateToArticle(article.id)}
                className="group cursor-pointer"
              >
                <div className="aspect-16/10 rounded overflow-hidden mb-2 bg-gray-100">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform"
                  />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#C71920] line-clamp-2 font-serif-hindi">
                  {article.title}
                </h4>
              </div>
            ))}
          </div>
        </section>

        {/* Entertainment & Tourism */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
          {renderSectionHeader('मनोरंजन व पर्यटन', 'मनोरंजन')}
          <div className="space-y-3">
            {entertainmentNews.slice(0, 2).map((article) => (
              <div
                key={article.id}
                onClick={() => navigateToArticle(article.id)}
                className="group cursor-pointer"
              >
                <div className="aspect-16/10 rounded overflow-hidden mb-2 bg-gray-100">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform"
                  />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#C71920] line-clamp-2 font-serif-hindi">
                  {article.title}
                </h4>
              </div>
            ))}
          </div>
        </section>

        {/* National & World */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
          {renderSectionHeader('देश-दुनिया', 'देश-दुनिया')}
          <div className="space-y-3">
            {nationalNews.slice(0, 2).map((article) => (
              <div
                key={article.id}
                onClick={() => navigateToArticle(article.id)}
                className="group cursor-pointer"
              >
                <div className="aspect-16/10 rounded overflow-hidden mb-2 bg-gray-100">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform"
                  />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#C71920] line-clamp-2 font-serif-hindi">
                  {article.title}
                </h4>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

