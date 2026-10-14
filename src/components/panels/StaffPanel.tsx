import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNews } from '../../context/NewsContext';
import { FileText, Plus, LogOut, CheckCircle } from 'lucide-react';

export const StaffPanel: React.FC = () => {
  const { currentUser, logout, setCurrentDashboardView } = useAuth();
  const { createArticle } = useNews();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState<'जशपुर' | 'छत्तीसगढ़' | 'राजनीति' | 'अपराध' | 'शिक्षा' | 'खेल' | 'मनोरंजन' | 'देश-दुनिया' | 'व्यापार'>('जशपुर');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary || !content) return;
    setSubmitting(true);
    setSuccessMsg(null);
    try {
      await createArticle({
        title,
        summary,
        category,
        content: content.split('\n').filter(Boolean),
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
        submitForReview: true
      });
      setSuccessMsg('समाचार सफलतापूर्वक समीक्षा के लिए भेज दिया गया है!');
      setTitle('');
      setSummary('');
      setContent('');
      setImageUrl('');
    } catch {
      //
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="bg-[#182230] text-white shadow-md border-b-4 border-[#C71920]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C71920] flex items-center justify-center font-bold text-white text-lg">
              {currentUser?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <h1 className="font-extrabold text-lg">रिपोर्टर स्टाफ पैनल (Staff Portal)</h1>
              <p className="text-xs text-gray-300">{currentUser?.name} ({currentUser?.email})</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentDashboardView('portal')}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              वेबसाइट देखें (View Site)
            </button>
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-[#C71920] hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>लॉग आउट</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-1">समाचार सबमिट करें (Submit News)</h2>
            <p className="text-sm text-gray-600">
              आपके द्वारा सबमिट किए गए समाचार एडमिन/संपादक की समीक्षा के बाद प्रकाशित किए जाएंगे।
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-medium">
            स्थिति: <span className="font-bold">समीक्षा के लिए लंबित (Pending Review)</span>
          </div>
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Submit Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#C71920]" />
            <span>नई खबर का विवरण भरें</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">समाचार शीर्षक (Title) *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="यहाँ मुख्य शीर्षक लिखें..."
                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-[#C71920]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">श्रेणी (Category) *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-[#C71920]"
              >
                <option value="जशपुर">जशपुर</option>
                <option value="छत्तीसगढ़">छत्तीसगढ़</option>
                <option value="राजनीति">राजनीति</option>
                <option value="अपराध">अपराध</option>
                <option value="शिक्षा">शिक्षा</option>
                <option value="खेल">खेल</option>
                <option value="मनोरंजन">मनोरंजन</option>
                <option value="देश-दुनिया">देश-दुनिया</option>
                <option value="व्यापार">व्यापार</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">संक्षिप्त सारांश (Summary) *</label>
            <textarea
              required
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="खबर का संक्षिप्त परिचय (1-2 वाक्य)..."
              className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-[#C71920]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">विस्तृत समाचार (Content Paragraphs) *</label>
            <textarea
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="प्रत्येक पैराग्राफ नई लाइन में लिखें..."
              className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-[#C71920]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">फोटो URL (Image URL)</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... (वैकल्पिक)"
              className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-[#C71920]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-6 bg-[#C71920] hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            <span>{submitting ? 'सबमिट हो रहा है...' : 'समीक्षा के लिए सबमिट करें (Submit for Review)'}</span>
          </button>
        </form>
      </main>
    </div>
  );
};
