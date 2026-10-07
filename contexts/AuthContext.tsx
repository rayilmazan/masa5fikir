'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LessonPlan } from '@/types/plan';
import { SavedPlanRecord } from '@/lib/db';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  branch?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, branch?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  savedPlans: SavedPlanRecord[];
  refreshSavedPlans: () => Promise<void>;
  saveCurrentPlan: (plan: LessonPlan) => Promise<{ success: boolean; error?: string }>;
  deleteSavedPlan: (planId: string) => Promise<boolean>;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  isSavedPlansModalOpen: boolean;
  openSavedPlansModal: () => void;
  closeSavedPlansModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [savedPlans, setSavedPlans] = useState<SavedPlanRecord[]>([]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [isSavedPlansModalOpen, setIsSavedPlansModalOpen] = useState<boolean>(false);

  const refreshSavedPlans = React.useCallback(async () => {
    try {
      const res = await fetch('/api/plans');
      if (res.ok) {
        const data = await res.json();
        setSavedPlans(data.plans || []);
      }
    } catch (err) {
      console.error('Failed to fetch saved plans:', err);
    }
  }, []);

  // Check current session on mount
  useEffect(() => {
    let isMounted = true;
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok && isMounted) {
          const data = await res.json();
          setUser(data.user);
          if (data.user) {
            refreshSavedPlans();
          }
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    checkSession();
    return () => {
      isMounted = false;
    };
  }, [refreshSavedPlans]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Giriş yapılamadı.' };
      }
      setUser(data.user);
      setIsAuthModalOpen(false);
      refreshSavedPlans();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Sunucuya bağlanırken bir hata oluştu.' };
    }
  };

  const register = async (name: string, email: string, password: string, branch?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, branch }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Kayıt yapılamadı.' };
      }
      setUser(data.user);
      setIsAuthModalOpen(false);
      refreshSavedPlans();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Sunucuya bağlanırken bir hata oluştu.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setSavedPlans([]);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const saveCurrentPlan = async (plan: LessonPlan) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return { success: false, error: 'Planı kaydetmek için lütfen önce giriş yapınız.' };
    }

    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Plan kaydedilemedi.' };
      }
      await refreshSavedPlans();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Plan kaydedilirken bağlantı hatası oluştu.' };
    }
  };

  const deleteSavedPlan = async (planId: string) => {
    try {
      const res = await fetch(`/api/plans?id=${encodeURIComponent(planId)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSavedPlans((prev) => prev.filter((p) => p.id !== planId));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openSavedPlansModal = () => setIsSavedPlansModalOpen(true);
  const closeSavedPlansModal = () => setIsSavedPlansModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        savedPlans,
        refreshSavedPlans,
        saveCurrentPlan,
        deleteSavedPlan,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        isSavedPlansModalOpen,
        openSavedPlansModal,
        closeSavedPlansModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
