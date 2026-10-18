import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addUser,
  authenticateUser,
  checkEmailExists,
  updateUserPassword,
  upsertProviderUser,
} from './useUsers';
import { syncProfileFromAuth } from './useUserProfile';

const AUTH_KEY = '@scana_auth';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthState();
  }, []);

  const persist = async (userData) => {
    const authData = {
      user: userData,
      timestamp: new Date().toISOString(),
    };
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    await syncProfileFromAuth(userData);
    setUser(userData);
    setIsLoggedIn(true);
  };

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

  const loginWithEmail = async (email, password) => {
    const found = await authenticateUser(email, password);
    if (!found) {
      const error = new Error('invalid_credentials');
      error.code = 'invalid_credentials';
      throw error;
    }
    await persist(found);
    return found;
  };

  const signup = async ({ email, password, name }) => {
    if (await checkEmailExists(email)) {
      const error = new Error('email_in_use');
      error.code = 'email_in_use';
      throw error;
    }
    const created = await addUser({ email, password, name, provider: 'email' });
    await persist(created);
    return created;
  };

  const loginWithProvider = async (profile) => {
    const found = await upsertProviderUser(profile);
    await persist(found);
    return found;
  };

  const resetPassword = async (email, newPassword) => {
    const updated = await updateUserPassword(email, newPassword);
    if (!updated) {
      const error = new Error('account_not_found');
      error.code = 'account_not_found';
      throw error;
    }
    return true;
  };

  const logout = async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    setIsLoggedIn(false);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      isLoggedIn,
      user,
      loading,
      loginWithEmail,
      signup,
      loginWithProvider,
      resetPassword,
      logout,
    }),
    [isLoggedIn, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
