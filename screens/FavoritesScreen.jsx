import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useFavorites } from '../store/useFavorites';

export default function FavoritesScreen() {
  const { favorites, loading, removeFromFavorites } = useFavorites();

  // Function to get product image based on favorite ID
  const getProductImage = (favoriteId) => {
    const imageNumber = (favoriteId % 19) + 1; // Updated to 19 since 18.jpg doesn't exist
    const imageMap = {
      1: require('../assets/1.jpg'),
      2: require('../assets/2.jpg'),
      3: require('../assets/3.jpg'),
      4: require('../assets/4.jpg'),
      5: require('../assets/5.jpg'),
      6: require('../assets/8.jpg'), // Use 8.jpg
      7: require('../assets/9.jpg'), // Use 9.jpg
      8: require('../assets/8.jpg'),
      9: require('../assets/9.jpg'),
      10: require('../assets/10.jpg'),
      11: require('../assets/11.jpg'),
      12: require('../assets/12.jpg'),
      13: require('../assets/13.jpg'),
      14: require('../assets/14.jpg'),
      15: require('../assets/15.jpg'),
      16: require('../assets/16.jpg'),
      17: require('../assets/17.jpg'),
      18: require('../assets/19.jpg'), // Use 19.jpg instead of missing 18.jpg
      19: require('../assets/20.jpg'),
    };
    return imageMap[imageNumber] || require('../assets/1.jpg');
  };

  const handleShareFavorite = async (favorite) => {
    try {
      const shareMessage = `Tjek dette produkt:\n\n${favorite.productName}\nPris: ${favorite.price}\n\nFra PriceScan app!`;

      await Share.share({
        message: shareMessage,
        title: favorite.productName,
      });
    } catch (error) {
      console.error('Error sharing favorite:', error);
      Alert.alert('Fejl', 'Kunne ikke dele denne favorit.');
    }
  };

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.scanCard}>
      {/* Background Image */}
      <Image 
        source={getProductImage(item.id)}
        style={styles.scanCardBackground}
        resizeMode="cover"
      />
      
      {/* Overlay for better text readability */}
      <View style={styles.scanCardOverlay} />
      
      <View style={styles.scanCardHeader}>
        <View style={styles.scanCardTitleRow}>
          <Text style={styles.scanCardTitle}>{item.productName}</Text>
          <View style={styles.scanCardActions}>
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={() => handleShareFavorite(item)}
            >
              <Ionicons name="share-outline" size={20} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => removeFromFavorites(item.id)}
            >
              <Text style={styles.removeIcon}>❌</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <View style={styles.scanCardContent}>
        <View style={styles.scanCardInfo}>
          <Text style={styles.scanCardStore}>{item.store}</Text>
          <Text style={styles.scanCardShipping}>Fragt: {item.shipping}</Text>
          <Text style={styles.scanCardEta}>{item.eta} dage</Text>
          <Text style={styles.scanCardRating}>✰ {item.rating}</Text>
        </View>
      </View>
      
      {/* Price in bottom right */}
      <View style={styles.scanCardPriceContainer}>
        <Text style={styles.scanCardPrice}>{item.price}kr,-</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.title}>Dine favoritter</Text>
        <Text style={styles.subtitle}>
          {favorites.length === 0 
            ? 'Ingen favoritter endnu' 
            : `${favorites.length} favorit${favorites.length === 1 ? '' : 'er'}`
          }
        </Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💔</Text>
          <Text style={styles.emptyTitle}>Ingen favoritter</Text>
          <Text style={styles.emptySubtitle}>
            Tap på hjerteikonet i prislisten for at tilføje favoritter
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    lineHeight: 22,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  // Scan Card Styles (matching ProfileScreen)
  scanCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  scanCardBackground: {
    position: 'absolute',
    top: -100,
    left: -50,
    right: -50,
    bottom: -100,
    width: '150%',
    height: '200%',
    zIndex: 1,
    transform: [{ translateX: 0 }, { translateY: 0 }],
  },
  scanCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    zIndex: 2,
  },
  scanCardHeader: {
    zIndex: 3,
    marginBottom: 12,
  },
  scanCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  scanCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scanCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareButton: {
    padding: 4,
  },
  removeButton: {
    padding: 4,
  },
  removeIcon: {
    fontSize: 22,
    color: colors.text,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scanCardContent: {
    zIndex: 3,
  },
  scanCardInfo: {
    flex: 1,
  },
  scanCardStore: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scanCardShipping: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scanCardEta: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scanCardRating: {
    fontSize: 14,
    color: colors.muted,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scanCardPriceContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 3,
  },
  scanCardPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
