import React, { useState } from 'react';
import { Clock, Eye, MapPin, ArrowRight, Filter, ChevronRight } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { NewsCategory, NewsArticle } from '../types/news';
import { AdBanner } from './AdBanner';

const categoryDescriptions: Record<NewsCategory, string> = {
  'जशपुर': 'जशपुर नगर, पत्थलगांव, बगीचा, कुनकुरी, दुलदुला, मनोरा और फरसाबहार की स्थानीय व जमीनी रिपोर्टिंग',
  'छत्तीसगढ़': 'राजधानी रायपुर, सरगुजा, बस्तर, बिलासपुर और राज्य सरकार के प्रमुख फैसले',
  'सरगुजा संभाग': 'सरगुजा संभाग (अंबिकापुर, सूरजपुर, बलरामपुर, कोरिया, मनेंद्रगढ़-चिरमिरी-भरतपुर) की ताज़ा ख़बरें',
  'बिलासपुर संभाग': 'बिलासपुर संभाग (बिलासपुर, रायगढ़, कोरबा, जांजगीर-चांपा, मुंगेली, गौरेला-पेण्ड्रा-मरवाही) की ख़बरें',
  'रायपुर संभाग': 'रायपुर संभाग (रायपुर, बलौदाबाजार, गरियाबंद, महासमुंद, धमतरी) की ख़बरें',
  'दुर्ग संभाग': 'दुर्ग संभाग (दुर्ग, राजनांदगांव, बालोद, बेमेतरा, कबीरधाम, मोहला-मानपुर-अम्गढ़ चौकी, खैरागढ़) की ख़बरें',
  'बस्तर संभाग': 'बस्तर संभाग (बस्तर, कांकेर, दंतेवाड़ा, नारायणपुर, बीजपुर, सुकमा, कोण्डागांव) की ख़बरें',
  'राजनीति': 'विधानसभा, संगठनात्मक गतिविधियां, राजनीतिक विश्लेषण और चुनावी हलचल',
  'अपराध': 'कानून-व्यवस्था, पुलिस कार्रवाई, साइबर सुरक्षा और अदालती फैसले',
  'शिक्षा': 'स्वामी आत्मानंद स्कूल, बोर्ड परीक्षाएं, कॉलेज, रोजगार और प्रतियोगी कोचिंग',
  'खेल': 'जशपुर की हॉकी बेटियां, राज्य स्तरीय प्रतियोगिताएं, क्रिकेट और ग्रामीण खेल',
  'मनोरंजन': 'रानीदाह जलप्रपात, सन्ना पर्यटन, संस्कृति, जनजातीय लोक कला और फिल्में',
  'देश-दुनिया': 'राष्ट्रीय राजमार्ग, केंद्र सरकार की नीतियां और अंतरराष्ट्रीय प्रमुख घटनाएं',
  'व्यापार': 'पत्थलगांव टमाटर मंडी भाव, जशपुर काजू, चाय व्यापार और बाजार समीक्षा'
};

export const CategoryView: React.FC = () => {
  const { selectedCategory, articles, navigateToArticle, navigateToHome } = useNews();
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [filterBlock, setFilterBlock] = useState<string>('सभी');

  if (!selectedCategory) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-600">कोई श्रेणी चयनित नहीं है।</p>
        <button
          onClick={navigateToHome}
          className="mt-3 px-4 py-2 bg-[#C71920] text-white rounded text-xs font-semibold"
        >
          मुख्य पृष्ठ पर जाएं
        </button>
      </div>
    );
  }

  // Get articles for this category
  let categoryArticles = articles.filter(a => {
    if (selectedCategory === 'छत्तीसगढ़') {
      return a.category === 'छत्तीसगढ़' || a.category.includes('संभाग');
    }
    if (selectedCategory?.includes('संभाग')) {
      return a.category === selectedCategory || a.category === 'छत्तीसगढ़';
    }
    return a.category === selectedCategory;
  });

  // Apply block filter if active
  if (filterBlock !== 'सभी') {
    categoryArticles = categoryArticles.filter(a => a.subLocation?.includes(filterBlock));
  }

  // Sorting
  if (sortBy === 'popular') {
    categoryArticles = [...categoryArticles].sort((a, b) => b.views - a.views);
  }

  // Distinct locations in this category for subfiltering
  const availableLocations = Array.from(
    new Set(
      articles
        .filter(a => a.category === selectedCategory && a.subLocation)
        .map(a => a.subLocation!)
    )
  );

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
      {/* Breadcrumb */}
      <nav aria-label="ब्रेडक्रम्ब" className="flex items-center gap-2 text-xs text-gray-500 mb-4">
        <button onClick={navigateToHome} className="hover:text-[#C71920] cursor-pointer">
          होम
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-gray-900">{selectedCategory}</span>
      </nav>

      {/* Category Banner */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-2xs border-l-4 border-l-[#C71920]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#182230] font-serif-hindi">
              {selectedCategory}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {categoryDescriptions[selectedCategory] || 'ताज़ा और प्रामाणिक हिंदी ख़बरें'}
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-gray-100 rounded-full text-gray-700 self-start sm:self-auto">
            कुल समाचार: {categoryArticles.length}
          </span>
        </div>

        {/* Filters and Sorting Bar */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Sub Location Filters */}
          {availableLocations.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-gray-500 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                <span>स्थान:</span>
              </span>
              <button
                onClick={() => setFilterBlock('सभी')}
                className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                  filterBlock === 'सभी' ? 'bg-[#182230] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                सभी
              </button>
              {availableLocations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setFilterBlock(loc)}
                  className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                    filterBlock === loc ? 'bg-[#182230] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}

          {/* Sort Selector */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-gray-500">क्रमबद्ध:</span>
            <button
              onClick={() => setSortBy('latest')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                sortBy === 'latest' ? 'bg-[#C71920] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ताज़ा पहले
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                sortBy === 'popular' ? 'bg-[#C71920] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              सर्वाधिक लोकप्रिय
            </button>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {categoryArticles.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center border border-gray-200">
          <p className="text-gray-600 font-medium">इस श्रेणी या चयनित फिल्टर में अभी कोई समाचार उपलब्ध नहीं है।</p>
          <button
            onClick={() => setFilterBlock('सभी')}
            className="mt-3 text-xs text-[#C71920] font-semibold underline"
          >
            सभी स्थान के समाचार देखें
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => navigateToArticle(article.id)}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#C71920]/60 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    loading="lazy"
                  />
                  {article.subLocation && (
                    <div className="absolute bottom-2 left-2 bg-[#182230]/90 text-white text-[11px] font-medium px-2 py-0.5 rounded-2xs flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>{article.subLocation}</span>
                    </div>
                  )}
                  {article.isBreaking && (
                    <div className="absolute top-2 right-2 bg-[#C71920] text-white text-[10px] font-bold px-2 py-0.5 rounded-2xs">
                      ब्रेकिंग
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-2">
                    <span className="font-semibold text-gray-700">{article.author.name}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.publishedAt.split(',')[0]}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {article.views}
                    </span>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-[#182230] leading-snug group-hover:text-[#C71920] transition-colors line-clamp-2 font-serif-hindi">
                    {article.title}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-3 mt-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#C71920]">
                <span>पूरी खबर पढ़ें</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sponsor / Ad Banner */}
      <div className="mt-10">
        <AdBanner format="horizontal-leaderboard" variant={2} />
      </div>
    </div>
  );
};
