import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_PROFILE_KEY = '@scana_user_profile';

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState({
    name: 'Mads Mikkelsen',
    email: 'mads@example.com',
    memberSince: 'Jan 2025',
    elo: 230,
    totalScans: 0,
    totalFavorites: 0,
  });
  const [loading, setLoading] = useState(true);

  // Load user profile from AsyncStorage on mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveUserProfile = async (newProfile) => {
    try {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(newProfile));
      setUserProfile(newProfile);
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  const updateElo = async (increment = 5) => {
    try {
      // Get the latest profile from storage to ensure we have current data
      const storedProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);
      const currentProfile = storedProfile ? JSON.parse(storedProfile) : userProfile;
      
      const newProfile = {
        ...currentProfile,
        elo: currentProfile.elo + increment,
      };
      await saveUserProfile(newProfile);
      console.log('Elo updated:', newProfile.elo); // Debug log
    } catch (error) {
      console.error('Error updating elo:', error);
    }
  };

  const updateScanCount = async () => {
    const newProfile = {
      ...userProfile,
      totalScans: userProfile.totalScans + 1,
    };
    await saveUserProfile(newProfile);
  };

  const updateFavoritesCount = async (count) => {
    const newProfile = {
      ...userProfile,
      totalFavorites: count,
    };
    await saveUserProfile(newProfile);
  };

  const resetProfile = async () => {
    const defaultProfile = {
      name: 'Mads Mikkelsen',
      email: 'mads@example.com',
      memberSince: 'Jan 2025',
      elo: 230,
      totalScans: 0,
      totalFavorites: 0,
    };
    await saveUserProfile(defaultProfile);
  };

  return {
    userProfile,
    loading,
    updateElo,
    updateScanCount,
    updateFavoritesCount,
    resetProfile,
    loadUserProfile,
  };
}
