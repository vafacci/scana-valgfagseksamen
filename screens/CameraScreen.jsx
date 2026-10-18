import React, { Component, useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../store/LanguageContext';

const PERMISSION_WAIT_MS = 2500;

class CameraPreviewGuard extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

export default function CameraScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImageUri, setCapturedImageUri] = useState(null);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(Platform.OS !== 'web');
  const [cameraFailed, setCameraFailed] = useState(false);
  const [permissionWaitExceeded, setPermissionWaitExceeded] = useState(false);
  const cameraRef = useRef(null);
  const processingRef = useRef(false);
  const { t } = useLanguage();

  const liveCamera =
    availabilityChecked &&
    cameraSupported &&
    !cameraFailed &&
    Boolean(permission?.granted);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const available = await CameraView.isAvailableAsync();
        if (!cancelled) {
          setCameraSupported(Boolean(available));
        }
      } catch {
        if (!cancelled) {
          setCameraSupported(Platform.OS !== 'web');
        }
      } finally {
        if (!cancelled) {
          setAvailabilityChecked(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!availabilityChecked || !cameraSupported || cameraFailed || permission) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setPermissionWaitExceeded(true);
    }, PERMISSION_WAIT_MS);

    return () => clearTimeout(timer);
  }, [availabilityChecked, cameraSupported, cameraFailed, permission]);

  useEffect(() => {
    if (Platform.OS === 'web') return undefined;
    StatusBar.setHidden(liveCamera, 'slide');
    return () => {
      StatusBar.setHidden(false, 'slide');
    };
  }, [liveCamera]);

  const goBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Tabs');
  }, [navigation]);

  const goToIdentify = useCallback(
    (photoUri) => {
      navigation.replace('Identify', { photoUri: photoUri || null });
    },
    [navigation]
  );

  const pickImageFromAlbum = useCallback(async () => {
    if (processingRef.current) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: Platform.OS !== 'web',
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]) {
        return;
      }

      goToIdentify(result.assets[0].uri);
    } catch (error) {
      console.error('Error picking image:', error);
      processingRef.current = false;
      setIsProcessing(false);
    }
  }, [goToIdentify]);

  const takePictureAndAnalyze = useCallback(async () => {
    if (processingRef.current) return;

    if (!liveCamera || !cameraRef.current) {
      await pickImageFromAlbum();
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      setCapturedImageUri(photo.uri);
      goToIdentify(photo.uri);
    } catch (error) {
      console.error('Camera capture failed, falling back to album', error);
      processingRef.current = false;
      setIsProcessing(false);
      await pickImageFromAlbum();
    }
  }, [liveCamera, goToIdentify, pickImageFromAlbum]);

  const handleRequestPermission = useCallback(async () => {
    try {
      const result = await requestPermission();
      if (!result?.granted) {
        setCameraFailed(false);
      }
    } catch (error) {
      console.error('Camera permission request failed', error);
      setCameraFailed(true);
    }
  }, [requestPermission]);

  const toggleCameraFacing = useCallback(() => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }, []);

  const handleCameraError = useCallback(() => {
    setCameraFailed(true);
  }, []);

  const closeButton = (
    <TouchableOpacity
      style={[styles.closeButton, { top: Math.max(insets.top, 16) + 8 }]}
      onPress={goBack}
      accessibilityRole="button"
      accessibilityLabel={t('close')}
    >
      <MaterialIcons name="close" size={22} color={colors.text} />
    </TouchableOpacity>
  );

  const processingOverlay = isProcessing ? (
    <View style={styles.processingOverlay}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  ) : null;

  if (!availabilityChecked || (cameraSupported && !cameraFailed && !permission && !permissionWaitExceeded)) {
    return (
      <View style={styles.container}>
        {closeButton}
        <View style={styles.content}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.message}>{t('loading')}</Text>
        </View>
      </View>
    );
  }

  if (!liveCamera) {
    const showGrantCamera = cameraSupported && !cameraFailed && !permission?.granted;

    return (
      <View style={styles.container}>
        {closeButton}
        <View style={styles.content}>
          <View style={styles.permissionIcon}>
            <MaterialIcons
              name={showGrantCamera ? 'photo-camera' : 'videocam-off'}
              size={32}
              color={colors.primary}
            />
          </View>
          <Text style={styles.message}>
            {showGrantCamera ? t('cameraPermission') : t('cameraUnavailable')}
          </Text>

          {showGrantCamera ? (
            <TouchableOpacity
              style={styles.button}
              onPress={handleRequestPermission}
              accessibilityRole="button"
              accessibilityLabel={t('grantPermission')}
            >
              <MaterialIcons name="photo-camera" size={20} color={colors.text} />
              <Text style={styles.buttonText}>{t('grantPermission')}</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={[styles.button, showGrantCamera && styles.secondaryButton, isProcessing && styles.buttonDisabled]}
            onPress={pickImageFromAlbum}
            disabled={isProcessing}
            accessibilityRole="button"
            accessibilityLabel={t('pickFromAlbum')}
          >
            <MaterialIcons name="photo-library" size={20} color={colors.text} />
            <Text style={styles.buttonText}>{t('pickFromAlbum')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.tertiaryButton, isProcessing && styles.buttonDisabled]}
            onPress={() => goToIdentify(null)}
            disabled={isProcessing}
            accessibilityRole="button"
            accessibilityLabel={t('pickFromCatalog')}
          >
            <MaterialIcons name="inventory-2" size={20} color={colors.text} />
            <Text style={styles.buttonText}>{t('pickFromCatalog')}</Text>
          </TouchableOpacity>
        </View>
        {processingOverlay}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {closeButton}

      <View style={styles.preview}>
        {capturedImageUri && isProcessing ? (
          <Image
            source={{ uri: capturedImageUri }}
            style={styles.fullscreenImage}
            resizeMode="cover"
          />
        ) : (
          <CameraPreviewGuard onError={handleCameraError}>
            <CameraView
              style={styles.fullscreenImage}
              facing={facing}
              ref={cameraRef}
              animateShutter={false}
              onMountError={handleCameraError}
            />
          </CameraPreviewGuard>
        )}

        <View style={styles.scanOverlay} pointerEvents="none">
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text style={styles.scanInstruction}>{t('cameraInstruction')}</Text>
        </View>
      </View>

      {processingOverlay}

      {!isProcessing && (
        <View style={[styles.controls, { paddingBottom: Math.max(insets.bottom, 16) + 20 }]}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={pickImageFromAlbum}
            accessibilityRole="button"
            accessibilityLabel={t('pickFromAlbum')}
          >
            <MaterialIcons name="photo-library" size={24} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shutterButton}
            onPress={takePictureAndAnalyze}
            accessibilityRole="button"
            accessibilityLabel={t('capturePhoto')}
          >
            <View style={styles.shutterInner} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleCameraFacing}
            accessibilityRole="button"
            accessibilityLabel={t('flipCamera')}
          >
            <MaterialIcons name="cameraswitch" size={24} color={colors.text} />
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
  preview: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  fullscreenImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1000,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 27, 43, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  permissionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    minWidth: 240,
  },
  secondaryButton: {
    marginTop: 12,
    backgroundColor: colors.card,
  },
  tertiaryButton: {
    marginTop: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 260,
    height: 260,
    position: 'relative',
  },
  scanInstruction: {
    color: colors.text,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 28,
    paddingHorizontal: 28,
    lineHeight: 22,
    textShadowColor: 'rgba(15, 27, 43, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 27, 43, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderColor: colors.primary,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 4,
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
    paddingTop: 24,
    backgroundColor: 'rgba(15, 27, 43, 0.72)',
    zIndex: 10,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.text,
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.text,
  },
});
