'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Types
export interface UserData {
  id: number;
  name: string;
  email: string;
  category: string;
  phoneNumber: string;
}

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: UserData & { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Secure Storage Service
class SecureStorageService {
  private readonly ACCESS_TOKEN_KEY = 'at';
  private readonly USER_DATA_KEY = 'ud';

  private encrypt(data: string): string {
    if (typeof window === 'undefined') return data;
    try {
      return btoa(encodeURIComponent(data));
    } catch {
      throw new Error('Encryption failed');
    }
  }

  private decrypt(encryptedData: string): string {
    if (typeof window === 'undefined') return encryptedData;
    try {
      return decodeURIComponent(atob(encryptedData));
    } catch {
      this.clearUserData();
      throw new Error('Invalid token data');
    }
  }

  setUserData(userData: UserData & { accessToken: string; refreshToken: string }): void {
    if (typeof window === 'undefined') return;
    if (typeof window.sessionStorage === 'undefined') return;
    try {
      const tokenData = {
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
        expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour
      };

      const encryptedTokenData = this.encrypt(JSON.stringify(tokenData));
      window.sessionStorage.setItem(this.ACCESS_TOKEN_KEY, encryptedTokenData);

      const { accessToken, refreshToken, ...safeUserData } = userData;
      const encryptedUserData = this.encrypt(JSON.stringify(safeUserData));
      window.sessionStorage.setItem(this.USER_DATA_KEY, encryptedUserData);
    } catch (error) {
      this.clearUserData();
    }
  }

  getUserData(): UserData | null {
    if (typeof window === 'undefined') return null;
    if (typeof window.sessionStorage === 'undefined') return null;
    try {
      const encryptedUserData = window.sessionStorage.getItem(this.USER_DATA_KEY);
      if (!encryptedUserData) return null;
      return JSON.parse(this.decrypt(encryptedUserData));
    } catch {
      this.clearUserData();
      return null;
    }
  }

  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    if (typeof window.sessionStorage === 'undefined') return null;
    try {
      const encryptedTokenData = window.sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
      if (!encryptedTokenData) return null;

      const tokenData = JSON.parse(this.decrypt(encryptedTokenData));
      if (Date.now() > tokenData.expiresAt) {
        this.clearUserData();
        return null;
      }
      return tokenData.accessToken;
    } catch {
      this.clearUserData();
      return null;
    }
  }

  clearUserData(): void {
    if (typeof window === 'undefined') return;
    if (typeof window.sessionStorage === 'undefined') return;
    window.sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    window.sessionStorage.removeItem(this.USER_DATA_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const secureStorage = new SecureStorageService();

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const userData = secureStorage.getUserData();
        const isAuth = secureStorage.isAuthenticated();
        
        if (isAuth && userData) {
          setUser(userData);
        } else {
          secureStorage.clearUserData();
          setUser(null);
        }
      } catch (error) {
        secureStorage.clearUserData();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to ensure sessionStorage is available
    setTimeout(initializeAuth, 100);
  }, []);

  const login = (userData: UserData & { accessToken: string; refreshToken: string }) => {
    secureStorage.setUserData(userData);
    setUser(userData);
  };

  const logout = () => {
    secureStorage.clearUserData();
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user && secureStorage.isAuthenticated(),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}