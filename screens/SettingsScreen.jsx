import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, Platform } from 'react-native';
import AppModal from '../components/AppModal';
import WebScroll from '../components/WebScroll';
import Tap from '../components/Tap';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../store/LanguageContext';
import { useScanHistory } from '../store/useScanHistory';
import { useFavorites } from '../store/useFavorites';
import { useUserProfile } from '../store/useUserProfile';
import { useAuth } from '../store/useAuth';
import LanguageSettingsScreen from './LanguageSettingsScreen';
import EditProfileScreen from './EditProfileScreen';

function SettingsRow({ icon, label, onPress, destructive }) {
  return (
    <Tap
      style={styles.row}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <MaterialIcons
        name={icon}
        size={22}
        color={destructive ? '#FF3B30' : colors.muted}
      />
      <Text style={[styles.rowLabel, destructive && styles.rowDestructive]}>{label}</Text>
      <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
    </Tap>
  );
}

export default function SettingsScreen({ visible, onClose, navigation }) {
  const isModal = visible !== undefined;
  const { t } = useLanguage();
  const { clearHistory } = useScanHistory();
  const { clearFavorites } = useFavorites();
  const { resetProfile } = useUserProfile();
  const { logout } = useAuth();
  const [languageSettingsVisible, setLanguageSettingsVisible] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);

  const openLegal = (type) => {
    if (isModal && onClose) onClose();
    const root = navigation?.getParent?.() ?? navigation;
    root?.navigate('Legal', { type });
  };

  const handleClearData = () => {
    const run = async () => {
      await Promise.all([clearHistory(), clearFavorites(), resetProfile()]);
      if (Platform.OS === 'web') {
        window.alert(t('dataCleared'));
        return;
      }
      Alert.alert(t('dataCleared'));
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`${t('clearLocalData')}\n\n${t('clearLocalDataHint')}`)) {
        run();
      }
      return;
    }

    Alert.alert(t('clearLocalData'), t('clearLocalDataHint'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('delete'), style: 'destructive', onPress: run },
    ]);
  };

  const handleLogout = () => {
    const run = () => logout();

    if (Platform.OS === 'web') {
      if (window.confirm(t('logout'))) {
        run();
      }
      return;
    }

    Alert.alert(t('logout'), t('logoutHint'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('logout'), style: 'destructive', onPress: run },
    ]);
  };

  const rows = [
    { icon: 'person-outline', label: t('editProfile'), onPress: () => setEditProfileVisible(true) },
    { icon: 'language', label: t('language'), onPress: () => setLanguageSettingsVisible(true) },
    { icon: 'lock-outline', label: t('privacy'), onPress: () => openLegal('privacy') },
    { icon: 'gavel', label: t('terms'), onPress: () => openLegal('terms') },
    { icon: 'sell', label: t('aboutPrices'), onPress: () => openLegal('prices') },
  ];

  const body = (
    <>
      <View style={[styles.header, isModal && styles.modalHeader]}>
        {isModal ? (
          <Tap style={styles.backButton} onPress={onClose}>
            <MaterialIcons name="arrow-back" size={22} color={colors.text} />
            <Text style={styles.backText}>{t('back')}</Text>
          </Tap>
        ) : null}
        <Text style={styles.title}>{t('settings')}</Text>
      </View>

      <View style={styles.group}>
        {rows.map((row) => (
          <SettingsRow key={row.label} {...row} />
        ))}
      </View>

      <View style={styles.group}>
        <SettingsRow
          icon="logout"
          label={t('logout')}
          onPress={handleLogout}
        />
        <SettingsRow
          icon="delete-outline"
          label={t('clearLocalData')}
          onPress={handleClearData}
          destructive
        />
      </View>
    </>
  );

  const extras = (
    <>
      {languageSettingsVisible ? (
        <LanguageSettingsScreen
          visible
          onClose={() => setLanguageSettingsVisible(false)}
        />
      ) : null}
      {editProfileVisible ? (
        <EditProfileScreen
          visible
          onClose={() => setEditProfileVisible(false)}
        />
      ) : null}
    </>
  );

  if (isModal) {
    return (
      <>
        <AppModal
          visible={visible}
          transparent
          animationType="slide"
          onRequestClose={onClose}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <WebScroll showsVerticalScrollIndicator={false}>
                {body}
              </WebScroll>
            </View>
          </View>
        </AppModal>
        {extras}
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <WebScroll
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {body}
      </WebScroll>
      {extras}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    minHeight: '70%',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 20,
  },
  modalHeader: {
    paddingTop: 20,
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
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  group: {
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: '100%',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  rowLabel: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  rowDestructive: {
    color: '#FF3B30',
  },
});
