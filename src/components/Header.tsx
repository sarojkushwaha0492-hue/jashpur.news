import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  Share2, 
  Calendar, 
  Clock,
  CloudSun, 
  FileText, 
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Shield,
  PenTool,
  Lock,
  LogOut,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { useAuth } from '../context/AuthContext';
import { NewsCategory } from '../types/news';
import { JashpurLogo } from './JashpurLogo';
import { useLiveDateTime } from '../utils/dateTime';

const categoriesList: { name: string; slug: NewsCategory }[] = [
  { name: 'छत्तीसगढ़', slug: 'छत्तीसगढ़' },
  { name: 'जशपुर', slug: 'जशपुर' },
  { name: 'राजनीति', slug: 'राजनीति' },
  { name: 'अपराध', slug: 'अपराध' },
  { name: 'शिक्षा व करियर', slug: 'शिक्षा' },
  { name: 'खेल', slug: 'खेल' },
  { name: 'व्यापार व मंडी', slug: 'व्यापार' },
  { name: 'मनोरंजन व पर्यटन', slug: 'मनोरंजन' },
  { name: 'देश-दुनिया', slug: 'देश-दुनिया' },
];

const categoriesListEn: { name: string; slug: NewsCategory }[] = [
  { name: 'Chhattisgarh', slug: 'छत्तीसगढ़' },
  { name: 'Jashpur', slug: 'जशपुर' },
  { name: 'Politics', slug: 'राजनीति' },
  { name: 'Crime', slug: 'अपराध' },
  { name: 'Education', slug: 'शिक्षा' },
  { name: 'Sports', slug: 'खेल' },
  { name: 'Business', slug: 'व्यापार' },
  { name: 'Entertainment', slug: 'मनोरंजन' },
  { name: 'World', slug: 'देश-दुनिया' },
];


const chhattisgarhDivisions: { name: string; slug: NewsCategory }[] = [
  { name: 'सरगुजा संभाग', slug: 'सरगुजा संभाग' },
  { name: 'बिलासपुर संभाग', slug: 'बिलासपुर संभाग' },
  { name: 'रायपुर संभाग', slug: 'रायपुर संभाग' },
  { name: 'दुर्ग संभाग', slug: 'दुर्ग संभाग' },
  { name: 'बस्तर संभाग', slug: 'बस्तर संभाग' },
];

const chhattisgarhDistricts = [
  'रायपुर', 'बिलासपुर', 'दुर्ग', 'बस्तर', 'जशपुर', 'सरगुजा', 'रायगढ़', 'कोरबा', 'कांकेर', 'दंतेवाड़ा', 
  'महाससमुंद', 'धमतरी', 'जांजगीर-चांपा', 'बालोद', 'बेमेतरा', 'कबीरधाम (कवर्धा)', 'मुंगेली', 'बलौदा बाजार', 
  'गरियाबंद', 'बलरामपुर', 'सूरजपुर', 'कोरिया', 'मनेन्द्रगढ़-चिरमिरी-भरतपुर', 'मोहला-मानपुर', 
  'खैरागढ़-छुईखदान-गंडई', 'सारंगढ़-बिलाईगढ़', 'सक्ती', 'बीजापुर', 'नारायणपुर', 'कोंडागांव', 'सुकमा', 'गौरेला-पेण्ड्रा-मरवाही'
];

