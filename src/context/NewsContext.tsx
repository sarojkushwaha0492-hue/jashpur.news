import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NewsArticle, NewsCategory, NewsComment, ArticleStatus } from '../types/news';
import { initialNewsArticles, defaultAuthors } from '../data/initialNews';
import { useAuth } from './AuthContext';

export type ViewType = 'home' | 'article' | 'category' | 'cms' | 'static-page';

export type StaticPageType = 
  | 'about' 
  | 'contact' 
  | 'privacy' 
  | 'disclaimer' 
  | 'terms' 
  | 'editorial' 
  | 'sitemap';

interface NewsContextType {
  articles: NewsArticle[];
  isLoadingArticles: boolean;
  currentView: ViewType;
  selectedArticle: NewsArticle | null;
  selectedCategory: NewsCategory | null;
  staticPageType: StaticPageType | null;
  searchQuery: string;
  isSearchOpen: boolean;
  fontSizeLevel: 'normal' | 'large' | 'xlarge';
  bookmarks: string[];
  lang: 'hi' | 'en';
  setLang: (lang: 'hi' | 'en') => void;
  t: (key: string) => string;
  
  // Navigation actions
  navigateToHome: () => void;
  navigateToArticle: (idOrSlug: string) => void;
  navigateToCategory: (category: NewsCategory) => void;
  navigateToCMS: () => void;
  navigateToStaticPage: (page: StaticPageType) => void;
  
  // Search & Filter
  setSearchQuery: (query: string) => void;
  setIsSearchOpen: (isOpen: boolean) => void;
  setFontSizeLevel: (level: 'normal' | 'large' | 'xlarge') => void;
  toggleBookmark: (articleId: string) => void;
  
  // Real Workflow API operations
  fetchArticles: () => Promise<void>;
  createArticle: (data: Partial<NewsArticle> & { title: string; category: NewsCategory; summary: string; submitForReview?: boolean }) => Promise<string | null>;
  addArticle: (article: Partial<NewsArticle>) => void;
  resetToDefaultArticles: () => void;
  updateArticle: (id: string, data: Partial<NewsArticle> & { submitForReview?: boolean }) => Promise<boolean>;
  reviewArticle: (id: string, action: 'approve_and_publish' | 'reject' | 'unpublish', reviewNotes?: string) => Promise<boolean>;
  deleteArticle: (id: string) => Promise<boolean>;
  
