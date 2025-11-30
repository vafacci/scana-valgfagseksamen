import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated, Image, Dimensions, Easing } from 'react-native';
import { colors } from '../theme/colors';
import { useLanguage } from '../store/LanguageContext';

export default function HomeScreen({ navigation }) {
  const { t, language } = useLanguage();
  const screenHeight = Dimensions.get('window').height;
  const offset15Percent = screenHeight * 0.10;
  
  // Image mapping for carousel
  const carouselImages = {
    pic1: require('../assets/pic1.jpg'),
    pic2: require('../assets/pic2.jpg'),
    pic3: require('../assets/pic3.jpg'),
    pic4: require('../assets/pic4.jpg'),
    pic5: require('../assets/pic5.jpg'),
    pic6: require('../assets/pic6.jpg'),
  };
  
  // Carousel data with translations
  const carouselData = [
    {
      id: 1,
      imageKey: 'pic1',
      icon: '📱',
      titleKey: 'carouselTitle1',
      subtitleKey: 'carouselSubtitle1'
    },
    {
      id: 2,
      imageKey: 'pic2',
      icon: '💰',
      titleKey: 'carouselTitle2',
      subtitleKey: 'carouselSubtitle2'
    },
    {
      id: 3,
      imageKey: 'pic3',
      icon: '🛒',
      titleKey: 'carouselTitle3',
      subtitleKey: 'carouselSubtitle3'
    },
    {
      id: 4,
      imageKey: 'pic4',
      icon: '⭐',
      titleKey: 'carouselTitle4',
      subtitleKey: 'carouselSubtitle4'
    },
    {
      id: 5,
      imageKey: 'pic5',
      icon: '🔍',
      titleKey: 'carouselTitle5',
      subtitleKey: 'carouselSubtitle5'
    },
    {
      id: 6,
      imageKey: 'pic6',
      icon: '💎',
      titleKey: 'carouselTitle6',
      subtitleKey: 'carouselSubtitle6'
    }
  ];
  
  // Carousel state - simple and smooth
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  
  // Simple and smooth carousel auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => {
        // Change image
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
        
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
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
          {/* Animated Background Image */}
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
          <View style={[styles.scannerIconTop, { top: 60 + offset15Percent }]}>
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
          <View style={[styles.textContent, { top: 180 + offset15Percent }]}>
            <Text style={styles.carouselTitle}>{t(carouselData[currentIndex].titleKey)}</Text>
            <Text style={styles.carouselSubtitle}>{t(carouselData[currentIndex].subtitleKey)}</Text>
          </View>

        </View>
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
});

