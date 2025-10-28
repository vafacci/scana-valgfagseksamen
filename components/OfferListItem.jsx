import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export default function OfferListItem({
  store,
  price,
  shipping,
  eta,
  rating,
  favorite,
  onToggleFavorite,
  onPressStore,
}) {
  return (
    <TouchableOpacity style={styles.offerCard} activeOpacity={0.85}>
      <View style={styles.offerHeader}>
        <Text style={styles.storeName}>{store}</Text>
        <TouchableOpacity style={styles.heartButtonHeader} onPress={onToggleFavorite}>
          <Text style={[styles.heartIconHeader, favorite && styles.heartFilled]}>
            {favorite ? '❤️' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.offerContentWrapper}>
        <View style={styles.offerLeftContent}>
          <Text style={styles.price}>{price}kr,-</Text>
          <Text style={styles.shipping}>Fragt: {shipping}</Text>
          <Text style={styles.eta}>{eta} dage</Text>
          <Text style={styles.rating}>✰ {rating}</Text>
        </View>

        <View style={styles.offerActions}>
          <TouchableOpacity style={styles.storeButton} onPress={onPressStore}>
            <Text style={styles.storeButtonText}>Gå til butik</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  offerCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 16,
    minHeight: 140,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  offerContentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
  },
  offerLeftContent: {
    flex: 1,
  },
  offerActions: {
    alignSelf: 'flex-end',
    minWidth: 120,
    maxWidth: 160,
  },
  heartButtonHeader: { padding: 8, marginTop: -4 },
  heartIconHeader: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    width: 24,
    height: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  heartFilled: { color: '#FF3B30' },
  storeName: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
    lineHeight: 22,
    flex: 1,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 1)',
    marginBottom: 8,
    lineHeight: 30,
  },
  shipping: { fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', marginBottom: 2, lineHeight: 19 },
  eta: { fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', marginBottom: 2, lineHeight: 19 },
  rating: { fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', lineHeight: 19 },
  storeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeButtonText: { color: colors.text, fontSize: 15, fontWeight: '600', lineHeight: 20 },
});


