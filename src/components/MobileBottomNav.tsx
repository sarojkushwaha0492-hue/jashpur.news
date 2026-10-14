import React from 'react';
import { Home, Compass, MapPin, Search, Lock, ShieldCheck } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { useAuth } from '../context/AuthContext';

export const MobileBottomNav: React.FC = () => {
  const { 
    currentView, 
    navigateToHome, 
    navigateToCategory, 
    isSearchOpen, 
    setIsSearchOpen 
  } = useNews();

  const { currentUser, setIsAuthModalOpen, setCurrentDashboardView } = useAuth();

  const handleDeskClick = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
    } else {
      setCurrentDashboardView(currentUser.role);
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        <button
          onClick={() => {
            setCurrentDashboardView('public');
            navigateToHome();
          }}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold transition-colors ${
            currentView === 'home' ? 'text-[#C71920]' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>होम</span>
        </button>

        <button
          onClick={() => {
            setCurrentDashboardView('public');
            navigateToCategory('जशपुर');
          }}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold transition-colors ${
            currentView === 'category' ? 'text-[#C71920]' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MapPin className="w-5 h-5 mb-0.5" />
          <span>जशपुर</span>
        </button>

        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold transition-colors ${
            isSearchOpen ? 'text-[#C71920]' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span>खोजें</span>
        </button>

        <button
          onClick={() => {
            setCurrentDashboardView('public');
            navigateToCategory('छत्तीसगढ़');
          }}
          className="flex flex-col items-center py-1 px-2 text-[10px] font-semibold text-gray-600 hover:text-gray-900"
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span>छत्तीसगढ़</span>
        </button>


      </div>
    </div>
  );
};
