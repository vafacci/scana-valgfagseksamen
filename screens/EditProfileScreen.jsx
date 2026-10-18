import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AppModal from '../components/AppModal';
import { colors } from '../theme/colors';
import { useLanguage } from '../store/LanguageContext';
import { useUserProfile } from '../store/useUserProfile';

export default function EditProfileScreen({ visible, onClose }) {
  const { t } = useLanguage();
  const { userProfile, updateProfile } = useUserProfile();
  const [name, setName] = useState(userProfile.name || '');
  const [email, setEmail] = useState(userProfile.email || '');

  useEffect(() => {
    if (visible) {
      setName(userProfile.name || '');
      setEmail(userProfile.email || '');
    }
  }, [visible, userProfile.name, userProfile.email]);

  const save = async () => {
    await updateProfile({
      name: name.trim(),
      email: email.trim(),
    });
    onClose();
  };

  return (
    <AppModal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <MaterialIcons name="arrow-back" size={22} color={colors.text} />
              <Text style={styles.backText}>{t('back')}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{t('editProfile')}</Text>
          </View>

          <Text style={styles.label}>{t('displayName')}</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t('namePlaceholder')}
            placeholderTextColor="rgba(255,255,255,0.4)"
            style={styles.input}
          />

          <Text style={styles.label}>{t('email')}</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder={t('emailPlaceholder')}
            placeholderTextColor="rgba(255,255,255,0.4)"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.save} onPress={save} accessibilityRole="button">
            <Text style={styles.saveText}>{t('save')}</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 12,
    marginBottom: 24,
  },
  backButton: {
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
  label: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 8,
  },
  save: {
    marginTop: 24,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
});