export const Header: React.FC = () => {
  const { 
    currentView, 
    selectedCategory, 
    navigateToHome, 
    navigateToCategory, 
    navigateToStaticPage,
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    setIsSearchOpen,
    articles,
    lang,
    setLang,
    t
  } = useNews();

  const { 
    currentUser, 
    logout, 
    setIsAuthModalOpen, 
    currentDashboardView, 
    setCurrentDashboardView 
  } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showEPaperNotice, setShowEPaperNotice] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [chhattisgarhSubMenuOpen, setChhattisgarhSubMenuOpen] = useState(false);

  const activeCategories = lang === 'en' ? categoriesListEn : categoriesList;

  // Real-time live date and ticking clock
  const { hindiDate, liveTime } = useLiveDateTime();
  const panchangHindi = 'विक्रम संवत 2083 | आश्विन शुक्ल पक्ष एकादशी';

  const [weatherText, setWeatherText] = useState('जशपुर: 26°C, साफ मौसम');

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=22.565&longitude=84.145&current=temperature_2m,weather_code')
      .then(res => res.json())
      .then(data => {
        if (data && data.current) {
          const temp = Math.round(data.current.temperature_2m);
          const code = data.current.weather_code;
          let cond = 'साफ मौसम';
          if ([1, 2, 3].includes(code)) cond = 'आंशिक बादल';
          else if ([51, 53, 55, 61, 63, 65].includes(code)) cond = 'वर्षा';
          else if ([45, 48].includes(code)) cond = 'कोहरा';
          else if ([95, 96, 99].includes(code)) cond = 'आंधी-तूफ़ान';
          setWeatherText(lang === 'en' ? `Jashpur: ${temp}°C, ${cond === 'साफ मौसम' ? 'Clear' : cond}` : `जशपुर: ${temp}°C, ${cond}`);
        }
      })
      .catch(() => {});
  }, [lang]);

  const handleCategoryClick = (cat: NewsCategory) => {
    setCurrentDashboardView('public');
    navigateToCategory(cat);
    setMobileMenuOpen(false);
  };

  const handleShareWebsite = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Jashpur.News',
        text: 'जशपुर और छत्तीसगढ़ की ताज़ा एवं निष्पक्ष ख़बरें पढ़ें Jashpur.News पर।',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  const handlePanelSwitch = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (currentUser.role === 'owner') setCurrentDashboardView('owner');
    else if (currentUser.role === 'admin') setCurrentDashboardView('admin');
    else if (currentUser.role === 'staff') setCurrentDashboardView('staff');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      {/* Top Utility Bar (Navy #182230) */}
      <div className="bg-[#182230] text-gray-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Real Live Date, Real Live Time, Weather, Panchang */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {/* Live Hindi Date */}
            <span className="flex items-center gap-1.5 font-medium text-amber-300">
              <Calendar className="w-3.5 h-3.5" />
              <span>{hindiDate}</span>
            </span>

            {/* Live Real Time Clock with Ticking Seconds */}
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/40 text-white font-mono text-[11px] font-bold border border-white/10 shadow-2xs">
              <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
              <span className="tabular-nums tracking-wide">{liveTime}</span>
            </span>


            <span className="hidden sm:inline text-gray-400">·</span>
            <span className="flex items-center gap-1 text-gray-300">
              <CloudSun className="w-3.5 h-3.5 text-amber-400" />
              <span>{weatherText}</span>
            </span>
          </div>

          {/* Top Quick Actions & Panel Auth */}
          <div className="flex items-center gap-3 ml-auto">
            <button 
              onClick={() => setShowEPaperNotice(true)}
              className="flex items-center gap-1 text-gray-200 hover:text-white transition-colors cursor-pointer text-[11px]"
              title="डिजिटल ई-पेपर"
            >
              <FileText className="w-3.5 h-3.5 text-red-400" />
              <span className="font-medium">ई-पेपर</span>
            </button>




          </div>
        </div>
      </div>

      {/* Main Brand Logo Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Menu Bar Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-800 hover:text-[#C71920] hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer border border-gray-200 shrink-0 shadow-2xs"
          aria-label="मेनू खोलें"
          title="मेनू"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-[#C71920]" /> : <Menu className="w-6 h-6 text-gray-800" />}
        </button>

        {/* Brand Logo & Title */}
        <div 
          onClick={() => {
            setCurrentDashboardView('public');
            navigateToHome();
          }}
          className="cursor-pointer text-center sm:text-left flex-1 sm:flex-initial select-none group"
        >
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <JashpurLogo className="w-12 h-12 sm:w-14 sm:h-14 group-hover:scale-105 transition-transform drop-shadow-xs" />
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#182230]">
                  Jashpur<span className="text-[#C71920]">.News</span>
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500 hidden sm:inline ml-1.5 px-2 py-0.5 bg-gray-100 rounded">
                  जशपुर
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Header Widget: Portal Highlights */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Share Button */}
          <button
            onClick={handleShareWebsite}
            className="p-2 rounded-full border border-gray-200 text-gray-700 hover:text-[#C71920] hover:border-[#C71920] transition-colors"
            title="वेबसाइट साझा करें"
            aria-label="वेबसाइट साझा करें"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Live Indicator */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-gray-200">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-[#C71920] bg-red-50 rounded-full border border-red-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C71920]"></span>
              </span>
              लाइव न्यूज़
            </span>
          </div>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {isSearchOpen && (
        <div className="bg-gray-100 border-t border-b border-gray-200 py-3 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="जशपुर, पत्थलगांव, कुनकुरी या कोई भी खबर खोजें..."
                className="w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:border-[#C71920] focus:ring-1 focus:ring-[#C71920]"
                autoFocus
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1.5 border border-gray-300 rounded bg-white"
              >
                साफ़ करें
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Horizontal Primary Navigation Bar */}
      <nav className="bg-[#C71920] text-white shadow-sm overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between min-w-max">
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
            {/* Home Link */}
            <button
              onClick={() => {
                setCurrentDashboardView('public');
                navigateToHome();
              }}
              className={`px-3.5 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentDashboardView === 'public' && currentView === 'home' 
                  ? 'bg-black/20 text-white border-b-2 border-amber-300' 
                  : 'hover:bg-white/10 text-white/95'
              }`}
            >
              <span>{lang === 'en' ? 'Home' : 'मुख्य पृष्ठ'}</span>
            </button>

            {/* About Us Link */}
            <button
              onClick={() => {
                setCurrentDashboardView('public');
                navigateToStaticPage('about');
              }}
              className={`px-3.5 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentDashboardView === 'public' && currentView === 'static-page' 
                  ? 'bg-black/20 text-white border-b-2 border-amber-300' 
                  : 'hover:bg-white/10 text-white/95'
              }`}
            >
              <span>{lang === 'en' ? 'About Us' : 'हमारे बारे में'}</span>
            </button>

            {/* Category Navigation Items */}
            {activeCategories.map((item) => {
              const isActive = currentDashboardView === 'public' && currentView === 'category' && selectedCategory === item.slug;
              if (item.slug === 'छत्तीसगढ़') {
                return (
                  <div key={item.slug} className="relative group/ch inline-block">
                    <button
                      onClick={() => handleCategoryClick(item.slug)}
                      className={`px-3 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                        isActive
                          ? 'bg-black/25 text-white border-b-2 border-amber-300'
                          : 'hover:bg-white/10 text-white/95'
                      }`}
                    >
                      <span>{item.name}</span>
                    </button>
                    {/* Desktop Dropdown with Divisions */}
                    <div className="absolute left-0 mt-0 w-56 bg-[#C71920] text-white hidden group-hover/ch:block z-50 py-2 shadow-lg">
                      <div className="space-y-0.5">
                        {chhattisgarhDivisions.map((div) => (
                          <button
                            key={div.slug}
                            onClick={() => handleCategoryClick(div.slug)}
                            className="w-full text-left px-4 py-2 text-xs hover:bg-black/20 font-semibold transition-colors cursor-pointer text-white"
                          >
                            {div.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={item.slug}
                  onClick={() => handleCategoryClick(item.slug)}
                  className={`px-3 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-black/25 text-white border-b-2 border-amber-300'
                      : 'hover:bg-white/10 text-white/95'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* Trending Hot Topics Quick Tag */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-red-100 pl-4 border-l border-red-700">
            <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-medium text-amber-200">ट्रेंडिंग:</span>
            <button 
              onClick={() => handleCategoryClick('जशपुर')} 
              className="hover:underline hover:text-white"
            >
              #जशपुरचाय
            </button>
            <span className="text-red-400">·</span>
            <button 
              onClick={() => handleCategoryClick('व्यापार')} 
              className="hover:underline hover:text-white"
            >
              #टमाटरमंडी
            </button>
          </div>
        </div>
      </nav>

      {/* Menu Bar Side Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full overflow-y-auto p-5 shadow-2xl flex flex-col justify-between">
            <div>
              {/* Drawer Header with Close Button */}
              <div className="pb-4 mb-4 border-b border-gray-200 flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <JashpurLogo className="w-10 h-10 shadow-xs" />
                    <span className="text-xl font-bold text-[#182230]">
                      Jashpur<span className="text-[#C71920]">.News</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    जशपुर एवं छत्तीसगढ़ का विश्वसनीय डिजिटल समाचार पत्र
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                      <Calendar className="w-3 h-3 text-[#C71920]" />
                      <span>{hindiDate}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-gray-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>{liveTime}</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  title="मेनू बंद करें"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setCurrentDashboardView('public');
                    navigateToHome();
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded font-semibold text-sm flex items-center justify-between cursor-pointer ${
                    currentDashboardView === 'public' && currentView === 'home' ? 'bg-red-50 text-[#C71920]' : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span>होम (मुख्य पृष्ठ)</span>
                  <ArrowRight className="w-4 h-4 opacity-50" />
                </button>

                {categoriesList.map((item) => {
                  if (item.slug === 'छत्तीसगढ़') {
                    return (
                      <div key={item.slug} className="space-y-1">
                        <div className="flex items-center justify-between w-full rounded font-medium text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors">
                          <button
                            onClick={() => {
                              handleCategoryClick(item.slug);
                              setMobileMenuOpen(false);
                            }}
                            className="flex-1 text-left px-3 py-2.5 font-semibold text-gray-900 cursor-pointer"
                          >
                            {item.name}
                          </button>
                          <button
                            onClick={() => setChhattisgarhSubMenuOpen(!chhattisgarhSubMenuOpen)}
                            className="p-2.5 text-gray-600 hover:text-[#C71920] cursor-pointer"
                            title="जिले देखें"
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform ${chhattisgarhSubMenuOpen ? 'rotate-180 text-[#C71920]' : ''}`} />
                          </button>
                        </div>

                        {chhattisgarhSubMenuOpen && (
                          <div className="pl-4 py-1 space-y-1 my-1">
                            {chhattisgarhDivisions.map((div) => (
                              <button
                                key={div.slug}
                                onClick={() => {
                                  handleCategoryClick(div.slug);
                                  setMobileMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 text-xs text-gray-800 font-semibold hover:text-[#C71920] transition-colors cursor-pointer"
                              >
                                {div.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={item.slug}
                      onClick={() => {
                        handleCategoryClick(item.slug);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded font-medium text-sm flex items-center justify-between text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      <span>{item.name}</span>
                      <ArrowRight className="w-4 h-4 opacity-40" />
                    </button>
                  );
                })}
              </div>

              {/* Administrative & Helpline Actions inside Menu Bar */}
              <div className="pt-4 mt-4 border-t border-gray-200 space-y-2.5">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider px-1">
                  प्रशासनिक अनुभाग
                </div>

                {/* Admin Login Button inside Menu Bar */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (!currentUser) {
                      setIsAuthModalOpen(true);
                    } else {
                      setCurrentDashboardView('admin');
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#C71920] hover:bg-red-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-md cursor-pointer border border-red-500"
                >
                  <Lock className="w-4 h-4 text-white" />
                  <span>
                    {currentUser 
                      ? 'एडमिन पैनल खोलें (Admin Panel)' 
                      : 'एडमिन लॉगिन (Admin Login)'
                    }
                  </span>
                </button>

                {currentUser && (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-600" />
                    <span>लॉग आउट (Logout)</span>
                  </button>
                )}


              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
              <p>© 2026 Jashpur.News</p>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Share Toast Notification */}
      {showShareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#182230] text-white px-4 py-2.5 rounded-lg shadow-lg text-sm flex items-center gap-2">
          <span>वेबसाइट लिंक कॉपी हो गया है!</span>
        </div>
      )}

      {/* E-Paper Modal & Real Newspaper Download View */}
      {showEPaperNotice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowEPaperNotice(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b pb-4 mb-4">
              <div className="w-12 h-12 bg-red-100 text-[#C71920] rounded-xl flex items-center justify-center font-bold shadow-xs">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#182230]">Jashpur.News वास्तविक ई-पेपर (E-Paper Edition)</h3>
                <p className="text-xs text-gray-500">
                  दिनांक: <span className="font-semibold text-gray-800">{hindiDate}</span> | संस्करण: जशपुर व छत्तीसगढ़ मुख्य संस्करण
                </p>
              </div>
            </div>

            {/* Newspaper Preview Box styled like real news */}
            <div className="bg-[#fcfbf9] border-2 border-gray-300 rounded-lg p-5 mb-5 shadow-inner">
              <div className="text-center border-b-2 border-black pb-2 mb-3">
                <h1 className="text-2xl font-serif font-black tracking-wider text-[#182230]">Jashpur.News दैनिक समाचार पत्र</h1>
                <div className="flex justify-between text-[11px] font-serif text-gray-700 mt-1 px-2 border-t border-b border-gray-400 py-0.5">
                  <span>रजिस्ट्रेशन नं: CG/JAS/2026/019</span>
                  <span>मूल्य: ₹5.00 मात्र</span>
                  <span>पृष्ठ संख्या: 08</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="border-r border-gray-300 pr-3">
                  <h4 className="font-serif font-bold text-sm text-[#C71920] leading-tight">मुख्यमंत्री विष्णुदेव साय आज जशपुर प्रवास पर, करोड़ों की सौगात</h4>
                  <p className="text-[11px] font-serif text-gray-600 mt-1 line-clamp-3">
                    जशपुर जिले के कांसाबेल व पत्थलगांव में आयोजित विशाल आमसभा में शामिल होकर क्षेत्रवासियों को देंगे ऐतिहासिक विकास कार्यों की सौगात...
                  </p>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-gray-900 leading-tight">टमाटर एवं चाय बागानों की बंपर पैदावार से किसानों के खिले चेहरे</h4>
                  <p className="text-[11px] font-serif text-gray-600 mt-1 line-clamp-3">
                    पत्तागोभी और टमाटर की बंपर पैदावार से मंडियों में रौनक, व्यापारी बाहर से पहुँच रहे हैं जशपुर...
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-dashed border-gray-400 text-center text-[11px] text-gray-500 font-serif">
                --- संपूर्ण 8 पृष्ठों का उच्च गुणवत्ता डिजिटल ई-पेपर संस्करण तैयार है ---
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    if (!printWindow) {
                      alert('कृपया पॉपअप ब्लॉकर (Pop-up blocker) बंद करें ताकि ई-पेपर खुल सके।');
                      return;
                    }

                    const allArticles = articles && articles.length > 0 ? articles : [];
                    const pageSize = 3;
                    const totalPages = Math.max(4, Math.ceil(allArticles.length / pageSize));

                    let pagesMarkup = '';

                    for (let p = 0; p < totalPages; p++) {
                      const pageArticles = allArticles.slice(p * pageSize, (p + 1) * pageSize);
                      const pageNum = p + 1;

                      let pageContent = '';
                      if (p === 0) {
                        const lead = pageArticles[0] || {
                          title: 'मुख्यमंत्री विष्णुदेव साय आज जशपुर प्रवास पर, करोड़ों की सौगात',
                          summary: 'जशपुर जिले के कांसाबेल व पत्थलगांव में आयोजित विशाल आमसभा में शामिल होकर क्षेत्रवासियों को देंगे ऐतिहासिक विकास कार्यों की सौगात...',
                          category: 'जशपुर',
                          imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'
                        };
                        const sec1 = pageArticles[1];
                        const sec2 = pageArticles[2];

                        pageContent = `
                          <div class="main-story">
                            <span style="font-size: 11px; background: #C71920; color: #fff; padding: 2px 6px; font-family: 'Poppins', sans-serif; font-weight: bold; text-transform: uppercase;">${lead.category || 'मुख्य समाचार'}</span>
                            <h2 style="font-size: 22px; font-weight: 900; color: #182230; margin-top: 6px; line-height: 1.3;">${lead.title}</h2>
                            ${lead.imageUrl ? `<img src="${lead.imageUrl}" style="width: 100%; max-height: 240px; object-fit: cover; border: 1px solid #ccc; margin: 10px 0;" />` : ''}
                            <p style="font-size: 14px; line-height: 1.6; text-align: justify; color: #222;">
                              ${lead.summary}
                            </p>
                          </div>

                          <div style="margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            ${sec1 ? `
                              <div style="border-right: 1px solid #ccc; padding-right: 15px;">
                                <span style="font-size: 10px; font-weight: bold; color: #C71920; text-transform: uppercase;">${sec1.category}</span>
                                <h3 style="font-size: 15px; font-weight: 700; margin: 4px 0 8px 0; color: #111;">${sec1.title}</h3>
                                <p style="font-size: 12px; line-height: 1.5; color: #444; text-align: justify;">${sec1.summary}</p>
                              </div>
                            ` : ''}
                            ${sec2 ? `
                              <div style="padding-left: 5px;">
                                <span style="font-size: 10px; font-weight: bold; color: #C71920; text-transform: uppercase;">${sec2.category}</span>
                                <h3 style="font-size: 15px; font-weight: 700; margin: 4px 0 8px 0; color: #111;">${sec2.title}</h3>
                                <p style="font-size: 12px; line-height: 1.5; color: #444; text-align: justify;">${sec2.summary}</p>
                              </div>
                            ` : ''}
                          </div>
                        `;
                      } else {
                        pageContent = `
                          <h2 style="font-size: 20px; font-weight: 900; color: #182230; border-bottom: 2px solid #111; padding-bottom: 6px; margin-bottom: 15px;">
                            जशपुर व छत्तीसगढ़ - ताज़ा समाचार (पृष्ठ 0${pageNum})
                          </h2>
                          <div style="display: flex; flex-direction: column; gap: 20px;">
                            ${pageArticles.length > 0 ? pageArticles.map(art => `
                              <div style="border-bottom: 1px dashed #ccc; padding-bottom: 14px;">
                                <div style="display: flex; justify-content: space-between; font-size: 10px; font-family: 'Poppins', sans-serif; color: #666; margin-bottom: 3px;">
                                  <span style="font-weight: bold; color: #C71920; text-transform: uppercase;">${art.category} ${art.subLocation ? '· ' + art.subLocation : ''}</span>
                                  <span>${art.publishedAt || 'ताज़ा अपडेट'}</span>
                                </div>
                                <h3 style="font-size: 16px; font-weight: 800; color: #111; margin: 0 0 6px 0;">${art.title}</h3>
                                <div style="display: flex; gap: 15px; align-items: flex-start;">
                                  ${art.imageUrl ? `<img src="${art.imageUrl}" style="width: 140px; height: 95px; object-fit: cover; border: 1px solid #ccc; flex-shrink: 0;" />` : ''}
                                  <p style="font-size: 13px; line-height: 1.5; color: #333; margin: 0; text-align: justify;">${art.summary}</p>
                                </div>
                              </div>
                            `).join('') : `
                              <p style="font-style: italic; color: #666; text-align: center; padding: 40px;">इस अंक में जशपुर, पत्थलगांव, कुनकुरी, बगीचा और पूरे छत्तीसगढ़ की सभी प्रमुख खबरें शामिल हैं।</p>
                            `}
                          </div>
                        `;
                      }

                      pagesMarkup += `
                        <div class="page">
                          <div class="header">
                            <div class="logo">Jashpur.News दैनिक</div>
                            <div style="font-size: 12px; font-family: 'Poppins', sans-serif; color: #555; margin-top: 4px;">छत्तीसगढ़ का नंबर 1 विश्वसनीय और लोकप्रिय समाचार पत्र</div>
                            <div class="meta">
                              <span>दिनांक: ${hindiDate}</span>
                              <span>संस्करण: जशपुर / छत्तीसगढ़ मुख्य संस्करण</span>
                              <span>मूल्य: ₹5.00 | पृष्ठ: 0${pageNum} / 0${totalPages}</span>
                            </div>
                          </div>
                          ${pageContent}
                          <div class="footer-note">
                            Jashpur.News ई-पेपर | सर्वाधिकार सुरक्षित © 2026 | पृष्ठ 0${pageNum} / 0${totalPages}
                          </div>
                        </div>
                      `;
                    }

                    printWindow.document.write(`
                      <!DOCTYPE html>
                      <html lang="hi">
                      <head>
                        <meta charset="UTF-8">
                        <title>Jashpur.News E-Paper - ${hindiDate}</title>
                        <style>
                          @import url('https://fonts.googleapis.com/css2?family=Martel:wght@400;700;900&family=Poppins:wght@400;600;700&display=swap');
                          body { font-family: 'Martel', serif; background: #fff; color: #111; margin: 0; padding: 20px; }
                          .page { max-width: 800px; margin: 0 auto 40px auto; border: 3px solid #000; padding: 30px; box-shadow: 0 0 15px rgba(0,0,0,0.1); page-break-after: always; background: #fff; }
                          .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 15px; margin-bottom: 20px; }
                          .logo { font-size: 38px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; margin: 0; color: #111; }
                          .meta { display: flex; justify-content: space-between; font-size: 13px; border-top: 1px solid #333; border-bottom: 1px solid #333; padding: 6px 0; margin-top: 10px; font-weight: bold; font-family: 'Poppins', sans-serif; }
                          .footer-note { text-align: center; font-size: 12px; margin-top: 30px; border-top: 1px dashed #666; padding-top: 10px; color: #555; font-family: 'Poppins', sans-serif; }
                          .no-print { text-align: center; margin: 20px 0; background: #fdf2f2; padding: 15px; border-radius: 8px; border: 1px solid #f8b4b4; }
                          .print-btn { background: #C71920; color: #fff; padding: 12px 24px; font-size: 16px; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; font-family: 'Poppins', sans-serif; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                          .print-btn:hover { background: #a01318; }
                          @media print {
                            .no-print { display: none; }
                            body { padding: 0; }
                            .page { border: none; box-shadow: none; margin: 0; padding: 15px; width: 100%; height: 100vh; }
                          }
                        </style>
                      </head>
                      <body>
                        <div class="no-print">
                          <button class="print-btn" onclick="window.print()">🖨️ संपूर्ण ई-पेपर पीडीएफ के रूप में सहेजें / प्रिंट करें (Save All News as PDF)</button>
                          <p style="font-family: 'Poppins', sans-serif; font-size: 13px; color: #C71920; margin-top: 8px; font-weight: bold;">(प्रिंट डायलॉग खुलने पर Destination में 'Save as PDF' चुनें ताकि सभी ताज़ा खबरें अखबार की तरह डाउनलोड हो सकें)</p>
                        </div>
                        ${pagesMarkup}
                        <script>
                          window.onload = function() {
                            setTimeout(function() {
                              window.print();
                            }, 400);
                          };
                        </script>
                      </body>
                      </html>
                    `);
                    printWindow.document.close();
                    setShowEPaperNotice(false);
                  }}
                  className="flex-1 bg-[#C71920] text-white py-3 px-4 rounded-xl text-sm font-extrabold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>वास्तविक ई-पेपर पीडीएफ डाउनलोड करें (Download Real PDF)</span>
                </button>
                <button
                  onClick={() => {
                    window.print();
                    setShowEPaperNotice(false);
                  }}
                  className="bg-gray-100 text-gray-800 py-3 px-4 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors cursor-pointer border border-gray-300"
                >
                  प्रिंट करें (Print View)
                </button>
              </div>
              <button
                onClick={() => setShowEPaperNotice(false)}
                className="w-full py-2 text-gray-500 text-xs hover:text-gray-800 font-medium cursor-pointer"
              >
                रद्द करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
