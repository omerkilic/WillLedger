import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { ApiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check local storage on mount
    const stored = ApiService.getStoredUser();
    if (stored) {
      setUser(stored);
    } else {
      // Default to active session with demo data on first load for immediate app access
      const defaultUser: User = {
        id: 'demo-user-1',
        email: 'omerkilic80@gmail.com',
        name: 'Omer Kilic',
        createdAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem('mwl_user', JSON.stringify(defaultUser));
      } catch (e) {
        console.warn('localStorage not available:', e);
      }
      setUser(defaultUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await ApiService.login(email, password);
    setUser(res.user);
  };

  const register = async (email: string, password: string, name?: string) => {
    const res = await ApiService.register(email, password, name);
    setUser(res.user);
  };

  const logout = () => {
    ApiService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
