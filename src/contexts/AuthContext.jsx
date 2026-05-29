import { useState, useEffect } from 'react';
import { authAPI, removeToken } from '@/lib/api';
import { toast } from 'sonner';
import { AuthContext } from '@/contexts/auth-context';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!user) return undefined;

    const refreshTimer = window.setInterval(async () => {
      try {
        await authAPI.refresh();
      } catch {
        setUser(null);
      }
    }, 12 * 60 * 1000);

    return () => window.clearInterval(refreshTimer);
  }, [user]);

  const checkAuth = async () => {
    try {
      // Cookies are sent automatically — no localStorage token needed
      const response = await authAPI.getCurrentUser();
      setUser(response.user);
    } catch {
      // 401 means no valid session; clear any legacy localStorage entries
      removeToken();
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

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const completeOAuth = async () => {
    // Cookies already set server-side; just fetch the user
    const response = await authAPI.getCurrentUser();
    setUser(response.user);
    return response.user;
  };

  const loginWithOtp = async (email, otp) => {
    const response = await authAPI.verifyOtp(email, otp);
    setUser(response.user);
    toast.success('Logged in successfully!');
    return response;
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
    completeOAuth,
    loginWithOtp,
    updateProfile,
    checkAuth,
    clearSession: removeToken,
    isAuthenticated: !!user,
    isAdmin: String(user?.role || '').toUpperCase() === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
