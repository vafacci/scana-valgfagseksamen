import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, FlatList } from 'react-native';
import { colors } from '../theme/colors';
import { useFavorites } from '../store/useFavorites';
import priceData from '../data/prices.json';

export default function ResultsScreen({ navigation, route }) {
  const { product, barcode, productName, photoUri } = route.params || {};
  const { toggleFavorite, isFavorite } = useFavorites();
  
  // Filter state
  const [activeFilter, setActiveFilter] = useState('billigste');
  
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
      case 'rating':
        return parseFloat(b.rating) - parseFloat(a.rating);
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
      {/* Top Section */}
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => navigation.navigate('Tabs')}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>


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

      {/* Recommended Products */}
      <View style={styles.recommendedContainer}>
        <Text style={styles.sectionTitle}>Anbefalede Produkter</Text>
        <View style={styles.recommendedGrid}>
          <View style={styles.recommendedCard}>
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
          </View>
          
          <View style={styles.recommendedCard}>
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
          </View>
          
          <View style={styles.recommendedCard}>
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
          </View>
        </View>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'billigste' && styles.filterTabActive]}
          onPress={() => setActiveFilter('billigste')}
        >
          <Text style={[styles.filterText, activeFilter === 'billigste' && styles.filterTextActive]}>
            Billigste
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'hurtigste' && styles.filterTabActive]}
          onPress={() => setActiveFilter('hurtigste')}
        >
          <Text style={[styles.filterText, activeFilter === 'hurtigste' && styles.filterTextActive]}>
            Hurtigste
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'rating' && styles.filterTabActive]}
          onPress={() => setActiveFilter('rating')}
        >
          <Text style={[styles.filterText, activeFilter === 'rating' && styles.filterTextActive]}>
            Rating
          </Text>
        </TouchableOpacity>
      </View>

      {/* Price List */}
      <View style={styles.priceListContainer}>
        <FlatList
          data={sortedOffers}
          renderItem={renderOfferItem}
          keyExtractor={(item, index) => `${item.store}-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
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
    paddingHorizontal: 20,
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
    borderRadius: 8,
    padding: 8,
    marginBottom: 4,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  offerLeft: {
    flex: 1,
    marginRight: 12,
  },
  offerRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storeName: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: '500',
  },
  heartButton: {
    padding: 4,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  detailsSection: {
    marginBottom: 6,
  },
  shipping: {
    fontSize: 11,
    color: colors.muted,
  },
  eta: {
    fontSize: 11,
    color: colors.muted,
  },
  rating: {
    fontSize: 11,
    color: colors.muted,
  },
  storeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'center',
  },
  storeButtonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  recommendedContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: -10,
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  filterTab: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.muted,
  },
  filterTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
});
