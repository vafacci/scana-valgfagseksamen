import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Keyboard,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../store/LanguageContext';
import { CATALOG, searchCatalog } from '../data/catalog';
import { useScanHistory } from '../store/useScanHistory';
import { useUserProfile } from '../store/useUserProfile';

export default function IdentifyScreen({ navigation, route }) {
  const { photoUri } = route.params || {};
  const { t } = useLanguage();
  const { addScan } = useScanHistory();
  const { updateElo } = useUserProfile();
  const [query, setQuery] = useState('');

  const products = useMemo(() => {
    const q = query.trim();
    return q.length >= 2 ? searchCatalog(q) : CATALOG;
  }, [query]);

  const chooseProduct = async (product) => {
    Keyboard.dismiss();
    try {
      await addScan(
        {
          productName: product.name,
          price: product.price,
          category: product.category,
          description: product.description,
          image: product.image,
          photoUri: photoUri || null,
          productId: product.id,
        },
        updateElo
      );
    } catch (error) {
      console.error('Error saving scan:', error);
    }

    navigation.replace('Results', { product, photoUri: photoUri || null });
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Tabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <TouchableOpacity
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel={t('close')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('identifyTitle')}</Text>
        <View style={styles.titleSpacer} />
      </View>

      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />
      ) : null}

      <Text style={styles.hint}>{t('identifyHint')}</Text>

      <View style={styles.searchBox}>
        <MaterialIcons name="search" size={20} color={colors.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('identifySearch')}
          placeholderTextColor="rgba(255,255,255,0.4)"
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.list}>
        {products.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.row}
            onPress={() => chooseProduct(item)}
            accessibilityRole="button"
            accessibilityLabel={item.name}
          >
            <Image source={item.image} style={styles.thumb} />
            <View style={styles.rowText}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
          </TouchableOpacity>
        ))}
        {products.length === 0 ? (
          <Text style={styles.empty}>{t('noSearchResults')}</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  titleSpacer: {
    width: 24,
  },
  photo: {
    height: 140,
    marginHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.card,
    marginBottom: 12,
  },
  hint: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    paddingVertical: 12,
    fontSize: 15,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  rowText: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  price: {
    color: colors.primary,
    fontSize: 13,
    marginTop: 2,
  },
  empty: {
    color: colors.muted,
    paddingVertical: 16,
    fontSize: 13,
  },
});
