import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  Keyboard,
} from 'react-native';
import WebScroll from '../components/WebScroll';
import Tap from '../components/Tap';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { useLanguage } from '../store/LanguageContext';
import { searchCatalog, findProductByName, findProductById, PRICES_UPDATED } from '../data/catalog';
import { useScanHistory } from '../store/useScanHistory';

export default function HomeScreen({ navigation }) {
  const { t } = useLanguage();
  const { scanHistory, loadScanHistory } = useScanHistory();
  const [query, setQuery] = useState('');
  const searching = query.trim().length >= 2;
  const results = searching ? searchCatalog(query) : [];
  const latest = scanHistory[0];
  const latestProduct = latest
    ? latest.productId
      ? findProductById(latest.productId)
      : findProductByName(latest.productName)
    : null;

  useFocusEffect(
    useCallback(() => {
      loadScanHistory();
    }, [loadScanHistory])
  );

  const openProduct = (product) => {
    if (!product) return;
    Keyboard.dismiss();
    const root = navigation.getParent?.() ?? navigation;
    root.navigate('Results', { product });
  };

  const openLatest = () => {
    openProduct(latestProduct);
  };

  const openCamera = () => {
    const root = navigation.getParent?.() ?? navigation;
    root.navigate('Camera');
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebScroll
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <View style={styles.brandRow}>
          <Text style={styles.brand}>SCANA</Text>
          <View style={styles.beta}>
            <Text style={styles.betaText}>{t('beta')}</Text>
          </View>
        </View>
        <Text style={styles.searchHint}>{t('searchHint')}</Text>

        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={22} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor="rgba(255,255,255,0.4)"
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>

        {searching ? (
          <>
            <Text style={styles.sectionLabel}>{t('results')}</Text>
            {results.length === 0 ? (
              <Text style={styles.emptySearch}>{t('noSearchResults')}</Text>
            ) : (
              results.map((item) => (
                <Tap
                  key={item.id}
                  style={styles.resultRow}
                  onPress={() => openProduct(item)}
                  accessibilityRole="button"
                  accessibilityLabel={item.name}
                >
                  <Image source={item.image} style={styles.resultImage} />
                  <View style={styles.resultText}>
                    <Text style={styles.resultName}>{item.name}</Text>
                    <Text style={styles.resultPrice}>{item.price}</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
                </Tap>
              ))
            )}
          </>
        ) : latest ? (
          <>
            <Text style={styles.sectionLabel}>{t('lastScan')}</Text>
            <Tap
              style={styles.latestCard}
              onPress={openLatest}
              accessibilityRole="button"
              accessibilityLabel={latest.productName}
            >
              <View style={styles.latestThumb}>
                {latest.photoUri ? (
                  <Image source={{ uri: latest.photoUri }} style={styles.latestImage} />
                ) : latestProduct?.image ? (
                  <Image source={latestProduct.image} style={styles.latestImage} />
                ) : (
                  <MaterialIcons name="photo-camera" size={26} color={colors.muted} />
                )}
              </View>
              <View style={styles.latestBody}>
                <Text style={styles.latestName} numberOfLines={2}>
                  {latest.productName}
                </Text>
                <Text style={styles.latestPrice}>{latest.price}</Text>
                {latest.date ? <Text style={styles.latestDate}>{latest.date}</Text> : null}
              </View>
              <MaterialIcons name="chevron-right" size={22} color={colors.muted} />
            </Tap>
          </>
        ) : (
          <View style={styles.emptyCard}>
            <MaterialIcons name="photo-camera" size={36} color={colors.muted} />
            <Text style={styles.emptyTitle}>{t('lastScan')}</Text>
            <Text style={styles.emptyText}>{t('scanToSeeLatest')}</Text>
            <Tap
              style={styles.scanButton}
              onPress={openCamera}
              accessibilityRole="button"
              accessibilityLabel={t('scanNow')}
            >
              <Text style={styles.scanButtonText}>{t('scanNow')}</Text>
            </Tap>
          </View>
        )}

        <Text style={styles.disclaimer}>
          {t('priceDisclaimer')} {t('pricesChecked')} {PRICES_UPDATED}.
        </Text>
      </WebScroll>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 32,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  brand: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 4,
  },
  beta: {
    backgroundColor: 'rgba(59, 110, 246, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  betaText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  searchHint: {
    color: colors.muted,
    fontSize: 15,
    marginBottom: 22,
    lineHeight: 22,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    paddingVertical: 14,
    fontSize: 16,
  },
  sectionLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: '100%',
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  resultImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  resultText: {
    flex: 1,
  },
  resultName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  resultPrice: {
    color: colors.primary,
    fontSize: 13,
    marginTop: 2,
  },
  emptySearch: {
    color: colors.muted,
    paddingVertical: 14,
    fontSize: 13,
  },
  latestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: '100%',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 14,
  },
  latestThumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  latestImage: {
    width: 64,
    height: 64,
  },
  latestBody: {
    flex: 1,
  },
  latestName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  latestPrice: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  latestDate: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 32,
    paddingHorizontal: 20,
    gap: 10,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  scanButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  disclaimer: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 24,
  },
});
