import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useAuth } from '../../store/useAuth';

export default function LandingScreen({ navigation }) {
  const { login } = useAuth();

  const handleJoinNow = async () => {
    console.log('Join now button pressed');
    // Instantly authenticate with a dummy user and let RootNavigator switch to tabs
    const dummyUser = {
      id: 'dev-user',
      name: 'Developer',
      email: 'dev@example.com',
      createdAt: new Date().toISOString(),
    };
    try {
      console.log('Attempting to login with dummy user:', dummyUser);
      await login(dummyUser);
      console.log('Login successful, should navigate to HomeScreen');
    } catch (e) {
      console.error('Login failed:', e);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login pressed`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.topLabel}>Landingpage</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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

          {/* Title */}
          <Text style={styles.title}>Scana</Text>
          <Text style={styles.subtitle}>Scan på farten!</Text>

          {/* Product Images Grid */}
          <View style={styles.productGrid}>
            <View style={[styles.productImage, styles.product1]} />
            <View style={[styles.productImage, styles.product2]} />
            <View style={[styles.productImage, styles.product3]} />
            <View style={[styles.productImage, styles.product4]} />
          </View>

          {/* Social Login Section */}
          <View style={styles.socialSection}>
            <Text style={styles.socialLabel}>Hurtig login med</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Google')}
              >
                <Text style={styles.socialIcon}>G</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Facebook')}
              >
                <Text style={styles.socialIcon}>f</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Apple')}
              >
                <Ionicons name="logo-apple" size={20} color={colors.muted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Join Now Button */}
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={handleJoinNow}
          >
            <Text style={styles.joinButtonText}>Join now</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginLink}>Har du en bruger? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  topLabel: {
    color: colors.muted,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  mainCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  scannerIcon: {
    width: 80,
    height: 80,
    backgroundColor: colors.text,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scannerInner: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
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
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 24,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    width: '100%',
  },
  productImage: {
    width: '48%',
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  product1: {
    backgroundColor: '#FF6B6B', // Orange cosmetic tubes
  },
  product2: {
    backgroundColor: '#4ECDC4', // Teal perfume bottle
  },
  product3: {
    backgroundColor: '#45B7D1', // Blue suede shoes
  },
  product4: {
    backgroundColor: '#96CEB4', // Green perfume bottle
  },
  socialSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  socialLabel: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 12,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    width: 50,
    height: 50,
    backgroundColor: colors.text,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.muted,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    minWidth: 160,
    alignItems: 'center',
  },
  joinButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    color: colors.text,
    fontSize: 14,
    textAlign: 'center',
  },
});
