import React, { useState } from 'react';
import {
  createNavigatorFactory,
  StackRouter,
  useNavigationBuilder,
} from '@react-navigation/native';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Tap from '../components/Tap';
import { colors } from '../theme/colors';
import { useLanguage } from '../store/LanguageContext';
import { useAuth } from '../store/useAuth';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CameraScreen from '../screens/CameraScreen';
import IdentifyScreen from '../screens/IdentifyScreen';
import SuccessScreen from '../screens/SuccessScreen';
import ResultsScreen from '../screens/ResultsScreen';
import LegalScreen from '../screens/LegalScreen';

function IsolatedStackNavigator({ id, initialRouteName, children, screenOptions }) {
  const { state, descriptors, NavigationContent } = useNavigationBuilder(StackRouter, {
    id,
    initialRouteName,
    children,
    screenOptions,
  });
  const active = state.routes[state.index];
  const descriptor = active ? descriptors[active.key] : null;

  return (
    <NavigationContent>
      <View style={styles.stackRoot}>{descriptor ? descriptor.render() : null}</View>
    </NavigationContent>
  );
}

const Stack = createNavigatorFactory(IsolatedStackNavigator)();

const TABS = [
  { key: 'home', route: 'HomeTab', icon: 'home', iconActive: 'home', labelKey: 'home' },
  { key: 'favorites', route: 'FavoritesTab', icon: 'favorite-border', iconActive: 'favorite', labelKey: 'favorites' },
  { key: 'scan', route: 'Camera', icon: 'photo-camera', labelKey: 'camera', scan: true },
  { key: 'profile', route: 'ProfileTab', icon: 'person-outline', iconActive: 'person', labelKey: 'profile' },
  { key: 'settings', route: 'SettingsTab', icon: 'settings', iconActive: 'settings', labelKey: 'settings' },
];

function TabButton({ label, active, onPress, children }) {
  return (
    <Tap
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={styles.tabSlot}
    >
      {children}
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </Tap>
  );
}

function WebMainTabs({ navigation }) {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('HomeTab');

  const screenNav = {
    navigate: (name, params) => {
      if (name === 'HomeTab' || name === 'FavoritesTab' || name === 'ProfileTab' || name === 'SettingsTab') {
        setTab(name);
        return;
      }
      navigation.navigate(name, params);
    },
    goBack: () => navigation.goBack(),
    getParent: () => navigation,
    addListener: (...args) => navigation.addListener(...args),
    setOptions: (...args) => navigation.setOptions?.(...args),
  };

  const openTab = (route) => {
    setTab(route);
  };

  const openScan = () => {
    navigation.navigate('Camera');
  };

  return (
    <View style={styles.tabRoot}>
      <View style={styles.tabScene}>
        {tab === 'HomeTab' ? <HomeScreen navigation={screenNav} /> : null}
        {tab === 'FavoritesTab' ? <FavoritesScreen navigation={screenNav} /> : null}
        {tab === 'ProfileTab' ? <ProfileScreen navigation={screenNav} /> : null}
        {tab === 'SettingsTab' ? <SettingsScreen navigation={screenNav} /> : null}
      </View>
      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {TABS.map((item) => {
          const label = t(item.labelKey);
          if (item.scan) {
            return (
              <TabButton key={item.key} label={label} onPress={openScan}>
                <View style={styles.scanBtn}>
                  <MaterialIcons name="photo-camera" size={22} color="#FFFFFF" />
                </View>
              </TabButton>
            );
          }
          const active = tab === item.route;
          return (
            <TabButton key={item.key} label={label} active={active} onPress={() => openTab(item.route)}>
              <MaterialIcons
                name={active ? item.iconActive : item.icon}
                size={22}
                color={active ? colors.primary : 'rgba(169, 180, 195, 0.9)'}
              />
            </TabButton>
          );
        })}
      </View>
    </View>
  );
}

export default function RootNavigator() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.boot}>
        <Text style={styles.bootBrand}>SCANA</Text>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={WebMainTabs} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Identify" component={IdentifyScreen} />
      <Stack.Screen name="Legal" component={LegalScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  stackRoot: {
    flex: 1,
  },
  tabRoot: {
    flex: 1,
  },
  tabScene: {
    flex: 1,
    overflow: 'hidden',
  },
  boot: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  bootBrand: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 4,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1B2B',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: 4,
    paddingTop: 8,
    zIndex: 30,
    ...Platform.select({
      web: {
        position: 'relative',
        cursor: 'pointer',
      },
    }),
  },
  tabSlot: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    gap: 3,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  scanBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(169, 180, 195, 0.95)',
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
