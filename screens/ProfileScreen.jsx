import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Share, Alert } from 'react-native';
import WebScroll from '../components/WebScroll';
import Tap from '../components/Tap';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import ScanHistoryCard from '../components/ScanHistoryCard';
import Avatar from '../components/Avatar';
import StatTile from '../components/StatTile';
import SettingsScreen from './SettingsScreen';
import { useScanHistory } from '../store/useScanHistory';
import { useFavorites } from '../store/useFavorites';
import { useUserProfile } from '../store/useUserProfile';
import { useLanguage } from '../store/LanguageContext';
import { useAuth } from '../store/useAuth';

export default function ProfileScreen({ navigation }) {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [removingScanId, setRemovingScanId] = useState(null);
  const { scanHistory, loading, loadScanHistory, removeScan } = useScanHistory();
  const { favorites, loadFavorites } = useFavorites();
  const { userProfile, loadUserProfile, updateFavoritesCount } = useUserProfile();
  const { user } = useAuth();
  const { t } = useLanguage();
  const displayName = userProfile.name || user?.name || t('guest');
  const displayEmail =
    userProfile.email ||
    (user?.provider && user.provider !== 'email' ? user.name : user?.email) ||
    `${t('memberSince')} ${userProfile.memberSince}`;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setShouldAnimate(false);

      await Promise.all([loadScanHistory(), loadFavorites(), loadUserProfile()]);

      setTimeout(() => {
        setShouldAnimate(true);
      }, 200);
    });

    return unsubscribe;
  }, [navigation, loadScanHistory, loadFavorites, loadUserProfile]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setShouldAnimate(false);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (favorites.length !== userProfile.totalFavorites) {
      updateFavoritesCount(favorites.length);
    }
  }, [favorites.length, userProfile.totalFavorites, updateFavoritesCount]);

  const handleRemoveScan = async (scanId) => {
    try {
      setRemovingScanId(scanId);
      await removeScan(scanId);
    } catch (error) {
      console.error('Error removing scan:', error);
    } finally {
      setRemovingScanId(null);
    }
  };

  const handleShareSingleScan = async (scan) => {
    try {
      await Share.share({
        message: `${scan.productName}\n${scan.price}`,
        title: scan.productName,
      });
    } catch (error) {
      console.error('Error sharing scan:', error);
      Alert.alert(t('error'), t('shareFailed'));
    }
  };

  const getProductImage = (scanId) => {
    const imageNumber = (Number(scanId) % 20) + 1;
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
      19: require('../assets/19.jpg'),
      20: require('../assets/20.jpg'),
    };
    return imageMap[imageNumber] || require('../assets/1.jpg');
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebScroll
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Avatar
            name={displayName}
            subtitle={displayEmail}
            size={60}
          />
          <Tap
            style={styles.gearButton}
            onPress={() => setSettingsVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={t('settings')}
          >
            <MaterialIcons name="settings" size={22} color={colors.muted} />
          </Tap>
        </View>

        <View style={styles.statsRow}>
          <StatTile
            key={`scans-${scanHistory.length}-${shouldAnimate}`}
            icon="photo-camera"
            value={scanHistory.length.toString()}
            label={t('scans')}
            animated={shouldAnimate}
          />
          <StatTile
            key={`favorites-${favorites.length}-${shouldAnimate}`}
            icon="favorite"
            value={favorites.length.toString()}
            label={t('favorites')}
            animated={shouldAnimate}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('recentScans')}</Text>
          {loading ? (
            <Text style={styles.loadingText}>{t('loading')}</Text>
          ) : scanHistory.length > 0 ? (
            scanHistory.map((scan) => (
              <ScanHistoryCard
                key={scan.id}
                productName={scan.productName}
                price={scan.price}
                date={scan.date}
                imageSource={scan.photoUri || getProductImage(scan.id)}
                onShare={() => handleShareSingleScan(scan)}
                onRemove={() => handleRemoveScan(scan.id)}
                removing={removingScanId === scan.id}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="photo-camera" size={36} color={colors.muted} />
              <Text style={styles.emptyText}>{t('noScansYet')}</Text>
            </View>
          )}
        </View>
      </WebScroll>

      {settingsVisible ? (
        <SettingsScreen
          visible
          onClose={() => setSettingsVisible(false)}
          navigation={navigation}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 24,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  gearButton: {
    padding: 8,
    marginLeft: 16,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 28,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
