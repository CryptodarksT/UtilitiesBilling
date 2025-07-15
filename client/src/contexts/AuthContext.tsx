import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { apiRequest } from '@/lib/queryClient';

interface AuthContextType {
  user: User | null;
  userData: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  getAuthToken: () => Promise<string>;
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Get user data from our backend
          const token = await user.getIdToken();
          const response = await apiRequest('GET', '/api/auth/profile', null, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUserData(data.user);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    // This will be implemented with Firebase auth
    throw new Error('Login not implemented yet');
  };

  const logout = async () => {
    await signOut(auth);
  };

  const register = async (registrationData: any) => {
    if (!user) throw new Error('No authenticated user');
    
    try {
      const token = await user.getIdToken();
      const response = await apiRequest('POST', '/api/auth/register', {
        firebaseUid: user.uid,
        email: user.email,
        name: user.displayName || '',
        ...registrationData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const getAuthToken = async (): Promise<string> => {
    if (!user) throw new Error('No authenticated user');
    return await user.getIdToken();
  };

  const value = {
    user,
    userData,
    loading,
    login,
    logout,
    register,
    getAuthToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};