import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  ShieldAlert, 
  Settings, 
  Flame, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Edit3, 
  Plus, 
  Search, 
  Lock, 
  RotateCcw, 
  Eye, 
  Activity, 
  AlertTriangle,
  UserPlus,
  ShieldCheck,
  Check,
  Phone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNews } from '../../context/NewsContext';
import { User, AuditLog, WebsiteSettings } from '../../types/auth';
import { NewsArticle, NewsCategory } from '../../types/news';

export const OwnerPanel: React.FC = () => {
  const { currentUser, token, logout, verifyOwnerPassword, setCurrentDashboardView } = useAuth();
  const { articles, fetchArticles, reviewArticle, deleteArticle, navigateToArticle } = useNews();

  const [activeTab, setActiveTab] = useState<'articles' | 'users' | 'audit' | 'settings'>('articles');
  const [usersList, setUsersList] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [articleSearch, setArticleSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // New User Form State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'staff'>('staff');
  const [userActionMsg, setUserActionMsg] = useState<string | null>(null);

  // Re-authentication Modal for sensitive actions
  const [reAuthOpen, setReAuthOpen] = useState(false);
  const [reAuthPassword, setReAuthPassword] = useState('');
  const [reAuthAction, setReAuthAction] = useState<(() => void) | null>(null);
  const [reAuthError, setReAuthError] = useState<string | null>(null);

  // Fetch Users
  const fetchUsers = async () => {
    if (!token) return;
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch {
      //
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch Audit Logs
  const fetchAuditLogs = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/audit-logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setAuditLogs(data);
      }
    } catch {
      //
    }
  };

  // Fetch Settings
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

  useEffect(() => {
    fetchUsers();
    fetchAuditLogs();
    fetchSettings();
  }, [token]);

  // Execute sensitive action with Owner password protection
  const triggerProtectedAction = (action: () => void) => {
    setReAuthAction(() => action);
    setReAuthPassword('');
    setReAuthError(null);
    setReAuthOpen(true);
  };

  const handleConfirmReAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const verified = await verifyOwnerPassword(reAuthPassword);
    if (!verified) {
      setReAuthError('पासवर्ड सत्यापन असफल रहा।');
      return;
    }
    setReAuthOpen(false);
    if (reAuthAction) {
      reAuthAction();
      setReAuthAction(null);
    }
  };

  // Handle Add User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole
        })
      });

      if (res.ok) {
        setUserActionMsg(`उपयोगकर्ता ${newUserName} सफलतापूर्वक बनाया गया!`);
        setShowAddUserModal(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
        fetchUsers();
        fetchAuditLogs();
        setTimeout(() => setUserActionMsg(null), 3500);
      } else {
        const err = await res.json();
        alert(err.error || 'उपयोगकर्ता बनाने में विफलता।');
      }
    } catch {
      alert('सर्वर त्रुटि।');
    }
  };

  // Handle User Status toggle (Active / Suspended)
  const handleToggleUserStatus = (u: User) => {
    triggerProtectedAction(async () => {
      const newStatus = u.status === 'active' ? 'suspended' : 'active';
      try {
        const res = await fetch(`/api/users/${u.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        });
        if (res.ok) {
          fetchUsers();
          fetchAuditLogs();
        }
      } catch {
        //
      }
    });
  };

  // Handle Delete User
  const handleDeleteUser = (u: User) => {
    if (u.role === 'owner') {
      alert('स्वामी (Owner) का खाता नहीं हटाया जा सकता।');
      return;
    }
    triggerProtectedAction(async () => {
      try {
        const res = await fetch(`/api/users/${u.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          fetchUsers();
          fetchAuditLogs();
        }
      } catch {
        //
      }
    });
  };

  // Filter articles
  const filteredArticles = articles.filter(a => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesSearch = !articleSearch || a.title.toLowerCase().includes(articleSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate Metrics
  const totalArticles = articles.length;
  const publishedCount = articles.filter(a => a.status === 'published').length;
  const pendingCount = articles.filter(a => a.status === 'pending_review').length;
  const draftCount = articles.filter(a => a.status === 'draft').length;

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Top Banner & Control Bar */}
      <div className="bg-[#182230] text-white border-b-4 border-[#C71920]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C71920] rounded-lg flex items-center justify-center font-bold text-white shadow-md">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  Jashpur.News सुपर-ओनर कंट्रोल पैनल
                </h1>
                <span className="text-[10px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-gray-300">
                वेबसाइट का सर्वाधिकार नियंत्रण • लॉग-इन: {currentUser?.name} ({currentUser?.email}) • ओनर संपर्क: +91 99073 18667
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setCurrentDashboardView('public')}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>पब्लिक पोर्टल देखें</span>
            </button>
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              लॉग आउट
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar gap-1 border-t border-gray-700/60 pt-2">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'articles' ? 'bg-gray-100 text-[#182230]' : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <FileText className="w-4 h-4 text-[#C71920]" />
            <span>समाचार प्रबंधन ({totalArticles})</span>
            {pendingCount > 0 && (
              <span className="bg-[#C71920] text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                {pendingCount} लंबित
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'users' ? 'bg-gray-100 text-[#182230]' : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <Users className="w-4 h-4 text-blue-400" />
            <span>स्टाफ व एडमिन खाते ({usersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'audit' ? 'bg-gray-100 text-[#182230]' : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>सुरक्षा ऑडिट लॉग्स</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings' ? 'bg-gray-100 text-[#182230]' : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span>सिस्टम सेटिंग्स</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Top 4 Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="text-gray-500 text-xs font-bold uppercase">कुल समाचार</div>
            <div className="text-2xl font-black text-[#182230] mt-1">{totalArticles}</div>
            <div className="text-[11px] text-gray-400 mt-1">प्रकाशित व ड्राफ्ट सहित</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs">
            <div className="text-emerald-700 text-xs font-bold uppercase">लाइव प्रकाशित</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{publishedCount}</div>
            <div className="text-[11px] text-emerald-600 mt-1">पोर्टल पर सक्रिय</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
            <div className="text-amber-800 text-xs font-bold uppercase">स्वीकृति हेतु लंबित</div>
            <div className="text-2xl font-black text-amber-700 mt-1">{pendingCount}</div>
            <div className="text-[11px] text-amber-600 mt-1">स्टाफ सबमिशन</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-2xs">
            <div className="text-blue-700 text-xs font-bold uppercase">सक्रिय स्टाफ</div>
            <div className="text-2xl font-black text-blue-700 mt-1">{usersList.length}</div>
            <div className="text-[11px] text-blue-600 mt-1">संपादकीय दल</div>
          </div>
        </div>

        {userActionMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{userActionMsg}</span>
          </div>
        )}

        {/* TAB 1: ARTICLES MANAGEMENT */}
        {activeTab === 'articles' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
            {/* Filter Toolbar */}
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    value={articleSearch}
                    onChange={(e) => setArticleSearch(e.target.value)}
                    placeholder="शीर्षक द्वारा खोजें..."
                    className="w-full bg-white border border-gray-300 rounded-lg py-1.5 pl-8 pr-3 text-xs text-gray-900 focus:outline-none focus:border-[#C71920]"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg py-1.5 px-3 text-xs text-gray-900 focus:outline-none"
                >
                  <option value="all">सभी स्थितियां</option>
                  <option value="published">केवल प्रकाशित (Published)</option>
                  <option value="pending_review">समीक्षाधीन (Pending Review)</option>
                  <option value="draft">ड्राफ्ट (Draft)</option>
                  <option value="rejected">अस्वीकृत (Rejected)</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentDashboardView('admin')}
                  className="px-3.5 py-1.5 bg-[#C71920] hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ नया समाचार अपलोड करें (Upload News)</span>
                </button>
                <div className="text-xs text-gray-500 font-semibold hidden sm:inline">
                  दिखाए जा रहे: {filteredArticles.length}
                </div>
              </div>
            </div>

            {/* Articles Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 text-gray-700 uppercase text-[10px] tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="p-3.5">समाचार शीर्षक व श्रेणी</th>
                    <th className="p-3.5">लेखक / संवाददाता</th>
                    <th className="p-3.5">स्थिति</th>
                    <th className="p-3.5">ब्रेकिंग टिकर</th>
                    <th className="p-3.5">तारीख</th>
                    <th className="p-3.5 text-right">कार्य (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredArticles.map((art) => (
                    <tr key={art.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3.5 max-w-xs">
                        <div className="font-bold text-gray-900 line-clamp-1">{art.title}</div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                          <span className="text-[#C71920] font-semibold">{art.category}</span>
                          {art.subLocation && (
                            <>
                              <span>·</span>
                              <span>{art.subLocation}</span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-medium text-gray-800">{art.authorName || art.author?.name}</div>
                        <div className="text-[10px] text-gray-400">{art.authorRole || 'संवाददाता'}</div>
                      </td>

                      <td className="p-3.5">
                        {art.status === 'published' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            प्रकाशित (Live)
                          </span>
                        )}
                        {art.status === 'pending_review' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                            समीक्षाधीन (Review)
                          </span>
                        )}
                        {art.status === 'draft' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700">
                            ड्राफ्ट (Draft)
                          </span>
                        )}
                        {art.status === 'rejected' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700">
                            अस्वीकृत (Rejected)
                          </span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <button
                          onClick={() => {
                            reviewArticle(art.id, 'approve_and_publish');
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                            art.isBreaking 
                              ? 'bg-red-600 text-white shadow-2xs' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {art.isBreaking ? '🔴 ब्रेकिंग ऑन' : 'ऑफ'}
                        </button>
                      </td>

                      <td className="p-3.5 text-gray-500 text-[11px]">
                        {art.publishedAt || art.createdAt?.split('T')[0] || 'आज'}
                      </td>

                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {art.status === 'pending_review' && (
                          <button
                            onClick={() => reviewArticle(art.id, 'approve_and_publish')}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold"
                            title="स्वीकृत करें और लाइव करें"
                          >
                            स्वीकृत करें
                          </button>
                        )}

                        {art.status === 'published' && (
                          <button
                            onClick={() => reviewArticle(art.id, 'unpublish')}
                            className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[11px] font-bold"
                            title="प्रकाशन वापस लें"
                          >
                            अनपब्लिश
                          </button>
                        )}

                        <button
                          onClick={() => {
                            triggerProtectedAction(() => deleteArticle(art.id));
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="समाचार हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: USERS & ROLES MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xs p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
              <div>
                <h3 className="text-lg font-bold text-[#182230]">
                  संपादकीय टीम एवं खाता प्रबंधन
                </h3>
                <p className="text-xs text-gray-500">
                  एडमिन और स्टाफ संवाददाताओं के खाते जोड़ें, सक्रिय अथवा निलंबित करें।
                </p>
              </div>

              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-3.5 py-2 bg-[#C71920] hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>नया खाता बनाएं</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 text-gray-700 uppercase text-[10px] tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="p-3">नाम व विवरण</th>
                    <th className="p-3">ईमेल</th>
                    <th className="p-3">भूमिका (Role)</th>
                    <th className="p-3">खाता स्थिति</th>
                    <th className="p-3">अंतिम लॉगिन</th>
                    <th className="p-3 text-right">कार्य</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="p-3 flex items-center gap-2.5">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border" />
                        <span className="font-bold text-gray-900">{u.name}</span>
                      </td>

                      <td className="p-3 text-gray-600">{u.email}</td>

                      <td className="p-3">
                        {u.role === 'owner' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-[#C71920]">
                            Owner (स्वामी)
                          </span>
                        ) : u.role === 'admin' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                            Admin (संपादक)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Staff (संवाददाता)
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        {u.status === 'active' ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> सक्रिय
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> निलंबित
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-gray-400 text-[11px]">{u.lastLogin?.slice(0, 10) || 'आज'}</td>

                      <td className="p-3 text-right space-x-2">
                        {u.role !== 'owner' && (
                          <>
                            <button
                              onClick={() => handleToggleUserStatus(u)}
                              className={`px-2 py-1 rounded text-[10px] font-bold ${
                                u.status === 'active' 
                                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                                  : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              }`}
                            >
                              {u.status === 'active' ? 'निलंबित करें' : 'सक्रिय करें'}
                            </button>

                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="हटाएं"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-lg font-bold text-[#182230]">
                सुरक्षा एवं प्रशासनिक ऑडिट लॉग्स (Audit Trail)
              </h3>
              <button
                onClick={fetchAuditLogs}
                className="text-xs text-[#C71920] font-bold hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>रिफ्रेश</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto divide-y divide-gray-100">
              {auditLogs.map((log) => (
                <div key={log.id} className="pt-2 text-xs flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{log.userName}</span>
                      <span className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded font-mono">
                        {log.action}
                      </span>
                      <span className="text-[11px] text-gray-400">{log.timestamp?.slice(0, 19).replace('T', ' ')}</span>
                    </div>
                    <p className="text-gray-600 text-xs mt-0.5">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono shrink-0">{log.ip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xs p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-[#182230]">
                Jashpur.News व्यापक सिस्टम सेटिंग्स (Advanced System Configuration)
              </h3>
            </div>

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const fd = new FormData(form);
                const payload = {
                  websiteName: fd.get('websiteName'),
                  location: fd.get('location'),
                  ownerPhone: fd.get('ownerPhone'),
                  helplinePhone: fd.get('helplinePhone'),
                  approvalRequired: fd.get('approvalRequired') === 'on',
                  breakingTickerEnabled: fd.get('breakingTickerEnabled') === 'on',
                  allowStaffDraftAutoSubmit: fd.get('allowStaffDraftAutoSubmit') === 'on',
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
                  if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                    alert('सेटिंग्स सफलतापूर्वक सहेज ली गईं!');
                  } else {
                    const err = await res.json();
                    alert(err.error || 'सेटिंग्स सहेजने में विफल।');
                  }
                } catch {
                  alert('सर्वर त्रुटि।');
                }
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">पोर्टल / वेबसाइट का नाम (Website Name)</label>
                  <input
                    type="text"
                    name="websiteName"
                    defaultValue={settings?.websiteName || 'Jashpur.News'}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">मुख्यालय / स्थान (Location)</label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={settings?.location || 'Jashpur, Chhattisgarh, India'}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">स्वामी / ओनर फोन नंबर (Owner Phone)</label>
                  <input
                    type="text"
                    name="ownerPhone"
                    defaultValue={settings?.ownerPhone || '99073 18667'}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">हेल्पलाइन फोन नंबर (Helpline Phone)</label>
                  <input
                    type="text"
                    name="helplinePhone"
                    defaultValue={settings?.helplinePhone || '99073 18667'}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium text-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">प्रकाशन पूर्व अनिवार्य समीक्षा (Approval Required)</h4>
                    <p className="text-xs text-gray-500">
                      स्टाफ संवाददाताओं की खबरों को सार्वजनिक पोर्टल पर आने से पूर्व एडमिन/ओनर द्वारा अनुमोदन अनिवार्य रहेगा।
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="approvalRequired"
                    defaultChecked={settings?.approvalRequired ?? true}
                    className="w-5 h-5 accent-[#C71920]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">लाइव ब्रेकिंग न्यूज़ टिकर (Live Ticker Enabled)</h4>
                    <p className="text-xs text-gray-500">
                      वेबसाइट हेडर के ठीक नीचे चलने वाला लाल ब्रेकिंग टिकर चालू रखें।
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="breakingTickerEnabled"
                    defaultChecked={settings?.breakingTickerEnabled ?? true}
                    className="w-5 h-5 accent-[#C71920]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">स्टाफ ड्राफ्ट ऑटो-सबमिट (Staff Draft Auto-Submit)</h4>
                    <p className="text-xs text-gray-500">
                      संपादक के पास समीक्षा हेतु स्टाफ ड्राफ्ट स्वचालित रूप से कतारबद्ध करें।
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="allowStaffDraftAutoSubmit"
                    defaultChecked={settings?.allowStaffDraftAutoSubmit ?? false}
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
          </div>
        )}
      </div>

      {/* CREATE USER MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-lg text-[#182230]">नया संपादकीय खाता जोड़ें</h3>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">पूरा नाम</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="उदा: रमेश कुमार भगत"
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">आधिकारिक ईमेल</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="reporter@jashpur.news"
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">पासवर्ड</label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="सुरक्षित पासवर्ड"
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">भूमिका (Role)</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full border p-2 rounded"
                >
                  <option value="staff">Staff (संवाददाता / रिपोर्टर)</option>
                  <option value="admin">Admin (उप-संपादक / ब्यूरो प्रमुख)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#C71920] text-white py-2 rounded font-bold hover:bg-red-700"
                >
                  खाता बनाएं
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-bold"
                >
                  रद्द करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RE-AUTHENTICATION MODAL FOR CRITICAL ACTIONS */}
      {reAuthOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 text-center shadow-2xl space-y-3">
            <Lock className="w-8 h-8 text-[#C71920] mx-auto" />
            <h3 className="font-extrabold text-base text-gray-900">सुरक्षा सत्यापन (Re-Authentication)</h3>
            <p className="text-xs text-gray-600">
              इस संवेदनशील प्रशासनिक कार्य को करने के लिए कृपया स्वामी (Owner) पासवर्ड दर्ज करें।
            </p>
            {reAuthError && (
              <p className="text-xs text-red-600 font-bold">{reAuthError}</p>
            )}
            <form onSubmit={handleConfirmReAuth} className="space-y-3">
              <input
                type="password"
                required
                autoFocus
                value={reAuthPassword}
                onChange={(e) => setReAuthPassword(e.target.value)}
                placeholder="पासवर्ड दर्ज करें"
                className="w-full border p-2 rounded text-xs text-center"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#C71920] text-white py-2 rounded text-xs font-bold hover:bg-red-700"
                >
                  सत्यापित करें
                </button>
                <button
                  type="button"
                  onClick={() => setReAuthOpen(false)}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded text-xs font-bold"
                >
                  रद्द करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
