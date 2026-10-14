import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  FileText, 
  Send, 
  Check, 
  Globe, 
  Scale, 
  FileCode,
  BookOpen,
  Clock,
  ExternalLink,
  Share2
} from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { StaticPageType } from '../context/NewsContext';

export const StaticPages: React.FC = () => {
  const { staticPageType, navigateToHome, navigateToStaticPage, articles } = useNews();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setFeedbackName('');
    setFeedbackEmail('');
    setFeedbackMessage('');
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  const page = staticPageType || 'about';

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      <button
        onClick={navigateToHome}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#C71920] mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>मुख्य पृष्ठ पर वापस जाएं</span>
      </button>

      {/* 1. ABOUT US */}
      {page === 'about' && (() => {
        const currentHour = new Date().getHours();
        const isOpenNow = currentHour >= 9 && currentHour < 20;

        return (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
            {/* Header */}
            <div className="border-b border-gray-200 pb-5">
              <span className="text-xs font-bold text-[#C71920] uppercase tracking-wider bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                परिचय व संपर्क जानकारी (About & Business Info)
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#182230] font-serif-hindi mt-2">
                Jashpur.News - हमारे बारे में
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                छत्तीसगढ़ और जशपुर का अग्रणी, स्वतंत्र एवं विश्वसनीय डिजिटल समाचार पोर्टल।
              </p>
            </div>

            {/* Intro Content */}
            <div className="prose text-gray-700 space-y-4 text-sm sm:text-base leading-relaxed">
              <p>
                <strong>Jashpur.News</strong> छत्तीसगढ़ के प्राकृतिक सौंदर्य और सांस्कृतिक विविधता से परिपूर्ण जशपुर जिले का अग्रणी एवं स्वतंत्र डिजिटल समाचार पोर्टल है। हमारा ध्येय जिले के अंतिम छोर, वनांचल ग्रामों और पहाड़ी पाठ क्षेत्रों में बसे प्रत्येक नागरिक की समस्याओं, उम्मीदों और उपलब्धियों को मुख्यधारा के मीडिया में निष्पक्षता से स्थान दिलाना है।
              </p>
              <p>
                जिले के 8 विकासखंडों—जशपुर नगर, पत्थलगांव, कुनकुरी, बगीचा, फरसाबहार, दुलदुला, मनोरा और सन्ना—से जुड़े हमारे समर्पित संवाददाताओं का नेटवर्क सत्यनिष्ठ, निष्पक्ष और प्रमाणिक रिपोर्टिंग सुनिश्चित करता है।
              </p>
            </div>

            {/* Contact & Business Info Cards Grid */}
            <div className="space-y-4 pt-2">
              <h3 className="text-base font-black text-[#182230] border-b pb-2 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#C71920]" />
                <span>व्यापारिक एवं संपर्क विवरण (Business & Contact Details)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                {/* 1. Contact Number */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-3.5 hover:shadow-sm transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">1. Contact Number (फोन नंबर)</div>
                    <div className="mt-1 font-bold text-gray-900 text-base">
                      <a href="tel:+919907318667" className="text-emerald-700 hover:underline flex items-center gap-1.5">
                        <span>+91 99073 18667</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">क्लिक करके सीधे कॉल करें।</p>
                  </div>
                </div>

                {/* 2. Business Hours */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-3.5 hover:shadow-sm transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">2. Business Hours (कार्य समय)</div>
                    <div className="mt-1 font-bold text-gray-900">
                      सुबह 9:00 AM – रात 8:00 PM
                    </div>
                    <div className="mt-1">
                      {isOpenNow ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-extrabold text-[11px]">
                          🟢 Open Now (खुला है)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-extrabold text-[11px]">
                          🔴 Closed (बंद है)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Category */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-3.5 hover:shadow-sm transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">3. Category (श्रेणी)</div>
                    <div className="mt-1 font-bold text-gray-900 text-base">
                      Education & Digital Media (शिक्षा)
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">शैक्षणिक एवं सूचनात्मक पोर्टल</p>
                  </div>
                </div>

                {/* 5. Email Address */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-3.5 hover:shadow-sm transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">5. Email Address (ईमेल)</div>
                    <div className="mt-1 font-bold text-gray-900">
                      <a href="mailto:sarojonlineworks@gmail.com" className="text-amber-700 hover:underline flex items-center gap-1.5 break-all">
                        <span>sarojonlineworks@gmail.com</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">क्लिक करके सीधे ईमेल भेजें।</p>
                  </div>
                </div>
              </div>

              {/* 4. Business Address & Map */}
              <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 text-[#C71920] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">4. Business Address (कार्यालय पता)</div>
                    <div className="mt-1 font-bold text-gray-900 text-sm">
                      VW34+F4W, Narayanpur, Chhattisgarh 496225, India
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <a
                        href="https://maps.google.com/?q=VW34+F4W+Narayanpur+Chhattisgarh+496225"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-[#C71920] hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Get Directions (दिशा-निर्देश प्राप्त करें)</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Google Maps Embed */}
                <div className="w-full h-48 sm:h-56 rounded-xl overflow-hidden border border-gray-300 shadow-xs">
                  <iframe
                    title="Jashpur News Office Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.5!2d84.145!3d22.565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDMzJzM5LjAiTiA4NMKwMDgnNDItMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                  ></iframe>
                </div>
              </div>

              {/* 6. Social Media Links */}
              <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">6. Social Media Links (सोशल मीडिया)</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/sarojkushwaha01/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white border border-gray-200 rounded-xl hover:border-pink-500 hover:shadow-sm transition-all flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                      📸
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 group-hover:text-pink-600 text-xs">Instagram</div>
                      <div className="text-[11px] text-gray-500">398 Followers</div>
                    </div>
                  </a>

                  {/* YouTube */}
                  <a
                    href="https://www.youtube.com/@sarojbabupro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white border border-gray-200 rounded-xl hover:border-red-500 hover:shadow-sm transition-all flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-red-100 text-[#C71920] flex items-center justify-center font-bold">
                      ▶️
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 group-hover:text-[#C71920] text-xs">YouTube</div>
                      <div className="text-[11px] text-gray-500">@sarojbabupro</div>
                    </div>
                  </a>

                  {/* Facebook (Inactive placeholder as requested) */}
                  <div className="p-3 bg-white/60 border border-gray-200 rounded-xl flex items-center gap-3 opacity-75">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      👥
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-xs">Facebook</div>
                      <div className="text-[10px] text-gray-500">Link updating soon</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 2. CONTACT US */}
      {page === 'contact' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <span className="text-xs font-bold text-[#C71920] uppercase tracking-wider">संपर्क सूत्र</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#182230] font-serif-hindi mt-1">
              संपर्क करें (Contact Us)
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              समाचार प्रेषण, विज्ञापन या शिकायत निवारण हेतु हमारे संपादकीय कार्यालय से संपर्क करें।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-[#C71920] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">संपादकीय एवं प्रशासनिक कार्यालय</h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    प्रेस कॉम्प्लेक्स, कलेक्टर मार्ग, जशपुर नगर,<br />
                    जिला जशपुर, छत्तीसगढ़ - 496331
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">समाचार हेल्पलाइन व ओनर संपर्क</h4>
                  <p className="text-xs text-gray-700 mt-0.5 font-semibold">
                    <a href="tel:+919907318667" className="hover:text-[#C71920] transition-colors">
                      +91 99073 18667
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">ईमेल संपर्क</h4>
                  <p className="text-xs text-gray-600 mt-0.5">editor@jashpur.news / ads@jashpur.news</p>
                </div>
              </div>
            </div>

            {/* Direct Message Form */}
            <form onSubmit={handleFeedbackSubmit} className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-3">
              <h3 className="font-bold text-sm text-gray-900">संपादक को संदेश भेजें</h3>

              {formSubmitted && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>धन्यवाद! आपका संदेश संपादक मंडल को प्राप्त हो गया है।</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">पूरा नाम</label>
                <input
                  type="text"
                  required
                  value={feedbackName}
                  onChange={(e) => setFeedbackName(e.target.value)}
                  placeholder="आपका नाम"
                  className="w-full bg-white border border-gray-300 rounded p-2 text-xs text-gray-900 focus:outline-none focus:border-[#C71920]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">ईमेल अथवा मोबाइल नंबर</label>
                <input
                  type="text"
                  required
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  placeholder="ईमेल / फोन नंबर"
                  className="w-full bg-white border border-gray-300 rounded p-2 text-xs text-gray-900 focus:outline-none focus:border-[#C71920]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">समाचार विवरण अथवा संदेश</label>
                <textarea
                  rows={3}
                  required
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="संदेश लिखें..."
                  className="w-full bg-white border border-gray-300 rounded p-2 text-xs text-gray-900 focus:outline-none focus:border-[#C71920]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#C71920] hover:bg-red-700 text-white rounded text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>संदेश प्रेषित करें</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. EDITORIAL POLICY */}
      {page === 'editorial' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-2xs space-y-5 text-sm sm:text-base text-gray-700 leading-relaxed">
          <div className="border-b border-gray-200 pb-3">
            <span className="text-xs font-bold text-[#C71920] uppercase tracking-wider">नैतिक संहिता</span>
            <h1 className="text-2xl font-bold text-[#182230] font-serif-hindi mt-1">
              संपादकीय नीति एवं आचार संहिता (Editorial Policy)
            </h1>
          </div>
          <p>
            Jashpur.News प्रेस काउंसिल ऑफ इंडिया (Press Council of India) तथा डिजिटल न्यूज पब्लिशर्स एसोसिएशन (DNPA) के स्वीकृत पत्रकारिता सिद्धांतों का शत-प्रतिशत अनुपालन करता है।
          </p>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded border-l-3 border-[#C71920]">
              <h4 className="font-bold text-gray-900 text-sm">1. तथ्य सत्यापन (Fact-Checking)</h4>
              <p className="text-xs text-gray-600 mt-0.5">
                किसी भी संवेदनशील खबर के प्रकाशन से पूर्व कम से कम दो स्वतंत्र स्थानीय स्रोतों से पुष्टि की जाती है।
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded border-l-3 border-[#C71920]">
              <h4 className="font-bold text-gray-900 text-sm">2. निष्पक्षता एवं दोनों पक्षों की बात</h4>
              <p className="text-xs text-gray-600 mt-0.5">
                विवाद अथवा आरोप-प्रत्यारोप की स्थिति में संबंधित सभी पक्षों का वक्तव्य यथोचित स्थान देकर प्रकाशित किया जाता है।
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded border-l-3 border-[#C71920]">
              <h4 className="font-bold text-gray-900 text-sm">3. भूल सुधार नीति (Corrections Policy)</h4>
              <p className="text-xs text-gray-600 mt-0.5">
                यदि किसी रिपोर्ट में अनजाने में कोई तथ्यात्मक त्रुटि होती है, तो उसे तत्परता से संशोधित कर स्पष्ट नोट अंकित किया जाता है।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. PRIVACY POLICY */}
      {page === 'privacy' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-2xs space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
          <div className="border-b border-gray-200 pb-3">
            <h1 className="text-2xl font-bold text-[#182230] font-serif-hindi">
              गोपनीयता नीति (Privacy Policy)
            </h1>
            <p className="text-xs text-gray-500">अंतिम नवीनीकरण: 12 अक्टूबर 2026</p>
          </div>
          <p>
            Jashpur News पर पाठकों की गोपनीयता हमारे लिए सर्वोच्च प्राथमिकता है। हमारी वेबसाइट का उपयोग करते समय आपके व्यक्तिगत डेटा की सुरक्षा के संबंध में हमारे नियम पारदर्शी हैं।
          </p>
          <h4 className="font-bold text-gray-900 text-sm">डेटा संकलन:</h4>
          <p className="text-xs sm:text-sm">
            हम किसी भी अनाधिकृत तृतीय-पक्ष को पाठकों की निजी जानकारी विक्रय या साझा नहीं करते हैं। स्थानीय ब्राउज़र स्टोरेज केवल आपकी भाषा प्राथमिकता एवं बुकमार्क सहेजने हेतु उपयोग होता है।
          </p>
        </div>
      )}

      {/* 5. DISCLAIMER */}
      {page === 'disclaimer' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-2xs space-y-4 text-sm text-gray-700 leading-relaxed">
          <div className="border-b border-gray-200 pb-3">
            <h1 className="text-2xl font-bold text-[#182230] font-serif-hindi">
              अस्वीकरण (Disclaimer)
            </h1>
          </div>
          <p>
            Jashpur News पर प्रकाशित सभी समाचार, लेख, विचार और टिप्पणियां संबंधित संवाददाताओं एवं लेखकों के व्यक्तिगत अध्ययन पर आधारित हैं।
          </p>
          <p>
            पोर्टल पर प्रकाशित विज्ञापनों में किए गए दावों की सत्यता के लिए विज्ञापनदाता स्वयं उत्तरदायी हैं। पाठकों से अनुरोध है कि वे किसी भी व्यापारिक निर्णय से पूर्व स्वयं पुष्टि कर लें।
          </p>
          <p>
            सभी कानूनी विवादों का क्षेत्राधिकार न्यायालय जशपुर नगर, छत्तीसगढ़ रहेगा।
          </p>
        </div>
      )}

      {/* 6. TERMS & CONDITIONS */}
      {page === 'terms' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-2xs space-y-4 text-sm text-gray-700 leading-relaxed">
          <div className="border-b border-gray-200 pb-3">
            <h1 className="text-2xl font-bold text-[#182230] font-serif-hindi">
              नियम एवं शर्तें (Terms & Conditions)
            </h1>
          </div>
          <p>
            Jashpur News की सामग्री (पाठ्य, छायाचित्र, वीडियो, ग्राफिक्स) भारतीय कॉपीराइट अधिनियम के अंतर्गत संरक्षित है। बिना पूर्व लिखित अनुमति के किसी भी सामग्री का व्यावसायिक पुनःप्रकाशन वर्जित है।
          </p>
        </div>
      )}

      {/* 7. XML SITEMAP & ROBOTS.TXT (Requirement 8) */}
      {page === 'sitemap' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#C71920] uppercase tracking-wider">SEO संरचना</span>
              <h1 className="text-2xl font-bold text-[#182230] font-serif-hindi mt-1">
                XML Sitemap & Robots.txt
              </h1>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold">
              सक्रिय व अनुक्रमित (Indexed)
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-900 text-gray-100 rounded-lg text-xs font-mono overflow-x-auto">
              <div className="text-gray-400 mb-2">// robots.txt</div>
              <div>User-agent: *</div>
              <div>Allow: /</div>
              <div>Sitemap: https://jashpur.news/sitemap.xml</div>
            </div>

            <div className="p-4 bg-gray-900 text-amber-200 rounded-lg text-xs font-mono overflow-x-auto max-h-60 overflow-y-auto">
              <div className="text-gray-400 mb-2">// sitemap.xml (Dynamic Live Feed)</div>
              <div>&lt;?xml version="1.0" encoding="UTF-8"?&gt;</div>
              <div>&lt;urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"&gt;</div>
              <div className="pl-4">&lt;url&gt;&lt;loc&gt;https://jashpur.news/&lt;/loc&gt;&lt;priority&gt;1.0&lt;/priority&gt;&lt;/url&gt;</div>
              {articles.map((a) => (
                <div key={a.id} className="pl-4">
                  &lt;url&gt;&lt;loc&gt;https://jashpur.news/article/{a.slug}&lt;/loc&gt;&lt;lastmod&gt;2026-10-12&lt;/lastmod&gt;&lt;changefreq&gt;daily&lt;/changefreq&gt;&lt;/url&gt;
                </div>
              ))}
              <div>&lt;/urlset&gt;</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
