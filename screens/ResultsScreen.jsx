import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, FlatList } from 'react-native';
import { colors } from '../theme/colors';
import { useFavorites } from '../store/useFavorites';
import priceData from '../data/prices.json';

export default function ResultsScreen({ navigation, route }) {
  const { product, barcode, productName, photoUri } = route.params || {};
  const { toggleFavorite, isFavorite } = useFavorites();
  
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
  
  // Sort offers by price (ascending)
  const sortedOffers = priceComparison?.offers.sort((a, b) => a.price - b.price) || [];

  const renderOfferItem = ({ item }) => {
    const favorite = isFavorite(item);
    
    return (
      <View style={styles.offerCard}>
        <View style={styles.offerHeader}>
          <Text style={styles.storeName}>{item.store}</Text>
          <TouchableOpacity 
            style={styles.heartButton}
            onPress={() => toggleFavorite({ ...item, productName })}
          >
            <Text style={[styles.heartIcon, favorite && styles.heartFilled]}>
              {favorite ? '❤️' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.priceSection}>
          <Text style={styles.price}>{item.price}kr,-</Text>
        </View>
        
        <View style={styles.detailsSection}>
          <Text style={styles.shipping}>Fragt: {item.shipping}</Text>
          <Text style={styles.eta}>{item.eta}</Text>
          <Text style={styles.rating}>✰ {item.rating} ({item.reviewCount})</Text>
        </View>
        
        <TouchableOpacity style={styles.storeButton}>
          <Text style={styles.storeButtonText}>Gå til butik</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Priser</Text>
        <Text style={styles.subtitle}>
          Sammenlign priser fra flere butikker - direkte efter du scanner varen.
        </Text>
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

      {/* Price List */}
      <View style={styles.priceListContainer}>
        <Text style={styles.sectionTitle}>Bedste pris i rækkefølge</Text>
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
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    fontSize: 18,
    color: colors.muted,
  },
  heartFilled: {
    color: '#FF3B30',
  },
  priceSection: {
    marginBottom: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  detailsSection: {
    marginBottom: 16,
  },
  shipping: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
  },
  eta: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: colors.muted,
  },
  storeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  storeButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
