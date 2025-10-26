import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated, Image, Dimensions } from 'react-native';
import { colors } from '../theme/colors';
import { useLanguage } from '../store/LanguageContext';

export default function HomeScreen({ navigation }) {
  const { t, language } = useLanguage();
  
  // Animation values for action buttons
  const actionAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  
  const actionPulseAnimations = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;
  
  // Image mapping for carousel
  const carouselImages = {
    pic1: require('../assets/pic1.jpg'),
    pic2: require('../assets/pic2.jpg'),
    pic3: require('../assets/pic3.jpg'),
    pic4: require('../assets/pic4.jpg'),
    pic5: require('../assets/pic5.jpg'),
    pic6: require('../assets/pic6.jpg'),
  };
  
  // Carousel data
  const carouselData = [
    {
      id: 1,
      imageKey: 'pic1',
      icon: '📱',
      title: 'Scan Produkter',
      subtitle: 'Find priser hurtigt'
    },
    {
      id: 2,
      imageKey: 'pic2',
      icon: '💰',
      title: 'Sammenlign Priser',
      subtitle: 'Bedste tilbud'
    },
    {
      id: 3,
      imageKey: 'pic3',
      icon: '🛒',
      title: 'Køb Smart',
      subtitle: 'Spar penge'
    },
    {
      id: 4,
      imageKey: 'pic4',
      icon: '⭐',
      title: 'Bedste Vurderinger',
      subtitle: 'Kvalitetsprodukter'
    },
    {
      id: 5,
      imageKey: 'pic5',
      icon: '🔍',
      title: 'Find Produkter',
      subtitle: 'Smart søgning'
    },
    {
      id: 6,
      imageKey: 'pic6',
      icon: '💎',
      title: 'Premium Kvalitet',
      subtitle: 'Top mærker'
    }
  ];
  
  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  // Start animations when component mounts
  useEffect(() => {
    const startActionAnimations = () => {
      // Staggered entrance animations
      actionAnimations.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 600,
          delay: 1000 + (index * 200), // Start after main content
          useNativeDriver: true,
        }).start();
      });
      
      // Subtle pulse animations
      actionPulseAnimations.forEach((anim, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1.08,
              duration: 2500 + (index * 400),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 1,
              duration: 2500 + (index * 400),
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    };
    
    startActionAnimations();
  }, []);
  
  // Carousel auto-play effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % carouselData.length;
        
        // Simple fade animation
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
        
        return nextIndex;
      });
    }, 4000); // Change every 4 seconds
    
    return () => clearInterval(interval);
  }, [carouselData.length]);
  
  console.log('HomeScreen rendered!', {
    currentLanguage: language,
    readyToScanText: t('readyToScan')
  }); // Debug log
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
      </View>

      {/* Carousel Card */}
      <View style={styles.carouselContainer}>
        <View style={styles.carouselCard}>
          {/* Animated Background Image Only */}
          <Animated.View style={[styles.carouselBackgroundContainer, { opacity: fadeAnim }]}>
            <Image 
              source={carouselImages[carouselData[currentIndex].imageKey]}
              style={styles.carouselImage}
              resizeMode="cover"
            />
            <View style={styles.carouselOverlay} />
          </Animated.View>
          
          {/* Static UI Elements (No Animation) */}
          {/* Scanner Icon - Top */}
          <View style={styles.scannerIconTop}>
            <View style={styles.scannerIconBackground}>
              <View style={styles.scannerInner}>
                <View style={styles.scannerCorners}>
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>
              </View>
            </View>
          </View>

          {/* Text Content - Below Scanner */}
          <View style={styles.textContent}>
            <Text style={styles.carouselTitle}>{carouselData[currentIndex].title}</Text>
            <Text style={styles.carouselSubtitle}>{carouselData[currentIndex].subtitle}</Text>
          </View>

          {/* Scan Button - Center */}
          <View style={styles.scanButtonCenter}>
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={() => navigation.navigate('Camera')}
            >
              <Text style={styles.scanButtonText}>Scan nu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Mid-Section Action Buttons */}
      <View style={styles.actionButtons}>
        <Animated.View style={[
          styles.actionItem,
          {
            transform: [
              { 
                translateY: actionAnimations[0].interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                })
              },
              { 
                scale: actionPulseAnimations[0]
              }
            ],
            opacity: actionAnimations[0],
          }
        ]}>
          <View style={styles.actionIcon}>
            <Text style={styles.actionIconText}>✈</Text>
          </View>
          <Text style={styles.actionLabel}>Scan</Text>
        </Animated.View>
        
        <Animated.View style={[
          styles.actionItem,
          {
            transform: [
              { 
                translateY: actionAnimations[1].interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                })
              },
              { 
                scale: actionPulseAnimations[1]
              }
            ],
            opacity: actionAnimations[1],
          }
        ]}>
          <View style={styles.actionIcon}>
            <Text style={styles.actionIconText}>✓</Text>
          </View>
          <Text style={styles.actionLabel}>Prisliste</Text>
        </Animated.View>
        
        <Animated.View style={[
          styles.actionItem,
          {
            transform: [
              { 
                translateY: actionAnimations[2].interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                })
              },
              { 
                scale: actionPulseAnimations[2]
              }
            ],
            opacity: actionAnimations[2],
          }
        ]}>
          <View style={styles.actionIcon}>
            <Text style={styles.actionIconText}>$</Text>
          </View>
          <Text style={styles.actionLabel}>Køb</Text>
        </Animated.View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topLabel: {
    color: colors.muted,
    fontSize: 14,
  },
  carouselContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -100,
    width: '100%',
    height: '120%',
  },
  carouselCard: {
    height: '100%',
    borderRadius: 0,
    overflow: 'hidden',
    position: 'relative',
  },
  carouselBackgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '120%',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    height: '120%',
  },
  carouselContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    position: 'relative',
    zIndex: 2,
  },
  scannerIconTop: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 3,
    marginTop: 50,
  },
  scannerIconBackground: {
    width: 100,
    height: 100,
    backgroundColor: colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContent: {
    position: 'absolute',
    top: 180,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 3,
    marginTop: 50
  },
  scanButtonCenter: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 3,
    transform: [{ translateY: -25 }],
    marginTop: 50,
  },
  scanButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 80,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 300,
    alignItems: 'center',
  },
  scanButtonText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  carouselTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  carouselSubtitle: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scannerInner: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerCorners: {
    width: 50,
    height: 50,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderColor: colors.text,
    borderWidth: 3,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingVertical: 20,
    position: 'absolute',
    bottom: 150,
    left: 0,
    right: 0,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.text,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconText: {
    color: colors.text,
    fontSize: 20,
  },
  actionLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
});

