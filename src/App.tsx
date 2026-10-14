import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NewsProvider, useNews } from './context/NewsContext';
import { Header } from './components/Header';
import { BreakingNewsTicker } from './components/BreakingNewsTicker';
import { HeroFeatured } from './components/HeroFeatured';
import { JashpurLocalSection } from './components/JashpurLocalSection';
import { CategoryGridSections } from './components/CategoryGridSections';
import { SidebarWidgets } from './components/SidebarWidgets';
import { ArticleView } from './components/ArticleView';
import { CategoryView } from './components/CategoryView';
import { StaticPages } from './components/StaticPages';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { OwnerPanel } from './components/panels/OwnerPanel';
import { AdminPanel } from './components/panels/AdminPanel';
import { StaffPanel } from './components/panels/StaffPanel';

const PublicPortalContent: React.FC = () => {
  const { currentView } = useNews();

  if (currentView === 'article') {
    return <ArticleView />;
  }

  if (currentView === 'category') {
    return <CategoryView />;
  }

  if (currentView === 'static-page') {
    return <StaticPages />;
  }

  // Home View
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-12">
      {/* 1. Hero Featured Section (विशाल मुख्य समाचार व साथी बड़ी ख़बरें) */}
      <HeroFeatured />

      {/* 2. Jashpur Local Section (जशपुर हलचल - 8 ब्लॉक वार रिपोर्टिंग) */}
      <JashpurLocalSection />

      {/* 3. Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Center: Thematic News Categories (8 cols) */}
        <div className="lg:col-span-8">
          <CategoryGridSections />
        </div>

        {/* Right Sidebar: Trending, Mandi Rates, WhatsApp, Ads (4 cols) */}
        <div className="lg:col-span-4 sticky top-24">
          <SidebarWidgets />
        </div>
      </div>
    </main>
  );
};

const MainRouter: React.FC = () => {
  const { currentDashboardView } = useAuth();

  // If user is inside an authenticated dashboard
  if (currentDashboardView === 'owner') {
    return <OwnerPanel />;
  }

  if (currentDashboardView === 'admin') {
    return <AdminPanel />;
  }

  if (currentDashboardView === 'staff') {
    return <StaffPanel />;
  }

  // Default: Public News Website
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#182230]">
      {/* Sticky Header with Navigation and Search */}
      <Header />

      {/* Professional Red Live Scrolling Latest News Ticker */}
      <BreakingNewsTicker />

      {/* Public Content Routing */}
      <div className="flex-1">
        <PublicPortalContent />
      </div>

      {/* Rich Footer */}
      <Footer />

      {/* Auth Modal for Staff/Admin/Owner Login */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NewsProvider>
        <MainRouter />
      </NewsProvider>
    </AuthProvider>
  );
}
