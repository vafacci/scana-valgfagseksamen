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
    console.log('useAuth: Loading auth state...');
    try {
      const storedAuth = await AsyncStorage.getItem(AUTH_KEY);
      console.log('useAuth: Stored auth data:', storedAuth);
      
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        console.log('useAuth: Parsed auth data:', authData);
        setIsLoggedIn(true);
        setUser(authData.user);
        console.log('useAuth: User logged in:', authData.user);
      } else {
        console.log('useAuth: No stored auth data, user not logged in');
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('useAuth: Error loading auth state:', error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      console.log('useAuth: Auth loading completed, setting loading to false');
      setLoading(false);
    }
  };

  const login = async (userData) => {
    console.log('useAuth.login called with:', userData);
    try {
      const authData = {
        user: userData,
        timestamp: new Date().toISOString(),
      };
      console.log('useAuth: Saving auth data to AsyncStorage:', authData);
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      console.log('useAuth: Auth data saved successfully');
      
      setIsLoggedIn(true);
      setUser(userData);
      console.log('useAuth.login completed, isLoggedIn set to true, user set to:', userData);
    } catch (error) {
      console.error('useAuth.login error:', error);
      throw error;
    }
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
