import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, FlatList, ScrollView, Animated } from 'react-native';
import { colors } from '../theme/colors';
import { useFavorites } from '../store/useFavorites';
import priceData from '../data/prices.json';

export default function ResultsScreen({ navigation, route }) {
  const { product, barcode, productName, photoUri } = route.params || {};
  const { toggleFavorite, isFavorite } = useFavorites();
  
  // Filter state
  const [activeFilter, setActiveFilter] = useState('billigste');
  
  // Animation values for recommended products
  const cardAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  
  const pulseAnimations = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;
  
  // Animation values for filter buttons
  const filterAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  
  const filterPulseAnimations = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;
  
  // Start animations on mount
  useEffect(() => {
    // Staggered entrance animations for recommended cards
    const cardAnimationsSequence = Animated.stagger(200, 
      cardAnimations.map(anim => 
        Animated.spring(anim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      )
    );
    
    // Staggered entrance animations for filter buttons
    const filterAnimationsSequence = Animated.stagger(150,
      filterAnimations.map(anim =>
        Animated.spring(anim, {
          toValue: 1,
          tension: 120,
          friction: 7,
          useNativeDriver: true,
        })
      )
    );
    
    // Start entrance animations
    Animated.parallel([
      cardAnimationsSequence,
      filterAnimationsSequence,
    ]).start();
    
    // Subtle pulse animations for recommended cards
    pulseAnimations.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.05,
            duration: 2000 + (index * 500),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000 + (index * 500),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
    
    // Subtle pulse animations for filter buttons
    filterPulseAnimations.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.02,
            duration: 3000 + (index * 300),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000 + (index * 300),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);
  
  // Use product data from barcode scan or fallback to mock data
  const productData = product || {
    name: productName || 'Apple AirPods Pro (2nd Gen)',
    price: '1,899 kr',
    category: 'Electronics',
    description: 'Active noise cancellation with Adaptive Transparency',
    image: photoUri || 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361'
  };
  
  // Find the product in our mock data for price comparison
  const priceComparison = priceData.find(item => 
    item.name === productData.name || item.name === 'Apple AirPods Pro (2nd Gen)'
  );
  
  // Sort offers based on active filter
  const sortedOffers = priceComparison?.offers.sort((a, b) => {
    switch (activeFilter) {
      case 'billigste':
        return a.price - b.price;
      case 'hurtigste':
        return parseInt(a.eta) - parseInt(b.eta);
      case 'anbefalet':
        // Anbefalingsscore: rating først, derefter laveste pris (fallback)
        const ratingDiff = parseFloat(b.rating) - parseFloat(a.rating);
        if (ratingDiff !== 0) return ratingDiff;
        // Hvis rating er ens, sortér efter laveste pris
        return a.price - b.price;
      default:
        return a.price - b.price;
    }
  }) || [];

  const renderOfferItem = ({ item }) => {
    const favorite = isFavorite(item);
    
    return (
      <View style={styles.offerCard}>
        <View style={styles.offerLeft}>
          <Text style={styles.storeName}>{item.store}</Text>
          
          <Text style={styles.price}>{item.price}kr,-</Text>
          
          <View style={styles.detailsRow}>
            <Text style={styles.shipping}>Fragt: {item.shipping}</Text>
            <Text style={styles.eta}>{item.eta}</Text>
            <Text style={styles.rating}>✰ {item.rating}</Text>
          </View>
        </View>
        
        <View style={styles.offerRight}>
          <TouchableOpacity 
            style={styles.heartButton}
            onPress={() => toggleFavorite({ ...item, productName })}
          >
            <Text style={[styles.heartIcon, favorite && styles.heartFilled]}>
              {favorite ? '❤️' : '♡'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.storeButton}>
            <Text style={styles.storeButtonText}>Gå til butik</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section - Fixed */}
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => navigation.navigate('Tabs')}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Anbefalede Produkter - FIXED AT THE TOP */}
      <View style={styles.recommendedContainer}>
        <Text style={styles.sectionTitle}>Anbefalede Produkter</Text>
        <View style={styles.recommendedGrid}>
          <Animated.View style={[
            styles.recommendedCard,
            {
              transform: [
                { scale: cardAnimations[0] },
                { scale: pulseAnimations[0] }
              ]
            }
          ]}>
            <Image 
              source={{ uri: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361' }} 
              style={styles.recommendedImage}
              resizeMode="cover"
            />
            <Text style={styles.recommendedName}>Apple AirPods Pro (3rd Gen)</Text>
            <Text style={styles.recommendedPrice}>2,199 kr</Text>
            <TouchableOpacity style={styles.recommendedButton}>
              <Text style={styles.recommendedButtonText}>Se tilbud</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View style={[
            styles.recommendedCard,
            {
              transform: [
                { scale: cardAnimations[1] },
                { scale: pulseAnimations[1] }
              ]
            }
          ]}>
            <Image 
              source={{ uri: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361' }} 
              style={styles.recommendedImage}
              resizeMode="cover"
            />
            <Text style={styles.recommendedName}>Sony WH-1000XM5</Text>
            <Text style={styles.recommendedPrice}>2,499 kr</Text>
            <TouchableOpacity style={styles.recommendedButton}>
              <Text style={styles.recommendedButtonText}>Se tilbud</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View style={[
            styles.recommendedCard,
            {
              transform: [
                { scale: cardAnimations[2] },
                { scale: pulseAnimations[2] }
              ]
            }
          ]}>
            <Image 
              source={{ uri: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361' }} 
              style={styles.recommendedImage}
              resizeMode="cover"
            />
            <Text style={styles.recommendedName}>Bose QuietComfort</Text>
            <Text style={styles.recommendedPrice}>2,799 kr</Text>
            <TouchableOpacity style={styles.recommendedButton}>
              <Text style={styles.recommendedButtonText}>Se tilbud</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'billigste' && styles.filterTabActive]}
          onPress={() => setActiveFilter('billigste')}
          accessibilityLabel="Billigste"
          accessibilityRole="button"
          accessibilityState={{ selected: activeFilter === 'billigste' }}
        >
          <Text style={[styles.filterText, activeFilter === 'billigste' && styles.filterTextActive]}>
            Billigste
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'hurtigste' && styles.filterTabActive]}
          onPress={() => setActiveFilter('hurtigste')}
          accessibilityLabel="Hurtigste"
          accessibilityRole="button"
          accessibilityState={{ selected: activeFilter === 'hurtigste' }}
        >
          <Text style={[styles.filterText, activeFilter === 'hurtigste' && styles.filterTextActive]}>
            Hurtigste
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'anbefalet' && styles.filterTabActive]}
          onPress={() => setActiveFilter('anbefalet')}
          accessibilityLabel="Anbefalet"
          accessibilityRole="button"
          accessibilityState={{ selected: activeFilter === 'anbefalet' }}
        >
          <Text style={[styles.filterText, activeFilter === 'anbefalet' && styles.filterTextActive]}>
            Anbefalet
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {/* Product Info */}
          <View style={styles.productInfo}>
            <View style={styles.productHeader}>
              <View style={styles.productTextInfo}>
                <Text style={styles.productName}>{productData.name}</Text>
                <Text style={styles.productCategory}>{productData.category}</Text>
                <Text style={styles.productDescription}>{productData.description}</Text>
                {barcode && (
                  <Text style={styles.barcodeInfo}>Barcode: {barcode}</Text>
                )}
              </View>
              <Image 
                source={{ uri: productData.image }} 
                style={styles.productImage}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Price List */}
          <View style={styles.priceListContainer}>
            {sortedOffers.map((item, index) => {
              const favorite = isFavorite(item);
              return (
                <TouchableOpacity 
                  key={index} 
                  style={styles.offerCard}
                  activeOpacity={0.8}
                >
                  {/* Header Row */}
                  <View style={styles.offerHeader}>
                    <Text style={styles.storeName}>{item.store}</Text>
                    <TouchableOpacity 
                      style={styles.heartButtonHeader}
                      onPress={() => toggleFavorite({ ...item, productName })}
                    >
                      <Text style={[styles.heartIconHeader, favorite && styles.heartFilled]}>
                        {favorite ? '❤️' : '♡'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Content Area */}
                  <View style={styles.offerContentWrapper}>
                    <View style={styles.offerLeftContent}>
                      <Text style={styles.price}>{item.price}kr,-</Text>
                      <Text style={styles.shipping}>Fragt: {item.shipping}</Text>
                      <Text style={styles.eta}>{item.eta} dage</Text>
                      <Text style={styles.rating}>✰ {item.rating}</Text>
                    </View>
                    
                    <View style={styles.offerActions}>
                      <TouchableOpacity style={styles.storeButton}>
                        <Text style={styles.storeButtonText}>Gå til butik</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backArrow: {
    color: colors.text,
    fontSize: 24,
    marginRight: 16,
  },
  topLabel: {
    color: colors.muted,
    fontSize: 14,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    lineHeight: 22,
  },
  productInfo: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  productTextInfo: {
    flex: 1,
    marginRight: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  productCategory: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
    marginBottom: 8,
  },
  barcodeInfo: {
    fontSize: 12,
    color: colors.muted,
    fontFamily: 'monospace',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: colors.card,
  },
  priceListContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
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
  heartButtonHeader: {
    padding: 8,
    marginTop: -4,
  },
  heartIconHeader: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    width: 24,
    height: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storeName: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
    lineHeight: 22,
    flex: 1,
  },
  heartButton: {
    padding: 8,
  },
  heartIcon: {
    fontSize: 16,
    color: colors.muted,
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  heartFilled: {
    color: '#FF3B30',
  },
  priceSection: {
    marginBottom: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 1)',
    marginBottom: 8,
    lineHeight: 30,
  },
  detailsSection: {
    marginBottom: 6,
  },
  shipping: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
    lineHeight: 19,
  },
  eta: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
    lineHeight: 19,
  },
  rating: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 19,
  },
  storeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  recommendedContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  filterContainer: {
    backgroundColor: colors.bg,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  recommendedGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  recommendedCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 10,
    width: '30%',
    alignItems: 'center',
    height: 180,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  recommendedImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.bg,
  },
  recommendedName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 16,
  },
  recommendedPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  recommendedButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
  },
  recommendedButtonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  filterTab: {
    backgroundColor: colors.card,
    paddingVertical: 0,
    paddingHorizontal: 16,
    height: 40,
    minWidth: 104,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
    letterSpacing: 0,
    opacity: 1,
  },
  filterTextActive: {
    color: 'rgba(255, 255, 255, 1)',
    fontWeight: '600',
    opacity: 1,
  },
});
