import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import { colors } from '../../theme/colors';
import { useLanguage } from '../../store/LanguageContext';
import { useAuth } from '../../store/useAuth';
import { GOOGLE_WEB_CLIENT_ID, FACEBOOK_APP_ID } from '../../config/auth';
import {
  authTokenFromResult,
  fetchFacebookProfile,
  fetchGoogleProfile,
} from '../../store/socialAuth';
import WebScroll from '../../components/WebScroll';
import Tap from '../../components/Tap';

WebBrowser.maybeCompleteAuthSession();

function notify(title, message) {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}

export default function LoginScreen({ navigation, route }) {
  const { t } = useLanguage();
  const { loginWithEmail, signup, loginWithProvider } = useAuth();
  const [mode, setMode] = useState(route?.params?.mode === 'signup' ? 'signup' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const isSignup = mode === 'signup';
  const [googleRequest, , googlePrompt] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_WEB_CLIENT_ID,
    androidClientId: GOOGLE_WEB_CLIENT_ID,
    scopes: ['openid', 'profile', 'email'],
  });
  const [facebookRequest, , facebookPrompt] = Facebook.useAuthRequest({
    clientId: FACEBOOK_APP_ID,
    scopes: ['public_profile', 'email'],
  });

  const run = async (fn) => {
    if (busy) return;
    setBusy(true);
    try {
      await fn();
    } catch (error) {
      const code = error?.code;
      if (code === 'invalid_credentials') notify(t('error'), t('invalidCredentials'));
      else if (code === 'email_in_use') notify(t('error'), t('emailInUse'));
      else if (code === 'cancelled') return;
      else notify(t('error'), t('loginFailed'));
    } finally {
      setBusy(false);
    }
  };

  const handleEmailAuth = () => {
    if (!email.trim() || !password) {
      notify(t('error'), t('fillAllFields'));
      return;
    }
    if (!email.includes('@')) {
      notify(t('error'), t('invalidEmail'));
      return;
    }
    if (password.length < 6) {
      notify(t('error'), t('passwordTooShort'));
      return;
    }

    if (isSignup) {
      if (password !== confirmPassword) {
        notify(t('error'), t('passwordsDontMatch'));
        return;
      }
      if (!agreeToTerms) {
        notify(t('error'), t('agreeToTerms'));
        return;
      }
      run(() => signup({ email, password, name }));
      return;
    }

    run(() => loginWithEmail(email, password));
  };

  const handleSocial = (provider) => {
    run(async () => {
      const prompt = provider === 'google' ? googlePrompt : facebookPrompt;
      const result = await prompt({ showInRecents: true });
      if (!result || result.type === 'cancel' || result.type === 'dismiss') {
        const error = new Error('cancelled');
        error.code = 'cancelled';
        throw error;
      }
      if (result.type !== 'success') {
        const error = new Error('login_failed');
        error.code = 'login_failed';
        throw error;
      }

      const token = authTokenFromResult(result);
      if (!token) {
        const error = new Error('login_failed');
        error.code = 'login_failed';
        throw error;
      }

      const profile =
        provider === 'google'
          ? await fetchGoogleProfile(token)
          : await fetchFacebookProfile(token);
      await loginWithProvider(profile);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <WebScroll
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.brand}>SCANA</Text>
          <Text style={styles.title}>{isSignup ? t('createAccount') : t('login')}</Text>
          <Text style={styles.subtitle}>
            {isSignup ? t('signupSubtitle') : t('welcomeBack')}
          </Text>

          <Tap
            style={styles.socialButton}
            onPress={() => handleSocial('google')}
            disabled={busy || !googleRequest}
            accessibilityRole="button"
            accessibilityLabel={t('continueWithGoogle')}
          >
            <FontAwesome name="google" size={18} color="#EA4335" />
            <Text style={styles.socialText}>{t('continueWithGoogle')}</Text>
          </Tap>

          <Tap
            style={[styles.socialButton, styles.facebookButton]}
            onPress={() => handleSocial('facebook')}
            disabled={busy || !facebookRequest}
            accessibilityRole="button"
            accessibilityLabel={t('continueWithFacebook')}
          >
            <FontAwesome name="facebook" size={18} color="#FFFFFF" />
            <Text style={[styles.socialText, styles.lightSocialText]}>
              {t('continueWithFacebook')}
            </Text>
          </Tap>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>{t('orContinueWith')}</Text>
            <View style={styles.divider} />
          </View>

          {isSignup ? (
            <TextInput
              style={styles.input}
              placeholder={t('namePlaceholder')}
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          ) : null}

          <TextInput
            style={styles.input}
            placeholder={t('email')}
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder={t('password')}
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {isSignup ? (
            <TextInput
              style={styles.input}
              placeholder={t('confirmPassword')}
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          ) : null}

          {isSignup ? (
            <Tap
              style={styles.termsRow}
              onPress={() => setAgreeToTerms((value) => !value)}
              accessibilityRole="button"
              accessibilityState={{ selected: agreeToTerms }}
            >
              <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                {agreeToTerms ? (
                  <MaterialIcons name="check" size={14} color="#FFFFFF" />
                ) : null}
              </View>
              <Text style={styles.termsText}>
                {t('agreePrefix')}{' '}
                <Text
                  style={styles.termsLink}
                  onPress={() => navigation.navigate('Legal', { type: 'terms' })}
                >
                  {t('terms')}
                </Text>
              </Text>
            </Tap>
          ) : (
            <Tap onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgot}>{t('forgotPassword')}</Text>
            </Tap>
          )}

          <Tap
            style={[styles.primaryButton, busy && styles.primaryDisabled]}
            onPress={handleEmailAuth}
            disabled={busy}
            accessibilityRole="button"
            accessibilityLabel={isSignup ? t('createAccount') : t('login')}
          >
            {busy ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryText}>{isSignup ? t('createAccount') : t('login')}</Text>
            )}
          </Tap>

          <Tap
            onPress={() => setMode(isSignup ? 'login' : 'signup')}
            disabled={busy}
          >
            <Text style={styles.switchText}>
              {isSignup ? t('haveAccount') : `${t('dontHaveAccount')} ${t('createAccount')}`}
            </Text>
          </Tap>

          <Text style={styles.hint}>{t('socialLoginHint')}</Text>
        </WebScroll>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 40,
  },
  brand: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 4,
    marginBottom: 28,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    width: '100%',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    minHeight: 50,
    marginBottom: 10,
  },
  facebookButton: {
    backgroundColor: '#1877F2',
  },
  socialText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
  },
  lightSocialText: {
    color: '#FFFFFF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 18,
  },
  divider: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  dividerText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.card,
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
  },
  forgot: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 16,
    marginTop: 2,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: '100%',
    gap: 10,
    marginBottom: 16,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    minHeight: 52,
    alignSelf: 'stretch',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  primaryDisabled: {
    opacity: 0.7,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  switchText: {
    color: colors.text,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  hint: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
