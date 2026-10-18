import { Platform } from 'react-native';

/**
 * React Native Web keeps a single global "responder" (interaction lock).
 * If iOS Safari drops a touchcancel / interrupted gesture, the lock sticks
 * and NOTHING in the app receives presses until a full reload.
 *
 * Force-clear that lock after every touch and when the page becomes visible.
 */
export function installWebResponderSafety() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  if (window.__scanaResponderSafety) return;
  window.__scanaResponderSafety = true;

  const clear = () => {
    try {
      // Prefer the module used by the app bundle.
      const mod = require('react-native-web/dist/modules/useResponderEvents/ResponderSystem');
      if (mod?.terminateResponder) mod.terminateResponder();
    } catch (_) {
      // ignore
    }
  };

  const onEnd = () => {
    // Clear after RN has processed the event.
    window.setTimeout(clear, 0);
    window.setTimeout(clear, 50);
  };

  document.addEventListener('touchend', onEnd, true);
  document.addEventListener('touchcancel', onEnd, true);
  document.addEventListener('pointerup', onEnd, true);
  document.addEventListener('pointercancel', onEnd, true);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') clear();
  });
  window.addEventListener('pageshow', clear);
  window.addEventListener('focus', clear);
}
