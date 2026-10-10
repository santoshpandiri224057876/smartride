import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smartride_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('smartride_token') || null);
  const [currentMode, setCurrentMode] = useState(() => {
    return localStorage.getItem('smartride_mode') || 'PASSENGER';
  });
  const [loading, setLoading] = useState(true);

  // Switch mode without logging out
  const switchMode = (mode) => {
    setCurrentMode(mode);
    localStorage.setItem('smartride_mode', mode);
  };

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const { token: jwt, user: userData } = res.data.data;
    setToken(jwt);
    setUser(userData);
    localStorage.setItem('smartride_token', jwt);
    localStorage.setItem('smartride_user', JSON.stringify(userData));

    // Default mode logic
    if (userData.role === 'ADMIN') {
      switchMode('ADMIN');
    } else if (userData.driverVerificationStatus === 'APPROVED') {
      switchMode('PASSENGER'); // user can switch freely
    } else {
      switchMode('PASSENGER');
    }
    return userData;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    const { token: jwt, user: userProfile } = res.data.data;
    setToken(jwt);
    setUser(userProfile);
    localStorage.setItem('smartride_token', jwt);
    localStorage.setItem('smartride_user', JSON.stringify(userProfile));
    switchMode('PASSENGER');
    return userProfile;
  };

  const logout = () => {
    localStorage.removeItem('smartride_token');
    localStorage.removeItem('smartride_user');
    localStorage.removeItem('smartride_mode');
    setToken(null);
    setUser(null);
    setCurrentMode('PASSENGER');
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await userService.getProfile();
      const freshUser = res.data.data;
      setUser(freshUser);
      localStorage.setItem('smartride_user', JSON.stringify(freshUser));
    } catch (err) {
      console.error('Failed to refresh user', err);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        await refreshUser();
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const isApprovedDriver = user?.driverVerificationStatus === 'APPROVED';
  const isPendingDriver = user?.driverVerificationStatus === 'PENDING';
  const isRejectedDriver = user?.driverVerificationStatus === 'REJECTED';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        currentMode,
        switchMode,
        login,
        register,
        logout,
        refreshUser,
        isApprovedDriver,
        isPendingDriver,
        isRejectedDriver,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
