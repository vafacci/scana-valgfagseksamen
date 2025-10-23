import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
      </View>

      {/* Main Content Card */}
      <View style={styles.mainCard}>
        {/* Scanner Icon */}
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

        <Text style={styles.title}>Er du klar til at scanne?</Text>
        <Text style={styles.subtitle}>
          Med kamera-scanneren kan du hurtigt finde prisen på en vare - uden at skulle søge manuelt.
        </Text>
      </View>

      {/* Scan Button - Centered */}
      <View style={styles.scanButtonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Camera')}
        >
          <Text style={styles.buttonText}>Scan nu</Text>
        </TouchableOpacity>
      </View>

      {/* Mid-Section Action Buttons */}
      <View style={styles.actionButtons}>
        <View style={styles.actionItem}>
          <View style={styles.actionIcon}>
            <Text style={styles.actionIconText}>✈</Text>
          </View>
          <Text style={styles.actionLabel}>Scan</Text>
        </View>
        
        <View style={styles.actionItem}>
          <View style={styles.actionIcon}>
            <Text style={styles.actionIconText}>✓</Text>
          </View>
          <Text style={styles.actionLabel}>Prisliste</Text>
        </View>
        
        <View style={styles.actionItem}>
          <View style={styles.actionIcon}>
            <Text style={styles.actionIconText}>$</Text>
          </View>
          <Text style={styles.actionLabel}>Buy</Text>
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
  mainCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 75,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  scannerIcon: {
    width: 80,
    height: 80,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },

  scannerInner: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerCorners: {
    width: 40,
    height: 40,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderColor: colors.text,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  scanButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 141,
    paddingVertical: 20,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
    marginBottom: 200,

  },
  buttonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
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
