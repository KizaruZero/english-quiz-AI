"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  username: string;
  loginTime: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  
  // Provide fallback values for SSR
  if (context === undefined) {
    return {
      user: null,
      login: () => false,
      logout: () => {},
      isAuthenticated: false,
    };
  }
  
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

// Simple demo credentials - in production, this would be handled differently
const DEMO_CREDENTIALS = {
  'admin': 'admin123',
  'user': 'user123',
  'student': 'student123',
  'KizaruZero': 'kizaru123'
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  // Handle hydration and check for existing auth
  useEffect(() => {
    setMounted(true);
    
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (!mounted) return false;

    // Check credentials
    if (DEMO_CREDENTIALS[username as keyof typeof DEMO_CREDENTIALS] === password) {
      const newUser: User = {
        username,
        loginTime: new Date().toISOString()
      };
      
      setUser(newUser);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    if (!mounted) return;
    
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}