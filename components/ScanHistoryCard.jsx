import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function ScanHistoryCard({
  productName,
  store,
  price,
  shipping,
  eta,
  rating,
  date,
  imageSource,
  onShare,
  onRemove,
  removing,
}) {
  let displayDate = null;
  if (date) {
    if (date instanceof Date && !isNaN(date)) {
      displayDate = date.toLocaleDateString('da-DK');
    } else if (typeof date === 'string') {
      const parsed = new Date(date);
      displayDate = isNaN(parsed) ? date : parsed.toLocaleDateString('da-DK');
    }
  }
  return (
    <View style={styles.scanCard}>
      <Image source={imageSource} style={styles.scanCardBackground} resizeMode="cover" />
      <View style={styles.scanCardOverlay} />

      <View style={styles.scanCardHeader}>
        <View style={styles.scanCardTitleRow}>
          <Text style={styles.scanCardTitle}>{productName}</Text>
          <View style={styles.scanCardActions}>
            {onShare ? (
              <TouchableOpacity style={styles.shareButton} onPress={onShare}>
                <Ionicons name="share-outline" size={20} color={colors.text} />
              </TouchableOpacity>
            ) : null}
            {onRemove ? (
              <TouchableOpacity
                style={[styles.removeButton, removing && styles.removeButtonDisabled]}
                onPress={onRemove}
                disabled={removing}
              >
                <Text style={styles.removeIcon}>{removing ? '⏳' : '✕'}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.scanCardContent}>
        <View style={styles.scanCardLeft}>
          <View style={styles.scanCardInfo}>
            {store ? <Text style={styles.scanCardStore}>{store}</Text> : null}
            {shipping ? <Text style={styles.scanCardShipping}>Fragt: {shipping}</Text> : null}
            {eta ? <Text style={styles.scanCardEta}>{eta}</Text> : null}
            {rating ? <Text style={styles.scanCardRating}>✰ {rating}</Text> : null}
            {displayDate ? (
              <Text style={styles.scanCardDate}>Tilføjet: {displayDate}</Text>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.scanCardPriceContainer}>
        <Text style={styles.scanCardPrice}>{price}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scanCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    zIndex: 3,
  },
  scanCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  scanCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scanCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  shareButton: {
    padding: 4,
  },
  removeButton: {
    padding: 4,
  },
  removeButtonDisabled: {
    opacity: 0.5,
  },
  removeIcon: {
    fontSize: 22,
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  scanCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 3,
  },
  scanCardLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  scanCardInfo: {
    flex: 1,
  },
  scanCardStore: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
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
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scanCardDate: {
    fontSize: 12,
    color: colors.muted,
    fontStyle: 'italic',
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