  // Interactive comments
  addComment: (articleId: string, comment: { authorName: string; city: string; comment: string }) => Promise<void>;
  likeComment: (articleId: string, commentId: string) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

const BOOKMARKS_KEY = 'jashpur_news_bookmarks_v1';

const translations: Record<string, Record<string, string>> = {
  hi: {
    home: 'मुख्य पृष्ठ',
    breakingNews: 'ताज़ा खबरें',
    mandiRates: 'धान व कृषि मंडी भाव',
    searchPlaceholder: 'समाचार, विषय या स्थान खोजें...',
    readMore: 'पूरा पढ़ें →',
    views: 'व्यूज',
    share: 'शेयर करें',
    comments: 'पाठक टिप्पणियां',
    adminPanel: 'एडमिन पैनल',
    ownerPanel: 'ओनर कंट्रोल पैनल',
    logout: 'लॉगआउट',
    login: 'एडमिन लॉगिन',
  },
  en: {
    home: 'Home',
    breakingNews: 'Breaking News',
    mandiRates: 'Crop & Mandi Rates',
    searchPlaceholder: 'Search news, topics, or locations...',
    readMore: 'Read More →',
    views: 'Views',
    share: 'Share',
    comments: 'Reader Comments',
    adminPanel: 'Admin Panel',
    ownerPanel: 'Owner Control Panel',
    logout: 'Logout',
    login: 'Admin Login',
  }
};

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, currentUser } = useAuth();
  const [articles, setArticles] = useState<NewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem('jashpur_news_cached_articles_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      //
    }
    return initialNewsArticles.map(a => ({
      ...a,
      status: 'published' as ArticleStatus,
      createdAt: a.publishedAt,
      updatedAt: a.publishedAt
    }));
  });
  const [isLoadingArticles, setIsLoadingArticles] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      //
    }
    return [];
  });

  // Sync articles to localStorage cache
  useEffect(() => {
    try {
      if (articles.length > 0) {
        localStorage.setItem('jashpur_news_cached_articles_v2', JSON.stringify(articles));
      }
    } catch {
      //
    }
  }, [articles]);

  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | null>(null);
  const [staticPageType, setStaticPageType] = useState<StaticPageType | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [lang, setLang] = useState<'hi' | 'en'>('hi');

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['hi'][key] || key;
  };

  // Fetch articles from backend API safely
  const fetchArticles = useCallback(async () => {
    setIsLoadingArticles(true);
    try {
      const headers: Record<string, string> = {
        'x-include-all': 'true'
      };
      const effectiveToken = token || localStorage.getItem('jashpur_news_auth_token_v1');
      if (effectiveToken) headers['Authorization'] = `Bearer ${effectiveToken}`;

      const res = await fetch('/api/articles?includeAll=true', { headers });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setArticles(data);
        }
      }
    } catch (err) {
      console.warn('API fetch articles failed, using cached state', err);
    } finally {
      setIsLoadingArticles(false);
    }
  }, [token]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles, token, currentUser]);

  // Persist bookmarks
  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch {
      //
    }
  }, [bookmarks]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setCurrentView('home');
    setSelectedArticleId(null);
    setSelectedCategory(null);
    setStaticPageType(null);
    scrollToTop();
  };

  const navigateToArticle = (idOrSlug: string) => {
    const found = articles.find(a => a.id === idOrSlug || a.slug === idOrSlug);
    if (found) {
      setSelectedArticleId(found.id);
    } else {
      setSelectedArticleId(idOrSlug);
    }
    setCurrentView('article');
    scrollToTop();
  };

  const navigateToCategory = (cat: NewsCategory) => {
    setSelectedCategory(cat);
    setCurrentView('category');
    scrollToTop();
  };

  const navigateToCMS = () => {
    setCurrentView('cms');
    scrollToTop();
  };

  const navigateToStaticPage = (page: StaticPageType) => {
    setStaticPageType(page);
    setCurrentView('static-page');
    scrollToTop();
  };

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Create article via backend API with offline fallback
  const createArticle = async (data: Partial<NewsArticle> & { title: string; category: NewsCategory; summary: string; submitForReview?: boolean }): Promise<string | null> => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/articles', {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const created = await res.json();
        await fetchArticles();
        return created.id;
      }
    } catch (err) {
      console.warn('Backend create article failed, falling back to local storage', err);
    }

    // Local fallback creation
    const newId = 'art_' + Date.now();
    const nowIso = new Date().toISOString();
    const contentArray = Array.isArray(data.content)
      ? data.content
      : typeof data.content === 'string'
      ? [data.content]
      : [data.summary];

    const newArticle: NewsArticle = {
      id: newId,
      title: data.title,
      slug: data.slug || ('news-' + Date.now()),
      category: data.category,
      summary: data.summary,
      content: contentArray,
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
      publishedAt: 'अभी-अभी',
      author: data.author || {
        id: currentUser?.id || 'usr_admin_01',
        name: currentUser?.name || 'संपादक',
        role: currentUser?.role || 'admin',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        location: 'जशपुर नगर'
      },
      readTime: data.readTime || '3 मिनट',
      isBreaking: data.isBreaking || false,
      isFeatured: data.isFeatured || false,
      views: 1,
      status: data.submitForReview ? 'pending_review' : 'published',
      subLocation: data.subLocation || 'जशपुर नगर',
      authorId: currentUser?.id || 'usr_admin_01',
      authorName: currentUser?.name || 'संपादक',
      authorRole: currentUser?.role || 'admin',
      createdAt: nowIso,
      updatedAt: nowIso,
      comments: []
    };

    setArticles(prev => {
      const next = [newArticle, ...prev];
      try {
        localStorage.setItem('jashpur_news_cached_articles_v2', JSON.stringify(next));
      } catch {}
      return next;
    });

    return newId;
  };

  // Update article via backend API
  const updateArticle = async (id: string, data: Partial<NewsArticle> & { submitForReview?: boolean }): Promise<boolean> => {
    // Optimistically update local state immediately for instant real-time response
    setArticles(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, ...data } : a);
      try {
        localStorage.setItem('jashpur_news_cached_articles_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const effectiveToken = token || localStorage.getItem('jashpur_news_auth_token_v1');
      if (effectiveToken) headers['Authorization'] = `Bearer ${effectiveToken}`;

      const res = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });

      if (res.ok) {
        await fetchArticles();
        return true;
      }
    } catch (err) {
      console.error('Update article failed', err);
    }
    return true;
  };

  // Review workflow action (approve_and_publish | reject | unpublish)
  const reviewArticle = async (id: string, action: 'approve_and_publish' | 'reject' | 'unpublish', reviewNotes?: string): Promise<boolean> => {
    try {
      // Optimistically update status locally in state so article remains right in place in Admin table
      const newStatus: ArticleStatus = action === 'approve_and_publish' ? 'published' : 'draft';
      setArticles(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));

      const effectiveToken = token || localStorage.getItem('jashpur_news_auth_token_v1');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (effectiveToken) headers['Authorization'] = `Bearer ${effectiveToken}`;

      const res = await fetch(`/api/articles/${id}/review`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action, reviewNotes })
      });

      if (res.ok) {
        await fetchArticles();
        return true;
      }
    } catch (err) {
      console.error('Review article failed', err);
    }
    return false;
  };

  // Delete article via backend API
  const deleteArticle = async (id: string): Promise<boolean> => {
    // Immediately remove from state & local storage for instant real-time response
    setArticles(prev => {
      const filtered = prev.filter(a => a.id !== id);
      try {
        localStorage.setItem('jashpur_news_cached_articles_v2', JSON.stringify(filtered));
      } catch {}
      return filtered;
    });

    if (selectedArticleId === id) {
      navigateToHome();
    }

    try {
      const effectiveToken = token || localStorage.getItem('jashpur_news_auth_token_v1');
      const headers: Record<string, string> = {};
      if (effectiveToken) headers['Authorization'] = `Bearer ${effectiveToken}`;

      await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers
      });
      return true;
    } catch (err) {
      console.error('Delete article failed', err);
      return true;
    }
  };

  // Add Comment via backend API
  const addComment = async (articleId: string, commentData: { authorName: string; city: string; comment: string }) => {
    try {
      const res = await fetch(`/api/articles/${articleId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      });
      if (res.ok) {
        const newC = await res.json();
        setArticles(prev => prev.map(a => {
          if (a.id === articleId) {
            return {
              ...a,
              comments: [newC, ...(a.comments || [])]
            };
          }
          return a;
        }));
      }
    } catch (err) {
      console.error('Add comment failed', err);
    }
  };

  const likeComment = (articleId: string, commentId: string) => {
    setArticles(prev => prev.map(a => {
      if (a.id === articleId) {
        return {
          ...a,
          comments: (a.comments || []).map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c)
        };
      }
      return a;
    }));
  };

  const addArticle = (articleData: Partial<NewsArticle>) => {
    createArticle({
      title: articleData.title || '',
      category: articleData.category || 'जशपुर',
      summary: articleData.summary || '',
      ...articleData
    });
  };

  const resetToDefaultArticles = async () => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      await fetch('/api/articles/seed', { method: 'POST', headers });
      await fetchArticles();
    } catch (err) {
      console.error('Reset articles failed', err);
      fetchArticles();
    }
  };

  const selectedArticle = articles.find(a => a.id === selectedArticleId) || null;

  return (
    <NewsContext.Provider
      value={{
        articles,
        isLoadingArticles,
        currentView,
        selectedArticle,
        selectedCategory,
        staticPageType,
        searchQuery,
        isSearchOpen,
        fontSizeLevel,
        bookmarks,
        lang,
        setLang,
        t,
        navigateToHome,
        navigateToArticle,
        navigateToCategory,
        navigateToCMS,
        navigateToStaticPage,
        setSearchQuery,
        setIsSearchOpen,
        setFontSizeLevel,
        toggleBookmark,
        fetchArticles,
        createArticle,
        addArticle,
        resetToDefaultArticles,
        updateArticle,
        reviewArticle,
        deleteArticle,
        addComment,
        likeComment
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = (): NewsContextType => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};
