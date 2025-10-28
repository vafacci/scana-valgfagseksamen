import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Animated, Image, StatusBar } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { useScanHistory } from '../store/useScanHistory';
import { useUserProfile } from '../store/useUserProfile';
import { useLanguage } from '../store/LanguageContext';
// import { identifyProduct, searchProducts } from '../services/productRecognition'; // DISABLED - Using demo products only for 100% free solution

const SCAN_COUNT_KEY = '@scana_scan_count';

// Mock AI Product Recognition Database
const AI_PRODUCT_DATABASE = {
  'airpods': {
    name: 'Apple AirPods Pro (2nd Gen)',
    price: '1,899 kr',
    category: 'Electronics',
    description: 'Active noise cancellation with Adaptive Transparency',
    image: require('../assets/airpods-pro.jpeg'),
    confidence: 0.95
  },
  'samsung_buds': {
    name: 'Samsung Galaxy Buds Pro',
    price: '1,299 kr',
    category: 'Electronics',
    description: 'Active noise cancellation and ambient sound',
    image: require('../assets/pic2.jpg'),
    confidence: 0.92
  },
  'sony_headphones': {
    name: 'Sony WH-1000XM5',
    price: '2,799 kr',
    category: 'Electronics',
    description: 'Industry-leading noise canceling with V1 processor',
    image: require('../assets/sony-wh.webp'),
    confidence: 0.88
  },
  'iphone': {
    name: 'iPhone 15 Pro',
    price: '9,999 kr',
    category: 'Electronics',
    description: 'Titanium design with A17 Pro chip',
    image: require('../assets/iphone 15.webp'),
    confidence: 0.97
  },
  'macbook': {
    name: 'MacBook Pro 16"',
    price: '19,999 kr',
    category: 'Electronics',
    description: 'M3 Pro chip with advanced processing power',
    image: require('../assets/macbook.jpeg'),
    confidence: 0.94
  },
  'ipad': {
    name: 'iPad Pro 12.9"',
    price: '12,499 kr',
    category: 'Electronics',
    description: 'M2 chip with Liquid Retina XDR display',
    image: require('../assets/pic1.jpg'),
    confidence: 0.91
  }
};

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [capturedImageUri, setCapturedImageUri] = useState(null);
  const [scanCount, setScanCount] = useState(0); // Track number of scans for rotation
  const cameraRef = useRef(null);
  const { addScan } = useScanHistory();
  const { updateElo } = useUserProfile();
  const { t } = useLanguage();

  // Load scan count from storage on mount
  useEffect(() => {
    loadScanCount();
  }, []);

  // Hide status bar for fullscreen camera
  useEffect(() => {
    StatusBar.setHidden(true, 'slide');
    return () => {
      StatusBar.setHidden(false, 'slide');
    };
  }, []);

  const loadScanCount = async () => {
    try {
      const count = await AsyncStorage.getItem(SCAN_COUNT_KEY);
      if (count !== null) {
        setScanCount(parseInt(count));
        console.log(`🔥 Loaded scan count from storage: ${count}`);
      }
    } catch (error) {
      console.error('Error loading scan count:', error);
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.message}>Loading camera permissions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.message}>We need your permission to show the camera</Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // AI Image Recognition Function - Uses DEMO products (100% FREE solution)
  const analyzeImageWithAI = async (imageUri) => {
    setProcessingStep(t('processing'));
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Analyzing image with AI...', imageUri);
    setProcessingStep(t('analyzing'));
    await new Promise(resolve => setTimeout(resolve, 700));
    
    setProcessingStep(t('identifying'));
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setProcessingStep(t('searching'));
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Return demo product data (100% FREE solution)
    // In a real app, you would call an API here, but for your project this works perfectly!
    return {
      success: false,
      fallback: true, // This triggers demo products
    };
  };

  const takePictureAndAnalyze = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setProcessingStep(t('processing'));
    
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      
      console.log('Photo taken, analyzing with AI...', photo.uri);
      setCapturedImageUri(photo.uri);
      
      try {
        // Analyze image with AI (uses demo products - 100% FREE)
        const analysisResult = await analyzeImageWithAI(photo.uri);
        
        // Always use demo products for 100% free solution
        // In a real app, this would call an API, but for your project demo products work perfectly!
        useDemoProduct();
      } catch (error) {
        console.error('Error in analysis:', error);
        // Use demo product on error
        useDemoProduct();
      }
      
      async function useDemoProduct() {
        // Rotate through demo products based on scan count
        const productKeys = ['airpods', 'samsung_buds', 'sony_headphones', 'iphone', 'macbook', 'ipad'];
        
        // Capture current scan count BEFORE selecting product
        const currentScanCount = scanCount;
        const currentIndex = currentScanCount % productKeys.length;
        const selectedKey = productKeys[currentIndex];
        const demoProduct = AI_PRODUCT_DATABASE[selectedKey];
        
        console.log(`🔥 SCAN DEBUG: scanCount=${scanCount}, currentScanCount=${currentScanCount}, index=${currentIndex}, selectedKey=${selectedKey}`);
        console.log(`Using demo product: ${selectedKey} (scan #${currentScanCount + 1}, index: ${currentIndex})`);
        
        await addScan({
          productName: demoProduct.name,
          price: demoProduct.price,
          category: demoProduct.category,
          description: demoProduct.description,
          image: demoProduct.image,
          confidence: demoProduct.confidence,
          photoUri: photo.uri
        }, updateElo);
        
        // Save new count to storage
        const newCount = currentScanCount + 1;
        await AsyncStorage.setItem(SCAN_COUNT_KEY, newCount.toString());
        console.log(`🔥 Saved scan count to storage: ${newCount}`);
        
        // Update local state too
        setScanCount(newCount);
        
        navigation.replace('Success', { 
          product: demoProduct,
          analysis: { confidence: demoProduct.confidence },
          photoUri: photo.uri
        });
      }
    }
    
    setIsProcessing(false);
    setProcessingStep('');
  };

  const pickImageFromAlbum = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setProcessingStep(t('openingAlbum'));
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setCapturedImageUri(imageUri);
        
        setProcessingStep(t('processing'));
        await new Promise(resolve => setTimeout(resolve, 400));
        
        setProcessingStep(t('analyzing'));
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setProcessingStep(t('identifying'));
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setProcessingStep(t('searching'));
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Navigate directly to success screen without showing success in CameraScreen
        
        // Rotate through demo products for album images too
        const productKeys = ['airpods', 'samsung_buds', 'sony_headphones', 'iphone', 'macbook', 'ipad'];
        // Capture current scan count before incrementing
        const currentScanCount = scanCount;
        const currentIndex = currentScanCount % productKeys.length;
        const selectedKey = productKeys[currentIndex];
        const demoProduct = AI_PRODUCT_DATABASE[selectedKey];
        
        console.log(`Using demo product from album: ${selectedKey} (scan #${currentScanCount + 1}, index: ${currentIndex})`);
        
        // Save scan to history
        await addScan({
          productName: demoProduct.name,
          price: demoProduct.price,
          category: demoProduct.category,
          description: demoProduct.description,
          image: demoProduct.image,
          confidence: demoProduct.confidence,
          photoUri: imageUri
        }, updateElo);
        
        // Save new count to storage
        const newCount = currentScanCount + 1;
        await AsyncStorage.setItem(SCAN_COUNT_KEY, newCount.toString());
        console.log(`🔥 Saved scan count to storage (album): ${newCount}`);
        
        // Update local state too
        setScanCount(newCount);
        
        // Navigate to success screen
        navigation.replace('Success', { 
          product: demoProduct,
          analysis: { confidence: demoProduct.confidence },
          photoUri: imageUri
        });
      } else {
        setIsProcessing(false);
        setProcessingStep('');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      {/* Back button - Fullscreen */}
      <TouchableOpacity 
        style={styles.frozenBackButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      {/* Camera View - Fullscreen */}
      {capturedImageUri && isProcessing ? (
        <Image 
          source={{ uri: capturedImageUri }}
          style={styles.fullscreenImage}
          resizeMode="cover"
        />
      ) : (
        <CameraView 
          style={styles.fullscreenImage} 
          facing={facing}
          ref={cameraRef}
        >
          <View style={styles.scanOverlay}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
        </View>
            <Text style={styles.scanInstruction}>
              {t('cameraInstruction')}
            </Text>
          </View>
        </CameraView>
      )}

      {/* Processing overlay - Fullscreen */}
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.processingText}>{processingStep}</Text>
          <View style={styles.progressSteps}>
            <View style={[styles.step, processingStep.includes(t('processing')) && styles.stepActive]} />
            <View style={[styles.step, processingStep.includes(t('analyzing')) && styles.stepActive]} />
            <View style={[styles.step, processingStep.includes(t('identifying')) && styles.stepActive]} />
            <View style={[styles.step, processingStep.includes(t('searching')) && styles.stepActive]} />
          </View>
        </View>
      )}

      {/* Camera Controls */}
      {!isProcessing && (
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={pickImageFromAlbum}
            disabled={isProcessing}
          >
            <Text style={styles.controlIcon}>📷</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.shutterButton, isProcessing && styles.shutterButtonDisabled]} 
            onPress={takePictureAndAnalyze}
            disabled={isProcessing}
          >
            <View style={styles.shutterInner} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={toggleCameraFacing}
            disabled={isProcessing}
          >
            <Text style={styles.controlIcon}>🔄</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: colors.bg,
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    flex: 1,
  },
  topSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 10,
  },
  backArrow: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  frozenBackButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  topLabel: {
    color: colors.muted,
    fontSize: 14,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  message: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scanOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 300,
    height: 300,
    position: 'relative',
  },
  scanInstruction: {
    color: colors.text,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: colors.text,
    fontSize: 20,
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  processingSubtext: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  progressSteps: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  step: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.muted,
    marginHorizontal: 6,
    opacity: 0.4,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  stepActive: {
    backgroundColor: colors.primary,
    opacity: 1,
    transform: [{ scale: 1.2 }],
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 40,
    color: colors.text,
  },
  successText: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  successSubtext: {
    color: colors.text,
    fontSize: 18,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  confetti: {
    position: 'absolute',
    top: '50%',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confettiEmoji: {
    fontSize: 24,
  },
  corner: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderColor: colors.text,
    borderWidth: 4,
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
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 30,
    paddingBottom: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 10,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    fontSize: 24,
  },
  shutterButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.text,
  },
  shutterButtonDisabled: {
    backgroundColor: '#666',
    borderColor: '#999',
  },
  shutterInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.text,
  },
});
