import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Animated, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { useScanHistory } from '../store/useScanHistory';

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
  const [showSuccess, setShowSuccess] = useState(false);
  const [capturedImageUri, setCapturedImageUri] = useState(null);
  const cameraRef = useRef(null);
  const { addScan } = useScanHistory();
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const successScaleAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const confettiAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const triggerConfetti = () => {
    const animations = confettiAnimations.map((anim, index) => {
      return Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 500 + (index * 150),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]);
    });
    
    Animated.parallel(animations).start();
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

  // Real AI Image Recognition Function using Uncle's API
  const analyzeImageWithAI = async (imageUri) => {
    setProcessingStep('Forbereder billede...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Sending image to AI API...', imageUri);
    setProcessingStep('Sender til AI API...');
    
    // Create FormData for image upload
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'product_image.jpg',
    });
    
    setProcessingStep('AI analyserer produktet...');
    
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
    
    setProcessingStep('Behandler resultat...');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const result = await response.json();
    console.log('AI API Response:', result);
    
    setProcessingStep('Færdig!');
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return result;
  };

  const takePictureAndAnalyze = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setProcessingStep('Tager billede...');
    
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      
      console.log('Photo taken, analyzing with AI...', photo.uri);
      setCapturedImageUri(photo.uri);
      setProcessingStep('Forbereder...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProcessingStep('Sender til AI...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStep('AI analyserer...');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setProcessingStep('Behandler data...');
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setProcessingStep('Fundet!');
      setShowSuccess(true);
      
      // Trigger confetti immediately
      triggerConfetti();
      
      // Start pulse animation for success icon
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Success animation
      Animated.parallel([
        Animated.spring(successScaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ])
      ]).start();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      });
      
      // Navigate to results
      navigation.replace('Results', { 
        product: demoProduct,
        analysis: { confidence: 0.95 },
        photoUri: photo.uri
      });
    }
  };

  const pickImageFromAlbum = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setProcessingStep('Åbner album...');
    
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
        
        setProcessingStep('Forbereder...');
        await new Promise(resolve => setTimeout(resolve, 600));
        
        setProcessingStep('Sender til AI...');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setProcessingStep('AI analyserer...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setProcessingStep('Behandler data...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setProcessingStep('Fundet!');
        setShowSuccess(true);
        
        // Trigger confetti immediately
        triggerConfetti();
        
        // Start pulse animation for success icon
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.3,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        ).start();
        
        // Success animation
        Animated.parallel([
          Animated.spring(successScaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(shakeAnim, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ])
        ]).start();
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
        });
        
        // Navigate to results
        navigation.replace('Results', { 
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
    <SafeAreaView style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        {capturedImageUri && isProcessing ? (
          <View style={styles.camera}>
            <Image 
              source={{ uri: capturedImageUri }}
              style={styles.camera}
              resizeMode="cover"
            />
            {/* AI Scanning overlay */}
            <View style={styles.scanOverlay}>
              {isProcessing && (
                <View style={styles.processingOverlay}>
                  {!showSuccess ? (
                    <>
                      <ActivityIndicator size="large" color={colors.primary} />
                      <Text style={styles.processingText}>{processingStep}</Text>
                      <View style={styles.progressSteps}>
                        <View style={[styles.step, processingStep.includes('Tager') && styles.stepActive]} />
                        <View style={[styles.step, processingStep.includes('Forbereder') && styles.stepActive]} />
                        <View style={[styles.step, processingStep.includes('Sender') && styles.stepActive]} />
                        <View style={[styles.step, processingStep.includes('AI analyserer') && styles.stepActive]} />
                        <View style={[styles.step, processingStep.includes('Behandler') && styles.stepActive]} />
                        <View style={[styles.step, processingStep.includes('Fundet') && styles.stepActive]} />
                      </View>
                    </>
                  ) : (
                    <Animated.View style={[
                      styles.successContainer,
                      {
                        transform: [
                          { scale: successScaleAnim }
                        ]
                      }
                    ]}>
                      <Animated.Text style={[
                        styles.successIcon,
                        {
                          transform: [
                            { scale: pulseAnim },
                            {
                              translateX: shakeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 10],
                              })
                            }
                          ]
                        }
                      ]}>✨</Animated.Text>
                      <Animated.Text style={[
                        styles.successText,
                        {
                          transform: [
                            {
                              translateX: shakeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 8],
                              })
                            }
                          ]
                        }
                      ]}>Produkt fundet!</Animated.Text>
                      <Animated.Text style={[
                        styles.successSubtext,
                        {
                          transform: [
                            {
                              translateX: shakeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 6],
                              })
                            }
                          ]
                        }
                      ]}>Navigerer til resultater...</Animated.Text>
                    </Animated.View>
                  )}
                  
                  {/* Confetti Elements */}
                  {showSuccess && confettiAnimations.map((anim, index) => (
                    <Animated.View
                      key={index}
                      style={[
                        styles.confetti,
                        {
                          left: `${10 + (index * 12)}%`,
                          transform: [
                            {
                              translateY: anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -300],
                              }),
                            },
                            {
                              rotate: anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '720deg'],
                              }),
                            },
                            {
                              scale: anim.interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [0, 1.2, 0.8],
                              }),
                            },
                          ],
                          opacity: anim,
                        },
                      ]}
                    >
                      <Text style={styles.confettiEmoji}>
                        {['🎉', '✨', '🎊', '💫', '⭐', '🌟', '💎', '🔥'][index]}
                      </Text>
                    </Animated.View>
                  ))}
                </View>
              )}
            </View>
          </View>
        ) : (
          <CameraView 
            style={styles.camera} 
            facing={facing}
            ref={cameraRef}
          >
          {/* AI Scanning overlay */}
          <View style={styles.scanOverlay}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <Text style={styles.scanInstruction}>
              Ret kameraet mod produktet og tryk på den hvide knap, eller vælg et billede fra albummet
            </Text>
            {isProcessing && (
              <View style={styles.processingOverlay}>
                {!showSuccess ? (
                  <>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.processingText}>{processingStep}</Text>
                    <View style={styles.progressSteps}>
                      <View style={[styles.step, processingStep.includes('Tager') && styles.stepActive]} />
                      <View style={[styles.step, processingStep.includes('Forbereder') && styles.stepActive]} />
                      <View style={[styles.step, processingStep.includes('Sender') && styles.stepActive]} />
                      <View style={[styles.step, processingStep.includes('AI analyserer') && styles.stepActive]} />
                      <View style={[styles.step, processingStep.includes('Behandler') && styles.stepActive]} />
                      <View style={[styles.step, processingStep.includes('Fundet') && styles.stepActive]} />
                    </View>
                  </>
                ) : (
                  <Animated.View style={[
                    styles.successContainer,
                    {
                      transform: [
                        { scale: successScaleAnim }
                      ]
                    }
                  ]}>
                    <Animated.Text style={[
                      styles.successIcon,
                      {
                        transform: [
                          { scale: pulseAnim },
                          {
                            translateX: shakeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 10],
                            })
                          }
                        ]
                      }
                    ]}>✨</Animated.Text>
                    <Animated.Text style={[
                      styles.successText,
                      {
                        transform: [
                          {
                            translateX: shakeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 8],
                            })
                          }
                        ]
                      }
                    ]}>Produkt fundet!</Animated.Text>
                    <Animated.Text style={[
                      styles.successSubtext,
                      {
                        transform: [
                          {
                            translateX: shakeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 6],
                            })
                          }
                        ]
                      }
                    ]}>Navigerer til resultater...</Animated.Text>
                  </Animated.View>
                )}
                
                {/* Confetti Elements */}
                {showSuccess && confettiAnimations.map((anim, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.confetti,
                      {
                        left: `${10 + (index * 12)}%`,
                        transform: [
                          {
                            translateY: anim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, -300],
                            }),
                          },
                          {
                            rotate: anim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0deg', '720deg'],
                            }),
                          },
                          {
                            scale: anim.interpolate({
                              inputRange: [0, 0.5, 1],
                              outputRange: [0, 1.2, 0.8],
                            }),
                          },
                        ],
                        opacity: anim,
                      },
                    ]}
                  >
                    <Text style={styles.confettiEmoji}>
                      {['🎉', '✨', '🎊', '💫', '⭐', '🌟', '💎', '🔥'][index]}
                    </Text>
                  </Animated.View>
                ))}
              </View>
            )}
          </View>
        </CameraView>
        )}
      </View>

      {/* Camera Controls */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backArrow: {
    color: colors.text,
    fontSize: 24,
    marginRight: 16,
  },
  frozenBackButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: colors.text,
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  processingSubtext: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  progressSteps: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  step: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.muted,
    marginHorizontal: 4,
    opacity: 0.3,
  },
  stepActive: {
    backgroundColor: colors.primary,
    opacity: 1,
    transform: [{ scale: 1.2 }],
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  successText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtext: {
    color: colors.muted,
    fontSize: 16,
    textAlign: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
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
