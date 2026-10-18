import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './navigation/RootNavigator';
import { LanguageProvider } from './store/LanguageContext';
import { AuthProvider } from './store/useAuth';
import { colors } from './theme/colors';
import * as WebBrowser from 'expo-web-browser';
import { installWebResponderSafety } from './utils/webResponderSafety';

WebBrowser.maybeCompleteAuthSession();
if (Platform.OS === 'web') {
  installWebResponderSafety();
}

export default function App() {
  return (
    <View style={styles.root}>
      <SafeAreaProvider>
        <View style={styles.shell}>
          <LanguageProvider>
            <AuthProvider>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </AuthProvider>
          </LanguageProvider>
        </View>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  shell: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : undefined,
    alignSelf: 'center',
    backgroundColor: colors.bg,
  },
});
