import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../store/LanguageContext';
import OfferListItem from '../components/OfferListItem';
import Tap from '../components/Tap';
import WebScroll from '../components/WebScroll';
import { useFavorites } from '../store/useFavorites';
import {
  findProductByName,
  offerUrl,
  sortOffers,
  getLowestPrice,
  formatPrice,
  PRICES_UPDATED,
} from '../data/catalog';

const FILTERS = [
  { id: 'billigste', icon: 'sell', labelKey: 'filterCheapest' },
  { id: 'hurtigste', icon: 'schedule', labelKey: 'filterFastest' },
  { id: 'anbefalet', icon: 'thumb-up', labelKey: 'filterRecommended' },
];

const SORT_HINTS = {
  billigste: 'sortByPrice',
  hurtigste: 'sortByDelivery',
  anbefalet: 'sortByRecommended',
};

const BADGE_FOR_FILTER = {
  billigste: 'cheapest',
  hurtigste: 'fastest',
  anbefalet: 'recommended',
};

const EMPTY_OFFERS = [];

function imageSource(image) {
  if (!image) return null;
  return typeof image === 'string' ? { uri: image } : image;
}

export default function ResultsScreen({ navigation, route }) {
  const { product, barcode, productName, photoUri } = route.params || {};
  const { t } = useLanguage();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [activeFilter, setActiveFilter] = useState('billigste');

  const catalogProduct = findProductByName(product?.name || productName);
  const displayName = catalogProduct?.name || product?.name || productName || t('unknownProduct');
  const displayImage = catalogProduct?.image || product?.image || photoUri || null;
  const displayCategory = catalogProduct?.category || product?.category || '';
  const offers = (product?.offers?.length ? product.offers : catalogProduct?.offers) || EMPTY_OFFERS;

  const sortedOffers = useMemo(
    () => sortOffers(offers, activeFilter),
    [offers, activeFilter]
  );

  const lowestPrice = getLowestPrice(offers);

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Tabs');
    }
  };

  const openStore = (offer) => {
    Linking.openURL(offerUrl(offer, displayName));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <Tap
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel={t('back')}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </Tap>
      </View>

      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <View style={styles.productTextInfo}>
            <Text style={styles.productName}>{displayName}</Text>
            {displayCategory ? (
              <Text style={styles.productCategory}>{displayCategory}</Text>
            ) : null}
            {lowestPrice != null ? (
              <Text style={styles.lowestPrice}>
                {t('fromPrice')} {formatPrice(lowestPrice)}
                {offers.length > 0 ? `  ·  ${offers.length} ${t('offers')}` : ''}
              </Text>
            ) : null}
            <Text style={styles.checked}>
              {t('pricesChecked')} {PRICES_UPDATED}
            </Text>
            {barcode ? (
              <Text style={styles.barcodeInfo}>{t('barcode')}: {barcode}</Text>
            ) : null}
          </View>
          {imageSource(displayImage) ? (
            <Image
              source={imageSource(displayImage)}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.productImage, styles.imageFallback]}>
              <MaterialIcons name="inventory-2" size={36} color={colors.muted} />
            </View>
          )}
        </View>
      </View>

      {offers.length > 0 ? (
        <View style={styles.filterSection}>
          <View style={styles.filterContainer}>
            {FILTERS.map((filter) => {
              const selected = activeFilter === filter.id;
              return (
                <Tap
                  key={filter.id}
                  style={[styles.filterTab, selected && styles.filterTabActive]}
                  onPress={() => setActiveFilter(filter.id)}
                  accessibilityLabel={t(filter.labelKey)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <MaterialIcons
                    name={filter.icon}
                    size={16}
                    color={selected ? colors.text : colors.muted}
                  />
                  <Text
                    style={[styles.filterText, selected && styles.filterTextActive]}
                    numberOfLines={1}
                  >
                    {t(filter.labelKey)}
                  </Text>
                </Tap>
              );
            })}
          </View>
          <Text style={styles.sortHint}>{t(SORT_HINTS[activeFilter])}</Text>
        </View>
      ) : null}

      <WebScroll
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sortedOffers.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="storefront" size={48} color={colors.muted} />
            <Text style={styles.emptyTitle}>{t('noOffers')}</Text>
            <Text style={styles.emptyHint}>{t('noOffersHint')}</Text>
          </View>
        ) : (
          <View style={styles.priceListContainer}>
            {sortedOffers.map((item, index) => {
              const favorite = isFavorite({ ...item, productName: displayName });
              return (
                <OfferListItem
                  key={`${item.store}-${item.price}`}
                  store={item.store}
                  price={item.price}
                  shipping={item.shipping}
                  eta={item.eta}
                  rating={item.rating}
                  favorite={favorite}
                  isLowest={lowestPrice != null && item.price === lowestPrice}
                  badgeType={index === 0 ? BADGE_FOR_FILTER[activeFilter] : null}
                  onToggleFavorite={() => toggleFavorite({
                    ...item,
                    productName: displayName,
                    productImage: displayImage,
                    category: displayCategory,
                    description: catalogProduct?.description || product?.description || '',
                  })}
                  onPressStore={() => openStore(item)}
                />
              );
            })}
          </View>
        )}
        <Text style={styles.disclaimer}>{t('priceDisclaimer')}</Text>
        <Text style={styles.opensHint}>{t('opensSearchHint')}</Text>
      </WebScroll>
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
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  backButton: {
    padding: 4,
  },
  productInfo: {
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 8,
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
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  productCategory: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '500',
    marginBottom: 8,
  },
  lowestPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 6,
  },
  checked: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 4,
  },
  barcodeInfo: {
    fontSize: 12,
    color: colors.muted,
    fontFamily: 'monospace',
  },
  productImage: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: colors.card,
  },
  imageFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterSection: {
    paddingBottom: 4,
  },
  filterContainer: {
    backgroundColor: colors.bg,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    alignItems: 'center',
  },
  filterTab: {
    backgroundColor: colors.card,
    paddingVertical: 0,
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
  },
  filterTextActive: {
    color: colors.text,
    fontWeight: '700',
  },
  sortHint: {
    color: colors.muted,
    fontSize: 12,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  priceListContainer: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyHint: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  disclaimer: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 4,
    marginTop: 8,
  },
  opensHint: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 4,
    marginTop: 6,
  },
});
