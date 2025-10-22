import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useAuth } from '../../store/useAuth';
import { useUsers } from '../../store/useUsers';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { findUser } = useUsers();

  const handleLogin = async () => {
    // Always log in with a dummy user, regardless of input
    const dummyUser = {
      id: 'dev-user',
      name: 'Developer',
      email: email || 'dev@example.com',
      createdAt: new Date().toISOString(),
    };

    try {
      await login(dummyUser);
      // No navigation needed if the app uses auth state switching
    } catch (error) {
      // Fallback: do nothing, but avoid throwing to keep UX smooth
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login pressed`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
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
          <Text style={styles.title}>Login Her</Text>
          <Text style={styles.subtitle}>Velkommen tilbage til Scana!</Text>

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

          {/* Form Fields */}
          <View style={styles.formSection}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Kodeord"
              placeholderTextColor={colors.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Forgot Password Link */}
          <View style={styles.forgotSection}>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotLink}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* Signup Link */}
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupLink}>Ny på Scana? Opret dig her!</Text>
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
    backgroundColor: colors.primary,
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
    fontSize: 28,
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
    lineHeight: 22,
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
  formSection: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.text,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.bg,
    marginBottom: 12,
  },
  forgotSection: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotLink: {
    fontSize: 14,
    color: colors.muted,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    minWidth: 160,
    alignItems: 'center',
  },
  loginButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  signupLink: {
    color: colors.text,
    fontSize: 14,
    textAlign: 'center',
  },
});
