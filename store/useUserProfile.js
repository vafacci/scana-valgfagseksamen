import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_PROFILE_KEY = '@scana_user_profile';

const DEFAULT_PROFILE = {
  name: '',
  email: '',
  memberSince: 'sep. 2026',
  elo: 0,
  totalScans: 0,
  totalFavorites: 0,
};

function isPlaceholderName(name) {
  const value = String(name || '').trim().toLowerCase();
  return !value || value === 'mads mikkelsen';
}

export async function syncProfileFromAuth(user) {
  if (!user) return;
  try {
    const storedProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);
    const current = storedProfile ? JSON.parse(storedProfile) : DEFAULT_PROFILE;
    const providerMail = String(user.email || '').endsWith('@scana.local');
    const next = {
      ...DEFAULT_PROFILE,
      ...current,
      name: user.name || current.name || '',
      email: providerMail ? current.email || '' : user.email || current.email || '',
    };
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(next));
  } catch (error) {
    console.error('Error syncing profile from auth:', error);
  }
}

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const saveUserProfile = async (newProfile) => {
    try {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(newProfile));
      setUserProfile(newProfile);
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        if (isPlaceholderName(parsed.name)) {
          const cleaned = {
            ...DEFAULT_PROFILE,
            ...parsed,
            name: '',
            email: parsed.email === 'mads@example.com' ? '' : parsed.email || '',
          };
          await saveUserProfile(cleaned);
        } else {
          setUserProfile({ ...DEFAULT_PROFILE, ...parsed });
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (fields) => {
    const storedProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);
    const current = storedProfile ? JSON.parse(storedProfile) : userProfile;
    await saveUserProfile({ ...DEFAULT_PROFILE, ...current, ...fields });
  };

  const updateElo = async (increment = 5) => {
    try {
      const storedProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);
      const currentProfile = storedProfile ? JSON.parse(storedProfile) : userProfile;
      await saveUserProfile({
        ...currentProfile,
        elo: (currentProfile.elo || 0) + increment,
      });
    } catch (error) {
      console.error('Error updating elo:', error);
    }
  };

  const updateFavoritesCount = async (count) => {
    await updateProfile({ totalFavorites: count });
  };

  const resetProfile = async () => {
    await saveUserProfile({ ...DEFAULT_PROFILE });
  };

  return {
    userProfile,
    loading,
    updateElo,
    updateProfile,
    updateFavoritesCount,
    resetProfile,
    loadUserProfile,
  };
}
