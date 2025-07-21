// context/AuthContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { apiService } from '../utils/api';
import { usePathname } from 'next/navigation'
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../utils/permissions';

interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
  roles?: string[];
  permissions: string[];
  is_active: boolean;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  hasCheckedLogin: boolean;
  refreshAuth: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  loading: true,
  hasCheckedLogin: false,
  refreshAuth: async () => {},
  hasPermission: () => false,
  hasAnyPermission: () => false,
  hasAllPermissions: () => false,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const [hasCheckedLogin, setHasCheckedLogin] = useState(false)

  const checkLogin = async () => {
    try {
      const res = await apiService.get('user/me')
      if (res.status === 200) {
        const userData = res.data;
        setUser(userData);
        setIsLoggedIn(true);
        setHasCheckedLogin(true);
      }
    } catch (err) {
      setUser(null);
      setIsLoggedIn(false);
      setHasCheckedLogin(true);
    } finally {
      setLoading(false);
    }
  }

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    // Clear any stored tokens
    localStorage.removeItem('token');
    // Redirect to login
    window.location.href = '/login';
  }

  const hasUserPermission = (permission: string): boolean => {
    if (!user) return false;
    return hasPermission(user.permissions || [], permission);
  }

  const hasUserAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false;
    return hasAnyPermission(user.permissions || [], permissions);
  }

  const hasUserAllPermissions = (permissions: string[]): boolean => {
    if (!user) return false;
    return hasAllPermissions(user.permissions || [], permissions);
  }

  useEffect(() => {
    // Không check ở route public
    const publicPaths = ['/', '/login', '/home','/about','/register']
    if (publicPaths.includes(pathname)) {
      setLoading(false)
      return
    }
    checkLogin()
  }, [pathname])

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      loading, 
      hasCheckedLogin, 
      refreshAuth: checkLogin,
      hasPermission: hasUserPermission,
      hasAnyPermission: hasUserAnyPermission,
      hasAllPermissions: hasUserAllPermissions,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
