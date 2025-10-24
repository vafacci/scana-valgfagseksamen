import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import { LanguageProvider } from './store/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </LanguageProvider>
  );
}
