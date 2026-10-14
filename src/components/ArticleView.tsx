import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  MapPin, 
  Share2, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  BookmarkCheck, 
  Printer, 
  MessageSquare, 
  ThumbsUp, 
  Send, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  Check
} from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { AdBanner } from './AdBanner';
import { NewsArticle } from '../types/news';

export const ArticleView: React.FC = () => {
  const { 
    selectedArticle, 
    articles, 
    navigateToHome, 
    navigateToCategory, 
    navigateToArticle,
    bookmarks,
    toggleBookmark,
    addComment,
    likeComment
  } = useNews();

  const [fontSize, setFontSize] = useState<'base' | 'lg' | 'xl'>('lg');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [commentName, setCommentName] = useState('');
  const [commentCity, setCommentCity] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Schema.org NewsArticle dynamic JSON-LD injection
  useEffect(() => {
    if (!selectedArticle) return;

    // Update document title for SEO
    const prevTitle = document.title;
    document.title = `${selectedArticle.title} | Jashpur.News`;

    const scriptId = 'json-ld-news-article';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const jsonLdData = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'headline': selectedArticle.title,
      'image': [selectedArticle.imageUrl],
      'datePublished': selectedArticle.publishedAt,
      'dateModified': selectedArticle.publishedAt,
      'author': [{
        '@type': 'Person',
        'name': selectedArticle.author.name,
        'jobTitle': selectedArticle.author.role
      }],
      'publisher': {
        '@type': 'NewsMediaOrganization',
        'name': 'Jashpur.News',
        'alternateName': 'जशपुर न्यूज़',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://jashpur.news/logo.png'
        }
      },
      'description': selectedArticle.summary,
      'articleSection': selectedArticle.category,
      'articleBody': selectedArticle.content.join(' ')
    };

    script.text = JSON.stringify(jsonLdData);

    return () => {
      document.title = prevTitle;
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [selectedArticle]);

  // Audio speech synthesis cleanup
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedArticle]);

  if (!selectedArticle) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-gray-800">समाचार प्राप्त नहीं हुआ</h2>
        <button
          onClick={navigateToHome}
          className="mt-4 px-4 py-2 bg-[#C71920] text-white rounded text-sm font-semibold"
        >
          मुख्य पृष्ठ पर लौटें
        </button>
      </div>
    );
  }

  // Text-To-Speech function ("बोलती खबर")
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('आपके ब्राउज़र में ऑडियो वाचन समर्थित नहीं है।');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${selectedArticle.title}। ${selectedArticle.summary}। ${selectedArticle.content.join(' ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Social Sharing
  const articleUrl = typeof window !== 'undefined' ? window.location.href : 'https://jashpur.news';
  const shareText = `${selectedArticle.title} - Jashpur.News`;

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + articleUrl)}`;
    window.open(url, '_blank');
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
    window.open(url, '_blank');
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(articleUrl)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Find previous and next articles
  const currentIndex = articles.findIndex(a => a.id === selectedArticle.id);
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  // Related articles (same category or others)
  const relatedArticles = articles
    .filter(a => a.id !== selectedArticle.id && (a.category === selectedArticle.category || a.subLocation === selectedArticle.subLocation))
    .slice(0, 3);

  const isBookmarked = bookmarks.includes(selectedArticle.id);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(selectedArticle.id, {
      authorName: commentName || 'पाठक',
      city: commentCity || 'जशपुर',
      comment: commentText
    });

    setCommentText('');
    setCommentName('');
    setCommentCity('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 3000);
  };

  return (
    <article className="max-w-4xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
      {/* 1. Breadcrumb Navigation */}
      <nav aria-label="ब्रेडक्रम्ब" className="flex items-center gap-2 text-xs text-gray-500 mb-4 flex-wrap">
        <button 
          onClick={navigateToHome}
          className="hover:text-[#C71920] hover:underline cursor-pointer"
        >
          होम
        </button>
        <span aria-hidden="true">/</span>
        <button
          onClick={() => navigateToCategory(selectedArticle.category)}
          className="hover:text-[#C71920] hover:underline cursor-pointer font-medium"
        >
          {selectedArticle.category}
        </button>
        {selectedArticle.subLocation && (
          <>
            <span aria-hidden="true">/</span>
            <span className="text-gray-600">{selectedArticle.subLocation}</span>
          </>
        )}
      </nav>

      {/* 2. Article Header & Title */}
      <header className="mb-6">
        {/* Category & Location kicker */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#C71920] uppercase tracking-wide mb-2">
          <span>{selectedArticle.category}</span>
          {selectedArticle.subLocation && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-[#182230] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#C71920]" />
                {selectedArticle.subLocation}
              </span>
            </>
          )}
        </div>

        {/* Large Headline */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#182230] leading-snug font-serif-hindi">
          {selectedArticle.title}
        </h1>

        {/* Lead Excerpt */}
        <p className="mt-3 text-base sm:text-lg text-gray-700 font-medium leading-relaxed border-l-3 border-[#C71920] pl-3.5 py-0.5 bg-gray-50/80 rounded-r">
          {selectedArticle.summary}
        </p>

        {/* Author byline, timestamp, views */}
        <div className="mt-5 pt-4 border-t border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={selectedArticle.author.avatar}
              alt={selectedArticle.author.name}
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
            <div>
              <div className="font-bold text-sm text-gray-900">
                {selectedArticle.author.name}
              </div>
              <div className="text-[11px] text-gray-500">
                {selectedArticle.author.role} ({selectedArticle.author.location})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {selectedArticle.publishedAt}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {selectedArticle.views} देखा गया
            </span>
            <span aria-hidden="true">·</span>
            <span>{selectedArticle.readTime} पठन</span>
          </div>
        </div>

        {/* Reader Utility Toolbar: Listen, Font Size, Bookmark, Share */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-gray-100/80 p-2.5 rounded-lg text-xs">
          {/* Audio Voice Player */}
          <button
            onClick={handleToggleAudio}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              isPlayingAudio
                ? 'bg-[#C71920] text-white shadow-xs'
                : 'bg-white text-gray-800 hover:bg-gray-200 border border-gray-200'
            }`}
            title="ऑडियो में खबर सुनें"
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4 text-[#C71920]" />}
            <span>{isPlayingAudio ? 'ऑडियो रोकें' : 'समाचार सुनें'}</span>
          </button>

          {/* Font Size Adjuster */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md p-1">
            <span className="text-[11px] text-gray-500 px-1">फॉन्ट:</span>
            <button
              onClick={() => setFontSize('base')}
              className={`px-2 py-0.5 rounded text-xs font-semibold ${fontSize === 'base' ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
              title="सामान्य फॉन्ट"
            >
              अ
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-2 py-0.5 rounded text-sm font-bold ${fontSize === 'lg' ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
              title="बड़ा फॉन्ट"
            >
              अ+
            </button>
            <button
              onClick={() => setFontSize('xl')}
              className={`px-2 py-0.5 rounded text-base font-extrabold ${fontSize === 'xl' ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
              title="अति बड़ा फॉन्ट"
            >
              अ++
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleBookmark(selectedArticle.id)}
              className={`p-1.5 rounded-md border transition-colors ${
                isBookmarked 
                  ? 'bg-amber-100 border-amber-300 text-amber-900' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
              title={isBookmarked ? 'बुकमार्क हटाया गया' : 'बुकमार्क करें'}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-amber-600 text-amber-600" /> : <Bookmark className="w-4 h-4" />}
            </button>

            <button
              onClick={() => window.print()}
              className="p-1.5 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50"
              title="प्रिंट करें"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. Featured Image & Caption */}
      <div className="mb-6">
        <div className="rounded-xl overflow-hidden shadow-sm bg-gray-100 border border-gray-200">
          <img
            src={selectedArticle.imageUrl}
            alt={selectedArticle.title}
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>
        {selectedArticle.imageCaption && (
          <p className="text-xs text-gray-500 mt-2 italic px-1 text-center">
            फोटो: {selectedArticle.imageCaption}
          </p>
        )}
      </div>

      {/* 4. Key Takeaways Box (प्रमुख बिंदु) */}
      {selectedArticle.keyPoints && selectedArticle.keyPoints.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 sm:p-5 mb-6">
          <h3 className="font-bold text-sm text-amber-900 mb-2.5 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#C71920] rounded-full"></span>
            खबर के मुख्य बिंदु (Quick Highlights):
          </h3>
          <ul className="space-y-1.5 text-xs sm:text-sm text-amber-950">
            {selectedArticle.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[#C71920] font-bold mt-0.5">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 5. Main Body Typography */}
      <div 
        className={`text-gray-800 leading-relaxed space-y-5 font-normal ${
          fontSize === 'base' ? 'text-base' : fontSize === 'lg' ? 'text-lg' : 'text-xl'
        }`}
      >
        {selectedArticle.content.map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Inline Article Ad Banner */}
      <AdBanner format="inline-article" />

      {/* 6. Social Sharing Box */}
      <div className="my-8 p-5 bg-white border border-gray-200 rounded-xl shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-gray-900">यह खबर अपने मित्रों से साझा करें:</h4>
            <p className="text-xs text-gray-500">सत्य और निष्पक्ष पत्रकारिता को आगे बढ़ाने में सहयोग दें</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors"
            >
              <span>WhatsApp</span>
            </button>

            {/* Facebook */}
            <button
              onClick={handleShareFacebook}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#1877F2] hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors"
            >
              <span>Facebook</span>
            </button>

            {/* Twitter / X */}
            <button
              onClick={handleShareTwitter}
              className="flex items-center gap-1.5 px-3 py-2 bg-black hover:bg-gray-800 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors"
            >
              <span>X (Twitter)</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-xs font-semibold border border-gray-300 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'कॉपी हो गया' : 'लिंक कॉपी'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7. Previous and Next Article Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 pt-6 border-t border-gray-200">
        {prevArticle ? (
          <div
            onClick={() => navigateToArticle(prevArticle.id)}
            className="p-3.5 bg-white border border-gray-200 rounded-lg hover:border-[#C71920] transition-colors cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold mb-1">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>पिछला समाचार</span>
            </div>
            <p className="font-semibold text-xs sm:text-sm text-gray-900 group-hover:text-[#C71920] line-clamp-2 font-serif-hindi">
              {prevArticle.title}
            </p>
          </div>
        ) : <div />}

        {nextArticle ? (
          <div
            onClick={() => navigateToArticle(nextArticle.id)}
            className="p-3.5 bg-white border border-gray-200 rounded-lg hover:border-[#C71920] transition-colors cursor-pointer group flex flex-col justify-between text-right"
          >
            <div className="flex items-center justify-end gap-1 text-[11px] text-gray-400 font-semibold mb-1">
              <span>अगला समाचार</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
            <p className="font-semibold text-xs sm:text-sm text-gray-900 group-hover:text-[#C71920] line-clamp-2 font-serif-hindi">
              {nextArticle.title}
            </p>
          </div>
        ) : <div />}
      </div>

      {/* 8. Reader Comments / प्रतिक्रियाएं */}
      <section className="my-10 bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-2xs">
        <div className="border-b border-gray-200 pb-3 mb-5 flex items-center justify-between">
          <h3 className="font-bold text-lg text-gray-900 font-serif-hindi flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#C71920]" />
            <span>पाठकों की प्रतिक्रियाएं ({selectedArticle.comments?.length || 0})</span>
          </h3>
          <span className="text-xs text-gray-500">आपकी राय महत्वपूर्ण है</span>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2.5">
            अपनी राय दर्ज करें:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="आपका नाम (वैकल्पिक)"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              className="bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#C71920]"
            />
            <input
              type="text"
              placeholder="आपका शहर / स्थान (उदा: जशपुर नगर)"
              value={commentCity}
              onChange={(e) => setCommentCity(e.target.value)}
              className="bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#C71920]"
            />
          </div>
          <textarea
            required
            rows={3}
            placeholder="इस खबर पर अपने विचार लिखें..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded p-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#C71920] mb-3"
          />
          <div className="flex items-center justify-between">
            {commentSuccess ? (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                आपकी प्रतिक्रिया सफलतापूर्वक प्रकाशित हुई!
              </span>
            ) : <span />}
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 bg-[#C71920] hover:bg-red-700 text-white px-4 py-2 rounded text-xs font-bold shadow-2xs transition-colors cursor-pointer ml-auto"
            >
              <span>प्रतिक्रिया भेजें</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </form>

        {/* Comments List */}
        {selectedArticle.comments && selectedArticle.comments.length > 0 ? (
          <div className="space-y-3.5">
            {selectedArticle.comments.map((comment) => (
              <div key={comment.id} className="p-3.5 bg-gray-50/70 border border-gray-200/80 rounded-lg">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{comment.authorName}</span>
                    <span className="text-[11px] text-gray-500">({comment.city})</span>
                  </div>
                  <span className="text-[11px] text-gray-400">{comment.timestamp}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {comment.comment}
                </p>
                <div className="mt-2 flex items-center justify-end">
                  <button
                    onClick={() => likeComment(selectedArticle.id, comment.id)}
                    className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-[#C71920] transition-colors"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>सहमत ({comment.likes})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 text-center py-4">
            इस खबर पर अभी तक कोई प्रतिक्रिया नहीं आई है। सबसे पहले अपनी राय साझा करें!
          </p>
        )}
      </section>

      {/* 9. Related Articles Grid */}
      {relatedArticles.length > 0 && (
        <section className="my-10">
          <div className="border-b-2 border-[#C71920] pb-2 mb-4">
            <h3 className="font-bold text-base sm:text-lg text-gray-900 font-serif-hindi">
              संबंधित ख़बरें (यह भी पढ़ें)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigateToArticle(rel.id)}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden group hover:border-[#C71920] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-16/10 bg-gray-100 overflow-hidden">
                    <img
                      src={rel.imageUrl}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform"
                    />
                  </div>
                  <div className="p-3">
                    <span className="text-[10px] text-[#C71920] font-semibold block mb-1">
                      {rel.category}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 group-hover:text-[#C71920] transition-colors font-serif-hindi">
                      {rel.title}
                    </h4>
                  </div>
                </div>
                <div className="px-3 pb-3 text-[11px] text-gray-400">
                  {rel.publishedAt.split(',')[0]}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
