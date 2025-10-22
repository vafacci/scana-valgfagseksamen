import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useAuth } from '../../store/useAuth';
import { useUsers } from '../../store/useUsers';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { login } = useAuth();
  const { addUser, checkEmailExists } = useUsers();

  const handleJoinNow = async () => {
    // Validation
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      Alert.alert('Error', 'Please agree to the Terms and Conditions');
      return;
    }

    try {
      // Check if email already exists
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        Alert.alert('Error', 'An account with this email already exists');
        return;
      }

      // Create new user
      const newUser = await addUser({ email, password });
      
      // Auto-login the new user
      await login(newUser);
      
      // Navigation happens automatically via useAuth state change
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
      console.error('Signup error:', error);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} signup pressed`);
  };

  const handleTermsPress = () => {
    console.log('Terms and Conditions pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.topLabel}>Opret en profil</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Main Content Card */}
        <View style={styles.mainCard}>
          {/* Title */}
          <Text style={styles.title}>Opret En Profil</Text>
          <Text style={styles.subtitle}>Bliv en del af Scana og shop nemmere</Text>

          {/* Social Login Section */}
          <View style={styles.socialSection}>
            <Text style={styles.socialLabel}>Hurtig oprettelse</Text>
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
            
            <TextInput
              style={styles.input}
              placeholder="Bekræft Kodeord"
              placeholderTextColor={colors.muted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          {/* Terms and Conditions */}
          <View style={styles.termsSection}>
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                {agreeToTerms && (
                  <Ionicons name="checkmark" size={16} color={colors.text} />
                )}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink} onPress={handleTermsPress}>
                  Terms and Conditions
                </Text>
              </Text>
            </TouchableOpacity>
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
    marginBottom: 20,
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
  termsSection: {
    width: '100%',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.muted,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
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
