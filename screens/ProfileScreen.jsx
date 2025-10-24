import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import Avatar from '../components/Avatar';
import StatTile from '../components/StatTile';
import ListItem from '../components/ListItem';
import SettingsScreen from './SettingsScreen';
import { useScanHistory } from '../store/useScanHistory';
import { useFavorites } from '../store/useFavorites';
import { useUserProfile } from '../store/useUserProfile';
import { useLanguage } from '../store/LanguageContext';

export default function ProfileScreen({ navigation }) {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [removingScanId, setRemovingScanId] = useState(null);
  const { scanHistory, loading, loadScanHistory, removeScan } = useScanHistory();
  const { favorites, loadFavorites } = useFavorites();
  const { userProfile, loadUserProfile, updateFavoritesCount } = useUserProfile();
  const { t, language } = useLanguage();
  
  console.log('ProfileScreen rendered!', {
    scanHistoryLength: scanHistory.length,
    favoritesLength: favorites.length,
    userElo: userProfile.elo,
    shouldAnimate,
    currentLanguage: language
  }); // Debug log

  // Refresh data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      console.log('ProfileScreen focused, loading data...');
      setShouldAnimate(false); // Reset animation state first
      
      // Load all data
      await Promise.all([
        loadScanHistory(),
        loadFavorites(),
        loadUserProfile()
      ]);
      
      // Trigger animation after data is loaded
      setTimeout(() => {
        setShouldAnimate(true);
      }, 200);
    });

    return unsubscribe;
  }, [navigation, loadScanHistory, loadFavorites, loadUserProfile]);

  // Reset animation state when screen loses focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setShouldAnimate(false);
    });

    return unsubscribe;
  }, [navigation]);

  // Update favorites count when favorites change
  useEffect(() => {
    if (favorites.length !== userProfile.totalFavorites) {
      updateFavoritesCount(favorites.length);
    }
  }, [favorites.length, userProfile.totalFavorites, updateFavoritesCount]);

  // Handle removing a scan
  const handleRemoveScan = async (scanId) => {
    try {
      setRemovingScanId(scanId);
      await removeScan(scanId);
      console.log('Scan removed:', scanId);
    } catch (error) {
      console.error('Error removing scan:', error);
    } finally {
      setRemovingScanId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Avatar and Gear */}
        <View style={styles.header}>
          <Avatar 
            name={userProfile.name} 
            subtitle={`${t('memberSince')} ${userProfile.memberSince}`}
            size={60}
            imageUrl="https://image.euroman.dk/5630446.webp?imageId=5630446&x=0.00&y=2.20&cropw=100.00&croph=95.59&width=1200&height=684&format=jpg"
          />
          <TouchableOpacity 
            style={styles.gearButton}
            onPress={() => setSettingsVisible(true)}
          >
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatTile 
            key={`scans-${scanHistory.length}-${shouldAnimate}`}
            icon="📱" 
            value={scanHistory.length.toString()} 
            label={t('scans')} 
            animated={shouldAnimate}
          />
          <StatTile 
            key={`favorites-${favorites.length}-${shouldAnimate}`}
            icon="❤️" 
            value={favorites.length.toString()} 
            label={t('favorites')} 
            animated={shouldAnimate}
          />
          <StatTile 
            key={`elo-${userProfile.elo}-${shouldAnimate}`}
            icon="🏆" 
            value={userProfile.elo.toString()} 
            label={t('elo')} 
            animated={shouldAnimate}
          />
        </View>

        {/* Recent Scans Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('recentScans')}</Text>
          {loading ? (
            <Text style={styles.loadingText}>{t('loading')}</Text>
          ) : scanHistory.length > 0 ? (
            scanHistory.map((scan) => (
              <View key={scan.id} style={styles.scanCard}>
                <View style={styles.scanCardHeader}>
                  <Text style={styles.scanCardTitle}>{scan.productName}</Text>
                  <TouchableOpacity 
                    style={[
                      styles.removeButton,
                      removingScanId === scan.id && styles.removeButtonDisabled
                    ]}
                    onPress={() => handleRemoveScan(scan.id)}
                    disabled={removingScanId === scan.id}
                  >
                    <Text style={styles.removeIcon}>
                      {removingScanId === scan.id ? '⏳' : '✕'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.scanCardContent}>
                  <View style={styles.scanCardLeft}>
                    <Text style={styles.scanCardStore}>Proshop</Text>
                    <Text style={styles.scanCardShipping}>Fragt: 29 kr</Text>
                    <Text style={styles.scanCardEta}>2-4 dage</Text>
                    <Text style={styles.scanCardRating}>✰ 4.4 (1800)</Text>
                    <Text style={styles.scanCardDate}>Tilføjet: {new Date(scan.date).toLocaleDateString('da-DK')}</Text>
                  </View>
                  
                  <View style={styles.scanCardRight}>
                    <Text style={styles.scanCardPrice}>{scan.price}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>{t('noScansYet')}</Text>
          )}
        </View>
      </ScrollView>
      
      {/* Settings Modal */}
      <SettingsScreen 
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
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
  scrollView: {
    flex: 1,
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
    marginTop: 20,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  scanCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  scanCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scanCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  removeButtonDisabled: {
    opacity: 0.5,
  },
  removeIcon: {
    fontSize: 18,
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  scanCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scanCardLeft: {
    flex: 1,
  },
  scanCardStore: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  scanCardShipping: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
  },
  scanCardEta: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
  },
  scanCardRating: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 8,
  },
  scanCardDate: {
    fontSize: 12,
    color: colors.muted,
    fontStyle: 'italic',
  },
  scanCardRight: {
    alignItems: 'flex-end',
  },
  scanCardPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
});
