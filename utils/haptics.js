import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export function hapticImpact(style = Haptics.ImpactFeedbackStyle.Medium) {
  if (Platform.OS === 'web') return;
  try {
    Haptics.impactAsync(style);
  } catch (error) {
    // Native haptics are unavailable on some devices.
  }
}

export function hapticSuccess() {
  if (Platform.OS === 'web') return;
  try {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    // Native haptics are unavailable on some devices.
  }
}
