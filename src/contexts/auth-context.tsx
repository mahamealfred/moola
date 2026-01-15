'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  user: any;
  accessToken: string | null;
  login: (_user: any, _token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      if (typeof window.localStorage === 'undefined') return;

      const token = window.localStorage.getItem('accessToken');
      const storedUser = window.localStorage.getItem('user');

      if (token && storedUser) {
        setAccessToken(token);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error restoring auth from localStorage:', error);
    }
  }, []);

  const login = (userData: any, token: string) => {
    setUser(userData);
    setAccessToken(token);
    try {
      if (typeof window === 'undefined') return;
      if (typeof window.localStorage === 'undefined') return;

      window.localStorage.setItem('accessToken', token);
      window.localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving auth to localStorage:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    try {
      if (typeof window === 'undefined') return;
      if (typeof window.localStorage === 'undefined') return;

      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
