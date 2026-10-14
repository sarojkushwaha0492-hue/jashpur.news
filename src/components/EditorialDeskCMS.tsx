import React, { useState } from 'react';
import { 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Image as ImageIcon, 
  Upload, 
  Check, 
  RotateCcw, 
  Download, 
  Flame, 
  Star, 
  Eye, 
  AlertCircle
} from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { NewsArticle, NewsCategory, Author } from '../types/news';
import { defaultAuthors } from '../data/initialNews';

const categories: NewsCategory[] = [
  'जशपुर',
  'छत्तीसगढ़',
  'राजनीति',
  'अपराध',
  'शिक्षा',
  'खेल',
  'व्यापार',
  'मनोरंजन',
  'देश-दुनिया'
];

const sampleImagePresets = [
  { label: 'चाय बागान / कृषि', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80' },
  { label: 'टमाटर / सब्जी मंडी', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1000&q=80' },
  { label: 'हॉकी / खेल मैदान', url: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1000&q=80' },
  { label: 'प्रशासन / प्रेस वार्ता', url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1000&q=80' },
  { label: 'अस्पताल / स्वास्थ्य', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80' },
  { label: 'प्राकृतिक जलप्रपात', url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80' }
];

export const EditorialDeskCMS: React.FC = () => {
  const { 
    articles, 
    addArticle, 
    updateArticle, 
    deleteArticle, 
    resetToDefaultArticles, 
    navigateToHome,
    navigateToArticle
  } = useNews();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NewsCategory>('जशपुर');
  const [subLocation, setSubLocation] = useState('जशपुर नगर');
  const [summary, setSummary] = useState('');
  const [contentString, setContentString] = useState('');
  const [keyPointsString, setKeyPointsString] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [authorKey, setAuthorKey] = useState<string>('arun');
  const [customAuthorName, setCustomAuthorName] = useState('');
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);

  // Handle local image file upload -> Base64
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('जशपुर');
    setSubLocation('जशपुर नगर');
    setSummary('');
    setContentString('');
    setKeyPointsString('');
    setImageUrl('');
    setImageCaption('');
    setAuthorKey('arun');
    setCustomAuthorName('');
    setIsBreaking(false);
    setIsFeatured(false);
    setIsTrending(false);
  };

  const handleEditClick = (article: NewsArticle) => {
    setEditingId(article.id);
    setTitle(article.title);
    setCategory(article.category);
    setSubLocation(article.subLocation || 'जशपुर नगर');
    setSummary(article.summary);
    setContentString(article.content.join('\n\n'));
    setKeyPointsString(article.keyPoints?.join('\n') || '');
    setImageUrl(article.imageUrl);
    setImageCaption(article.imageCaption || '');
    setIsBreaking(!!article.isBreaking);
    setIsFeatured(!!article.isFeatured);
    setIsTrending(!!article.isTrending);

    // match author or set custom
    const match = Object.entries(defaultAuthors).find(([, a]) => a.name === article.author.name);
    if (match) {
      setAuthorKey(match[0]);
      setCustomAuthorName('');
    } else {
      setAuthorKey('custom');
      setCustomAuthorName(article.author.name);
    }

    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      alert('कृपया शीर्षक और संक्षिप्त विवरण अवश्य भरें।');
      return;
    }

    const paragraphs = contentString
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const keyPoints = keyPointsString
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const author: Author = authorKey === 'custom' && customAuthorName
      ? {
          id: 'custom-' + Date.now(),
          name: customAuthorName,
          role: 'विशेष संवाददाता',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          location: subLocation
        }
      : defaultAuthors[authorKey] || defaultAuthors[2];

    const finalImage = imageUrl.trim() || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1000&q=80';

    if (editingId) {
      const existing = articles.find(a => a.id === editingId);
      if (existing) {
        updateArticle(editingId, {
          title,
          category,
          subLocation,
          summary,
          content: paragraphs.length > 0 ? paragraphs : [summary],
          keyPoints,
          imageUrl: finalImage,
          imageCaption: imageCaption || title,
          author,
          isBreaking,
          isFeatured,
          isTrending,
        });
        setSuccessMessage('समाचार सफलतापूर्वक अपडेट किया गया!');
      }
    } else {
      const newId = addArticle({
        title,
        category,
        subLocation,
        summary,
        content: paragraphs.length > 0 ? paragraphs : [summary],
        keyPoints,
        imageUrl: finalImage,
        imageCaption: imageCaption || title,
        author,
        isBreaking,
        isFeatured,
        isTrending,
      });
      setSuccessMessage('नया समाचार सफलतापूर्वक प्रकाशित किया गया!');
    }

    resetForm();
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(articles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `jashpur_news_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-gray-200">
        <div>
          <button
            onClick={navigateToHome}
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-[#C71920] mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>पोर्टल पर वापस जाएं</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#C71920] rounded-xs"></span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#182230] font-serif-hindi">
              Jashpur News संपादकीय डेस्क (News CMS)
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            समाचार जोड़ें, शीर्षक व विवरण संपादित करें, फोटो अपलोड करें और श्रेणी आवंटित करें।
          </p>
        </div>

        {/* Global CMS Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded flex items-center gap-1.5 border border-gray-300 transition-colors"
            title="सभी खबरों का बैकअप डाउनलोड करें"
          >
            <Download className="w-3.5 h-3.5" />
            <span>बैकअप (JSON)</span>
          </button>

          <button
            onClick={() => {
              if (confirm('क्या आप सभी खबरों को डिफ़ॉल्ट मूल स्थिति में रीसेट करना चाहते हैं?')) {
                resetToDefaultArticles();
              }
            }}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#C71920] text-xs font-semibold rounded flex items-center gap-1.5 border border-red-200 transition-colors"
            title="मूल समाचार रीसेट करें"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>रीसेट डेटा</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-2xs">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('create')}
          className={`py-2.5 px-4 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'create'
              ? 'border-[#C71920] text-[#C71920]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{editingId ? 'समाचार संपादन' : 'नया समाचार लिखें'}</span>
        </button>

        <button
          onClick={() => setActiveTab('list')}
          className={`py-2.5 px-4 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'list'
              ? 'border-[#C71920] text-[#C71920]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <span>प्रकाशित समाचार सूची ({articles.length})</span>
        </button>
      </div>

      {/* TAB 1: Editor Form */}
      {activeTab === 'create' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {editingId && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-900 flex items-center justify-between">
                <span>आप मौजूदा समाचार (ID: {editingId}) संपादित कर रहे हैं।</span>
                <button
                  type="button"
                  onClick={resetForm}
                  className="font-bold underline text-amber-800"
                >
                  संपादन रद्द करें (नया बनाएं)
                </button>
              </div>
            )}

            {/* Headline */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                समाचार शीर्षक / Headline <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="उदा: पत्थलगांव टमाटर मंडी में इस सप्ताह रिकॉर्ड आवक दर्ज..."
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm sm:text-base font-semibold text-gray-900 focus:outline-none focus:border-[#C71920] focus:ring-1 focus:ring-[#C71920]"
              />
            </div>

            {/* Category & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                  श्रेणी / Category <span className="text-red-600">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as NewsCategory)}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C71920]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                  स्थान / ब्लॉक (Location Tag)
                </label>
                <input
                  type="text"
                  value={subLocation}
                  onChange={(e) => setSubLocation(e.target.value)}
                  placeholder="उदा: जशपुर नगर, पत्थलगांव, कुनकुरी, बगीचा, सन्ना"
                  className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C71920]"
                />
              </div>
            </div>

            {/* Excerpt / Summary */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                संक्षिप्त विवरण / Lead Excerpt <span className="text-red-600">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="2-3 वाक्यों में खबर का सार जो कार्ड्स और सोशल शेयरिंग पर दिखेगा..."
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#C71920]"
              />
            </div>

            {/* Full Body Content */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                विस्तृत समाचार सामग्री (Paragraphs)
              </label>
              <p className="text-[11px] text-gray-500 mb-1">
                अलग-अलग पैराग्राफ बनाने के लिए दो बार Enter (खाली लाइन) दबाएं।
              </p>
              <textarea
                rows={6}
                value={contentString}
                onChange={(e) => setContentString(e.target.value)}
                placeholder="खबर का विस्तृत विवरण यहां लिखें..."
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#C71920]"
              />
            </div>

            {/* Key Bullet Highlights */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                मुख्य बिंदु / Highlights (प्रति पंक्ति 1 बिंदु)
              </label>
              <textarea
                rows={3}
                value={keyPointsString}
                onChange={(e) => setKeyPointsString(e.target.value)}
                placeholder="सोगड़ा चाय को मिला ऑर्गेनिक सर्टिफिकेशन&#10;800 किसान परिवारों को रोजगार&#10;पर्यटन विभाग ने तैयार किया नया पैकेज"
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#C71920]"
              />
            </div>

            {/* Featured Image & Upload */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide">
                प्रमुख छायाचित्र / Featured Image
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="इमेज वेब URL पेस्ट करें (उदा: https://...)"
                  className="flex-1 w-full bg-white border border-gray-300 rounded-md p-2 text-xs text-gray-900"
                />

                <span className="text-xs text-gray-500">या</span>

                <label className="cursor-pointer bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-3 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#C71920]" />
                  <span>डिवाइस से फोटो चुनें</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Sample Presets */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] text-gray-500">त्वरित फोटो:</span>
                {sampleImagePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className="text-[10px] bg-white border border-gray-200 hover:border-[#C71920] px-2 py-0.5 rounded text-gray-700 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Image Preview & Caption */}
              {imageUrl && (
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-16 h-12 object-cover rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    placeholder="फोटो कैप्शन (उदा: जशपुर सोगड़ा में बागान)"
                    className="flex-1 bg-white border border-gray-300 rounded-md p-2 text-xs text-gray-900"
                  />
                </div>
              )}
            </div>

            {/* Author Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                  संवाददाता / लेखक (Author)
                </label>
                <select
                  value={authorKey}
                  onChange={(e) => setAuthorKey(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C71920]"
                >
                  <option value="arun">अरुण कुमार भगत (जिला संवाददाता, जशपुर)</option>
                  <option value="sushil">सुशील टोप्पो (विशेष संवाददाता, कुनकुरी)</option>
                  <option value="mukesh">मुकेश यादव (कृषि प्रतिनिधि, पत्थलगांव)</option>
                  <option value="priya">प्रिया शर्मा (राजनीतिक विश्लेषक, रायपुर)</option>
                  <option value="custom">अन्य संवाददाता का नाम दर्ज करें</option>
                </select>
              </div>

              {authorKey === 'custom' && (
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                    संवाददाता का पूरा नाम
                  </label>
                  <input
                    type="text"
                    value={customAuthorName}
                    onChange={(e) => setCustomAuthorName(e.target.value)}
                    placeholder="उदा: रमेश कुमार चौहान"
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900"
                  />
                </div>
              )}
            </div>

            {/* Visibility & Badges Toggles */}
            <div className="flex items-center gap-6 flex-wrap pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="rounded text-[#C71920] focus:ring-[#C71920] w-4 h-4"
                />
                <span className="flex items-center gap-1 text-red-600">
                  <Flame className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                  ब्रेकिंग टिकर में जोड़ें
                </span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-[#C71920] focus:ring-[#C71920] w-4 h-4"
                />
                <span className="flex items-center gap-1 text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  होमपेज मुख्य खबर (Lead Story)
                </span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="rounded text-[#C71920] focus:ring-[#C71920] w-4 h-4"
                />
                <span className="text-emerald-700">ट्रेंडिंग में चिह्नित करें</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                फॉर्म साफ़ करें
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#C71920] hover:bg-red-700 text-white rounded text-sm font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingId ? 'संशोधन सुरक्षित करें' : 'समाचार अभी प्रकाशित करें'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: News Articles List & Manager */}
      {activeTab === 'list' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">
              कुल सक्रिय समाचार: {articles.length}
            </span>
            <span className="text-xs text-gray-500">
              सभी बदलाव तुरंत पोर्टल पर लाइव होते हैं
            </span>
          </div>

          <div className="divide-y divide-gray-200">
            {articles.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors">
                <div className="flex gap-3.5 items-start flex-1 min-w-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-14 sm:w-20 sm:h-16 object-cover rounded shrink-0 bg-gray-100"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-1 flex-wrap">
                      <span className="font-bold text-[#C71920]">{item.category}</span>
                      {item.subLocation && (
                        <>
                          <span>·</span>
                          <span className="text-gray-700 font-medium">{item.subLocation}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>{item.publishedAt}</span>
                      {item.isBreaking && (
                        <span className="px-1.5 py-0.2 bg-red-100 text-red-700 font-bold rounded-2xs text-[10px]">
                          ब्रेकिंग
                        </span>
                      )}
                      {item.isFeatured && (
                        <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 font-bold rounded-2xs text-[10px]">
                          लीड
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-gray-900 leading-snug truncate font-serif-hindi">
                      {item.title}
                    </h4>

                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {item.summary}
                    </p>
                  </div>
                </div>

                {/* Operations */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => navigateToArticle(item.id)}
                    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded"
                    title="खबर देखें"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleEditClick(item)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                    title="संपादित करें"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`क्या आप "${item.title}" को हटाना चाहते हैं?`)) {
                        deleteArticle(item.id);
                      }
                    }}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                    title="हटाएं"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
