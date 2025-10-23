import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = '@scana_auth';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const storedAuth = await AsyncStorage.getItem(AUTH_KEY);
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        setIsLoggedIn(true);
        setUser(authData.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    console.log('useAuth.login called with:', userData);
    const authData = {
      user: userData,
      timestamp: new Date().toISOString(),
    };
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    setIsLoggedIn(true);
    setUser(userData);
    console.log('useAuth.login completed, isLoggedIn set to true');
  };

  const logout = async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    setIsLoggedIn(false);
    setUser(null);
  };

  return {
    isLoggedIn,
    user,
    loading,
    login,
    logout,
  };
}
