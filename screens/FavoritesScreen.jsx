import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Share, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useFavorites } from '../store/useFavorites';
import { useLanguage } from '../store/LanguageContext';
import ScanHistoryCard from '../components/ScanHistoryCard';
import WebScroll from '../components/WebScroll';

export default function FavoritesScreen() {
  const { favorites, loading, removeFromFavorites } = useFavorites();
  const { t } = useLanguage();

  const getProductImage = (favoriteId) => {
    const imageNumber = (Number(favoriteId) % 19) + 1;
    const imageMap = {
      1: require('../assets/1.jpg'),
      2: require('../assets/2.jpg'),
      3: require('../assets/3.jpg'),
      4: require('../assets/4.jpg'),
      5: require('../assets/5.jpg'),
      6: require('../assets/8.jpg'),
      7: require('../assets/9.jpg'),
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
      18: require('../assets/19.jpg'),
      19: require('../assets/20.jpg'),
    };
    return imageMap[imageNumber] || require('../assets/1.jpg');
  };

  const handleShareFavorite = async (favorite) => {
    try {
      await Share.share({
        message: `${favorite.productName}\n${favorite.price}`,
        title: favorite.productName,
      });
    } catch (error) {
      console.error('Error sharing favorite:', error);
      Alert.alert(t('error'), t('shareFailed'));
    }
  };

  const renderFavoriteItem = ({ item }) => {
    const imageSource = item.productImage || getProductImage(item.id);
    const eta = item.eta ? `${item.eta} ${t('days')}` : undefined;

    return (
      <ScanHistoryCard
        productName={item.productName}
        store={item.store}
        price={typeof item.price === 'number' ? `${item.price}kr,-` : item.price}
        shipping={item.shipping}
        eta={eta}
        rating={item.rating}
        date={item.addedAt}
        imageSource={imageSource}
        onShare={() => handleShareFavorite(item)}
        onRemove={() => removeFromFavorites(item.id)}
      />
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.subtitle}>{t('loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const subtitle =
    favorites.length === 0
      ? t('noFavorites')
      : `${favorites.length} ${t('favorites').toLowerCase()}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('yourFavorites')}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons
            name="favorite-border"
            size={48}
            color={colors.muted}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>{t('noFavorites')}</Text>
          <Text style={styles.emptySubtitle}>{t('noFavoritesHint')}</Text>
        </View>
      ) : (
        <WebScroll contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {favorites.map((item) => (
            <View key={String(item.id)}>{renderFavoriteItem({ item })}</View>
          ))}
        </WebScroll>
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
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
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
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
});
