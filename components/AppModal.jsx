import React from 'react';
import { Modal, Platform, StyleSheet, View } from 'react-native';

export default function AppModal({
  visible,
  onRequestClose,
  children,
  transparent,
  animationType,
  presentationStyle,
}) {
  if (Platform.OS === 'web') {
    if (!visible) return null;
    return (
      <View style={styles.web} pointerEvents="auto">
        {children}
      </View>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      presentationStyle={presentationStyle}
      onRequestClose={onRequestClose}
    >
      {children}
    </Modal>
  );
}

const styles = StyleSheet.create({
  web: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 40,
  },
});
