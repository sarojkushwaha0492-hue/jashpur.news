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

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token && data.user) {
        setToken(data.token);
        setCurrentUser(data.user);
        setIsAuthModalOpen(false);
        if (data.user.role === 'owner') setCurrentDashboardView('owner_panel');
        else if (data.user.role === 'admin') setCurrentDashboardView('admin_panel');
        else setCurrentDashboardView('staff_panel');
        return { success: true };
      } else {
        return { success: false, error: data.error || 'लॉगिन असफल रहा।' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'कनेक्शन त्रुटि।' };
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    setCurrentDashboardView('portal');
  };

  const verifyOwnerPassword = async (password: string): Promise<boolean> => {
    if (!currentUser || !token) return false;
    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      return res.ok && data.verified === true;
    } catch {
      return false;
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
