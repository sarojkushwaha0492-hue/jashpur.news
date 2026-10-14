import React, { useState } from 'react';
import { Shield, Key, Mail, Lock, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { JashpurLogo } from './JashpurLogo';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useAuth();
  
  // Password login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);
    if (!result.success) {
      setErrorMsg(result.error || 'लॉगिन विफल रहा। कृपया सही ईमेल और पासवर्ड दर्ज करें।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#182230] text-white p-5 relative border-b-4 border-[#C71920]">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <JashpurLogo className="w-12 h-12 shadow-sm" />
            <div>
              <h3 className="font-extrabold text-lg text-white">Jashpur.News सुरक्षित एडमिन पोर्टल</h3>
              <p className="text-xs text-gray-300">
                अधिकृत संपादकीय व प्रशासन लॉगिन
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Error Message Alert */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Email & Password Form */}
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                यूज़र आईडी / ईमेल (User ID / Email)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jashpur.news या saroj.jashpur"
                  className="w-full bg-white border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#C71920] focus:ring-1 focus:ring-[#C71920]"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                पासवर्ड (Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#C71920] focus:ring-1 focus:ring-[#C71920]"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#C71920] hover:bg-red-700 text-white rounded-lg font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>सत्यापित किया जा रहा है...</span>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>एडमिन पैनल में प्रवेश करें</span>
                </>
              )}
            </button>
          </form>

          {/* Security Features Info */}
          <div className="mt-5 pt-4 border-t border-gray-200 text-[11px] text-gray-500 space-y-1">
            <div className="flex items-center gap-1.5 text-gray-700 font-semibold">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>सुरक्षा सुरक्षात्मक उपाय (Enterprise Security):</span>
            </div>
            <p>• गोपनीय क्रेडेंशियल्स सुरक्षित (Hidden Credentials)।</p>
            <p>• सुरक्षित ईमेल एवं पासवर्ड प्रमाणीकरण।</p>
            <p>• सर्वर-साइड रोल-आधारित अभिगम नियंत्रण (RBAC)।</p>
          </div>
        </div>
      </div>
    </div>
  );
};
