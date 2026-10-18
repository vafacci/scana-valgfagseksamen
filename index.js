import { registerRootComponent } from 'expo';
import App from './App';

if (typeof document === 'undefined') {
  try {
    require('react-native/Libraries/Core/setUpXHR');
    if (typeof globalThis.FormData === 'undefined') {
      globalThis.FormData = require('react-native/Libraries/Network/FormData').default;
    }
  } catch (error) {
    // Web bundle does not need the React Native FormData polyfill.
  }
}

registerRootComponent(App);
