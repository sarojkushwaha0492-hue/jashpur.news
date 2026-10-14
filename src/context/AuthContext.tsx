import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/auth';

export type DashboardViewType = 'portal' | 'public' | 'owner_panel' | 'admin_panel' | 'staff_panel' | 'cms' | 'owner' | 'admin' | 'staff';

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  verifyOwnerPassword: (password: string) => Promise<boolean>;
  currentDashboardView: DashboardViewType;
  setCurrentDashboardView: (view: DashboardViewType) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'jashpur_news_token_v1';
const USER_KEY = 'jashpur_news_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [currentDashboardView, setCurrentDashboardView] = useState<DashboardViewType>('portal');

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [currentUser]);

  // Helper to safely parse JSON without throwing on HTML error pages
  const parseSafeJson = async (res: Response) => {
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        return await res.json();
      } catch {
        return null;
      }
    }
    const text = await res.text();
    const trimmed = text.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return null;
      }
    }
    return null;
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPassword = (password || '').trim();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
      });

      const data = await parseSafeJson(res);

      if (res.ok && data && data.token && data.user) {
        setToken(data.token);
        setCurrentUser(data.user);
        setIsAuthModalOpen(false);
        if (data.user.role === 'owner') setCurrentDashboardView('owner_panel');
        else if (data.user.role === 'admin') setCurrentDashboardView('admin_panel');
        else setCurrentDashboardView('staff_panel');
        return { success: true };
      } else if (data && data.error) {
        return { success: false, error: data.error };
      }
    } catch {
      // Server unreachable or network error, proceed to client-side credential fallback
    }

    // Client-side authentication fallback (for Hostinger static deployments or offline backend)
    // Check custom credentials stored in localStorage if any
    let customAdminEmail = 'saroj.jashpur';
    let customAdminPassword = 'saroj@2026';
    try {
      const savedCreds = localStorage.getItem('jashpur_admin_custom_creds');
      if (savedCreds) {
        const parsed = JSON.parse(savedCreds);
        if (parsed.email) customAdminEmail = parsed.email.toLowerCase().trim();
        if (parsed.password) customAdminPassword = parsed.password.trim();
      }
    } catch {
      //
    }

    // 1. Admin / Bureau Chief
    if (
      (cleanEmail === 'saroj.jashpur' || cleanEmail === 'admin@jashpur.news' || cleanEmail === 'admin' || cleanEmail === customAdminEmail) &&
      (cleanPassword === 'saroj@2026' || cleanPassword === customAdminPassword)
    ) {
      const adminUser: User = {
        id: 'usr_admin_01',
        name: 'सरोज (Admin / Bureau Chief)',
        email: customAdminEmail,
        phone: '6267564769',
        role: 'admin',
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        permissions: {
          canPublishDirectly: true,
          canManageUsers: false,
          canManageTicker: true,
          canModerateComments: true,
          canManageAds: false,
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      const fallbackToken = 'tok_local_' + Math.random().toString(36).substring(2);
      setToken(fallbackToken);
      setCurrentUser(adminUser);
      setIsAuthModalOpen(false);
      setCurrentDashboardView('admin_panel');
      return { success: true };
    }

    // 2. Owner / Super Admin
    if (
      (cleanEmail === 'owner@jashpur.news' || cleanEmail === 'owner') &&
      cleanPassword === 'Owner@123'
    ) {
      const ownerUser: User = {
        id: 'usr_owner_01',
        name: 'कलेक्टर संपादक (Owner)',
        email: 'owner@jashpur.news',
        phone: '99073 18667',
        role: 'owner',
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        permissions: {
          canPublishDirectly: true,
          canManageUsers: true,
          canManageTicker: true,
          canModerateComments: true,
          canManageAds: true,
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      const fallbackToken = 'tok_local_' + Math.random().toString(36).substring(2);
      setToken(fallbackToken);
      setCurrentUser(ownerUser);
      setIsAuthModalOpen(false);
      setCurrentDashboardView('owner_panel');
      return { success: true };
    }

    // 3. Staff Reporter
    if (
      (cleanEmail === 'staff@jashpur.news' || cleanEmail === 'staff') &&
      cleanPassword === 'Staff@123'
    ) {
      const staffUser: User = {
        id: 'usr_staff_01',
        name: 'अरुण कुमार भगत (Staff Reporter)',
        email: 'staff@jashpur.news',
        role: 'staff',
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        permissions: {
          canPublishDirectly: false,
          canManageUsers: false,
          canManageTicker: false,
          canModerateComments: false,
          canManageAds: false,
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      const fallbackToken = 'tok_local_' + Math.random().toString(36).substring(2);
      setToken(fallbackToken);
      setCurrentUser(staffUser);
      setIsAuthModalOpen(false);
      setCurrentDashboardView('staff_panel');
      return { success: true };
    }

    return { 
      success: false, 
      error: 'अमान्य यूज़र आईडी अथवा पासवर्ड। कृपया सही क्रेडेंशियल दर्ज करें।' 
    };
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    setCurrentDashboardView('portal');
  };

  const verifyOwnerPassword = async (password: string): Promise<boolean> => {
    if (!currentUser) return false;
    if (password === 'Owner@123') return true;
    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password })
      });
      const data = await parseSafeJson(res);
      return data?.verified === true;
    } catch {
      return password === 'Owner@123';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        logout,
        verifyOwnerPassword,
        currentDashboardView,
        setCurrentDashboardView
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
