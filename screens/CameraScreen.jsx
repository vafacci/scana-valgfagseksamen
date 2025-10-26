import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Animated, Image, StatusBar } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { useScanHistory } from '../store/useScanHistory';
import { useUserProfile } from '../store/useUserProfile';
import { useLanguage } from '../store/LanguageContext';

// Mock AI Product Recognition Database
const AI_PRODUCT_DATABASE = {
  'airpods': {
    name: 'Apple AirPods Pro (2nd Gen)',
    price: '1,899 kr',
    category: 'Electronics',
    description: 'Active noise cancellation with Adaptive Transparency',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361',
    confidence: 0.95
  },
  'samsung_buds': {
    name: 'Samsung Galaxy Buds Pro',
    price: '1,299 kr',
    category: 'Electronics',
    description: 'Active noise cancellation and ambient sound',
    image: 'https://images.samsung.com/is/image/samsung/p6pim/dk/2101/gallery/dk-galaxy-buds-pro-sm-r190nzkaxeu-368338267',
    confidence: 0.92
  },
  'sony_headphones': {
    name: 'Sony WH-1000XM4',
    price: '2,499 kr',
    category: 'Electronics',
    description: 'Industry-leading noise canceling with Dual Noise Sensor technology',
    image: 'https://www.sony.com/image/4c4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b',
    confidence: 0.88
  },
  'iphone': {
    name: 'iPhone 15 Pro',
    price: '9,999 kr',
    category: 'Electronics',
    description: 'Titanium design with A17 Pro chip',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009279823',
    confidence: 0.97
  }
};

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [capturedImageUri, setCapturedImageUri] = useState(null);
  const cameraRef = useRef(null);
  const { addScan } = useScanHistory();
  const { updateElo } = useUserProfile();
  const { t } = useLanguage();

  // Hide status bar for fullscreen camera
  useEffect(() => {
    StatusBar.setHidden(true, 'slide');
    return () => {
      StatusBar.setHidden(false, 'slide');
    };
  }, []);

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

  // Real AI Image Recognition Function using Uncle's API
  const analyzeImageWithAI = async (imageUri) => {
    setProcessingStep(t('processing'));
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Sending image to AI API...', imageUri);
    setProcessingStep(t('analyzing'));
    
    // Create FormData for image upload
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'product_image.jpg',
    });
    
    setProcessingStep(t('identifying'));
    
    // Call your uncle's AI recognition API
    const response = await fetch('https://your-uncles-api.com/recognize', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        // Add any API key or authentication headers here
        // 'Authorization': 'Bearer YOUR_API_KEY',
      },
    });
    
    setProcessingStep(t('searching'));
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const result = await response.json();
    console.log('AI API Response:', result);
    
    setProcessingStep(t('success'));
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return result;
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
      setProcessingStep(t('processing'));
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setProcessingStep(t('analyzing'));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProcessingStep(t('identifying'));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProcessingStep(t('searching'));
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Navigate directly to success screen without showing success in CameraScreen
      
      // Use AirPods as demo product
      const demoProduct = AI_PRODUCT_DATABASE['airpods'];
      
      // Save scan to history
      await addScan({
        productName: demoProduct.name,
        price: demoProduct.price,
        category: demoProduct.category,
        description: demoProduct.description,
        image: demoProduct.image,
        confidence: 0.95,
        photoUri: photo.uri
      }, updateElo);
      
      // Navigate to success screen
      navigation.replace('Success', { 
        product: demoProduct,
        analysis: { confidence: 0.95 },
        photoUri: photo.uri
      });
    }
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
        
        // Use Samsung Buds as demo product for album images
        const demoProduct = AI_PRODUCT_DATABASE['samsung_buds'];
        
        // Save scan to history
        await addScan({
          productName: demoProduct.name,
          price: demoProduct.price,
          category: demoProduct.category,
          description: demoProduct.description,
          image: demoProduct.image,
          confidence: 0.92,
          photoUri: imageUri
        }, updateElo);
        
        // Navigate to success screen
        navigation.replace('Success', { 
          product: demoProduct,
          analysis: { confidence: 0.92 },
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 10,
    borderRadius: 8,
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
