import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await authAPI.getCurrentUser();
        setUser(response.user);
      }
    } catch (error) {
      // Token is invalid or expired
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      setUser(response.user);
      toast.success('Account created successfully!');
      return response;
    } catch (error) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      setUser(response.user);
      toast.success('Logged in successfully!');
      return response;
    } catch (error) {
      toast.error(error.message || 'Invalid email or password');
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      setUser(response.user);
      toast.success('Profile updated successfully!');
      return response;
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    updateProfile,
    checkAuth,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

