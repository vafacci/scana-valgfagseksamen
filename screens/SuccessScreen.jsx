import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../store/LanguageContext';
import { hapticSuccess } from '../utils/haptics';

const SUCCESS_HOLD_MS = 700;

export default function SuccessScreen({ navigation, route }) {
  const { product, photoUri } = route.params || {};
  const { t } = useLanguage();

  useEffect(() => {
    hapticSuccess();

    const timer = setTimeout(() => {
      navigation.replace('Results', {
        product,
        photoUri,
      });
    }, SUCCESS_HOLD_MS);

    return () => clearTimeout(timer);
  }, [navigation, product, photoUri]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.successContainer}>
        <View style={styles.checkmarkCircle}>
          <MaterialIcons name="check" size={36} color={colors.text} />
        </View>
        <Text style={styles.successText}>{t('success')}</Text>
        {product?.name ? <Text style={styles.productName}>{product.name}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  checkmarkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  productName: {
    color: colors.muted,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
});
