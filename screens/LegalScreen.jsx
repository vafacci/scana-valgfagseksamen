import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../store/LanguageContext';
import { PRICES_UPDATED } from '../data/catalog';

const COPY = {
  privacy: { titleKey: 'legalPrivacyTitle', bodyKey: 'legalPrivacyBody' },
  terms: { titleKey: 'legalTermsTitle', bodyKey: 'legalTermsBody' },
  prices: { titleKey: 'legalPricesTitle', bodyKey: 'legalPricesBody' },
};

export default function LegalScreen({ navigation, route }) {
  const { t } = useLanguage();
  const type = COPY[route.params?.type] ? route.params.type : 'privacy';
  const copy = COPY[type];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={t('back')}
          style={styles.back}
        >
          <MaterialIcons name="arrow-back" size={22} color={colors.text} />
          <Text style={styles.backText}>{t('back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t(copy.titleKey)}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.text}>{t(copy.bodyKey)}</Text>
        {type === 'prices' ? (
          <Text style={styles.meta}>
            {t('pricesChecked')} {PRICES_UPDATED}
          </Text>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    color: colors.text,
    fontSize: 16,
    marginLeft: 8,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  body: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  text: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 24,
  },
  meta: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 20,
  },
});
