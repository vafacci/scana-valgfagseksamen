import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated, Easing } from 'react-native';
import { colors } from '../theme/colors';
import { useLanguage } from '../store/LanguageContext';
import * as Haptics from 'expo-haptics';

export default function SuccessScreen({ navigation, route }) {
  const { product, photoUri } = route.params || {};
  const { t } = useLanguage();

  // Blue primary color for success
  const successBlue = colors.primary;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const iconScaleAnim = useRef(new Animated.Value(0)).current;
  const iconOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Haptic feedback for success
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Start all animations
    Animated.parallel([
      // Fade in container
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Progress bar fill from left to right (0% to 100%)
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false, // Can't use native driver for width
      }),
      // Scale up container
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      // Icon appears with scale and fade
      Animated.parallel([
        Animated.spring(iconScaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(iconOpacityAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Pulse animation for the checkmark icon - starts after initial animation
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.12,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, 400);

    // Navigate to results after 1200ms for wow effect
    const timer = setTimeout(() => {
      navigation.replace('Results', {
        product,
        photoUri
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[
        styles.successContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        {/* Animated Checkmark Icon with Green Background */}
        <Animated.View style={[
          styles.checkmarkContainer,
          {
            transform: [
              { scale: iconScaleAnim },
              { scale: pulseAnim }
            ],
            opacity: iconOpacityAnim,
          }
        ]}>
          <View style={[styles.checkmarkCircle, { backgroundColor: successBlue }]}>
            <Text style={styles.checkmarkIcon}>✓</Text>
          </View>
        </Animated.View>

        <Text style={styles.successText}>{t('success')}</Text>

        {/* Progress Bar - fills from left to right */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View style={[
              styles.progressBarFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: successBlue,
              }
            ]} />
          </View>
        </View>
      </Animated.View>
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
  checkmarkContainer: {
    marginBottom: 30,
  },
  checkmarkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 25,
  },
  checkmarkIcon: {
    fontSize: 60,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  successText: {
    color: colors.text,
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  progressBarContainer: {
    width: 300,
    alignItems: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: colors.card,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
});
