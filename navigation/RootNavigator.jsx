import React, { useEffect, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { useAuth } from '../store/useAuth';
import { useLanguage } from '../store/LanguageContext';
import AuthNavigator from './AuthNavigator';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CameraScreen from '../screens/CameraScreen';
import SuccessScreen from '../screens/SuccessScreen';
import ResultsScreen from '../screens/ResultsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const screenWidth = Dimensions.get('window').width;
  const { t, language } = useLanguage();

  const WaveNavigationBar = ({ state, descriptors, navigation }) => {
    console.log('WaveNavigationBar props:', { state, descriptors, navigation });
    const currentRouteName = state?.routes?.[state.index]?.name;
    
    // Animation values
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const waveAnim = useRef(new Animated.Value(0)).current;
    const buttonAnimations = useRef({
      home: new Animated.Value(1),
      favorites: new Animated.Value(1),
      scan: new Animated.Value(1),
      profile: new Animated.Value(1),
      settings: new Animated.Value(1),
    }).current;
    
    // Morphing icon animations
    const iconMorphAnimations = useRef({
      home: new Animated.Value(0),
      favorites: new Animated.Value(0),
      scan: new Animated.Value(0),
      profile: new Animated.Value(0),
      settings: new Animated.Value(0),
    }).current;
    
    // Removed problematic wave animation

    const animateButtonPress = (buttonKey) => {
      // Haptic feedback
      if (buttonKey === 'scan') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      // Button scale animation
      Animated.sequence([
        Animated.timing(buttonAnimations[buttonKey], {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(buttonAnimations[buttonKey], {
          toValue: 1,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Icon morphing animation (only for scan)
      if (buttonKey === 'scan') {
        const morphDuration = 600;
        Animated.sequence([
          Animated.timing(iconMorphAnimations[buttonKey], {
            toValue: 1,
            duration: morphDuration,
            useNativeDriver: true,
          }),
          Animated.timing(iconMorphAnimations[buttonKey], {
            toValue: 0,
            duration: morphDuration,
            useNativeDriver: true,
          }),
        ]).start();
      }
    };

    const handleNavigation = (screenName, buttonKey) => {
      // Haptic feedback only; no visual button animations
      if (buttonKey === 'scan') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      if (screenName === 'Camera') {
        navigation.navigate(screenName);
      } else {
        navigation.jumpTo(screenName);
      }
    };
    
    return (
      <Animated.View style={[styles.waveContainer, { transform: [{ scale: scaleAnim }] }]}>
        <Svg height="100" width={screenWidth} style={styles.waveSvg}>
          <Path
            d={`M0,15 L${screenWidth/2 - 80},15 Q${screenWidth/2 - 60},15 ${screenWidth/2 - 50},35 Q${screenWidth/2 - 30},85 ${screenWidth/2},85 Q${screenWidth/2 + 30},85 ${screenWidth/2 + 50},35 Q${screenWidth/2 + 60},15 ${screenWidth/2 +80},15 L${screenWidth},15 L${screenWidth},100 L0,100 Z`}
            fill="white"
          />
        </Svg>
        
        {/* Navigation Items */}
        <View style={styles.navItemsContainer}>
          {/* Left Side Items */}
          <View style={styles.leftNavItems}>
            <TouchableOpacity 
              style={styles.navItem} 
              onPress={() => handleNavigation('HomeTab', 'home')}
            >
              <View style={styles.buttonContainer}>
                
                <Animated.View style={{ 
                  transform: [
                    { scale: buttonAnimations.home }
                  ] 
                }}>
                  <Text style={[styles.tabIcon, currentRouteName === 'HomeTab' && styles.tabIconActive]}>🏠</Text>
                  <Text style={[styles.tabLabel, { marginLeft: 12 }, currentRouteName === 'HomeTab' && styles.tabLabelActive]}>{t('home')}</Text>
                </Animated.View>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.navItem} 
              onPress={() => handleNavigation('FavoritesTab', 'favorites')}
            >
              <View style={styles.buttonContainer}>
                
                <Animated.View style={{ 
                  transform: [
                    { scale: buttonAnimations.favorites }
                  ] 
                }}>
                  <Text style={[styles.tabIcon, currentRouteName === 'FavoritesTab' && styles.tabIconActive]}>❤️</Text>
                  <Text style={[styles.tabLabel, { marginLeft: 4 }, currentRouteName === 'FavoritesTab' && styles.tabLabelActive]}>{t('favorites')}</Text>
                </Animated.View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Scan Button */}
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => handleNavigation('Camera', 'scan')}
          >
            <View style={styles.scanButtonContainer}>
              
              <Animated.View style={{ 
                transform: [
                  { scale: buttonAnimations.scan },
                  { 
                    rotateZ: iconMorphAnimations.scan.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '720deg'],
                    })
                  },
                  {
                    scaleX: iconMorphAnimations.scan.interpolate({
                      inputRange: [0, 0.3, 0.7, 1],
                      outputRange: [1, 1.1, 0.9, 1],
                    })
                  },
                  {
                    scaleY: iconMorphAnimations.scan.interpolate({
                      inputRange: [0, 0.3, 0.7, 1],
                      outputRange: [1, 0.9, 1.1, 1],
                    })
                  }
                ] 
              }}>
              <View style={styles.scannerIcon}>
                <View style={styles.scannerInner}>
                  <View style={styles.scannerCorners}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                  </View>
                </View>
              </View>
              <Text style={styles.scanLabel}>SCAN</Text>
              </Animated.View>
            </View>
          </TouchableOpacity>

          {/* Right Side Items */}
          <View style={styles.rightNavItems}>
            <TouchableOpacity 
              style={styles.navItem} 
              onPress={() => handleNavigation('ProfileTab', 'profile')}
            >
              <View style={styles.buttonContainer}>
                
                <Animated.View style={{ 
                  transform: [
                    { scale: buttonAnimations.profile }
                  ] 
                }}>
                  <Text style={[styles.tabIcon, currentRouteName === 'ProfileTab' && styles.tabIconActive]}>👤</Text>
                  <Text style={[styles.tabLabel, { marginLeft: 10 }, currentRouteName === 'ProfileTab' && styles.tabLabelActive]}>{t('profile')}</Text>
                </Animated.View>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.navItem} 
              onPress={() => handleNavigation('SettingsTab', 'settings')}
            >
              <View style={styles.buttonContainer}>
                
                <Animated.View style={{ 
                  transform: [
                    { scale: buttonAnimations.settings }
                  ] 
                }}>
                  <Text style={[styles.tabIcon, currentRouteName === 'SettingsTab' && styles.tabIconActive]}>⚙</Text>
                  <Text style={[styles.tabLabel, currentRouteName === 'SettingsTab' && styles.tabLabelActive]}>{t('settings')}</Text>
                </Animated.View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <Tab.Navigator
      key={language} // Force re-render when language changes
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          display: 'none',
          height: 0,
          opacity: 0,
        },
        tabBarButton: () => null,
        animationEnabled: true,
        animationTypeForReplace: 'push',
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width * 0.3, 0],
                  }),
                },
                {
                  rotateY: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['15deg', '0deg'],
                  }),
                },
                {
                  scale: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
              opacity: current.progress.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.8, 1],
              }),
            },
          };
        },
      }}
      tabBar={(props) => <WaveNavigationBar {...props} />}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: t('home'),
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>🏠</Text>
          ),
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-layouts.screen.width * 0.2, 0],
                    }),
                  },
                  {
                    rotateZ: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['-5deg', '0deg'],
                    }),
                  },
                  {
                    scale: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
                opacity: current.progress.interpolate({
                  inputRange: [0, 0.3, 1],
                  outputRange: [0, 0.7, 1],
                }),
              },
            };
          },
        }}
      />
      
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          tabBarLabel: t('favorites'),
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>❤️</Text>
          ),
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height * 0.1, 0],
                    }),
                  },
                  {
                    rotateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['10deg', '0deg'],
                    }),
                  },
                  {
                    scale: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.85, 1],
                    }),
                  },
                ],
                opacity: current.progress.interpolate({
                  inputRange: [0, 0.4, 1],
                  outputRange: [0, 0.6, 1],
                }),
              },
            };
          },
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
          tabBarLabel: t('profile'),
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>👤</Text>
          ),
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width * 0.2, 0],
                    }),
                  },
                  {
                    rotateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['-15deg', '0deg'],
                    }),
                  },
                  {
                    scale: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
                opacity: current.progress.interpolate({
                  inputRange: [0, 0.2, 1],
                  outputRange: [0, 0.8, 1],
                }),
              },
            };
          },
        }}
      />
      
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          tabBarLabel: t('settings'),
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>⚙</Text>
          ),
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-layouts.screen.height * 0.1, 0],
                    }),
                  },
                  {
                    rotateZ: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['5deg', '0deg'],
                    }),
                  },
                  {
                    scale: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
                opacity: current.progress.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 0.5, 1],
                }),
              },
            };
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { isLoggedIn, loading } = useAuth();
  
  console.log('RootNavigator render - isLoggedIn:', isLoggedIn, 'loading:', loading);

  if (loading) {
    console.log('RootNavigator: Still loading...');
    return null;
  }

  if (!isLoggedIn) {
    console.log('RootNavigator: User not logged in, showing AuthNavigator');
    return <AuthNavigator />;
  }

  console.log('RootNavigator: User logged in, showing TabNavigator');
  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0F1B2B' },
        animation: 'slide_from_right',
        animationDuration: 400,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        presentation: 'card',
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
                {
                  rotateY: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['45deg', '0deg'],
                  }),
                },
                {
                  scale: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          };
        },
      }}
    >
      <Stack.Screen 
        name="Tabs" 
        component={TabNavigator}
        options={{
          animation: 'fade',
          animationDuration: 500,
        }}
      />
      <Stack.Screen 
        name="Camera" 
        component={CameraScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
          animationDuration: 250,
          gestureEnabled: true,
          gestureDirection: 'vertical',
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                  {
                    scale: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            };
          },
        }}
      />
      <Stack.Screen 
        name="Success" 
        component={SuccessScreen}
        options={{
          animation: 'fade',
          animationDuration: 150,
        }}
      />
      <Stack.Screen 
        name="Results" 
        component={ResultsScreen}
        options={{
          animation: 'slide_from_right',
          animationDuration: 250,
          gestureEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                  {
                    scale: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            };
          },
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    marginTop: 40,
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  waveSvg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItemsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  leftNavItems: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
    flex: 1,
    justifyContent: 'flex-start',
  },
  rightNavItems: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
    flex: 1,
    justifyContent: 'flex-end',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  scannerIcon: {
    width: 65,
    height: 65,
    backgroundColor: colors.primary,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    elevation: 15,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  scannerInner: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerCorners: {
    width: 32,
    height: 32,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderColor: 'white',
    borderWidth: 2,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: "#fff",
    marginTop: 8,
    textAlign: 'center',
    width: 65,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  tabIcon: {
    fontSize: 16,
    marginBottom: 4,
    marginLeft: 12,
  },
  tabIconActive: {
    color: colors.primary,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: '#999999',
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  buttonContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
