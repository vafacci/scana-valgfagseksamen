import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { useFavorites } from '../store/useFavorites';

export default function FavoritesScreen() {
  const { favorites, loading, removeFromFavorites } = useFavorites();

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.favoriteCard}>
      <View style={styles.favoriteHeader}>
        <Text style={styles.productName}>{item.productName}</Text>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeFromFavorites(item.id)}
        >
          <Text style={styles.removeIcon}>❌</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.storeInfo}>
        <Text style={styles.storeName}>{item.store}</Text>
        <Text style={styles.price}>{item.price}kr,-</Text>
      </View>
      
      <View style={styles.detailsSection}>
        <Text style={styles.shipping}>Fragt: {item.shipping}</Text>
        <Text style={styles.eta}>{item.eta}</Text>
        <Text style={styles.rating}>✰ {item.rating} ({item.reviewCount})</Text>
      </View>
      
      <Text style={styles.addedDate}>
        Tilføjet: {new Date(item.addedAt).toLocaleDateString('da-DK')}
      </Text>
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
  topLabel: {
    color: colors.muted,
    fontSize: 14,
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
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
  favoriteCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  favoriteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  removeIcon: {
    fontSize: 16,
  },
  storeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  storeName: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: '500',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  detailsSection: {
    marginBottom: 12,
  },
  shipping: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
  },
  eta: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: colors.muted,
  },
  addedDate: {
    fontSize: 12,
    color: colors.muted,
    fontStyle: 'italic',
  },
});
