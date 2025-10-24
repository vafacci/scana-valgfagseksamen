import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../store/LanguageContext';

export default function LanguageSettingsScreen({ visible, onClose }) {
  const { language, changeLanguage, t, getAvailableLanguages } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  // Update selectedLanguage when language changes
  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  const handleLanguageSelect = async (langCode) => {
    setSelectedLanguage(langCode);
    await changeLanguage(langCode);
    // Close the modal after language change
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleSave = () => {
    onClose();
  };

  const availableLanguages = getAvailableLanguages();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onClose}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
            <Text style={styles.backText}>{t('back')}</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('language')}</Text>
          <Text style={styles.subtitle}>{t('selectLanguage')}</Text>
        </View>

        {/* Language Options */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.languageContainer}>
            {availableLanguages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  selectedLanguage === lang.code && styles.languageOptionSelected
                ]}
                onPress={() => handleLanguageSelect(lang.code)}
              >
                <View style={styles.languageInfo}>
                  <Text style={[
                    styles.languageName,
                    selectedLanguage === lang.code && styles.languageNameSelected
                  ]}>
                    {lang.nativeName}
                  </Text>
                  <Text style={[
                    styles.languageCode,
                    selectedLanguage === lang.code && styles.languageCodeSelected
                  ]}>
                    {lang.name}
                  </Text>
                </View>
                
                {selectedLanguage === lang.code && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Save Button */}
          <View style={styles.saveContainer}>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>{t('save')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    paddingHorizontal: 20,
    paddingVertical: 24,
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
  },
  scrollView: {
    flex: 1,
  },
  languageContainer: {
    paddingHorizontal: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  languageNameSelected: {
    color: colors.primary,
  },
  languageCode: {
    fontSize: 14,
    color: colors.muted,
  },
  languageCodeSelected: {
    color: colors.primary,
  },
  saveContainer: {
    paddingHorizontal: 20,
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
    color: '#FFFFFF',
  },
});
