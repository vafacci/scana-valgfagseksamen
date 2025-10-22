import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../theme/colors';

export default function ListItem({ thumbnail, title, date, price }) {
  return (
    <View style={styles.container}>
      <View style={styles.thumbnailContainer}>
        <View style={styles.thumbnailPlaceholder}>
          <Text style={styles.thumbnailText}>📱</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.details}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{date}</Text>
          </View>
          <Text style={styles.price}>{price}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbnailContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.card,
    marginRight: 12,
    overflow: 'hidden',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateBadge: {
    backgroundColor: colors.card,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dateText: {
    fontSize: 12,
    color: colors.muted,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});
