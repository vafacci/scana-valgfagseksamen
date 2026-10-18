import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Tap from './Tap';
import { colors } from '../theme/colors';
import { useLanguage } from '../store/LanguageContext';
import { formatPrice } from '../data/catalog';

const BADGE_KEYS = {
  cheapest: 'cheapestBadge',
  fastest: 'fastestBadge',
  recommended: 'recommendedBadge',
};

export default function OfferListItem({
  store,
  price,
  shipping,
  eta,
  rating,
  favorite,
  onToggleFavorite,
  onPressStore,
  badgeType,
  isLowest,
}) {
  const { t } = useLanguage();
  const badgeKey = BADGE_KEYS[badgeType];

  return (
    <View style={styles.offerCard}>
      <View style={styles.offerHeader}>
        <Tap
          style={styles.storeBlock}
          onPress={onPressStore}
          accessibilityRole="button"
          accessibilityLabel={`${store}, ${formatPrice(price)}`}
        >
          <Text style={styles.storeName} numberOfLines={1}>{store}</Text>
          {badgeKey ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{t(badgeKey)}</Text>
            </View>
          ) : null}
        </Tap>
        <Tap
          style={styles.heartButton}
          onPress={onToggleFavorite}
          accessibilityRole="button"
          accessibilityLabel={favorite ? t('removeFromFavorites') : t('addToFavorites')}
        >
          <MaterialIcons
            name={favorite ? 'favorite' : 'favorite-border'}
            size={22}
            color={favorite ? '#FF3B30' : 'rgba(255, 255, 255, 0.9)'}
          />
        </Tap>
      </View>

      <Tap style={styles.offerBody} onPress={onPressStore}>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MaterialIcons name="star" size={14} color={colors.primary} />
            <Text style={styles.metaText}>{rating}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="schedule" size={14} color={colors.muted} />
            <Text style={styles.metaText}>{eta} {t('days')}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="local-shipping" size={14} color={colors.muted} />
            <Text style={styles.metaText}>{t('shipping')}: {shipping}</Text>
          </View>
        </View>

        <View style={styles.offerFooter}>
          <Text style={[styles.price, isLowest && styles.priceLowest]}>
            {formatPrice(price)}
          </Text>
          <View style={styles.storeButton}>
            <Text style={styles.storeButtonText}>{t('searchAtStore')} {store}</Text>
            <MaterialIcons name="open-in-new" size={16} color={colors.text} />
          </View>
        </View>
      </Tap>
    </View>
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
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  storeBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  storeName: {
    fontSize: 17,
    color: colors.text,
    fontWeight: '600',
    lineHeight: 22,
  },
  badge: {
    backgroundColor: 'rgba(59, 110, 246, 0.18)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  heartButton: {
    padding: 4,
    marginTop: -4,
  },
  offerBody: {
    alignSelf: 'stretch',
    width: '100%',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
  },
  offerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 28,
    flexShrink: 1,
  },
  priceLowest: {
    color: colors.primary,
  },
  storeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    minHeight: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    maxWidth: 180,
  },
  storeButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
});
