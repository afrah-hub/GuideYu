import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const initAuth = async () => {
      try {
        const profile = await authService.getProfile();
        setUser(profile);
      } catch (error) {
        // Not logged in or expired
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    const profile = await authService.getProfile();
    setUser(profile);
    return data;
  };

  const googleLogin = async (token) => {
    const data = await authService.googleLogin(token);
    const profile = await authService.getProfile();
    setUser(profile);
    return data;
  };

  const appleLogin = async (token) => {
    const data = await authService.appleLogin(token);
    const profile = await authService.getProfile();
    setUser(profile);
    return data;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
    
    // Explicitly clear frontend-accessible cookies
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
  };

  const refreshUser = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (error) {
      console.error("Refresh user error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, googleLogin, appleLogin, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
