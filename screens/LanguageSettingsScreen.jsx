import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import AppModal from '../components/AppModal';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../store/LanguageContext';

export default function LanguageSettingsScreen({ visible, onClose }) {
  const { language, changeLanguage, t, getAvailableLanguages } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  const handleLanguageSelect = async (langCode) => {
    setSelectedLanguage(langCode);
    await changeLanguage(langCode);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const availableLanguages = getAvailableLanguages();

  return (
    <AppModal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <MaterialIcons name="arrow-back" size={22} color={colors.text} />
            <Text style={styles.backText}>{t('back')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('language')}</Text>
          <Text style={styles.subtitle}>{t('selectLanguage')}</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.languageContainer}>
            {availableLanguages.map((lang) => {
              const selected = selectedLanguage === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={styles.languageOption}
                  onPress={() => handleLanguageSelect(lang.code)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                >
                  <MaterialIcons name="translate" size={22} color={colors.muted} />
                  <View style={styles.languageInfo}>
                    <Text style={styles.languageName}>{lang.nativeName}</Text>
                    <Text style={styles.languageCode}>{lang.name}</Text>
                  </View>
                  <MaterialIcons
                    name={selected ? 'radio-button-checked' : 'radio-button-unchecked'}
                    size={22}
                    color={selected ? colors.primary : colors.muted}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.saveContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={onClose}>
              <Text style={styles.saveButtonText}>{t('save')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  languageContainer: {
    marginHorizontal: 24,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  languageCode: {
    fontSize: 13,
    color: colors.muted,
  },
  saveContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
