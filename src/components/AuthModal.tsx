import React, { useState } from 'react';
import { Shield, Key, Mail, Lock, X, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { JashpurLogo } from './JashpurLogo';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useAuth();
  
  // Mode: login or reset
  const [isResetMode, setIsResetMode] = useState(false);

  // Password login state
  const [email, setEmail] = useState('saroj.jashpur');
  const [password, setPassword] = useState('');

  // Password reset state
  const [resetEmail, setResetEmail] = useState('saroj.jashpur');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

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
      setErrorMsg(result.error || 'लॉगिन विफल रहा। कृपया सही आईडी और पासवर्ड दर्ज करें।');
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResetSuccess(null);

    if (newPassword.length < 4) {
      setErrorMsg('नया पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते हैं।');
      return;
    }

    try {
      localStorage.setItem('jashpur_admin_custom_creds', JSON.stringify({
        email: resetEmail.trim(),
        password: newPassword.trim()
      }));
      setResetSuccess('पासवर्ड सफलतापूर्वक रीसेट हो गया है! अब आप नए पासवर्ड से लॉगिन कर सकते हैं।');
      setTimeout(() => {
        setIsResetMode(false);
        setPassword('');
        setResetSuccess(null);
      }, 2000);
    } catch {
      setErrorMsg('पासवर्ड रीसेट करने में त्रुटि।');
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
              <h3 className="font-extrabold text-lg text-white">Jashpur.News एडमिन पोर्टल</h3>
              <p className="text-xs text-gray-300">
                {isResetMode ? 'एडमिन पासवर्ड रीसेट करें' : 'सुरक्षित एकल एडमिन लॉगिन'}
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

          {/* Success Message Alert */}
          {resetSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{resetSuccess}</span>
            </div>
          )}

          {!isResetMode ? (
            /* Login Form */
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  एडमिन यूज़र आईडी (Admin Login ID)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="saroj.jashpur"
                    className="w-full bg-white border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#C71920] focus:ring-1 focus:ring-[#C71920]"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700">
                    पासवर्ड (Password)
                  </label>
                  <button
                    type="button"
                    onClick={() => { setIsResetMode(true); setErrorMsg(null); }}
                    className="text-xs text-[#C71920] hover:underline font-semibold cursor-pointer"
                  >
                    पासवर्ड भूल गए / रीसेट करें?
                  </button>
                </div>
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
          ) : (
            /* Password Reset Form */
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  एडमिन यूज़र आईडी कन्फर्म करें
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="saroj.jashpur"
                    className="w-full bg-white border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#C71920] focus:ring-1 focus:ring-[#C71920]"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  नया पासवर्ड (New Password)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="कम से कम 4 अक्षर"
                    className="w-full bg-white border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#C71920] focus:ring-1 focus:ring-[#C71920]"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  नया पासवर्ड पुनः दर्ज करें (Confirm Password)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="पुनः दर्ज करें"
                    className="w-full bg-white border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#C71920] focus:ring-1 focus:ring-[#C71920]"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setIsResetMode(false); setErrorMsg(null); setResetSuccess(null); }}
                  className="w-1/2 py-2.5 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-bold text-xs cursor-pointer transition-colors"
                >
                  वापस लॉगिन करें
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 px-4 bg-[#C71920] hover:bg-red-700 text-white rounded-lg font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>पासवर्ड अपडेट करें</span>
                </button>
              </div>
            </form>
          )}

          {/* Security Features Info */}
          <div className="mt-5 pt-4 border-t border-gray-200 text-[11px] text-gray-500 space-y-1">
            <div className="flex items-center gap-1.5 text-gray-700 font-semibold">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>एकल एडमिन सुरक्षा (Single Admin Portal):</span>
            </div>
            <p>• केवल अधिकृत एडमिन आईडी द्वारा सुरक्षित संचालन।</p>
            <p>• पासवर्ड रीसेट करने और बदलने की सुविधा उपलब्ध।</p>
          </div>
        </div>
      </div>
    </div>
  );
};
