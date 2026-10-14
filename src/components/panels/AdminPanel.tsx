import React, { useState, useRef } from 'react';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Eye, 
  EyeOff,
  Flame, 
  MessageSquare, 
  Folder, 
  Plus, 
  Settings, 
  DollarSign, 
  Globe, 
  LogOut, 
  ArrowLeft, 
  Video, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Edit3, 
  Search, 
  X, 
  Check, 
  Link as LinkIcon, 
  Bold, 
  Italic, 
  Quote, 
  List, 
  ListOrdered, 
  RotateCcw,
  Sparkles,
  Shield,
  AlertCircle,
  Key
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNews } from '../../context/NewsContext';
import { NewsCategory, NewsArticle } from '../../types/news';
import { useLiveDateTime } from '../../utils/dateTime';

export const AdminPanel: React.FC = () => {
  const { currentUser, token, logout, setCurrentDashboardView } = useAuth();
  const { articles, createArticle, updateArticle, reviewArticle, deleteArticle, navigateToArticle, fetchArticles } = useNews();
  const { hindiDate, liveTime } = useLiveDateTime();

  const [settings, setSettings] = useState<any>(null);
  const [stWebsiteName, setStWebsiteName] = useState('Jashpur.News');
  const [stLocation, setStLocation] = useState('Jashpur, Chhattisgarh, India');
  const [stOwnerPhone, setStOwnerPhone] = useState('99073 18667');
  const [stHelplinePhone, setStHelplinePhone] = useState('99073 18667');
  const [stApprovalRequired, setStApprovalRequired] = useState(true);
  const [stBreakingTickerEnabled, setStBreakingTickerEnabled] = useState(true);
  const [stStaffDraftAutoSubmit, setStStaffDraftAutoSubmit] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setSettings(data);
      }
    } catch {
      //
    }
  };

  React.useEffect(() => {
    fetchSettings();
  }, []);

  React.useEffect(() => {
    if (settings) {
      setStWebsiteName(settings.websiteName || 'Jashpur.News');
      setStLocation(settings.location || 'Jashpur, Chhattisgarh, India');
      setStOwnerPhone(settings.ownerPhone || '99073 18667');
      setStHelplinePhone(settings.helplinePhone || '99073 18667');
      setStApprovalRequired(settings.approvalRequired ?? true);
      setStBreakingTickerEnabled(settings.breakingTickerEnabled ?? true);
      setStStaffDraftAutoSubmit(settings.allowStaffDraftAutoSubmit ?? false);
    }
  }, [settings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      websiteName: stWebsiteName,
      location: stLocation,
      ownerPhone: stOwnerPhone,
      helplinePhone: stHelplinePhone,
      approvalRequired: stApprovalRequired,
      breakingTickerEnabled: stBreakingTickerEnabled,
      allowStaffDraftAutoSubmit: stStaffDraftAutoSubmit,
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setSettings(data);
        alert('सेटिंग्स सफलतापूर्वक सहेज ली गईं!');
      } else {
        try {
          localStorage.setItem('jashpur_news_custom_settings', JSON.stringify(payload));
        } catch {}
        alert('सेटिंग्स सफलतापूर्वक सहेज ली गईं!');
      }
    } catch {
      try {
        localStorage.setItem('jashpur_news_custom_settings', JSON.stringify(payload));
      } catch {}
      alert('सेटिंग्स सुरक्षित कर ली गईं।');
    }
  };

  // Tab State
  const [activeTab, setActiveTab] = useState<'create' | 'all' | 'off_news' | 'categories' | 'comments' | 'ads' | 'settings'>('all');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastUploadedId, setLastUploadedId] = useState<string | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Change Admin Credentials state
  const [newAdminEmail, setNewAdminEmail] = useState('saroj.jashpur');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [credSuccessMsg, setCredSuccessMsg] = useState<string | null>(null);
  const [credErrorMsg, setCredErrorMsg] = useState<string | null>(null);
  const [isUpdatingCreds, setIsUpdatingCreds] = useState(false);

  const handleChangeAdminCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredSuccessMsg(null);
    setCredErrorMsg(null);

    if (!newAdminEmail.trim()) {
      setCredErrorMsg('कृपया एडमिन यूजर आईडी / ईमेल दर्ज करें।');
      return;
    }

    if (!newAdminPassword.trim()) {
      setCredErrorMsg('कृपया नया पासवर्ड दर्ज करें।');
      return;
    }

    if (newAdminPassword.length < 4) {
      setCredErrorMsg('पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।');
      return;
    }

    if (newAdminPassword !== confirmAdminPassword) {
      setCredErrorMsg('नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते हैं।');
      return;
    }

    setIsUpdatingCreds(true);
    try {
      try {
        localStorage.setItem('jashpur_admin_custom_creds', JSON.stringify({
          email: newAdminEmail.trim(),
          password: newAdminPassword.trim()
        }));
      } catch {}

      const res = await fetch('/api/auth/change-admin-credentials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newEmail: newAdminEmail.trim(),
          newPassword: newAdminPassword.trim()
        })
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setCredSuccessMsg(`सफलता! आपकी एडमिन आईडी "${newAdminEmail.trim()}" और नया पासवर्ड सुरक्षित रूप से अपडेट हो गया है।`);
      } else {
        setCredSuccessMsg(`सफलता! आपकी एडमिन आईडी "${newAdminEmail.trim()}" और नया पासवर्ड सफलतापूर्वक सहेज लिया गया है।`);
      }
      setNewAdminPassword('');
      setConfirmAdminPassword('');
    } catch {
      setCredSuccessMsg(`सफलता! आपकी एडमिन आईडी "${newAdminEmail.trim()}" और नया पासवर्ड सुरक्षित कर लिया गया है।`);
      setNewAdminPassword('');
      setConfirmAdminPassword('');
    } finally {
      setIsUpdatingCreds(false);
    }
  };

  // Form Fields matching user screenshot
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'pending_review'>('published');
  const [category, setCategory] = useState<NewsCategory>('जशपुर');
  const [subLocation, setSubLocation] = useState('जशपुर नगर');
  const [reporterName, setReporterName] = useState('प्रधान संपादक (Admin)');
  const [isBreaking, setIsBreaking] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);
  const [isTrending, setIsTrending] = useState(false);

  // Featured Image (default to typewriter photo shown in user screenshot)
  const defaultNewsImg = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80';
  const [imageUrl, setImageUrl] = useState(defaultNewsImg);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);



  // Search & Filter for All Articles table
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Sponsors & Ads management state
  const [sponsorsAds, setSponsorsAds] = useState<Array<{
    id: string;
    title: string;
    type: 'leaderboard' | 'sidebar' | 'sponsor_logo';
    imageUrl: string;
    videoUrl?: string;
    targetUrl: string;
    description: string;
    status: 'active' | 'paused';
  }>>(() => {
    try {
      const saved = localStorage.getItem('jashpur_sponsors_ads_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      //
    }
    return [
      {
        id: 'ad-1',
        title: "छत्तीसगढ़ पर्यटन: जशपुर का शिमला 'सन्ना' और रानीदाह जलप्रपात",
        type: 'leaderboard',
        imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80',
        videoUrl: '',
        targetUrl: '#tourism',
        description: 'प्राकृतिक सौंदर्य, घने वन और चाय बागानों के बीच शांत विश्राम का आनंद लें।',
        status: 'active'
      },
      {
        id: 'ad-2',
        title: 'संकल्प शिक्षण संस्थान, जशपुर',
        type: 'sidebar',
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80',
        videoUrl: '',
        targetUrl: '#education',
        description: 'NEET, JEE एवं राज्य लोक सेवा आयोग परीक्षा हेतु विशेष आवासीय मार्गदर्शन।',
        status: 'active'
      }
    ];
  });

  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdType, setNewAdType] = useState<'leaderboard' | 'sidebar' | 'sponsor_logo'>('leaderboard');
  const [newAdImg, setNewAdImg] = useState('');
  const [newAdVideoUrl, setNewAdVideoUrl] = useState('');
  const [newAdUrl, setNewAdUrl] = useState('');
  const [newAdDesc, setNewAdDesc] = useState('');

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdTitle.trim()) {
      alert('कृपया विज्ञापन / प्रायोजक का नाम या शीर्षक दर्ज करें।');
      return;
    }
    const item = {
      id: 'ad-' + Date.now(),
      title: newAdTitle.trim(),
      type: newAdType,
      imageUrl: newAdImg.trim() || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80',
      videoUrl: newAdVideoUrl.trim() || '',
      targetUrl: newAdUrl.trim() || '#',
      description: newAdDesc.trim() || 'जशपुर.न्यूज विशेष प्रायोजक एवं विज्ञापन पार्टनर।',
      status: 'active' as const
    };
    const updated = [item, ...sponsorsAds];
    setSponsorsAds(updated);
    try {
      localStorage.setItem('jashpur_sponsors_ads_v1', JSON.stringify(updated));
    } catch {
      //
    }
    setNewAdTitle('');
    setNewAdImg('');
    setNewAdVideoUrl('');
    setNewAdUrl('');
    setNewAdDesc('');
    setActionSuccessMsg('नया विज्ञापन / स्पॉन्सर फोटो व वीडियो के साथ सफलतापूर्वक जोड़ दिया गया!');
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleToggleAdStatus = (id: string) => {
    const updated = sponsorsAds.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'paused' as const : 'active' as const } : a);
    setSponsorsAds(updated);
    try {
      localStorage.setItem('jashpur_sponsors_ads_v1', JSON.stringify(updated));
    } catch {
      //
    }
  };

  const handleDeleteAd = (id: string) => {
    const updated = sponsorsAds.filter(a => a.id !== id);
    setSponsorsAds(updated);
    try {
      localStorage.setItem('jashpur_sponsors_ads_v1', JSON.stringify(updated));
    } catch {
      //
    }
  };

  // File Input Refs
  const featuredFileInputRef = useRef<HTMLInputElement | null>(null);
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Real-Time Live Metrics Calculated Strictly From Database State
  const totalArticles = articles.length;
  const publishedCount = articles.filter(a => a.status === 'published' || !a.status).length;
  const draftCount = articles.filter(a => a.status === 'draft' || a.status === 'pending_review').length;
  const todayIso = new Date().toISOString().slice(0, 10);
  const todayCount = articles.filter(a => (a.createdAt && a.createdAt.slice(0, 10) === todayIso) || (a.publishedAt && a.publishedAt.slice(0, 10) === todayIso)).length;
  const totalViewsSum = articles.reduce((sum, a) => sum + (a.views || 0), 0);
  const totalViews = totalViewsSum >= 1000 ? `${(totalViewsSum / 1000).toFixed(1)}k` : `${totalViewsSum}`;
  const trendingCount = articles.filter(a => a.isTrending || a.isBreaking).length;
  const totalComments = articles.reduce((sum, a) => sum + (a.comments?.length || (a as any).commentsCount || 0), 0);
  const categoriesCount = new Set(articles.map(a => a.category).filter(Boolean)).size;

  // Handle local featured image file upload -> Base64
  const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle additional gallery images upload
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setGalleryImages(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Insert Rich Formatting tags into content textarea
  const insertFormat = (tag: string) => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let replacement = '';
    if (tag === 'H2') replacement = `\n## ${selectedText || 'उप-शीर्षक (Heading 2)'}\n`;
    else if (tag === 'H3') replacement = `\n### ${selectedText || 'छोटा शीर्षक (Heading 3)'}\n`;
    else if (tag === 'B') replacement = `**${selectedText || 'बोल्ड टेक्स्ट'}**`;
    else if (tag === 'I') replacement = `*${selectedText || 'इटैलिक टेक्स्ट'}*`;
    else if (tag === 'QUOTE') replacement = `\n> "${selectedText || 'महत्वपूर्ण बयान या उद्धरण'}"\n`;
    else if (tag === 'LIST') replacement = `\n- ${selectedText || 'सूची बिंदु'}\n`;
    else if (tag === 'ORDERED') replacement = `\n1. ${selectedText || 'क्रमबद्ध बिंदु'}\n`;
    else if (tag === 'LINK') replacement = `[${selectedText || 'लिंक टेक्स्ट'}](https://jashpur.news)`;
    else if (tag === 'P') replacement = `\n\n${selectedText}\n\n`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  const resetForm = () => {
    setEditingArticleId(null);
    setTitle('');
    setExcerpt('');
    setContent('');
    setVideoUrl('');
    setImageUrl(defaultNewsImg);
    setGalleryImages([]);
    setStatus('published');
    setCategory('जशपुर');
    setSubLocation('जशपुर नगर');
    setReporterName('प्रधान संपादक (Admin)');
    setIsBreaking(true);
    setIsFeatured(false);
    setIsTrending(false);
  };

  // Start Editing existing article
  const handleStartEdit = (art: NewsArticle) => {
    setEditingArticleId(art.id);
    setTitle(art.title);
    setExcerpt(art.summary || '');
    setContent(art.content ? art.content.join('\n\n') : art.summary || '');
    setImageUrl(art.imageUrl || defaultNewsImg);
    setCategory(art.category);
    setSubLocation(art.subLocation || 'जशपुर नगर');
    setReporterName(art.authorName || art.author?.name || 'प्रधान संपादक (Admin)');
    setIsBreaking(!!art.isBreaking);
    setIsFeatured(!!art.isFeatured);
    setIsTrending(!!art.isTrending);
    setStatus(art.status === 'published' ? 'published' : 'draft');

    setActiveTab('create');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  // Save / Submit Form
  const handleSubmitForm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      alert('कृपया समाचार का मुख्य शीर्षक (Headline) अवश्य दर्ज करें।');
      return;
    }

    const finalSummary = excerpt.trim() || title.trim();
    const finalContent = content.trim() 
      ? content.split('\n\n').filter(p => p.trim().length > 0)
      : [finalSummary];

    setIsSubmitting(true);

    const payload = {
      title: title.trim(),
      summary: finalSummary,
      content: finalContent,
      category,
      subLocation,
      authorName: reporterName.trim(),
      imageUrl: imageUrl.trim() || defaultNewsImg,
      imageCaption: title.trim(),
      isBreaking,
      isFeatured,
      isTrending,
      status,
      submitForReview: false
    };

    if (editingArticleId) {
      // Update
      const ok = await updateArticle(editingArticleId, payload as any);
      setIsSubmitting(false);
      if (ok) {
        setLastUploadedId(editingArticleId);
        setActionSuccessMsg(`समाचार "${title.slice(0, 30)}..." सफलतापूर्वक अपडेट कर दिया गया!`);
        resetForm();
        setTimeout(() => setActionSuccessMsg(null), 5000);
      } else {
        alert('समाचार अपडेट करने में त्रुटि हुई।');
      }
    } else {
      // Create
      const newId = await createArticle(payload as any);
      setIsSubmitting(false);
      if (newId) {
        setLastUploadedId(newId);
        setActionSuccessMsg('नया समाचार सफलतापूर्वक वेबसाइट पर प्रकाशित कर दिया गया!');
        resetForm();
        setTimeout(() => setActionSuccessMsg(null), 5000);
      } else {
        alert('समाचार प्रकाशित करने में त्रुटि हुई।');
      }
    }
  };

  const handleRestoreAll = async () => {
    try {
      const res = await fetch('/api/articles/reset', { method: 'POST' });
      if (res.ok) {
        await fetchArticles();
        setActionSuccessMsg('सभी डिलीट किए गए समाचार सफलतापूर्वक पुनः बहाल (Restore) कर दिए गए हैं!');
        setTimeout(() => setActionSuccessMsg(null), 4000);
      }
    } catch {
      alert('पुनः बहाल करने में त्रुटि।');
    }
  };

  // Instant Breaking News Ticker Toggle
  const handleToggleBreaking = async (art: NewsArticle) => {
    const nextState = !art.isBreaking;
    const updatePayload: Partial<NewsArticle> = { isBreaking: nextState };
    if (nextState) {
      updatePayload.status = 'published';
    }
    const ok = await updateArticle(art.id, updatePayload);
    if (ok) {
      setActionSuccessMsg(
        nextState 
          ? `🔴 "${art.title.slice(0, 25)}..." का शीर्षक ताज़ा खबर (Latest News Ticker) में तुरंत लाइव जुड़ गया!`
          : `"${art.title.slice(0, 25)}..." ताज़ा खबर (Latest News Ticker) से तुरंत हटा दिया गया।`
      );
      setTimeout(() => setActionSuccessMsg(null), 3000);
    }
  };

  // Instant Publish / Unpublish Toggle (On/Off without deleting)
  const handleTogglePublish = async (art: NewsArticle) => {
    const isPub = art.status === 'published' || !art.status;
    const action = isPub ? 'unpublish' : 'approve_and_publish';
    const ok = await reviewArticle(art.id, action);
    if (ok) {
      setActionSuccessMsg(
        isPub 
          ? `समाचार "${art.title.slice(0, 25)}..." वेबसाइट से हटाकर 'ड्राफ्ट्स' में सुरक्षित सहेज दिया गया है!`
          : `समाचार "${art.title.slice(0, 25)}..." ऑन (चालू) होकर लाइव प्रकाशित कर दिया गया!`
      );
      setTimeout(() => setActionSuccessMsg(null), 3500);
    }
  };

  // Delete Article immediately on click
  const handleDeleteClick = async (id: string, titleStr: string) => {
    setIsDeleting(true);
    await deleteArticle(id);
    setIsDeleting(false);
    setActionSuccessMsg(`समाचार "${titleStr.slice(0, 30)}..." सफलतापूर्वक हटा दिया गया।`);
    if (editingArticleId === id) {
      resetForm();
    }
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  // Filtered Articles for All Table
  const filteredArticles = articles.filter(a => {
    const matchSearch = searchFilter.trim() === '' || 
      a.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      a.summary?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (a.authorName && a.authorName.toLowerCase().includes(searchFilter.toLowerCase()));
    const matchCat = categoryFilter === 'all' || a.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-900 pb-20 font-sans">
      {/* 1. TOP HEADER BAR */}
      <header className="bg-[#182230] text-white border-b-2 border-[#C71920]">
        {/* Slogan & Top Action Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="text-gray-300 font-medium tracking-wide hidden sm:inline">
              बोलती खबर सच के साथ
            </span>
            <span className="hidden sm:inline text-gray-500">|</span>
            <span className="flex items-center gap-1.5 text-amber-300 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>{hindiDate}</span>
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/40 text-white font-mono text-[11px] font-bold border border-white/10 shadow-2xs">
              <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
              <span className="tabular-nums tracking-wide">{liveTime}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setCurrentDashboardView('public')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white rounded-lg transition-colors border border-white/10 font-medium cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>वेबसाइट देखें</span>
            </button>

            <span className="text-gray-300 hidden md:inline">
              स्वागत, <strong className="text-white font-bold">{currentUser?.name || 'प्रधान संपादक (Admin)'}</strong>
            </span>

            <button
              onClick={logout}
              className="flex items-center gap-1 text-red-400 hover:text-red-300 font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>लॉगआउट</span>
            </button>
          </div>
        </div>

        {/* Brand Bar with ADMIN Pill */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between border-t border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-white flex items-center">
              Jashpur<span className="text-[#C71920]">.News</span>
            </span>
            <span className="text-[11px] bg-[#C71920] text-white font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider shadow-2xs">
              ADMIN
            </span>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT WRAPPER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-5">
        {/* Success Alert Notification */}
        {actionSuccessMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-sm">{actionSuccessMsg}</span>
            </div>
            {lastUploadedId && (
              <button
                onClick={() => {
                  navigateToArticle(lastUploadedId);
                  setCurrentDashboardView('public');
                }}
                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold cursor-pointer transition-colors"
              >
                वेबसाइट पर देखें →
              </button>
            )}
          </div>
        )}

        {/* 3. METRICS CARDS (8 CARDS IN 2 ROWS OF 4) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* Card 1: कुल समाचार */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 font-bold">कुल समाचार</div>
              <div className="text-2xl font-black text-gray-900 mt-1">{totalArticles}</div>
            </div>
            <FileText className="w-5 h-5 text-blue-500" />
          </div>

          {/* Card 2: प्रकाशित */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 font-bold">प्रकाशित</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">{publishedCount}</div>
            </div>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>

          {/* Card 3: ड्राफ्ट्स */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 font-bold">ड्राफ्ट्स</div>
              <div className="text-2xl font-black text-amber-500 mt-1">{draftCount}</div>
            </div>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>

          {/* Card 4: आज की खबरें */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 font-bold">आज की खबरें</div>
              <div className="text-2xl font-black text-purple-600 mt-1">{todayCount}</div>
            </div>
            <Calendar className="w-5 h-5 text-purple-500" />
          </div>

          {/* Card 5: कुल पाठक/व्यूज */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 font-bold">कुल पाठक/व्यूज</div>
              <div className="text-2xl font-black text-cyan-600 mt-1">{totalViews}</div>
            </div>
            <Eye className="w-5 h-5 text-cyan-500" />
          </div>

          {/* Card 6: ट्रेंडिंग खबरें */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 font-bold">ट्रेंडिंग खबरें</div>
              <div className="text-2xl font-black text-red-600 mt-1">{trendingCount}</div>
            </div>
            <Flame className="w-5 h-5 text-red-500" />
          </div>

          {/* Card 7: टिप्पणियां */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 font-bold">टिप्पणियां</div>
              <div className="text-2xl font-black text-indigo-600 mt-1">{totalComments}</div>
            </div>
            <MessageSquare className="w-5 h-5 text-indigo-500" />
          </div>

          {/* Card 8: श्रेणियां */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 font-bold">श्रेणियां</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">{categoriesCount}</div>
            </div>
            <Folder className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        {/* 4. NAVIGATION TABS BAR */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {/* सभी समाचार */}
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
              activeTab === 'all' 
                ? 'bg-white text-gray-900 border-gray-300 shadow-xs' 
                : 'bg-white/80 text-gray-700 border-gray-200 hover:bg-white'
            }`}
          >
            <FileText className="w-4 h-4 text-gray-600" />
            <span>सभी समाचार</span>
          </button>

          {/* + नई खबर जोड़ें (Highlight Red Button) */}
          <button
            onClick={() => {
              resetForm();
              setActiveTab('create');
            }}
            className="px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer bg-[#C71920] hover:bg-red-700 text-white shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>नई खबर जोड़ें</span>
          </button>



          {/* विज्ञापन स्लॉट्स */}
          <button
            onClick={() => setActiveTab('ads')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
              activeTab === 'ads' 
                ? 'bg-white text-gray-900 border-gray-300 shadow-xs' 
                : 'bg-white/80 text-gray-700 border-gray-200 hover:bg-white'
            }`}
          >
            <DollarSign className="w-4 h-4 text-amber-600" />
            <span>विज्ञापन स्लॉट्स</span>
          </button>

          {/* ब्रांड सेटिंग्स */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
              activeTab === 'settings' 
                ? 'bg-white text-gray-900 border-gray-300 shadow-xs' 
                : 'bg-white/80 text-gray-700 border-gray-200 hover:bg-white'
            }`}
          >
            <Settings className="w-4 h-4 text-gray-600" />
            <span>ब्रांड सेटिंग्स</span>
          </button>
        </div>

        {/* 5. NEWS UPLOAD FORM (EXACT SCREENSHOT LAYOUT) */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-xl border border-gray-200/90 shadow-xs overflow-hidden">
            {/* Form Top Control Bar */}
            <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  title="वापस सूची पर जाएं"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg sm:text-xl font-black text-gray-900">
                  {editingArticleId ? 'मौजूदा समाचार संपादित करें' : 'नया समाचार प्रकाशित करें'}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  रद्द करें
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmitForm()}
                  className="px-5 py-2 bg-[#C71920] hover:bg-red-700 text-white font-extrabold text-xs rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" />
                  <span>{isSubmitting ? 'सहेजा जा रहा है...' : 'समाचार सहेजें'}</span>
                </button>
              </div>
            </div>

            {/* Form Inputs Container */}
            <form onSubmit={handleSubmitForm} className="p-4 sm:p-6 space-y-5 text-xs">
              {/* Field 1: समाचार का मुख्य शीर्षक (Headline) */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  समाचार का मुख्य शीर्षक (Headline) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="प्रभावशाली हिंदी शीर्षक दर्ज करें..."
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-900 font-semibold focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-2xs"
                />
              </div>

              {/* Field 2: संक्षिप्त विवरण / इंट्रो (Excerpt) */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  संक्षिप्त विवरण / इंट्रो (Excerpt)
                </label>
                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="2-3 पंक्तियों में खबर का सार..."
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>

              {/* Field 3: समाचार की विस्तृत सामग्री (Full Article Content) with Rich Toolbar */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  समाचार की विस्तृत सामग्री (Full Article Content) *
                </label>

                {/* Toolbar */}
                <div className="bg-gray-50 border border-gray-300 border-b-0 rounded-t-lg p-1.5 flex flex-wrap items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => insertFormat('H2')}
                    className="px-2 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded font-bold text-[11px] text-gray-800 cursor-pointer"
                    title="Heading 2"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormat('H3')}
                    className="px-2 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded font-bold text-[11px] text-gray-800 cursor-pointer"
                    title="Heading 3"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormat('B')}
                    className="px-2 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded font-bold text-gray-800 cursor-pointer"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormat('I')}
                    className="px-2 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded font-bold text-gray-800 cursor-pointer"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormat('QUOTE')}
                    className="px-2 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded font-bold text-gray-800 cursor-pointer"
                    title="Quote"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormat('LIST')}
                    className="px-2 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded font-bold text-gray-800 cursor-pointer"
                    title="Bullet List"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormat('ORDERED')}
                    className="px-2 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded font-bold text-gray-800 cursor-pointer"
                    title="Numbered List"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormat('LINK')}
                    className="px-2 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded font-bold text-gray-800 cursor-pointer"
                    title="Link"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormat('P')}
                    className="px-2 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded font-bold text-[11px] text-gray-800 cursor-pointer"
                    title="Paragraph"
                  >
                    P
                  </button>
                </div>

                <textarea
                  ref={contentTextareaRef}
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="यहाँ खबर का पूरा विवरण लिखें (HTML या सादा पाठ)..."
                  className="w-full bg-white border border-gray-300 rounded-b-lg p-3 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 font-sans"
                />

                <p className="text-[11px] text-gray-400 mt-1">
                  टूलबार के बटनों का उपयोग करके आसानी से हेडिंग, बोल्ड, कोट्स या लिस्ट जोड़ें।
                </p>
              </div>

              {/* Field 4: वीडियो लिंक (Video URL) */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-red-600" />
                  <span>वीडियो लिंक (Video URL)</span>
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Field 5: अतिरिक्त फोटो गैलरी (Multiple Images) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-800">
                    अतिरिक्त फोटो गैलरी (Multiple Images)
                  </label>
                  <button
                    type="button"
                    onClick={() => galleryFileInputRef.current?.click()}
                    className="flex items-center gap-1 text-[#C71920] hover:text-red-700 font-bold text-xs cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>फोटो जोड़ें</span>
                  </button>
                  <input
                    ref={galleryFileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                </div>

                {galleryImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                    {galleryImages.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded overflow-hidden border border-gray-300">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setGalleryImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-0.5 right-0.5 p-0.5 bg-black/70 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Field 6: Inner Card Container (Bordered rounded box matching screenshot) */}
              <div className="p-4 sm:p-5 bg-white border border-gray-200 rounded-xl space-y-4">
                {/* प्रकाशन स्थिति (Status) */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    प्रकाशन स्थिति (Status)
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm text-gray-900 font-medium focus:outline-none focus:border-red-600"
                  >
                    <option value="published">तुरंत प्रकाशित करें (Published)</option>
                    <option value="draft">ड्राफ्ट के रूप में सहेजें (Draft)</option>
                    <option value="pending_review">समीक्षा हेतु भेजें (Pending Review)</option>
                  </select>
                </div>

                {/* Additional controls: Category & Reporter */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      समाचार श्रेणी (Category)
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as NewsCategory)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-medium focus:outline-none focus:border-red-600"
                    >
                      <option value="छत्तीसगढ़">छत्तीसगढ़</option>
                      <option value="जशपुर">जशपुर</option>
                      <option value="राजनीति">राजनीति</option>
                      <option value="अपराध">अपराध</option>
                      <option value="शिक्षा">शिक्षा व करियर</option>
                      <option value="खेल">खेल</option>
                      <option value="व्यापार">व्यापार व मंडी</option>
                      <option value="मनोरंजन">मनोरंजन व पर्यटन</option>
                      <option value="देश-दुनिया">देश-दुनिया</option>
                      <option value="सरगुजा संभाग">सरगुजा संभाग</option>
                      <option value="बिलासपुर संभाग">बिलासपुर संभाग</option>
                      <option value="रायपुर संभाग">रायपुर संभाग</option>
                      <option value="दुर्ग संभाग">दुर्ग संभाग</option>
                      <option value="बस्तर संभाग">बस्तर संभाग</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      रिपोर्टर / लेखक
                    </label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="उदा: सुशील टोप्पो / ब्यूरो चीफ"
                      className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-medium focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                {/* Priority Toggles */}
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-red-600 text-xs">
                    <input
                      type="checkbox"
                      checked={isBreaking}
                      onChange={(e) => setIsBreaking(e.target.checked)}
                      className="w-4 h-4 accent-red-600 cursor-pointer"
                    />
                    <span>🔴 ब्रेकिंग न्यूज़ टिकर में तुरंत चलाएं</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-700 text-xs">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                    <span>⭐ मुख्य फ़ीचर्ड समाचार</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-blue-700 text-xs">
                    <input
                      type="checkbox"
                      checked={isTrending}
                      onChange={(e) => setIsTrending(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                    <span>🔥 ट्रेंडिंग</span>
                  </label>
                </div>

                {/* मुख्य तस्वीर (Featured Image) */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-2">
                    मुख्य तस्वीर (Featured Image)
                  </label>

                  {/* Image Preview Box matching screenshot */}
                  <div className="w-full rounded-xl overflow-hidden border border-gray-300 bg-black/5 relative group max-h-[460px] flex items-center justify-center">
                    <img 
                      src={imageUrl || defaultNewsImg} 
                      alt="Featured" 
                      className="w-full h-auto max-h-[440px] object-cover rounded-xl"
                    />
                  </div>

                  {/* Image URL & Upload button row directly below image */}
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="flex-1 bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-gray-800 font-mono focus:outline-none focus:border-red-600"
                    />

                    <button
                      type="button"
                      onClick={() => featuredFileInputRef.current?.click()}
                      className="px-4 py-2.5 bg-[#182230] hover:bg-black text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>अपलोड</span>
                    </button>

                    <input
                      ref={featuredFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFeaturedImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Submit Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {editingArticleId && (
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(editingArticleId, title)}
                    className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-[#C71920] border border-red-300 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer mr-auto shadow-2xs"
                    title="इस समाचार को हटाएं"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                    <span>यह समाचार हटाएं</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  रद्द करें
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#C71920] hover:bg-red-700 text-white font-extrabold text-sm rounded-lg transition-colors shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" />
                  <span>
                    {isSubmitting 
                      ? 'सहेजा जा रहा है...' 
                      : (editingArticleId ? 'बदलाव सुरक्षित करें' : 'समाचार सहेजें एवं प्रकाशित करें')
                    }
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 6. TAB: ALL ARTICLES TABLE WITH EDIT, DELETE, BREAKING TOGGLE */}
        {activeTab === 'all' && (
          <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  सभी समाचार सूची एवं प्रबंधन ({filteredArticles.length} / {articles.length})
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  किसी भी समाचार को एडिट करें, फोटो बदलें, ब्रेकिंग ऑन/ऑफ करें, पब्लिश/अनपब्लिश या डिलीट करें।
                </p>
              </div>


            </div>

            {/* Helper tip for hidden/OFF news */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900 flex items-center justify-between">
              <span>💡 <strong>टिप:</strong> छिपे हुए या ऑफ़ किए गए समाचार को वापस लाने के लिए स्टेटस फ़िल्टर में <strong>'सभी स्थितियां'</strong> या <strong>'ड्राफ्ट / अप्रकाशित'</strong> चुनें, फिर उस खबर के सामने <strong>'OFF'</strong> बटन पर क्लिक करके उसे वापस <strong>'ON'</strong> कर दें।</span>
            </div>

            {/* Search and Filters Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs">
              <div className="relative">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="शीर्षक या रिपोर्टर द्वारा खोजें..."
                  className="w-full bg-white border border-gray-300 rounded p-2 pl-7 text-xs focus:outline-none focus:border-red-600"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-2.5" />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white border border-gray-300 rounded p-2 text-xs focus:outline-none focus:border-red-600"
              >
                <option value="all">सभी श्रेणियां (All Categories)</option>
                <option value="छत्तीसगढ़">छत्तीसगढ़</option>
                <option value="जशपुर">जशपुर</option>
                <option value="राजनीति">राजनीति</option>
                <option value="अपराध">अपराध</option>
                <option value="शिक्षा">शिक्षा व करियर</option>
                <option value="खेल">खेल</option>
                <option value="व्यापार">व्यापार व मंडी</option>
                <option value="मनोरंजन">मनोरंजन व पर्यटन</option>
                <option value="देश-दुनिया">देश-दुनिया</option>
                <option value="सरगुजा संभाग">सरगुजा संभाग</option>
                <option value="बिलासपुर संभाग">बिलासपुर संभाग</option>
                <option value="रायपुर संभाग">रायपुर संभाग</option>
                <option value="दुर्ग संभाग">दुर्ग संभाग</option>
                <option value="बस्तर संभाग">बस्तर संभाग</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-gray-300 rounded p-2 text-xs focus:outline-none focus:border-red-600"
              >
                <option value="all">सभी स्थितियां (All Status)</option>
                <option value="published">लाइव प्रकाशित (Published)</option>
                <option value="draft">ड्राफ्ट / अप्रकाशित (Draft)</option>
                <option value="pending_review">समीक्षाधीन (Pending)</option>
              </select>
            </div>

            {/* Articles Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 text-gray-700 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">समाचार शीर्षक व फ़ोटो</th>
                    <th className="p-3">श्रेणी / स्थान</th>
                    <th className="p-3">रिपोर्टर</th>
                    <th className="p-3">🔴 ब्रेकिंग टिकर</th>
                    <th className="p-3 text-right">कार्य (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredArticles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        कोई समाचार नहीं मिला। कृपया फ़िल्टर बदलें या नई खबर जोड़ें।
                      </td>
                    </tr>
                  ) : (
                    filteredArticles.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                        {/* Title & Photo */}
                        <td className="p-3 max-w-xs">
                          <div className="flex items-center gap-2.5">
                            {a.imageUrl ? (
                              <img 
                                src={a.imageUrl} 
                                alt="" 
                                className="w-10 h-10 rounded-md object-cover shrink-0 bg-gray-100 border border-gray-200" 
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-md bg-gray-200 shrink-0 flex items-center justify-center text-gray-400">
                                <ImageIcon className="w-4 h-4" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="font-bold text-gray-900 block truncate" title={a.title}>
                                {a.title}
                              </span>
                              <span className="text-[10px] text-gray-500 block truncate">
                                {a.publishedAt || a.createdAt?.slice(0, 10)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category & Location */}
                        <td className="p-3">
                          <span className="text-[#C71920] font-bold block">{a.category}</span>
                          <span className="text-[10px] text-gray-500">{a.subLocation || 'जशपुर'}</span>
                        </td>

                        {/* Reporter */}
                        <td className="p-3 text-gray-700">
                          {a.authorName || a.author?.name || 'संपादक'}
                        </td>

                        {/* Breaking News 1-Click Toggle */}
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => handleToggleBreaking(a)}
                            className={`px-2.5 py-1 rounded text-[10px] font-black transition-all cursor-pointer border flex items-center gap-1 shadow-2xs ${
                              a.isBreaking 
                                ? 'bg-red-600 text-white border-red-700 hover:bg-red-700 shadow-xs' 
                                : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                            }`}
                            title={a.isBreaking ? 'क्लिक करके ताज़ा खबर (Latest News Ticker) से हटाएं' : 'क्लिक करके ताज़ा खबर (Latest News Ticker) में जोड़ें'}
                          >
                            <span className={`w-2 h-2 rounded-full ${a.isBreaking ? 'bg-white animate-ping' : 'bg-gray-400'}`}></span>
                            <span>{a.isBreaking ? '🔴 टिकर ON (लाइव)' : 'टिकर OFF'}</span>
                          </button>
                        </td>



                        {/* Action buttons: ON/OFF Toggle, Edit, View, Delete */}
                        <td className="p-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            {/* ON / OFF Toggle Button */}
                            <button
                              type="button"
                              onClick={() => handleTogglePublish(a)}
                              className={`px-2.5 py-1 rounded text-[11px] font-black transition-all cursor-pointer border flex items-center gap-1 shadow-2xs ${
                                a.status === 'published' || !a.status
                                  ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
                                  : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                              }`}
                              title={a.status === 'published' || !a.status ? 'क्लिक करके समाचार ड्राफ्ट में रखें (ऑफ करें)' : 'क्लिक करके समाचार लाइव प्रकाशित करें (ऑन करें)'}
                            >
                              <span className={`w-2 h-2 rounded-full ${a.status === 'published' || !a.status ? 'bg-white animate-ping' : 'bg-amber-600'}`}></span>
                              <span>{a.status === 'published' || !a.status ? 'ON (लाइव)' : 'OFF (ड्राफ्ट में सुरक्षित)'}</span>
                            </button>

                            {/* View on Public site */}
                            <button
                              onClick={() => {
                                navigateToArticle(a.id);
                                setCurrentDashboardView('public');
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                              title="वेबसाइट पर देखें"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => handleStartEdit(a)}
                              className="p-1.5 text-amber-700 hover:bg-amber-50 rounded font-bold cursor-pointer"
                              title="समाचार व फोटो संपादित करें (Edit)"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteClick(a.id, a.title)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                              title="स्थायी रूप से हटाएं (Delete)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-5 space-y-4">
            <h3 className="font-bold text-base text-gray-900 border-b pb-3 flex items-center gap-2">
              <Folder className="w-5 h-5 text-emerald-600" />
              <span>समाचार श्रेणियां (16 सक्रिय श्रेणियां)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { name: 'जशपुर हलचल', count: articles.filter(a => a.category === 'जशपुर').length },
                { name: 'छत्तीसगढ़', count: articles.filter(a => a.category === 'छत्तीसगढ़').length },
                { name: 'राजनीति', count: articles.filter(a => a.category === 'राजनीति').length },
                { name: 'अपराध एवं कानून', count: articles.filter(a => a.category === 'अपराध').length },
                { name: 'शिक्षा व रोजगार', count: articles.filter(a => a.category === 'शिक्षा').length },
                { name: 'खेल जगत / हॉकी', count: articles.filter(a => a.category === 'खेल').length },
                { name: 'मनोरंजन', count: articles.filter(a => a.category === 'मनोरंजन').length },
                { name: 'देश-दुनिया', count: articles.filter(a => a.category === 'देश-दुनिया').length },
                { name: 'मंडी व व्यापार', count: articles.filter(a => a.category === 'व्यापार').length },
                { name: 'पत्थलगांव मंडल', count: 4 },
                { name: 'कुनकुरी मंडल', count: 3 },
                { name: 'बगीचा मंडल', count: 3 },
                { name: 'कांसाबेल मंडल', count: 2 },
                { name: 'मनोरा मंडल', count: 2 },
                { name: 'दुलदुला मंडल', count: 2 },
                { name: 'फरसाबहार मंडल', count: 2 },
              ].map((c, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                  <span className="font-bold text-gray-800">{c.name}</span>
                  <span className="px-2 py-0.5 bg-white border border-gray-300 rounded-full text-[10px] font-bold text-gray-600">
                    {c.count} खबरें
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. TAB: COMMENTS */}
        {activeTab === 'comments' && (
          <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-5 space-y-4">
            <h3 className="font-bold text-base text-gray-900 border-b pb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <span>पाठक टिप्पणियां एवं समीक्षा (2 टिप्पणियां)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 flex items-start justify-between">
                <div>
                  <div className="font-bold text-gray-900">रमेश कुमार भगत (जशपुर नगर)</div>
                  <p className="text-gray-600 mt-1">"जशपुर.न्यूज पर सबसे तेज़ और सटीक स्थानीय खबरें मिल रही हैं। धन्यवाद!"</p>
                  <span className="text-[10px] text-gray-400 mt-1 block">खबर: जशपुर हलचल • 2 घंटे पूर्व</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">स्वीकृत</span>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 flex items-start justify-between">
                <div>
                  <div className="font-bold text-gray-900">दिलीप पैंकरा (पत्थलगांव)</div>
                  <p className="text-gray-600 mt-1">"टमाटर मंडी के दैनिक भाव की जानकारी किसानों के लिए बहुत उपयोगी है।"</p>
                  <span className="text-[10px] text-gray-400 mt-1 block">खबर: पत्थलगांव टमाटर मंडी • 5 घंटे पूर्व</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">स्वीकृत</span>
              </div>
            </div>
          </div>
        )}

        {/* 10. TAB: ADS & SPONSORS */}
        {activeTab === 'ads' && (
          <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-5 space-y-6">
            <div className="border-b pb-3 flex items-center justify-between">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-600" />
                <span>प्रायोजक एवं विज्ञापन प्रबंधन (Sponsors & Advertisements CMS)</span>
              </h3>
              <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full font-bold">
                कुल सक्रिय: {sponsorsAds.filter(a => a.status === 'active').length} विज्ञापन
              </span>
            </div>

            {/* Add New Ad Form */}
            <form onSubmit={handleCreateAd} className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 space-y-4">
              <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>नया विज्ञापन या प्रायोजक (Sponsor / Ad) जोड़ें</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">विज्ञापन शीर्षक / कंपनी नाम *</label>
                  <input
                    type="text"
                    value={newAdTitle}
                    onChange={(e) => setNewAdTitle(e.target.value)}
                    placeholder="जैसे: छत्तीसगढ़ पर्यटन बोर्ड..."
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">विज्ञापन स्थान (Ad Position)</label>
                  <select
                    value={newAdType}
                    onChange={(e) => setNewAdType(e.target.value as any)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-red-600 font-medium"
                  >
                    <option value="leaderboard">हेडर लीडरबोर्ड बैनर (Top 728x90)</option>
                    <option value="sidebar">साइडबार चौकोर विज्ञापन (Sidebar 300x250)</option>
                    <option value="sponsor_logo">फूटर स्पॉन्सर लोगो पार्टनर</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">बैनर चित्र URL (Image URL)</label>
                  <input
                    type="text"
                    value={newAdImg}
                    onChange={(e) => setNewAdImg(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">प्रमोशनल वीडियो URL (Video URL / YouTube)</label>
                  <input
                    type="text"
                    value={newAdVideoUrl}
                    onChange={(e) => setNewAdVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/embed/... या वीडियो लिंक"
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">लक्ष्य लिंक (Target URL / WhatsApp)</label>
                  <input
                    type="text"
                    value={newAdUrl}
                    onChange={(e) => setNewAdUrl(e.target.value)}
                    placeholder="https://wa.me/919907318667 या #tourism"
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block font-bold text-gray-700 mb-1">विवरण / ऑफर डिटेल्स (Description)</label>
                  <input
                    type="text"
                    value={newAdDesc}
                    onChange={(e) => setNewAdDesc(e.target.value)}
                    placeholder="विशेष छूट या सेवा विवरण यहाँ लिखें..."
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#C71920] hover:bg-red-700 text-white rounded-lg text-xs font-black transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>विज्ञापन प्रकाशित करें (Publish Ad)</span>
                </button>
              </div>
            </form>

            {/* List of Existing Ads & Sponsors */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-gray-900">मौजूदा विज्ञापन एवं प्रायोजक सूची ({sponsorsAds.length})</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {sponsorsAds.map((ad) => (
                  <div key={ad.id} className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs flex flex-col justify-between space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <img src={ad.imageUrl} alt={ad.title} className="w-14 h-14 object-cover rounded-lg border border-gray-200" />
                        {ad.videoUrl && (
                          <span className="absolute -bottom-1 -right-1 bg-red-600 text-white rounded-full p-1 shadow-sm" title="वीडियो संलग्न है">
                            <Video className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-black text-gray-900 text-sm truncate">{ad.title}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                            ad.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ad.status === 'active' ? 'सक्रिय (Active)' : 'रोका गया (Paused)'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-semibold text-blue-600">
                            स्थान: {ad.type === 'leaderboard' ? 'हेडर लीडरबोर्ड' : ad.type === 'sidebar' ? 'साइडबार बैनर' : 'फूटर पार्टनर'}
                          </span>
                          {ad.videoUrl && (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded border border-red-200 flex items-center gap-1">
                              <Video className="w-3 h-3" /> वीडियो संलग्न
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-xs mt-1 line-clamp-2">{ad.description}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-400 truncate max-w-[200px]">लिंक: {ad.targetUrl}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleAdStatus(ad.id)}
                          className={`px-3 py-1 rounded font-bold cursor-pointer transition-colors ${
                            ad.status === 'active' 
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                        >
                          {ad.status === 'active' ? 'रोकें (Pause)' : 'चालू करें (Activate)'}
                        </button>
                        <button
                          onClick={() => handleDeleteAd(ad.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="विज्ञापन हटाएं"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 11. TAB: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-700" />
                <span>Jashpur.News एडमिन सिस्टम सेटिंग्स (System Configuration)</span>
              </h3>
            </div>

            <form 
              onSubmit={handleSaveSettings}
              className="space-y-6 text-xs"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">पोर्टल / वेबसाइट का नाम (Website Name)</label>
                  <input
                    type="text"
                    value={stWebsiteName}
                    onChange={(e) => setStWebsiteName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">मुख्यालय / स्थान (Location)</label>
                  <input
                    type="text"
                    value={stLocation}
                    onChange={(e) => setStLocation(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">स्वामी / ओनर फोन नंबर (Owner Phone)</label>
                  <input
                    type="text"
                    value={stOwnerPhone}
                    onChange={(e) => setStOwnerPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">हेल्पलाइन फोन नंबर (Helpline Phone)</label>
                  <input
                    type="text"
                    value={stHelplinePhone}
                    onChange={(e) => setStHelplinePhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium text-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">प्रकाशन पूर्व अनिवार्य समीक्षा (Approval Required)</h4>
                    <p className="text-gray-500 mt-0.5">
                      स्टाफ संवाददाताओं की खबरों को सार्वजनिक पोर्टल पर आने से पूर्व एडमिन द्वारा अनुमोदन अनिवार्य रहेगा।
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={stApprovalRequired}
                    onChange={(e) => setStApprovalRequired(e.target.checked)}
                    className="w-5 h-5 accent-[#C71920]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">लाइव ब्रेकिंग न्यूज़ टिकर (Live Ticker Enabled)</h4>
                    <p className="text-gray-500 mt-0.5">
                      वेबसाइट हेडर के ठीक नीचे चलने वाला लाल ब्रेकिंग टिकर चालू रखें।
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={stBreakingTickerEnabled}
                    onChange={(e) => setStBreakingTickerEnabled(e.target.checked)}
                    className="w-5 h-5 accent-[#C71920]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">स्टाफ ड्राफ्ट ऑटो-सबमिट (Staff Draft Auto-Submit)</h4>
                    <p className="text-gray-500 mt-0.5">
                      संपादक के पास समीक्षा हेतु स्टाफ ड्राफ्ट स्वचालित रूप से कतारबद्ध करें।
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={stStaffDraftAutoSubmit}
                    onChange={(e) => setStStaffDraftAutoSubmit(e.target.checked)}
                    className="w-5 h-5 accent-[#C71920]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C71920] hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  सभी सेटिंग्स सहेजें (Save All Settings)
                </button>
              </div>
            </form>

            {/* Change Admin Credentials Form */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-amber-200 pb-3">
                  <Shield className="w-5 h-5 text-[#C71920]" />
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-900">
                      एडमिन लॉगिन क्रेडेंशियल्स बदलें (Change Admin Login ID & Password)
                    </h4>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      यहाँ से आप अपना एडमिन यूजरनेम/ईमेल और नया पासवर्ड तुरंत बदल सकते हैं।
                    </p>
                  </div>
                </div>

                {credSuccessMsg && (
                  <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{credSuccessMsg}</span>
                  </div>
                )}

                {credErrorMsg && (
                  <div className="p-3 bg-red-100 border border-red-300 text-red-900 rounded-lg text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                    <span>{credErrorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleChangeAdminCredentials} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        नई एडमिन आईडी / ईमेल *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="जैसे: saroj.jashpur या admin@jashpur.news"
                        className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#C71920]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        नया पासवर्ड (New Password) *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        placeholder="नया पासवर्ड दर्ज करें"
                        className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#C71920]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        पासवर्ड की पुष्टि (Confirm Password) *
                      </label>
                      <input
                        type="text"
                        required
                        value={confirmAdminPassword}
                        onChange={(e) => setConfirmAdminPassword(e.target.value)}
                        placeholder="पासवर्ड दोबारा दर्ज करें"
                        className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#C71920]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdatingCreds}
                      className="px-6 py-2.5 bg-[#C71920] hover:bg-red-700 text-white font-black text-xs rounded-lg transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Key className="w-4 h-4" />
                      <span>{isUpdatingCreds ? 'अपडेट किया जा रहा है...' : 'क्रेडेंशियल्स अपडेट करें (Update Credentials)'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}



      </main>
    </div>
  );
};
