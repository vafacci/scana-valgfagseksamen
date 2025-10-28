import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@scana_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addToFavorites = async (offer) => {
    // Include product name in ID to make it unique per product
    const offerId = `${offer.productName || 'unknown'}-${offer.store}-${offer.price}`;
    const isAlreadyFavorite = favorites.some(fav => fav.id === offerId);
    
    if (!isAlreadyFavorite) {
      const newFavorite = {
        id: offerId,
        store: offer.store,
        price: offer.price,
        shipping: offer.shipping,
        eta: offer.eta,
        rating: offer.rating,
        reviewCount: offer.reviewCount,
        productName: offer.productName || 'Unknown Product',
        productImage: offer.productImage, // Add product image
        category: offer.category || 'Electronics', // Add category
        description: offer.description || '', // Add description
        addedAt: new Date().toISOString(),
      };
      
      const newFavorites = [...favorites, newFavorite];
      await saveFavorites(newFavorites);
    }
  };

  const removeFromFavorites = async (offerId) => {
    const newFavorites = favorites.filter(fav => fav.id !== offerId);
    await saveFavorites(newFavorites);
  };

  const toggleFavorite = async (offer) => {
    // Include product name in ID to make it unique per product
    const offerId = `${offer.productName || 'unknown'}-${offer.store}-${offer.price}`;
    const isFavorite = favorites.some(fav => fav.id === offerId);
    
    if (isFavorite) {
      await removeFromFavorites(offerId);
    } else {
      await addToFavorites(offer);
    }
  };

  const isFavorite = (offer) => {
    // Include product name in ID to make it unique per product
    const offerId = `${offer.productName || 'unknown'}-${offer.store}-${offer.price}`;
    return favorites.some(fav => fav.id === offerId);
  };

  const clearFavorites = async () => {
    await saveFavorites([]);
  };

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    loadFavorites,
  };
}
