import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Share, Alert, Image } from 'react-native';
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

  const handleShareSingleScan = async (scan) => {
    try {
      const shareMessage = `Tjek dette produkt:\n\n${scan.productName}\nPris: ${scan.price}\n\nScannet med PriceScan app!`;

      await Share.share({
        message: shareMessage,
        title: scan.productName,
      });
    } catch (error) {
      console.error('Error sharing scan:', error);
      Alert.alert('Fejl', 'Kunne ikke dele denne scan.');
    }
  };

  // Function to get product image based on scan ID
  const getProductImage = (scanId) => {
    const imageNumber = (scanId % 20) + 1; // Cycle through 1-20
    const imageMap = {
      1: require('../assets/1.jpg'),
      2: require('../assets/2.jpg'),
      3: require('../assets/3.jpg'),
      4: require('../assets/4.jpg'),
      5: require('../assets/5.jpg'),
      6: require('../assets/8.jpg'), // Use 8.jpg instead of missing 6.jpg
      7: require('../assets/9.jpg'), // Use 9.jpg instead of missing 7.jpg
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
      18: require('../assets/19.jpg'), // Use 19.jpg instead of missing 18.jpg
      19: require('../assets/19.jpg'),
      20: require('../assets/20.jpg'),
    };
    return imageMap[imageNumber] || require('../assets/1.jpg');
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
                 {/* Background Image */}
                 <Image 
                   source={getProductImage(scan.id)}
                   style={styles.scanCardBackground}
                   resizeMode="cover"
                 />
                 
                 {/* Overlay for better text readability */}
                 <View style={styles.scanCardOverlay} />
                 
                 <View style={styles.scanCardHeader}>
                   <View style={styles.scanCardTitleRow}>
                     <Text style={styles.scanCardTitle}>{scan.productName}</Text>
                     <View style={styles.scanCardActions}>
                       <TouchableOpacity 
                         style={styles.shareButton}
                         onPress={() => handleShareSingleScan(scan)}
                       >
                         <Ionicons name="share-outline" size={20} color={colors.text} />
                       </TouchableOpacity>
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
                   </View>
                 </View>
                 
                 <View style={styles.scanCardContent}>
                   <View style={styles.scanCardLeft}>
                     <View style={styles.scanCardInfo}>
                       <Text style={styles.scanCardStore}>Proshop</Text>
                       <Text style={styles.scanCardShipping}>Fragt: 29 kr</Text>
                       <Text style={styles.scanCardEta}>2-4 dage</Text>
                       <Text style={styles.scanCardRating}>✰ 4.4 (1800)</Text>
                       <Text style={styles.scanCardDate}>Tilføjet: {new Date(scan.date).toLocaleDateString('da-DK')}</Text>
                     </View>
                   </View>
                 </View>
                 
                 {/* Price positioned at bottom right */}
                 <View style={styles.scanCardPriceContainer}>
                   <Text style={styles.scanCardPrice}>{scan.price}</Text>
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
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
    transform: [{ translateX: 0 }, { translateY: 0 }],
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
