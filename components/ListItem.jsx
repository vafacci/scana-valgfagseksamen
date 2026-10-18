import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function ListItem({ thumbnail, title, date, price }) {
  const image = typeof thumbnail === 'string' ? { uri: thumbnail } : thumbnail;

  return (
    <View style={styles.container}>
      <View style={styles.thumbnailContainer}>
        {image ? (
          <Image source={image} style={styles.thumbnail} resizeMode="cover" />
        ) : (
          <MaterialIcons name="photo-camera" size={20} color={colors.muted} />
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.details}>
          {date ? <Text style={styles.dateText}>{date}</Text> : null}
          {price ? <Text style={styles.price}>{price}</Text> : null}
        </View>
      </View>

      <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  thumbnailContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.bg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  dateText: {
    fontSize: 12,
    color: colors.muted,
  },
  price: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
});
