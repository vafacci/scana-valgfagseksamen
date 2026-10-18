import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Tap from './Tap';
import { colors } from '../theme/colors';
import { useLanguage } from '../store/LanguageContext';

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
  const { t } = useLanguage();

  let displayDate = null;
  if (date) {
    if (date instanceof Date && !isNaN(date)) {
      displayDate = date.toLocaleDateString('da-DK');
    } else if (typeof date === 'string') {
      const parsed = new Date(date);
      displayDate = isNaN(parsed) ? date : parsed.toLocaleDateString('da-DK');
    }
  }

  const image =
    typeof imageSource === 'string' ? { uri: imageSource } : imageSource;

  return (
    <View style={styles.card}>
      <View style={styles.thumb}>
        {image ? (
          <Image source={image} style={styles.thumbImage} resizeMode="cover" />
        ) : (
          <MaterialIcons name="photo-camera" size={20} color={colors.muted} />
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {productName}
          </Text>
          <View style={styles.actions}>
            {onShare ? (
              <Tap
                style={styles.iconButton}
                onPress={onShare}
                accessibilityRole="button"
                accessibilityLabel={t('share')}
              >
                <MaterialIcons name="share" size={20} color={colors.muted} />
              </Tap>
            ) : null}
            {onRemove ? (
              <Tap
                style={styles.iconButton}
                onPress={onRemove}
                disabled={removing}
                accessibilityRole="button"
                accessibilityLabel={t('delete')}
              >
                <MaterialIcons
                  name={removing ? 'hourglass-empty' : 'delete-outline'}
                  size={20}
                  color="#FF3B30"
                />
              </Tap>
            ) : null}
          </View>
        </View>

        {store ? <Text style={styles.meta}>{store}</Text> : null}
        {shipping ? (
          <Text style={styles.meta}>
            {t('shipping')}: {shipping}
          </Text>
        ) : null}
        {eta ? <Text style={styles.meta}>{eta}</Text> : null}
        {rating ? (
          <View style={styles.ratingRow}>
            <MaterialIcons name="star" size={14} color={colors.muted} />
            <Text style={styles.meta}>{rating}</Text>
          </View>
        ) : null}
        {price ? <Text style={styles.price}>{price}</Text> : null}
        {displayDate ? <Text style={styles.date}>{displayDate}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbImage: {
    width: 56,
    height: 56,
  },
  body: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
  },
  iconButton: {
    padding: 6,
    minWidth: 32,
    minHeight: 32,
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  price: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
  },
  date: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
});
