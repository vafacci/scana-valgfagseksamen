import 'react-native/Libraries/Core/setUpXHR';
import { registerRootComponent } from 'expo';

// Ensure FormData exists early in RN runtime
if (typeof globalThis.FormData === 'undefined') {
  // Use React Native's built-in FormData implementation
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  globalThis.FormData = require('react-native/Libraries/Network/FormData').default;
}

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
