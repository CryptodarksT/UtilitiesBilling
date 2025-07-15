import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: number;
  email: string;
  name: string;
  businessName?: string;
  phone?: string;
  isVerified: boolean;
  keyExpiresAt: string;
  lastLoginAt: string;
}

interface AuthContextType {
  user: User | null;
  userData: any;
  loading: boolean;
  login: (apiKey: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<{ apiKey: string }>;
  getAuthToken: () => string | null;
  regenerateApiKey: () => Promise<{ apiKey: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored API key on startup
    const checkStoredAuth = async () => {
      const storedApiKey = localStorage.getItem('payoo_api_key');
      if (storedApiKey) {
        try {
          const response = await apiRequest('GET', '/api/auth/profile', null, {
            headers: { Authorization: `Bearer ${storedApiKey}` }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.user.userData);
            setUserData(data.user);
          } else {
            localStorage.removeItem('payoo_api_key');
          }
        } catch (error) {
          console.error('Error checking stored auth:', error);
          localStorage.removeItem('payoo_api_key');
        }
      }
      setLoading(false);
    };

    checkStoredAuth();
  }, []);

  const login = async (apiKey: string) => {
    try {
      const response = await apiRequest('POST', '/api/auth/login', { apiKey });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setUserData(data.user);
        localStorage.setItem('payoo_api_key', apiKey);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setUserData(null);
    localStorage.removeItem('payoo_api_key');
  };

  const register = async (registrationData: any) => {
    try {
      const response = await apiRequest('POST', '/api/auth/register', registrationData);
      
      if (response.ok) {
        const data = await response.json();
        return { apiKey: data.user.apiKey };
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const getAuthToken = (): string | null => {
    return localStorage.getItem('payoo_api_key');
  };

  const regenerateApiKey = async () => {
    try {
      const currentApiKey = localStorage.getItem('payoo_api_key');
      if (!currentApiKey) throw new Error('No API key found');

      const response = await apiRequest('POST', '/api/auth/regenerate-key', {}, {
        headers: { Authorization: `Bearer ${currentApiKey}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('payoo_api_key', data.user.apiKey);
        return { apiKey: data.user.apiKey };
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to regenerate API key');
      }
    } catch (error) {
      console.error('Regenerate API key error:', error);
      throw error;
    }
  };

  const value = {
    user,
    userData,
    loading,
    login,
    logout,
    register,
    getAuthToken,
    regenerateApiKey
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};