import React from 'react';
import LoginScreen from './LoginScreen';

export default function SignupScreen({ navigation, route }) {
  return <LoginScreen navigation={navigation} route={{ ...route, params: { mode: 'signup' } }} />;
}
