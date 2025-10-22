import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { useAuth } from '../store/useAuth';
import AuthNavigator from './AuthNavigator';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CameraScreen from '../screens/CameraScreen';
import ResultsScreen from '../screens/ResultsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const navigation = useNavigation();

  const ScanButton = () => (
    <TouchableOpacity
      style={styles.scanButton}
      onPress={() => navigation.navigate('Camera')}
    >
      <View style={styles.whiteSquare}>
        <Text style={styles.scanIcon}>📷</Text>
      </View>
      <Text style={styles.scanLabel}>Scan</Text>
    </TouchableOpacity>
  );

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.card,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Hjem',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>🏠</Text>
          ),
        }}
      />
      
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favoritter',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>❤️</Text>
          ),
        }}
      />
      
      <Tab.Screen
        name="ScanTab"
        component={View}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => <ScanButton />,
          tabBarButton: () => <ScanButton />,
        }}
      />
      
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>👤</Text>
          ),
        }}
      />
      
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Indstillinger',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>⚙</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isLoggedIn) {
    return <AuthNavigator />;
  }

  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0F1B2B' }
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  scanButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  whiteSquare: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  scanIcon: {
    fontSize: 20,
    color: colors.primary,
  },
  scanLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.muted,
    marginTop: 2,
  },
  tabIcon: {
    fontSize: 20,
  },
});
